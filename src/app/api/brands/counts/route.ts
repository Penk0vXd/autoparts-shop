import { NextResponse } from 'next/server'
import { getBrandCounts } from '@/services/brandService'

export async function GET() {
  try {
    const counts = await getBrandCounts()

    // Cache for 5 minutes, allow stale while revalidating
    const headers = {
      'Cache-Control': 's-maxage=300, stale-while-revalidate'
    }

    return NextResponse.json(counts, { headers })
  } catch (error) {
    console.error('Brand counts API error:', error)
    return NextResponse.json(
      { success: false, error: 'Database connection required' },
      { status: 500 }
    )
  }
} 