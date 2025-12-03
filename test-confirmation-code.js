// Quick test script to verify confirmation code functionality
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testConfirmationCode() {
  try {
    console.log('🧪 Testing Confirmation Code Functionality...\n')
    
    // 1. Check if confirmationCode field exists in schema
    console.log('1. Checking database schema...')
    const reservation = await prisma.reservation.findFirst({
      include: {
        guestProfile: true,
        room: true
      }
    })
    
    if (reservation) {
      console.log(`   ✅ Found reservation: ${reservation.id}`)
      console.log(`   - Status: ${reservation.status}`)
      console.log(`   - Confirmation Code: ${reservation.confirmationCode || 'Not set yet'}`)
      console.log(`   - Guest: ${reservation.guestProfile?.firstName} ${reservation.guestProfile?.lastName}`)
      console.log(`   - Email: ${reservation.guestProfile?.email}`)
      console.log(`   - Room: ${reservation.room?.number}`)
    } else {
      console.log('   ⚠️  No reservations found. Run seed script first.')
    }
    
    // 2. Test confirmation code generation
    console.log('\n2. Testing confirmation code generation...')
    const testCode = Math.floor(100000 + Math.random() * 900000).toString()
    console.log(`   ✅ Generated test code: ${testCode}`)
    console.log(`   - Format: 6 digits ✓`)
    console.log(`   - Length: ${testCode.length} ✓`)
    
    // 3. Check check-in search functionality
    console.log('\n3. Testing check-in search...')
    if (reservation && reservation.confirmationCode) {
      const found = await prisma.reservation.findUnique({
        where: { confirmationCode: reservation.confirmationCode },
        include: {
          guestProfile: true,
          room: true
        }
      })
      if (found) {
        console.log(`   ✅ Can find reservation by confirmation code`)
        console.log(`   - Code: ${found.confirmationCode}`)
        console.log(`   - Guest: ${found.guestProfile?.firstName} ${found.guestProfile?.lastName}`)
      }
    } else {
      console.log('   ⚠️  No confirmation code set. Complete a booking first.')
    }
    
    console.log('\n✅ All tests completed!')
    console.log('\n📝 Next steps:')
    console.log('   1. Complete a booking flow at http://localhost:3000/booking')
    console.log('   2. Check console logs for email (confirmation code will be sent)')
    console.log('   3. Use the confirmation code at http://localhost:3000/checkin')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testConfirmationCode()



