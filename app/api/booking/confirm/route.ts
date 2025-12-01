import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'
import { generateToken, generateConfirmationCode } from '@/lib/utils'
import { sendConfirmationCodeEmail } from '@/lib/email'

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
    const { reservationId } = body

    if (!reservationId) {
      return NextResponse.json(
        { ok: false, error: 'Reservation ID required' },
        { status: 400 }
      )
    }

    // Get reservation with all related data
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        user: true,
        room: true,
        guestProfile: true,
        identityDocument: true,
        paymentAuth: true,
        biometricCheck: true
      }
    })

    if (!reservation) {
      return NextResponse.json(
        { ok: false, error: 'Reservation not found' },
        { status: 404 }
      )
    }

    // Verify all prerequisites are met
    if (reservation.status !== 'pending') {
      return NextResponse.json(
        { ok: false, error: 'Reservation is not in pending status' },
        { status: 400 }
      )
    }

    if (!reservation.identityDocument) {
      return NextResponse.json(
        { ok: false, error: 'Identity document not uploaded' },
        { status: 400 }
      )
    }

    if (!reservation.paymentAuth || reservation.paymentAuth.status !== 'authorized') {
      return NextResponse.json(
        { ok: false, error: 'Payment not authorized' },
        { status: 400 }
      )
    }

    if (!reservation.biometricCheck) {
      return NextResponse.json(
        { ok: false, error: 'Biometric verification not completed' },
        { status: 400 }
      )
    }

    // Check biometric status
    if (reservation.biometricCheck.status === 'fail') {
      return NextResponse.json(
        { ok: false, error: 'Biometric verification failed' },
        { status: 400 }
      )
    }

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

    // Update reservation status and add confirmation code
    const updatedReservation = await prisma.reservation.update({
      where: { id: reservationId },
      data: { 
        status: 'confirmed',
        confirmationCode: confirmationCode!
      }
    })

    // Generate digital key
    const currentToken = generateToken()
    const expiresAt = new Date(Date.now() + 30 * 1000) // 30 seconds

    const digitalKey = await prisma.digitalKey.create({
      data: {
        reservationId: reservation.id,
        currentToken,
        expiresAt,
        lastRotatedAt: new Date()
      }
    })

    // Update room status to occupied
    await prisma.room.update({
      where: { id: reservation.roomId },
      data: { status: 'occupied' }
    })

    // Send confirmation code email with digital key
    if (reservation.guestProfile) {
      await sendConfirmationCodeEmail(
        reservation.guestProfile.email,
        confirmationCode!,
        reservation.id,
        `${reservation.guestProfile.firstName} ${reservation.guestProfile.lastName}`,
        reservation.checkInDate,
        reservation.checkOutDate,
        reservation.room.number,
        digitalKey.currentToken,
        digitalKey.expiresAt
      )
    }

    // Log audit event
    await prisma.auditLog.create({
      data: {
        actorUserId: user.userId,
        action: 'reservation_confirmed',
        entityType: 'reservation',
        entityId: reservation.id,
        details: {
          digitalKeyId: digitalKey.id,
          biometricStatus: reservation.biometricCheck.status,
          matchScore: reservation.biometricCheck.matchScore,
          confirmationCode: confirmationCode
        }
      }
    })

    return NextResponse.json({
      ok: true,
      data: {
        reservation: {
          id: updatedReservation.id,
          status: updatedReservation.status,
          totalAmount: updatedReservation.totalAmount,
          confirmationCode: updatedReservation.confirmationCode
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
    console.error('Confirm error:', error)
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

