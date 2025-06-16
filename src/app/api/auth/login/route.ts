import { NextRequest, NextResponse } from 'next/server'
import { login } from '@/services/authService'
import { rateLimit } from '@/lib/rate-limit'

// Rate limit: 5 requests per minute
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
})

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    await limiter.check(5, 'LOGIN_IP')
    
    const body = await request.json()
    const result = await login(body)
    
    if (result.error) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' }, // Generic error for security
        { status: 401 }
      )
    }
    
    return NextResponse.json({
      success: true,
      user: result.user,
    })
  } catch (error) {
    console.error('Login API error:', error)
    
    if (error instanceof Error && error.message.includes('rate limit')) {
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        { status: 429 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    )
  }
} 