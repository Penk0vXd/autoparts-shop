import { NextRequest, NextResponse } from 'next/server'
import { resetPassword } from '@/services/authService'
import { rateLimit } from '@/lib/rate-limit'

// Rate limit: 3 requests per hour
const limiter = rateLimit({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 500,
})

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    await limiter.check(3, 'RESET_PASSWORD_IP')
    
    const body = await request.json()
    const result = await resetPassword(body)
    
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
    console.error('Reset password API error:', error)
    
    if (error instanceof Error && error.message.includes('rate limit')) {
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        { status: 429 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Password reset failed' },
      { status: 500 }
    )
  }
} 