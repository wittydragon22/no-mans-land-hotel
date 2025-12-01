import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'
import { generateToken, generateConfirmationCode } from '@/lib/utils'
import { sendConfirmationCodeEmail } from '@/lib/email'

/**
 * Complete booking endpoint - creates full reservation with all steps and sends email
 * Supports both authenticated and guest bookings
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      roomId,
      checkInDate,
      checkOutDate,
      guests,
      guestDetails,
      paymentDetails,
      // Note: ID and biometric are optional for testing
    } = body

    // Validate required fields
    if (!roomId || !checkInDate || !checkOutDate || !guests || !guestDetails) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Try to get authenticated user first
    const authenticatedUser = getUserFromRequest(request)
    let user

    if (authenticatedUser) {
      // Use authenticated user
      user = await prisma.user.findUnique({
        where: { id: authenticatedUser.userId }
      })
      
      if (!user) {
        return NextResponse.json(
          { ok: false, error: 'User account not found' },
          { status: 404 }
        )
      }

      // Verify email matches (for security)
      if (user.email !== guestDetails.email) {
        return NextResponse.json(
          { ok: false, error: 'Email does not match your account' },
          { status: 400 }
        )
      }
    } else {
      // No authentication - get or create user by email
      user = await prisma.user.findFirst({
        where: { email: guestDetails.email }
      })

      if (!user) {
        // Create a guest user for this booking
        const hashedPassword = await bcrypt.hash('guest123', 10)
        user = await prisma.user.create({
          data: {
            email: guestDetails.email,
            hash: hashedPassword,
            role: 'guest',
            name: `${guestDetails.firstName} ${guestDetails.lastName}`,
          }
        })
      }
    }

    // Check if room is available
    // roomId could be either the database ID or room number
    // First try to find by ID, then by room number
    let room = await prisma.room.findUnique({
      where: { id: roomId }
    })
    
    if (!room) {
      // Try finding by room number (for mock rooms from frontend)
      room = await prisma.room.findFirst({
        where: { number: roomId }
      })
    }

    // If still not found, try to get first available room (for testing with mock data)
    if (!room) {
      room = await prisma.room.findFirst({
        where: { status: 'available' }
      })
    }

    if (!room) {
      return NextResponse.json(
        { ok: false, error: 'No available rooms found. Please try again later.' },
        { status: 404 }
      )
    }

    // Check for duplicate/conflicting reservations
    // Check if room is already booked for the same dates
    const checkIn = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)

    const conflictingReservation = await prisma.reservation.findFirst({
      where: {
        roomId: room.id,
        status: { in: ['pending', 'confirmed', 'checked_in'] },
        OR: [
          {
            // Existing reservation starts before new checkout and ends after new checkin
            checkInDate: { lt: checkOut },
            checkOutDate: { gt: checkIn }
          }
        ]
      }
    })

    if (conflictingReservation) {
      return NextResponse.json(
        { 
          ok: false, 
          error: `Room ${room.number} is already booked for the selected dates. Please choose different dates.` 
        },
        { status: 409 } // 409 Conflict
      )
    }

    // Check if user already has a reservation for the same dates (prevent duplicates)
    const userDuplicateReservation = await prisma.reservation.findFirst({
      where: {
        userId: user.id,
        status: { in: ['pending', 'confirmed', 'checked_in'] },
        checkInDate: checkIn,
        checkOutDate: checkOut,
        roomId: room.id
      }
    })

    if (userDuplicateReservation) {
      return NextResponse.json(
        { 
          ok: false, 
          error: 'You already have a reservation for this room and dates. Please check your bookings.' 
        },
        { status: 409 } // 409 Conflict
      )
    }

    // Calculate pricing
    const nights = Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24))
    const subtotal = room.basePrice * nights
    const taxAmount = Math.round(subtotal * 0.085) // 8.5% tax
    const totalAmount = subtotal + taxAmount
    const depositHoldCents = room.basePrice // One night deposit

    // Generate confirmation code
    let confirmationCode: string
    let isUnique = false
    while (!isUnique) {
      confirmationCode = generateConfirmationCode()
      const existing = await prisma.reservation.findUnique({
        where: { confirmationCode }
      })
      if (!existing) {
        isUnique = true
      }
    }

    // Create reservation
    const reservation = await prisma.reservation.create({
      data: {
        userId: user.id,
        roomId: room.id,
        checkInDate: new Date(checkInDate),
        checkOutDate: new Date(checkOutDate),
        guests,
        status: 'confirmed',
        totalAmount,
        depositHoldCents,
        confirmationCode: confirmationCode!
      }
    })

    // Create guest profile
    await prisma.guestProfile.create({
      data: {
        reservationId: reservation.id,
        firstName: guestDetails.firstName,
        lastName: guestDetails.lastName,
        email: guestDetails.email,
        phone: guestDetails.phone,
        country: guestDetails.country,
        isBusiness: guestDetails.isBusiness || false,
        company: guestDetails.company,
        vat: guestDetails.vat
      }
    })

    // Create payment auth (mock)
    if (paymentDetails) {
      await prisma.paymentAuth.create({
        data: {
          reservationId: reservation.id,
          last4: paymentDetails.cardNumber.slice(-4),
          brand: paymentDetails.cardNumber.startsWith('4') ? 'visa' : 'mastercard',
          expMonth: paymentDetails.expiryMonth,
          expYear: paymentDetails.expiryYear,
          amountHoldCents: depositHoldCents,
          status: 'authorized',
        }
      })
    }

    // Create identity document (mock - for testing)
    await prisma.identityDocument.create({
      data: {
        reservationId: reservation.id,
        frontUrl: 'mock://id-front.jpg',
        verified: true,
      }
    })

    // Create biometric check (mock - for testing)
    await prisma.biometricCheck.create({
      data: {
        reservationId: reservation.id,
        matchScore: 95,
        status: 'pass',
        imageUrl: 'mock://face.jpg',
      }
    })

    // Generate digital key
    const currentToken = generateToken()
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

    const digitalKey = await prisma.digitalKey.create({
      data: {
        reservationId: reservation.id,
        currentToken,
        expiresAt,
        lastRotatedAt: new Date()
      }
    })

    // Update room status
    await prisma.room.update({
      where: { id: room.id },
      data: { status: 'occupied' }
    })

    // Construct digital key URL
    const digitalKeyUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/key/${reservation.id}`

    // Send confirmation email with digital key
    const emailSent = await sendConfirmationCodeEmail(
      guestDetails.email,
      confirmationCode!,
      reservation.id,
      `${guestDetails.firstName} ${guestDetails.lastName}`,
      reservation.checkInDate,
      reservation.checkOutDate,
      room.number,
      digitalKey.currentToken,
      digitalKey.expiresAt
    )
    
    if (!emailSent) {
      console.warn('⚠️  Failed to send confirmation email. Confirmation code:', confirmationCode)
      console.warn('⚠️  Please check RESEND_API_KEY configuration')
      // Don't fail the booking if email fails - the code is still in the database
    } else {
      console.log('✅ Confirmation email sent successfully to:', guestDetails.email)
      console.log('✅ Confirmation code:', confirmationCode)
      console.log('✅ Digital key URL:', digitalKeyUrl)
    }

    // Log audit event
    await prisma.auditLog.create({
      data: {
        actorUserId: user.id,
        action: 'reservation_confirmed',
        entityType: 'reservation',
        entityId: reservation.id,
        details: JSON.stringify({
          digitalKeyId: digitalKey.id,
          confirmationCode: confirmationCode,
          roomNumber: room.number
        })
      }
    })

    return NextResponse.json({
      ok: true,
      data: {
        reservation: {
          id: reservation.id,
          status: reservation.status,
          confirmationCode: reservation.confirmationCode,
          totalAmount: reservation.totalAmount
        },
        digitalKey: {
          id: digitalKey.id,
          currentToken: digitalKey.currentToken,
          expiresAt: digitalKey.expiresAt,
          lastRotatedAt: digitalKey.lastRotatedAt
        }
      }
    })
  } catch (error) {
    console.error('Complete booking error:', error)
    return NextResponse.json(
      { ok: false, error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

