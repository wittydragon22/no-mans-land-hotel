#!/bin/bash

echo "🏨 Setting up Unmanned Hotel System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"

# Generate Prisma client
echo "🗄️ Setting up database..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma client"
    exit 1
fi

# Push database schema
npx prisma db push

if [ $? -ne 0 ]; then
    echo "❌ Failed to push database schema"
    exit 1
fi

# Seed database
echo "🌱 Seeding database..."
npm run db:seed

if [ $? -ne 0 ]; then
    echo "❌ Failed to seed database"
    exit 1
fi

echo "✅ Database setup complete"

echo ""
echo "🎉 Setup complete! You can now run the application:"
echo ""
echo "   npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser"
echo ""
echo "Demo accounts:"
echo "  Admin: admin@hotel.com / admin123"
echo "  Operator: operator@hotel.com / operator123"
echo "  Guest: guest@example.com / guest123"
echo ""

