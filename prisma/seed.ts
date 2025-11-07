import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create users
  const adminHash = await bcrypt.hash('admin123', 10)
  const operatorHash = await bcrypt.hash('operator123', 10)
  const guestHash = await bcrypt.hash('guest123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@hotel.com' },
    update: {},
    create: {
      email: 'admin@hotel.com',
      hash: adminHash,
      role: 'admin',
      name: 'Hotel Admin',
      phone: '+1-555-0001',
    },
  })

  const operator = await prisma.user.upsert({
    where: { email: 'operator@hotel.com' },
    update: {},
    create: {
      email: 'operator@hotel.com',
      hash: operatorHash,
      role: 'operator',
      name: 'Hotel Operator',
      phone: '+1-555-0002',
    },
  })

  const guest = await prisma.user.upsert({
    where: { email: 'guest@example.com' },
    update: {},
    create: {
      email: 'guest@example.com',
      hash: guestHash,
      role: 'guest',
      name: 'Demo Guest',
      phone: '+1-555-0003',
    },
  })

  console.log('✅ Users created')

  // Create rooms
  const rooms = []
  for (let i = 1; i <= 10; i++) {
    const roomType = i <= 4 ? 'Standard' : i <= 7 ? 'Deluxe' : 'Suite'
    const basePrice = roomType === 'Standard' ? 15000 : roomType === 'Deluxe' ? 25000 : 40000
    const maxGuests = roomType === 'Standard' ? 2 : roomType === 'Deluxe' ? 4 : 6

    const room = await prisma.room.upsert({
      where: { number: i.toString().padStart(3, '0') },
      update: {},
      create: {
        number: i.toString().padStart(3, '0'),
        type: roomType,
        maxGuests,
        basePrice,
        status: 'available',
      },
    })
    rooms.push(room)
  }

  console.log('✅ Rooms created')

  // Create rate plans
  const ratePlans = [
    {
      roomType: 'Standard',
      taxPercent: 8.5,
      depositPolicy: 'One night deposit required at booking',
      cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
    },
    {
      roomType: 'Deluxe',
      taxPercent: 8.5,
      depositPolicy: 'One night deposit required at booking',
      cancellationPolicy: 'Free cancellation up to 48 hours before check-in',
    },
    {
      roomType: 'Suite',
      taxPercent: 8.5,
      depositPolicy: 'Two night deposit required at booking',
      cancellationPolicy: 'Free cancellation up to 72 hours before check-in',
    },
  ]

  for (const plan of ratePlans) {
    await prisma.ratePlan.create({
      data: plan,
    })
  }

  console.log('✅ Rate plans created')

  // Create a demo reservation
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const dayAfterTomorrow = new Date()
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)

  const demoReservation = await prisma.reservation.create({
    data: {
      userId: guest.id,
      roomId: rooms[0].id,
      checkInDate: tomorrow,
      checkOutDate: dayAfterTomorrow,
      guests: 2,
      status: 'confirmed',
      totalAmount: 16275, // $162.75 including tax
      depositHoldCents: 15000, // $150 deposit
    },
  })

  // Create guest profile for demo reservation
  await prisma.guestProfile.create({
    data: {
      reservationId: demoReservation.id,
      firstName: 'John',
      lastName: 'Doe',
      email: 'guest@example.com',
      phone: '+1-555-0003',
      country: 'US',
      isBusiness: false,
    },
  })

  // Create digital key for demo reservation
  await prisma.digitalKey.create({
    data: {
      reservationId: demoReservation.id,
      currentToken: 'demo-token-123',
      expiresAt: new Date(Date.now() + 30 * 1000), // 30 seconds from now
    },
  })

  console.log('✅ Demo reservation created')

  console.log('🎉 Database seeded successfully!')
  console.log('\nDemo accounts:')
  console.log('Admin: admin@hotel.com / admin123')
  console.log('Operator: operator@hotel.com / operator123')
  console.log('Guest: guest@example.com / guest123')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
