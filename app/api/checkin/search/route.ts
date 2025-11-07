import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const checkinSearchSchema = z.object({
  reservationId: z.string().min(1),
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reservationId, email } = checkinSearchSchema.parse(body)

    // Find reservation
    const reservation = await prisma.reservation.findFirst({
      where: {
        id: reservationId,
        guestProfile: {
          email: email
        },
        status: { in: ['confirmed', 'pending'] }
      },
      include: {
        room: true,
        guestProfile: true,
        digitalKey: true
      }
    })

    if (!reservation) {
      return NextResponse.json(
        { ok: false, error: 'Reservation not found. Please check your reservation ID and email' },
        { status: 404 }
      )
    }

    // Check if check-in date is today or in the past
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const checkInDate = new Date(reservation.checkInDate)
    checkInDate.setHours(0, 0, 0, 0)

    if (checkInDate > today) {
      return NextResponse.json(
        { ok: false, error: `Your check-in date is ${checkInDate.toLocaleDateString('en-US')}. Please check in on or after your check-in date` },
        { status: 400 }
      )
    }

    return NextResponse.json({
      ok: true,
      data: {
        reservation: {
          id: reservation.id,
          guestName: `${reservation.guestProfile.firstName} ${reservation.guestProfile.lastName}`,
          email: reservation.guestProfile.email,
          roomNumber: reservation.room.number,
          roomType: reservation.room.type,
          checkInDate: reservation.checkInDate,
          checkOutDate: reservation.checkOutDate,
          status: reservation.status,
          totalAmount: reservation.totalAmount,
          hasDigitalKey: !!reservation.digitalKey
        }
      }
    })
  } catch (error) {
    console.error('Check-in search error:', error)
    if (error instanceof z.ZodError) {
    return NextResponse.json(
      { ok: false, error: error.errors[0].message },
      { status: 400 }
    )
  }
  return NextResponse.json(
    { ok: false, error: 'Internal server error' },
    { status: 500 }
  )
  }
}
