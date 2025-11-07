import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { bookingSearchSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { checkInDate, checkOutDate, guests, roomType } = bookingSearchSchema.parse(body)

    const checkIn = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)

    // Find available rooms
    const availableRooms = await prisma.room.findMany({
      where: {
        status: 'available',
        maxGuests: { gte: guests },
        ...(roomType && { type: roomType }),
        // Check for conflicts with existing reservations
        NOT: {
          reservations: {
            some: {
              status: { in: ['confirmed', 'checked_in'] },
              OR: [
                {
                  checkInDate: { lte: checkOut },
                  checkOutDate: { gt: checkIn }
                }
              ]
            }
          }
        }
      },
      include: {
        reservations: {
          where: {
            status: { in: ['confirmed', 'checked_in'] },
            OR: [
              {
                checkInDate: { lte: checkOut },
                checkOutDate: { gt: checkIn }
              }
            ]
          }
        }
      }
    })

    // Get rate plans for pricing
    const ratePlans = await prisma.ratePlan.findMany()

    // Calculate pricing for each room
    const roomsWithPricing = availableRooms.map(room => {
      const ratePlan = ratePlans.find(rp => rp.roomType === room.type)
      const taxPercent = ratePlan?.taxPercent || 8.5
      const taxAmount = Math.round(room.basePrice * (taxPercent / 100))
      const totalPrice = room.basePrice + taxAmount

      return {
        id: room.id,
        number: room.number,
        type: room.type,
        basePrice: room.basePrice,
        totalPrice,
        taxAmount,
        maxGuests: room.maxGuests,
        amenities: getRoomAmenities(room.type),
        cancellationPolicy: ratePlan?.cancellationPolicy || 'Standard cancellation policy'
      }
    })

    return NextResponse.json({
      ok: true,
      data: { rooms: roomsWithPricing }
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function getRoomAmenities(roomType: string): string[] {
  const baseAmenities = ['WiFi', 'Security']
  
  switch (roomType) {
    case 'Standard':
      return [...baseAmenities, 'Coffee']
    case 'Deluxe':
      return [...baseAmenities, 'Coffee', 'Parking']
    case 'Suite':
      return [...baseAmenities, 'Coffee', 'Parking', 'Premium']
    default:
      return baseAmenities
  }
}

