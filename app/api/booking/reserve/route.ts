import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { ok: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { roomId, checkInDate, checkOutDate, guests, guestDetails } = body

    // Validate required fields
    if (!roomId || !checkInDate || !checkOutDate || !guests || !guestDetails) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if room is still available
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        reservations: {
          where: {
            status: { in: ['confirmed', 'checked_in'] },
            OR: [
              {
                checkInDate: { lte: new Date(checkOutDate) },
                checkOutDate: { gt: new Date(checkInDate) }
              }
            ]
          }
        }
      }
    })

    if (!room || room.status !== 'available' || room.reservations.length > 0) {
      return NextResponse.json(
        { ok: false, error: 'Room no longer available' },
        { status: 400 }
      )
    }

    // Calculate pricing
    const nights = Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24))
    const subtotal = room.basePrice * nights
    const taxAmount = Math.round(subtotal * 0.085) // 8.5% tax
    const totalAmount = subtotal + taxAmount
    const depositHoldCents = room.basePrice // One night deposit

    // Create reservation
    const reservation = await prisma.reservation.create({
      data: {
        userId: user.userId,
        roomId,
        checkInDate: new Date(checkInDate),
        checkOutDate: new Date(checkOutDate),
        guests,
        status: 'pending',
        totalAmount,
        depositHoldCents
      }
    })

    // Create guest profile
    const guestProfile = await prisma.guestProfile.create({
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

    // Log audit event
    await prisma.auditLog.create({
      data: {
        actorUserId: user.userId,
        action: 'reservation_created',
        entityType: 'reservation',
        entityId: reservation.id,
        details: {
          roomId,
          checkInDate,
          checkOutDate,
          guests,
          totalAmount
        }
      }
    })

    return NextResponse.json({
      ok: true,
      data: {
        reservation: {
          id: reservation.id,
          status: reservation.status,
          totalAmount: reservation.totalAmount,
          depositHoldCents: reservation.depositHoldCents
        },
        guestProfile: {
          id: guestProfile.id,
          firstName: guestProfile.firstName,
          lastName: guestProfile.lastName,
          email: guestProfile.email
        }
      }
    })
  } catch (error) {
    console.error('Reserve error:', error)
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

