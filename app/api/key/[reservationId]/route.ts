import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'
import { generateToken } from '@/lib/utils'

interface RouteParams {
  params: {
    reservationId: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { ok: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { reservationId } = params

    // Get reservation and digital key
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        digitalKey: true,
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

    // Check if user owns this reservation or is operator/admin
    if (reservation.userId !== user.userId && user.role === 'guest') {
      return NextResponse.json(
        { ok: false, error: 'Access denied' },
        { status: 403 }
      )
    }

    if (!reservation.digitalKey) {
      return NextResponse.json(
        { ok: false, error: 'Digital key not found' },
        { status: 404 }
      )
    }

    const now = new Date()
    const key = reservation.digitalKey

    // Check if key needs rotation
    if (now >= key.expiresAt) {
      // Generate new token
      const newToken = generateToken()
      const newExpiresAt = new Date(now.getTime() + 30 * 1000) // 30 seconds

      const updatedKey = await prisma.digitalKey.update({
        where: { id: key.id },
        data: {
          currentToken: newToken,
          expiresAt: newExpiresAt,
          lastRotatedAt: now
        }
      })

      // Log key rotation
      await prisma.auditLog.create({
        data: {
          actorUserId: user.userId,
          action: 'digital_key_rotated',
          entityType: 'digital_key',
          entityId: key.id,
          details: {
            reservationId,
            oldToken: key.currentToken.substring(0, 8) + '...',
            newToken: newToken.substring(0, 8) + '...'
          }
        }
      })

      return NextResponse.json({
        ok: true,
        data: {
          key: {
            id: updatedKey.id,
            currentToken: updatedKey.currentToken,
            expiresAt: updatedKey.expiresAt,
            lastRotatedAt: updatedKey.lastRotatedAt
          },
          reservation: {
            id: reservation.id,
            roomNumber: reservation.room.number,
            guestName: `${reservation.guestProfile.firstName} ${reservation.guestProfile.lastName}`,
            status: reservation.status
          }
        }
      })
    }

    // Return current key
    return NextResponse.json({
      ok: true,
      data: {
        key: {
          id: key.id,
          currentToken: key.currentToken,
          expiresAt: key.expiresAt,
          lastRotatedAt: key.lastRotatedAt
        },
        reservation: {
          id: reservation.id,
          roomNumber: reservation.room.number,
          guestName: `${reservation.guestProfile.firstName} ${reservation.guestProfile.lastName}`,
          status: reservation.status
        }
      }
    })
  } catch (error) {
    console.error('Get key error:', error)
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { ok: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Only operators and admins can revoke keys
    if (user.role === 'guest') {
      return NextResponse.json(
        { ok: false, error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const { reservationId } = params

    // Get reservation
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { digitalKey: true }
    })

    if (!reservation) {
      return NextResponse.json(
        { ok: false, error: 'Reservation not found' },
        { status: 404 }
      )
    }

    if (!reservation.digitalKey) {
      return NextResponse.json(
        { ok: false, error: 'Digital key not found' },
        { status: 404 }
      )
    }

    // Delete digital key
    await prisma.digitalKey.delete({
      where: { id: reservation.digitalKey.id }
    })

    // Log key revocation
    await prisma.auditLog.create({
      data: {
        actorUserId: user.userId,
        action: 'digital_key_revoked',
        entityType: 'digital_key',
        entityId: reservation.digitalKey.id,
        details: {
          reservationId,
          revokedBy: user.role
        }
      }
    })

    return NextResponse.json({
      ok: true,
      data: { message: 'Digital key revoked successfully' }
    })
  } catch (error) {
    console.error('Revoke key error:', error)
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

