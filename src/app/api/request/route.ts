// src/app/api/request/route.ts
// The divine gatekeeper - accepts offerings, sends whispers to Discord

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// MVP API Route for Parts Requests
// Simplified version that takes form data and saves to Supabase

interface RequestData {
  full_name: string
  phone: string
  car_details: string
  message: string
}

// Initialize Supabase client with service role key for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST(request: NextRequest) {
  try {
    // Parse JSON body
    const body: RequestData = await request.json()
    
    // Basic validation
    if (!body.full_name || !body.phone || !body.car_details || !body.message) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate field lengths
    if (body.full_name.length < 2 || body.full_name.length > 100) {
      return NextResponse.json(
        { success: false, error: 'Full name must be between 2 and 100 characters' },
        { status: 400 }
      )
    }

    if (body.phone.length < 6 || body.phone.length > 20) {
      return NextResponse.json(
        { success: false, error: 'Phone number must be between 6 and 20 characters' },
        { status: 400 }
      )
    }

    if (body.message.length < 10 || body.message.length > 1000) {
      return NextResponse.json(
        { success: false, error: 'Message must be between 10 and 1000 characters' },
        { status: 400 }
      )
    }

    // Prepare data for Supabase
    const requestData = {
      full_name: body.full_name.trim(),
      phone: body.phone.trim(),
      car_details: body.car_details.trim(),
      message: body.message.trim(),
      created_at: new Date().toISOString()
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('requests')
      .insert([requestData])
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to save request. Please try again.' },
        { status: 500 }
      )
    }

    // Success response
    return NextResponse.json(
      { 
        success: true, 
        message: 'Request submitted successfully',
        id: data.id 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('API route error:', error)
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON data' },
        { status: 400 }
      )
    }

    // Handle other errors
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to submit requests.' },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to submit requests.' },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to submit requests.' },
    { status: 405 }
  )
}
