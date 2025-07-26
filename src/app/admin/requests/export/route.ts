import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// 🔥 Edge runtime for performance
export const runtime = 'edge'

// 🏛️ Service role client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// 📊 CSV export handler
export async function GET(request: NextRequest) {
  try {
    // 🔐 Guard: Only allow access if admin mode is enabled
    if (process.env.NEXT_PUBLIC_ADMIN_MODE !== 'true') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // 📋 Fetch all requests
    const { data: requests, error } = await supabaseAdmin
      .from('requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch requests for export:', error)
      return NextResponse.json(
        { error: 'Failed to fetch data' },
        { status: 500 }
      )
    }

    // 📄 Generate CSV content
    const csvHeaders = [
      'ID',
      'Дата создаване',
      'Статус',
      'Име',
      'Телефон', 
      'Имейл',
      'Марка',
      'Модел',
      'Година',
      'Двигател',
      'Описание на част',
      'Последна промяна'
    ]

    const csvRows = requests.map(request => [
      request.id,
      new Date(request.created_at).toLocaleString('bg-BG'),
      request.status === 'new' ? 'Нова' : 
      request.status === 'accepted' ? 'Приета' : 
      request.status === 'rejected' ? 'Отказана' : request.status,
      request.name,
      request.phone,
      request.email || '',
      request.brand || '',
      request.model || '',
      request.year || '',
      request.engine || '',
      `"${request.part_text.replace(/"/g, '""')}"`, // Escape quotes
      new Date(request.updated_at).toLocaleString('bg-BG')
    ])

    // 🔧 Build CSV content
    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n')

    // 📁 Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 10)
    const filename = `requests-export-${timestamp}.csv`

    // 🚀 Return CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })

  } catch (error) {
    console.error('CSV export error:', error)
    return NextResponse.json(
      { error: 'Export failed' },
      { status: 500 }
    )
  }
}

// 🚫 All other methods forbidden
export async function POST() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function PATCH() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
} 