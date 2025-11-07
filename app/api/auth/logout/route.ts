import { NextRequest, NextResponse } from 'next/server'
import { clearAuthCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Create response
    const response = NextResponse.json({
      ok: true,
      data: { message: 'Logged out successfully' }
    })

    // Clear httpOnly cookie
    response.headers.set('Set-Cookie', clearAuthCookie())

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

