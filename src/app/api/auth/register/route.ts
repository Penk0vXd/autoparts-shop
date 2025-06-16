import { NextRequest, NextResponse } from 'next/server'
import { register } from '@/services/authService'
import { rateLimit } from '@/lib/rate-limit'

// Rate limit: 5 requests per minute
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
})

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    await limiter.check(5, 'REGISTER_IP')
    
    const body = await request.json()
    const result = await register(body)
    
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
    console.error('Registration API error:', error)
    
    if (error instanceof Error && error.message.includes('rate limit')) {
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        { status: 429 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Registration failed' },
      { status: 500 }
    )
  }
} 