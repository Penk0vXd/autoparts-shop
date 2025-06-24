import { NextRequest, NextResponse } from 'next/server'
import { getCategories } from '@/services/productService'

// This route connects to database - make it fully dynamic
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const categories = await getCategories()

    return NextResponse.json({
      success: true,
      data: categories
    })
  } catch (error) {
    console.error('Categories API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 