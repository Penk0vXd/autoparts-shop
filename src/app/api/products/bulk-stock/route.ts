import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ids = searchParams.get('ids')?.split(',') || []

    if (!ids.length) {
      return NextResponse.json({})
    }

    const { data, error } = await supabase
      .from('products')
      .select('id, stock')
      .in('id', ids)

    if (error) throw error

    const stockMap = data.reduce((acc, product) => ({
      ...acc,
      [product.id]: product.stock
    }), {})

    return NextResponse.json(stockMap)
  } catch (error) {
    console.error('Bulk stock API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stock data' },
      { status: 500 }
    )
  }
} 