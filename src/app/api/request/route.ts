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
    .regex(/^[\+]?[0-9\s\-\(\)\.]+$/, 'Невалиден формат на телефонен номер'),
  
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

// Helper function to extract data from FormData or JSON
async function extractRequestData(request: NextRequest): Promise<RequestData> {
  const contentType = request.headers.get('content-type') || ''
  
  if (contentType.includes('multipart/form-data')) {
    // Handle FormData
    const formData = await request.formData()
    
    // Map form field names to our expected structure
    const full_name = formData.get('name') as string || ''
    const phone = formData.get('phone') as string || ''
    
    // Combine car details from individual fields
    const brand = formData.get('brand') as string || ''
    const model = formData.get('model') as string || ''
    const year = formData.get('year') as string || ''
    const engine = formData.get('engine') as string || ''
    
    const car_details = [brand, model, year, engine].filter(Boolean).join(' ')
    
    const message = formData.get('part_text') as string || ''
    const file = formData.get('attachment') || null
    
    return {
      full_name,
      phone,
      car_details,
      message,
      file
    }
  } else {
    // Handle JSON
    const rawBody = await request.text()
    console.log('[API] Raw request body:', rawBody)
    
    try {
      const body = JSON.parse(rawBody)
      return {
        full_name: body.full_name || body.name || '',
        phone: body.phone || '',
        car_details: body.car_details || '',
        message: body.message || body.part_text || '',
        file: body.file || null
      }
    } catch (parseError) {
      console.error('[API] JSON parsing error:', parseError)
      throw new Error('Invalid JSON format in request body')
    }
  }
}

// Main POST handler with comprehensive error handling and Zod validation
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  console.log('[API] POST /api/request - Request received')
  
  // Check for required environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error('[API] Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
    return NextResponse.json(
      { 
        success: false, 
        error: 'Server configuration error: Supabase URL not configured' 
      },
      { status: 500 }
    )
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('[API] Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
    return NextResponse.json(
      { 
        success: false, 
        error: 'Server configuration error: Supabase service role key not configured' 
      },
      { status: 500 }
    )
  }
  
  try {
    // Extract data from request (FormData or JSON)
    const requestData = await extractRequestData(request)
    
    console.log('[API] Extracted request data:', { 
      full_name: requestData.full_name ? '***' : 'missing',
      phone: requestData.phone ? '***' : 'missing',
      car_details: requestData.car_details ? '***' : 'missing',
      message: requestData.message ? '***' : 'missing',
      file: requestData.file ? 'present' : 'missing'
    })
    
    // Server-side validation with Zod
    try {
      apiRequestSchema.parse(requestData)
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
    const dataForDatabase = {
      full_name: requestData.full_name.trim(),
      phone: requestData.phone.trim(),
      car_details: requestData.car_details.trim(),
      message: requestData.message.trim()
    }

    console.log('[API] Saving to Supabase...')

    // Insert into Supabase with error handling and retry
    let data, error
    let retryCount = 0
    const maxRetries = 2

    while (retryCount <= maxRetries) {
      const result = await supabase
        .from('requests')
        .insert([{
          ...dataForDatabase,
          created_at: new Date().toISOString()
        }])
        .select()
        .single()

      data = result.data
      error = result.error

      if (!error) {
        break // Success, exit retry loop
      }

      if (error.code === 'PGRST204' && retryCount < maxRetries) {
        // Schema cache issue, wait and retry
        console.log(`[API] Schema cache issue, retrying... (attempt ${retryCount + 1})`)
        await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second
        retryCount++
        continue
      }

      break // Either not a schema issue or max retries reached
    }

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
        error: error instanceof Error ? error.message : 'Internal server error' 
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
