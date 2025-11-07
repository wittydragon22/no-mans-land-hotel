import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import { UserRole } from '@prisma/client'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key'

export interface JWTPayload {
  userId: string
  email: string
  role: UserRole
  iat?: number
  exp?: number
}

export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  // Check for httpOnly cookie
  const cookieToken = request.cookies.get('auth-token')?.value
  return cookieToken || null
}

export function getUserFromRequest(request: NextRequest): JWTPayload | null {
  const token = getTokenFromRequest(request)
  if (!token) return null

  return verifyToken(token)
}

export function requireAuth(role?: UserRole) {
  return (request: NextRequest): JWTPayload => {
    const user = getUserFromRequest(request)
    if (!user) {
      throw new Error('Authentication required')
    }

    if (role && user.role !== role && user.role !== 'admin') {
      throw new Error('Insufficient permissions')
    }

    return user
  }
}

export function setAuthCookie(token: string): string {
  return `auth-token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict; Secure`
}

export function clearAuthCookie(): string {
  return `auth-token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict; Secure`
}

