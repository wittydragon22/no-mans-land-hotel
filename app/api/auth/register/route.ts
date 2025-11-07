import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/db'
import { registerSchema } from '@/lib/validations'
import { setAuthCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, phone } = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { ok: false, error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        hash,
        name,
        phone,
        role: 'guest' // Default role for new registrations
      }
    })

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    // Create response with httpOnly cookie
    const response = NextResponse.json({
      ok: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
          phone: user.phone
        }
      }
    })

    // Set httpOnly cookie
    response.headers.set('Set-Cookie', setAuthCookie(token))

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

