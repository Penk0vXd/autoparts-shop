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
  vin?: string
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
  image?: {
    url: string
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
    console.log('[Discord] Webhook URL not configured')
    return false
  }

  // Validate webhook URL format
  if (!webhookUrl.includes('discord.com/api/webhooks/')) {
    console.log('[Discord] Invalid webhook URL format')
    return false
  }

  try {
    // Prepare Discord embed
    const embed: DiscordEmbed = {
      title: '🚗 Нова заявка за авточасти',
      color: 0x00FF00, // Green color
      fields: [
        {
          name: '👤 Име',
          value: requestData.full_name || 'Не е посочено',
          inline: true
        },
        {
          name: '📞 Телефон',
          value: requestData.phone || 'Не е посочено',
          inline: true
        },
        {
          name: '🚗 Автомобил',
          value: requestData.car_details || 'Не е посочено',
          inline: false
        },
        {
          name: '🔧 Търсена част',
          value: requestData.message ? requestData.message.substring(0, 1000) : 'Не е посочено',
          inline: false
        },
        {
          name: '🆔 ID на заявката',
          value: requestId,
          inline: true
        },
        {
          name: '⏰ Време',
          value: new Date().toLocaleString('bg-BG'),
          inline: true
        }
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: 'AutoParts Store - Нова заявка'
      }
    }

    // Add image if file is present
    if (requestData.file && requestData.file instanceof File) {
      try {
        // Convert file to base64 for Discord
        const arrayBuffer = await requestData.file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const base64 = buffer.toString('base64')
        const mimeType = requestData.file.type
        
        embed.image = {
          url: `data:${mimeType};base64,${base64}`
        }
        
        embed.fields.push({
          name: '📎 Прикачен файл',
          value: `${requestData.file.name} (${(requestData.file.size / 1024).toFixed(1)} KB)`,
          inline: true
        })
      } catch (imageError) {
        console.error('[Discord] Error processing image:', imageError)
        embed.fields.push({
          name: '📎 Прикачен файл',
          value: 'Грешка при обработка на файла',
          inline: true
        })
      }
    }

    const payload: DiscordPayload = {
      embeds: [embed],
      username: 'AutoParts Bot'
    }

    console.log('[Discord] Sending notification...')

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AutoParts-Store/1.0'
      },
      body: JSON.stringify(payload)
    })

    if (response.ok) {
      console.log('[Discord] Notification sent successfully')
      return true
    } else {
      const errorText = await response.text()
      console.error('[Discord] Webhook failed:', response.status, errorText)
      return false
    }

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
    const vin = formData.get('vin') as string || ''

    const car_details = [brand, model, year, engine].filter(Boolean).join(' ')
    const car_details_with_vin = vin ? `${car_details} (VIN: ${vin})` : car_details

    const message = formData.get('part_text') as string || ''
    const file = formData.get('attachment') || null
    
    return {
      full_name,
      phone,
      car_details: car_details_with_vin,
      message,
      vin,
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
        vin: body.vin || '',
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
      name: requestData.full_name.trim(), // Map to 'name' column (NOT NULL)
      phone: requestData.phone.trim(),
      car_details: requestData.car_details.trim(),
      full_name: requestData.full_name.trim(), // Also keep 'full_name' for compatibility
      message: requestData.message.trim(),
      part_text: requestData.message.trim() // Map to 'part_text' column (NOT NULL)
    }

    console.log('[API] Saving to Supabase...')

    // Insert into Supabase with error handling and retry
    let data, error
    let retryCount = 0
    const maxRetries = 3

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
        await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds
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
