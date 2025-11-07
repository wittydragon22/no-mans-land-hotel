import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateToken } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reservationId } = body

    if (!reservationId) {
      return NextResponse.json(
        { ok: false, error: 'Reservation ID is required' },
        { status: 400 }
      )
    }

    // Find reservation
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        room: true,
        guestProfile: true,
        identityDocument: true,
        biometricCheck: true,
        digitalKey: true
      }
    })

    if (!reservation) {
      return NextResponse.json(
        { ok: false, error: 'Reservation not found' },
        { status: 404 }
      )
    }

    // Check if already checked in
    if (reservation.status === 'checked_in') {
      return NextResponse.json(
        { ok: false, error: 'You have already completed check-in' },
        { status: 400 }
      )
    }

    // Update reservation status to checked_in
    await prisma.reservation.update({
      where: { id: reservationId },
      data: { status: 'checked_in' }
    })

    // Update room status to occupied
    await prisma.room.update({
      where: { id: reservation.roomId },
      data: { status: 'occupied' }
    })

    // Generate or update digital key
    let digitalKey
    if (reservation.digitalKey) {
      // Update existing key
      const newToken = generateToken()
      digitalKey = await prisma.digitalKey.update({
        where: { id: reservation.digitalKey.id },
        data: {
          currentToken: newToken,
          expiresAt: new Date(Date.now() + 30 * 1000), // 30 seconds
          lastRotatedAt: new Date()
        }
      })
    } else {
      // Create new digital key
      const newToken = generateToken()
      digitalKey = await prisma.digitalKey.create({
        data: {
          reservationId: reservation.id,
          currentToken: newToken,
          expiresAt: new Date(Date.now() + 30 * 1000), // 30 seconds
          lastRotatedAt: new Date()
        }
      })
    }

    // Log audit event
    await prisma.auditLog.create({
      data: {
        actorUserId: reservation.userId,
        action: 'check_in_completed',
        entityType: 'reservation',
        entityId: reservation.id,
        details: {
          roomNumber: reservation.room.number,
          digitalKeyId: digitalKey.id
        }
      }
    })

    return NextResponse.json({
      ok: true,
      data: {
        reservation: {
          id: reservation.id,
          status: 'checked_in',
          roomNumber: reservation.room.number
        },
        digitalKey: {
          id: digitalKey.id,
          currentToken: digitalKey.currentToken,
          expiresAt: digitalKey.expiresAt
        }
      }
    })
  } catch (error) {
    console.error('Complete check-in error:', error)
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
