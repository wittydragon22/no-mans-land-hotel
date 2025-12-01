import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const checkinSearchSchema = z.object({
  reservationId: z.string().optional(),
  email: z.string().email().optional(),
  confirmationCode: z.string().optional(),
}).refine(
  (data) => {
    // Either reservationId+email OR confirmationCode must be provided
    return (data.reservationId && data.email) || data.confirmationCode
  },
  {
    message: "Either provide reservation ID and email, or confirmation code",
  }
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('🔍 Check-in search request:', body)
    
    const { reservationId, email, confirmationCode } = checkinSearchSchema.parse(body)
    console.log('✅ Parsed data:', { reservationId, email, confirmationCode })

    // Find reservation by confirmation code OR reservationId+email
    let reservation
    if (confirmationCode) {
      console.log('🔑 Searching by confirmation code:', confirmationCode)
      // Search by confirmation code
      reservation = await prisma.reservation.findUnique({
        where: {
          confirmationCode: confirmationCode.trim()
        },
        include: {
          room: true,
          guestProfile: true,
          digitalKey: true
        }
      })
      
      console.log('📋 Reservation found:', reservation ? 'Yes' : 'No')
      if (reservation) {
        console.log('📋 Reservation status:', reservation.status)
      }

      // Verify status
      if (reservation && !['confirmed', 'pending'].includes(reservation.status)) {
        console.log('⚠️  Reservation status not valid for check-in:', reservation.status)
        reservation = null
      }
    } else if (reservationId && email) {
      // Search by reservationId and email
      reservation = await prisma.reservation.findFirst({
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
    }

    if (!reservation) {
      console.log('❌ Reservation not found')
      const errorMessage = confirmationCode 
        ? `Reservation not found with confirmation code: ${confirmationCode}. Please check your confirmation code.`
        : 'Reservation not found. Please check your reservation ID and email'
      return NextResponse.json(
        { ok: false, error: errorMessage },
        { status: 404 }
      )
    }
    
    console.log('✅ Reservation found:', reservation.id)

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
