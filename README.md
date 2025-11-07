# Unmanned Hotel System

A revolutionary autonomous hotel experience with AI-powered booking, facial recognition, and digital keys. Built with Next.js, TypeScript, Prisma, and PostgreSQL.

## Features

- **Multi-step Booking Flow**: Seamless 6-step booking process with real-time validation
- **Digital Key System**: Rotating QR codes and NFC integration for secure room access
- **Biometric Verification**: Face recognition for secure check-in
- **Operator Dashboard**: Complete hotel management interface
- **Admin Panel**: User management and feature flag controls
- **Mobile-First Design**: Responsive design with Framer Motion animations

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM, PostgreSQL
- **Authentication**: JWT with httpOnly cookies
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **State Management**: TanStack Query (React Query)

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd unmanned-hotel-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your values:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/unmanned_hotel"
   JWT_SECRET="your-super-secret-jwt-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret-here"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run database migrations
   npm run db:migrate
   
   # Seed the database with sample data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Demo Accounts

After running the seed script, you can use these demo accounts:

- **Admin**: admin@hotel.com / admin123
- **Operator**: operator@hotel.com / operator123  
- **Guest**: guest@example.com / guest123

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── booking/           # Booking flow pages
│   ├── operator/          # Operator dashboard
│   ├── admin/             # Admin panel
│   └── key/               # Digital key pages
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── booking/          # Booking-specific components
│   └── providers/        # React context providers
├── lib/                   # Utility functions and configurations
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration  
- `POST /api/auth/logout` - User logout

### Booking Flow
- `POST /api/booking/search` - Search available rooms
- `POST /api/booking/reserve` - Create reservation
- `POST /api/booking/id` - Upload ID documents
- `POST /api/booking/payment` - Process payment
- `POST /api/booking/biometric` - Biometric verification
- `POST /api/booking/confirm` - Confirm booking

### Digital Keys
- `GET /api/key/[reservationId]` - Get current key token
- `DELETE /api/key/[reservationId]` - Revoke digital key

### Operator & Admin
- `GET /api/operator/reservations` - List reservations
- `POST /api/operator/override/[reservationId]` - Override biometric status
- `GET /api/admin/audit` - View audit logs
- `POST /api/admin/feature-flags` - Toggle feature flags

## Database Schema

The application uses the following main entities:

- **Users**: Guest, operator, and admin accounts
- **Rooms**: Hotel room inventory with pricing
- **Reservations**: Booking records with status tracking
- **Guest Profiles**: Guest information and preferences
- **Identity Documents**: ID verification and OCR data
- **Payment Auth**: Payment authorization records
- **Biometric Checks**: Face verification results
- **Digital Keys**: Rotating access tokens
- **Audit Logs**: System activity tracking

## Key Features

### Booking Flow
1. **Search & Select Room**: Date selection, guest count, room type filtering
2. **Guest Details**: Personal information, business stay options
3. **ID Capture**: Document upload with OCR processing
4. **Payment**: Secure card processing with deposit holds
5. **Biometric Verification**: Face recognition matching
6. **Confirmation**: Digital key generation and booking completion

### Digital Key System
- **Rotating Tokens**: Keys rotate every 30 seconds for security
- **QR Code Display**: Visual key for door access
- **NFC Integration**: Mobile device pairing for contactless access
- **Access Logging**: All key usage is tracked and audited

### Operator Dashboard
- **KPI Monitoring**: Occupancy rates, guest counts, pending check-ins
- **Reservation Management**: View, modify, and override bookings
- **Manual Review**: Handle biometric verification failures
- **Key Management**: Revoke and monitor digital keys

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Guest, operator, and admin permissions
- **Data Encryption**: Sensitive data encrypted at rest
- **Audit Logging**: Complete activity tracking
- **Rate Limiting**: API endpoint protection
- **Input Validation**: Zod schema validation for all inputs

## Development

### Database Management
```bash
# View database in Prisma Studio
npm run db:studio

# Reset database
npm run db:push --force-reset

# Generate new migration
npm run db:migrate
```

### Testing
```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e
```

## Deployment

### Environment Variables
Ensure all required environment variables are set in production:

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secure JWT signing key
- `NEXTAUTH_URL`: Application URL
- `NEXTAUTH_SECRET`: NextAuth secret key

### Database Setup
1. Create PostgreSQL database
2. Run migrations: `npm run db:migrate`
3. Seed initial data: `npm run db:seed`

### Build and Deploy
```bash
# Build for production
npm run build

# Start production server
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Email: support@unmannedhotel.com
- Documentation: [docs.unmannedhotel.com](https://docs.unmannedhotel.com)
- Issues: [GitHub Issues](https://github.com/your-org/unmanned-hotel-system/issues)

