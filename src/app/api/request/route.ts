// src/app/api/request/route.ts
// The divine gatekeeper - accepts offerings, sends whispers to Discord

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

// 🔥 EDGE RUNTIME for lightning speed
export const runtime = 'edge'

// 📋 Validation schema
const RequestSchema = z.object({
  name: z.string().min(2, 'Името трябва да е поне 2 символа').max(100),
  phone: z.string().min(6, 'Телефонът трябва да е поне 6 символа').max(20),
  email: z.string().email('Невалиден имейл').optional().or(z.literal('')),
  brand: z.string().max(50).optional().or(z.literal('')),
  model: z.string().max(50).optional().or(z.literal('')),
  year: z.string().max(4).optional().or(z.literal('')),
  engine: z.string().max(100).optional().or(z.literal('')),
  part_text: z.string().min(10, 'Описанието трябва да е поне 10 символа').max(1000),
  honeypot: z.string().max(0, 'Spam detected'), // Should be empty
})

// 🏛️ Supabase client with service role
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

// 🤖 hCaptcha verification
async function verifyCaptcha(token: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.hcaptcha.com/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: process.env.HCAPTCHA_SECRET!,
        response: token,
      }),
    })

    const data = await response.json()
    return data.success === true
  } catch (error) {
    console.error('hCaptcha verification failed:', error)
    return false
  }
}

// 📎 File validation
function validateFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
  
  if (file.size > maxSize) {
    return { valid: false, error: 'Файлът трябва да е под 5MB' }
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Разрешени са само JPG, PNG и PDF файлове' }
  }
  
  return { valid: true }
}

// 📨 Discord webhook with interactive buttons
async function sendDiscordNotification(request: any, attachment?: File) {
  if (!process.env.DISCORD_WEBHOOK_URL) return

  try {
    const embed = {
      title: "🚗 Нова заявка за авточасти",
      color: 0xDC2626,
      fields: [
        { name: "👤 Клиент", value: request.name, inline: true },
        { name: "📞 Телефон", value: request.phone, inline: true },
        { name: "📧 Имейл", value: request.email || "Не е посочен", inline: true },
        { 
          name: "🚙 Автомобил", 
          value: [request.brand, request.model, request.year, request.engine]
            .filter(Boolean).join(' ') || "Не е посочен", 
          inline: false 
        },
        { name: "🔧 Част", value: request.part_text, inline: false },
        { name: "🆔 ID", value: request.id, inline: true },
      ],
      timestamp: new Date().toISOString(),
      footer: { text: "Autoparts Portal" }
    }

    // Interactive buttons for status updates
    const components = [
      {
        type: 1, // Action Row
        components: [
          {
            type: 2, // Button
            style: 3, // Success (Green)
            label: "✅ Прието",
            custom_id: `accept_${request.id}`
          },
          {
            type: 2, // Button  
            style: 4, // Danger (Red)
            label: "❌ Отказано",
            custom_id: `reject_${request.id}`
          }
        ]
      }
    ]

    const formData = new FormData()
    
    // Main payload
    formData.append('payload_json', JSON.stringify({
      embeds: [embed],
      components: components
    }))

    // Add file attachment if provided
    if (attachment) {
      const fileBuffer = await attachment.arrayBuffer()
      const blob = new Blob([fileBuffer], { type: attachment.type })
      formData.append('files[0]', blob, attachment.name)
    }

    const response = await fetch(process.env.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      console.error('Discord webhook failed:', response.status, await response.text())
    }
  } catch (error) {
    console.error('Discord notification error:', error)
  }
}

// 🚀 Main POST handler
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract form fields
    const data = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string || '',
      brand: formData.get('brand') as string || '',
      model: formData.get('model') as string || '',
      year: formData.get('year') as string || '',
      engine: formData.get('engine') as string || '',
      part_text: formData.get('part_text') as string,
      honeypot: formData.get('honeypot') as string || '',
    }

    // Get file attachment if present
    const file = formData.get('attachment') as File | null

    // 🛡️ Validate input
    const validatedData = RequestSchema.parse(data)

    // 🍯 Honeypot check (should be empty)
    if (validatedData.honeypot) {
      return NextResponse.json({ 
        success: false, 
        error: 'Заявката не може да бъде обработена' 
      }, { status: 400 })
    }

    // 🤖 hCaptcha verification removed for MVP

    // 📎 Validate file if uploaded
    if (file && file.size > 0) {
      const fileValidation = validateFile(file)
      if (!fileValidation.valid) {
        return NextResponse.json({ 
          success: false, 
          error: fileValidation.error 
        }, { status: 400 })
      }
    }

    // 💾 Save to Supabase
    const requestData = {
      name: validatedData.name,
      phone: validatedData.phone,
      email: validatedData.email || null,
      brand: validatedData.brand || null,
      model: validatedData.model || null,
      year: validatedData.year || null,
      engine: validatedData.engine || null,
      part_text: validatedData.part_text,
      status: 'new'
    }

    const { data: savedRequest, error } = await supabase
      .from('requests')
      .insert(requestData)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ 
        success: false, 
        error: 'Грешка при запазване на заявката' 
      }, { status: 500 })
    }

    // 📨 Send Discord notification
    await sendDiscordNotification(savedRequest, file || undefined)

    return NextResponse.json({ 
      success: true, 
      id: savedRequest.id 
    })

  } catch (error) {
    console.error('Request processing error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Невалидни данни',
        details: error.errors
      }, { status: 400 })
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Възникна грешка при обработката' 
    }, { status: 500 })
  }
}

// 🔒 PATCH handler for Discord button interactions (status updates)
export async function PATCH(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    const status = url.searchParams.get('status')

    if (!id || !status || !['accepted', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
    }

    const { error } = await supabase
      .from('requests')
      .update({ status })
      .eq('id', id)

    if (error) {
      console.error('Status update error:', error)
      return NextResponse.json({ error: 'Update failed' }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('PATCH error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

// 🚫 All other methods forbidden
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
