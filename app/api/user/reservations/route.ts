import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

/**
 * Get user's reservations
 * Returns all reservations for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { ok: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get all reservations for this user
    const reservations = await prisma.reservation.findMany({
      where: {
        userId: user.userId
      },
      include: {
        room: {
          select: {
            number: true,
            type: true,
            basePrice: true
          }
        },
        guestProfile: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        digitalKey: {
          select: {
            currentToken: true,
            expiresAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      ok: true,
      data: {
        reservations: reservations.map(res => ({
          id: res.id,
          confirmationCode: res.confirmationCode,
          roomNumber: res.room.number,
          roomType: res.room.type,
          checkInDate: res.checkInDate,
          checkOutDate: res.checkOutDate,
          guests: res.guests,
          status: res.status,
          totalAmount: res.totalAmount,
          createdAt: res.createdAt,
          guestName: res.guestProfile ? `${res.guestProfile.firstName} ${res.guestProfile.lastName}` : null,
          hasDigitalKey: !!res.digitalKey,
          digitalKeyExpiresAt: res.digitalKey?.expiresAt || null
        }))
      }
    })
  } catch (error) {
    console.error('Get reservations error:', error)
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

