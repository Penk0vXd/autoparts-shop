// src/app/api/request/route.ts
// The divine gatekeeper - accepts offerings, sends whispers to Discord

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// MVP API Route for Parts Requests with Discord Webhook
// Works in both local and Vercel environments

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

// Discord webhook function that works in both local and Vercel
async function sendDiscordNotification(requestData: any, requestId: string) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL
  
  if (!webhookUrl) {
    console.log('Discord webhook URL not configured, skipping notification')
    return
  }

  try {
    const embed = {
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
          value: requestData.message, 
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

    const payload = {
      embeds: [embed],
      username: "AutoParts Bot",
      avatar_url: "https://cdn.discordapp.com/attachments/123456789/123456789/car-icon.png"
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      console.error('Discord webhook failed:', response.status, await response.text())
    } else {
      console.log('Discord notification sent successfully')
    }
  } catch (error) {
    console.error('Discord webhook error:', error)
    // Don't fail the request if Discord webhook fails
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse JSON body
    const body: RequestData = await request.json()
    
    // Basic validation
    if (!body.full_name || !body.phone || !body.car_details || !body.message) {
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
        { success: false, error: 'Грешка при запазване на заявката. Моля опитайте отново.' },
        { status: 500 }
      )
    }

    // Send Discord notification (works in both local and Vercel)
    await sendDiscordNotification(requestData, data.id)

    // Success response
    return NextResponse.json(
      { 
        success: true, 
        message: 'Заявката е изпратена успешно',
        id: data.id 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('API route error:', error)
    
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
