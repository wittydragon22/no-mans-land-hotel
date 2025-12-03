/**
 * Script to check if confirmation codes are in the database
 * Run with: npx tsx scripts/check-confirmation-codes.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkConfirmationCodes() {
  console.log('🔍 Checking confirmation codes in database...\n')

  try {
    // Get all reservations
    const reservations = await prisma.reservation.findMany({
      select: {
        id: true,
        confirmationCode: true,
        status: true,
        checkInDate: true,
        checkOutDate: true,
        guestProfile: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          }
        },
        room: {
          select: {
            number: true,
            type: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10, // Get last 10 reservations
    })

    console.log(`📋 Found ${reservations.length} reservations (showing last 10):\n`)

    if (reservations.length === 0) {
      console.log('⚠️  No reservations found in database')
      return
    }

    let withCode = 0
    let withoutCode = 0

    reservations.forEach((reservation, index) => {
      const hasCode = !!reservation.confirmationCode
      if (hasCode) {
        withCode++
      } else {
        withoutCode++
      }

      console.log(`${index + 1}. Reservation ID: ${reservation.id}`)
      console.log(`   Status: ${reservation.status}`)
      console.log(`   Confirmation Code: ${reservation.confirmationCode || '❌ MISSING'}`)
      console.log(`   Guest: ${reservation.guestProfile?.firstName} ${reservation.guestProfile?.lastName} (${reservation.guestProfile?.email})`)
      console.log(`   Room: ${reservation.room?.number} (${reservation.room?.type})`)
      console.log(`   Check-in: ${reservation.checkInDate.toLocaleDateString()}`)
      console.log('')
    })

    console.log('📊 Summary:')
    console.log(`   ✅ With confirmation code: ${withCode}`)
    console.log(`   ❌ Without confirmation code: ${withoutCode}`)

    if (withoutCode > 0) {
      console.log('\n⚠️  Some reservations are missing confirmation codes!')
      console.log('   These reservations cannot be checked in using confirmation code.')
    }

    // Test search by confirmation code
    const reservationWithCode = reservations.find(r => r.confirmationCode)
    if (reservationWithCode && reservationWithCode.confirmationCode) {
      console.log('\n🧪 Testing search by confirmation code...')
      const testCode = reservationWithCode.confirmationCode
      const found = await prisma.reservation.findUnique({
        where: { confirmationCode: testCode },
        select: {
          id: true,
          confirmationCode: true,
          status: true,
        }
      })

      if (found) {
        console.log(`   ✅ Successfully found reservation with code: ${testCode}`)
        console.log(`   Reservation ID: ${found.id}`)
        console.log(`   Status: ${found.status}`)
      } else {
        console.log(`   ❌ Failed to find reservation with code: ${testCode}`)
      }
    }

  } catch (error) {
    console.error('❌ Error checking confirmation codes:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkConfirmationCodes()



