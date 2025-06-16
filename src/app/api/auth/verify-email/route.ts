import { NextRequest, NextResponse } from 'next/server'
import { verifyEmail } from '@/services/authService'
import { rateLimit } from '@/lib/rate-limit'

// Rate limit: 5 requests per minute
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
})

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    await limiter.check(5, 'VERIFY_EMAIL_IP')
    
    const { token } = await request.json()
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      )
    }
    
    const result = await verifyEmail(token)
    
    if (result.error) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }
    
    return NextResponse.json({
      success: true,
      user: result.user,
    })
  } catch (error) {
    console.error('Email verification API error:', error)
    
    if (error instanceof Error && error.message.includes('rate limit')) {
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        { status: 429 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Email verification failed' },
      { status: 500 }
    )
  }
} 