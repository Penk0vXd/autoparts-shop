// src/app/api/request/route.ts
// The divine gatekeeper - accepts offerings, sends whispers to Discord

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// High-performance Discord webhook API route
// Works flawlessly in both local and Vercel environments

// Type definitions for robust type safety
interface RequestData {
  full_name: string
  phone: string
  car_details: string
  message: string
}

interface DiscordEmbed {
  title: string
  color: number
  fields: Array<{
    name: string
    value: string
    inline?: boolean
  }>
  timestamp: string
  footer: {
    text: string
  }
}

interface DiscordPayload {
  embeds: DiscordEmbed[]
  username: string
  avatar_url?: string
}

interface ApiResponse {
  success: boolean
  message?: string
  id?: string
  discord_sent?: boolean
  error?: string
}

// Initialize Supabase client with service role key
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

// Robust Discord webhook function with comprehensive error handling
async function sendDiscordNotification(requestData: RequestData, requestId: string): Promise<boolean> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL
  
  if (!webhookUrl) {
    console.log('[Discord] Webhook URL not configured, skipping notification')
    return false
  }

  // Validate webhook URL format
  if (!webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
    console.error('[Discord] Invalid webhook URL format')
    return false
  }

  try {
    console.log('[Discord] Preparing notification payload...')
    
    const embed: DiscordEmbed = {
      title: "🚗 Нова заявка за авточасти",
      color: 0xDC2626, // Red color
      fields: [
        { 
          name: "👤 Клиент", 
          value: requestData.full_name, 
          inline: true 
        },
        { 
          name: "📞 Телефон", 
          value: requestData.phone, 
          inline: true 
        },
        { 
          name: "🚙 Автомобил", 
          value: requestData.car_details || "Не е посочен", 
          inline: false 
        },
        { 
          name: "🔧 Описание на частта", 
          value: requestData.message.length > 1024 
            ? requestData.message.substring(0, 1021) + '...' 
            : requestData.message, 
          inline: false 
        },
        { 
          name: "🆔 ID на заявката", 
          value: requestId, 
          inline: true 
        },
        {
          name: "📅 Дата и час",
          value: new Date().toLocaleString('bg-BG', {
            timeZone: 'Europe/Sofia',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }),
          inline: true
        }
      ],
      timestamp: new Date().toISOString(),
      footer: { 
        text: "AutoParts Store - Автоматично известие" 
      }
    }

    const payload: DiscordPayload = {
      embeds: [embed],
      username: "AutoParts Bot"
    }

    console.log('[Discord] Sending notification to webhook...')

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AutoParts-Store-Bot/1.0'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[Discord] Webhook failed with status ${response.status}:`, errorText)
      return false
    }

    console.log('[Discord] Notification sent successfully')
    return true

  } catch (error) {
    console.error('[Discord] Webhook error:', error)
    return false
  }
}

// Main POST handler with comprehensive error handling
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  console.log('[API] POST /api/request - Request received')
  
  try {
    // Log raw request for debugging
    const rawBody = await request.text()
    console.log('[API] Raw request body:', rawBody)
    
    // Parse JSON body with proper error handling
    let body: RequestData
    try {
      body = JSON.parse(rawBody)
    } catch (parseError) {
      console.error('[API] JSON parsing error:', parseError)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid JSON format in request body' 
        },
        { status: 400 }
      )
    }
    
    console.log('[API] Parsed request data:', { 
      full_name: body.full_name ? '***' : 'missing',
      phone: body.phone ? '***' : 'missing',
      car_details: body.car_details ? '***' : 'missing',
      message: body.message ? '***' : 'missing'
    })
    
    // Comprehensive validation
    if (!body.full_name || !body.phone || !body.car_details || !body.message) {
      console.log('[API] Validation failed: missing required fields')
      return NextResponse.json(
        { 
          success: false, 
          error: 'All fields are required: full_name, phone, car_details, message' 
        },
        { status: 400 }
      )
    }

    // Field length validation
    if (body.full_name.length < 2 || body.full_name.length > 100) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Full name must be between 2 and 100 characters' 
        },
        { status: 400 }
      )
    }

    if (body.phone.length < 6 || body.phone.length > 20) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Phone number must be between 6 and 20 characters' 
        },
        { status: 400 }
      )
    }

    if (body.message.length < 10 || body.message.length > 1000) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Message must be between 10 and 1000 characters' 
        },
        { status: 400 }
      )
    }

    // Prepare data for database
    const requestData: RequestData = {
      full_name: body.full_name.trim(),
      phone: body.phone.trim(),
      car_details: body.car_details.trim(),
      message: body.message.trim()
    }

    console.log('[API] Saving to Supabase...')

    // Insert into Supabase with error handling
    const { data, error } = await supabase
      .from('requests')
      .insert([{
        ...requestData,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      console.error('[API] Supabase insert error:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Database error: Failed to save request' 
        },
        { status: 500 }
      )
    }

    console.log('[API] Request saved to Supabase with ID:', data.id)

    // Send Discord notification
    const discordSuccess = await sendDiscordNotification(requestData, data.id)
    
    if (!discordSuccess) {
      console.warn('[API] Discord notification failed, but request was saved successfully')
    }

    // Success response
    const response: ApiResponse = {
      success: true,
      message: 'Request submitted successfully',
      id: data.id,
      discord_sent: discordSuccess
    }

    console.log('[API] Request processed successfully')
    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    console.error('[API] Unexpected error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

// Handle other HTTP methods
export async function GET(): Promise<NextResponse<{ error: string }>> {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to submit requests.' },
    { status: 405 }
  )
}

export async function PUT(): Promise<NextResponse<{ error: string }>> {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to submit requests.' },
    { status: 405 }
  )
}

export async function DELETE(): Promise<NextResponse<{ error: string }>> {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to submit requests.' },
    { status: 405 }
  )
}
