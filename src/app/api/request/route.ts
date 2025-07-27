// src/app/api/request/route.ts
// The divine gatekeeper - accepts offerings, sends whispers to Discord

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

// High-performance Discord webhook API route with Zod validation
// Works flawlessly in both local and Vercel environments

// Zod schema for API validation
const apiRequestSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Името трябва да е поне 2 символа')
    .max(100, 'Името трябва да е под 100 символа')
    .regex(/^[a-zA-Zа-яА-Я\s]+$/, 'Името трябва да съдържа само букви'),
  
  phone: z
    .string()
    .min(6, 'Телефонният номер трябва да е поне 6 символа')
    .max(20, 'Телефонният номер трябва да е под 20 символа')
    .regex(/^[\+]?[0-9\s\-\(\)]+$/, 'Невалиден формат на телефонен номер'),
  
  car_details: z
    .string()
    .min(3, 'Детайлите за автомобила трябва да са поне 3 символа')
    .max(200, 'Детайлите за автомобила трябва да са под 200 символа'),
  
  message: z
    .string()
    .min(10, 'Съобщението трябва да е поне 10 символа')
    .max(1000, 'Съобщението трябва да е под 1000 символа'),
  
  file: z
    .any()
    .optional()
    .refine((file) => {
      if (!file) return true
      const maxSize = 5 * 1024 * 1024 // 5MB
      return file.size <= maxSize
    }, 'Файлът трябва да е под 5MB')
    .refine((file) => {
      if (!file) return true
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
      return allowedTypes.includes(file.type)
    }, 'Разрешени са само JPG, PNG и PDF файлове')
})

// Type definitions for robust type safety
interface RequestData {
  full_name: string
  phone: string
  car_details: string
  message: string
  file?: any
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
  details?: Array<{
    path: (string | number)[]
    message: string
  }>
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

// Main POST handler with comprehensive error handling and Zod validation
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
      message: body.message ? '***' : 'missing',
      file: body.file ? 'present' : 'missing'
    })
    
    // Server-side validation with Zod
    try {
      apiRequestSchema.parse(body)
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        console.log('[API] Validation failed:', validationError.errors)
        return NextResponse.json(
          {
            success: false,
            error: 'Validation failed',
            details: validationError.errors.map(err => ({
              path: err.path,
              message: err.message
            }))
          },
          { status: 400 }
        )
      }
    }
    
    // Prepare data for database
    const requestData: RequestData = {
      full_name: body.full_name.trim(),
      phone: body.phone.trim(),
      car_details: body.car_details.trim(),
      message: body.message.trim(),
      file: body.file
    }

    console.log('[API] Saving to Supabase...')

    // Insert into Supabase with error handling
    const { data, error } = await supabase
      .from('requests')
      .insert([{
        full_name: requestData.full_name,
        phone: requestData.phone,
        car_details: requestData.car_details,
        message: requestData.message,
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
