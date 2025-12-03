import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

/**
 * Cancel a reservation
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { reservationId: string } }
) {
  try {
    const user = getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { ok: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { reservationId } = params

    // Get reservation
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        user: true,
        room: true,
        guestProfile: true
      }
    })

    if (!reservation) {
      return NextResponse.json(
        { ok: false, error: 'Reservation not found' },
        { status: 404 }
      )
    }

    // Check if user owns this reservation
    if (reservation.userId !== user.userId && user.role === 'guest') {
      return NextResponse.json(
        { ok: false, error: 'Access denied' },
        { status: 403 }
      )
    }

    // Check if reservation can be canceled
    if (reservation.status === 'canceled') {
      return NextResponse.json(
        { ok: false, error: 'Reservation is already canceled' },
        { status: 400 }
      )
    }

    if (reservation.status === 'checked_out') {
      return NextResponse.json(
        { ok: false, error: 'Cannot cancel a completed reservation' },
        { status: 400 }
      )
    }

    // Update reservation status
    const updatedReservation = await prisma.reservation.update({
      where: { id: reservationId },
      data: {
        status: 'canceled'
      }
    })

    // Update room status back to available if not checked in
    if (reservation.status !== 'checked_in') {
      await prisma.room.update({
        where: { id: reservation.roomId },
        data: { status: 'available' }
      })
    }

    // Log audit event
    await prisma.auditLog.create({
      data: {
        actorUserId: user.userId,
        action: 'reservation_canceled',
        entityType: 'reservation',
        entityId: reservation.id,
        details: JSON.stringify({
          previousStatus: reservation.status,
          roomNumber: reservation.room.number,
          totalAmount: reservation.totalAmount
        })
      }
    })

    return NextResponse.json({
      ok: true,
      data: {
        reservation: {
          id: updatedReservation.id,
          status: updatedReservation.status
        }
      }
    })
  } catch (error) {
    console.error('Cancel reservation error:', error)
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}



