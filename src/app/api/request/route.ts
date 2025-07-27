// src/app/api/request/route.ts
// The divine gatekeeper - accepts offerings, sends whispers to Discord

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// MVP API Route for Parts Requests with Discord Webhook
// Works reliably in both local and Vercel environments

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

// Enhanced Discord webhook function with better error handling
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

export async function POST(request: NextRequest) {
  try {
    // Parse JSON body
    const body: RequestData = await request.json()
    
    console.log('[API] Received request:', { 
      full_name: body.full_name ? '***' : 'missing',
      phone: body.phone ? '***' : 'missing',
      car_details: body.car_details ? '***' : 'missing',
      message: body.message ? '***' : 'missing'
    })
    
    // Basic validation
    if (!body.full_name || !body.phone || !body.car_details || !body.message) {
      console.log('[API] Validation failed: missing required fields')
      return NextResponse.json(
        { success: false, error: 'Всички полета са задължителни' },
        { status: 400 }
      )
    }

    // Validate field lengths
    if (body.full_name.length < 2 || body.full_name.length > 100) {
      return NextResponse.json(
        { success: false, error: 'Името трябва да е между 2 и 100 символа' },
        { status: 400 }
      )
    }

    if (body.phone.length < 6 || body.phone.length > 20) {
      return NextResponse.json(
        { success: false, error: 'Телефонният номер трябва да е между 6 и 20 символа' },
        { status: 400 }
      )
    }

    if (body.message.length < 10 || body.message.length > 1000) {
      return NextResponse.json(
        { success: false, error: 'Съобщението трябва да е между 10 и 1000 символа' },
        { status: 400 }
      )
    }

    // Prepare data for Supabase
    const requestData: RequestData = {
      full_name: body.full_name.trim(),
      phone: body.phone.trim(),
      car_details: body.car_details.trim(),
      message: body.message.trim()
    }

    console.log('[API] Saving to Supabase...')

    // Insert into Supabase
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
        { success: false, error: 'Грешка при запазване на заявката. Моля опитайте отново.' },
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
    return NextResponse.json(
      { 
        success: true, 
        message: 'Заявката е изпратена успешно',
        id: data.id,
        discord_sent: discordSuccess
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('[API] Route error:', error)
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: 'Невалидни данни' },
        { status: 400 }
      )
    }

    // Handle other errors
    return NextResponse.json(
      { success: false, error: 'Възникна грешка при обработката' },
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
