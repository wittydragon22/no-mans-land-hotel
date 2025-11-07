import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
})

export const bookingSearchSchema = z.object({
  checkInDate: z.string().min(1, 'Check-in date is required'),
  checkOutDate: z.string().min(1, 'Check-out date is required'),
  guests: z.number().min(1, 'At least 1 guest required').max(10, 'Maximum 10 guests'),
  roomType: z.enum(['Standard', 'Deluxe', 'Suite']).optional(),
}).refine((data) => {
  const checkIn = new Date(data.checkInDate)
  const checkOut = new Date(data.checkOutDate)
  return checkOut > checkIn
}, {
  message: 'Check-out date must be after check-in date',
  path: ['checkOutDate'],
})

export const guestDetailsSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  country: z.string().min(2, 'Country is required'),
  isBusiness: z.boolean().default(false),
  company: z.string().optional(),
  vat: z.string().optional(),
}).refine((data) => {
  if (data.isBusiness) {
    return data.company && data.company.length > 0
  }
  return true
}, {
  message: 'Company name is required for business stays',
  path: ['company'],
})

export const paymentSchema = z.object({
  cardNumber: z.string().min(13, 'Invalid card number').max(19, 'Invalid card number'),
  expiryMonth: z.number().min(1).max(12, 'Invalid month'),
  expiryYear: z.number().min(new Date().getFullYear(), 'Card has expired'),
  cvv: z.string().min(3, 'Invalid CVV').max(4, 'Invalid CVV'),
  billingAddress: z.object({
    street: z.string().min(5, 'Street address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    zipCode: z.string().min(5, 'ZIP code is required'),
    country: z.string().min(2, 'Country is required'),
  }),
})

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

