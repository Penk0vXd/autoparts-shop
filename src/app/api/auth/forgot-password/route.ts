import { NextRequest, NextResponse } from 'next/server'
import { requestPasswordReset } from '@/services/authService'
import { rateLimit } from '@/lib/rate-limit'

// Rate limit: 3 requests per hour
const limiter = rateLimit({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 500,
})

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    await limiter.check(3, 'FORGOT_PASSWORD_IP')
    
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }
    
    const result = await requestPasswordReset(email)
    
    // Always return success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message: 'If an account exists, you will receive a password reset email',
    })
  } catch (error) {
    console.error('Forgot password API error:', error)
    
    if (error instanceof Error && error.message.includes('rate limit')) {
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        { status: 429 }
      )
    }
    
    // Still return success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message: 'If an account exists, you will receive a password reset email',
    })
  }
} 