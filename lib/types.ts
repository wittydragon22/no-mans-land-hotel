import { UserRole, RoomType, ReservationStatus, PaymentStatus, BiometricStatus } from '@prisma/client'

export interface ApiResponse<T = any> {
  ok: boolean
  data?: T
  error?: string
}

export interface User {
  id: string
  email: string
  role: UserRole
  name?: string
  phone?: string
  createdAt: Date
}

export interface Room {
  id: string
  number: string
  type: RoomType
  maxGuests: number
  basePrice: number
  status: string
}

export interface Reservation {
  id: string
  userId: string
  roomId: string
  checkInDate: Date
  checkOutDate: Date
  guests: number
  status: ReservationStatus
  totalAmount: number
  depositHoldCents: number
  createdAt: Date
}

export interface BookingSearchRequest {
  checkInDate: string
  checkOutDate: string
  guests: number
  roomType?: RoomType
}

export interface BookingSearchResponse {
  rooms: Array<{
    id: string
    number: string
    type: RoomType
    basePrice: number
    totalPrice: number
    taxAmount: number
    maxGuests: number
    amenities: string[]
    cancellationPolicy: string
  }>
}

export interface GuestDetails {
  firstName: string
  lastName: string
  email: string
  phone: string
  country: string
  isBusiness: boolean
  company?: string
  vat?: string
}

export interface PaymentDetails {
  cardNumber: string
  expiryMonth: number
  expiryYear: number
  cvv: string
  billingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

export interface DigitalKey {
  id: string
  reservationId: string
  currentToken: string
  expiresAt: Date
  lastRotatedAt: Date
}

export interface FeatureFlags {
  enableFaceId: boolean
  enableNFC: boolean
  enablePaymentHold: boolean
}

export interface KPIData {
  occupancy: number
  inHouse: number
  dueOut: number
  pendingCheckIns: number
  manualReviewQueue: number
}

export interface AuditLogEntry {
  id: string
  actorUserId: string
  action: string
  entityType: string
  entityId: string
  details?: any
  createdAt: Date
  actor: {
    name?: string
    email: string
  }
}

