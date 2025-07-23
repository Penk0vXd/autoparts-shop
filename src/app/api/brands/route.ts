import { NextRequest, NextResponse } from 'next/server'
import { getBrands, getBrandsByCategory, type BrandCategory } from '@/services/brandService'

// This route connects to database - make it fully dynamic
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = Math.max(1, Number(searchParams.get('page')) || 1)
    const limit = Math.min(48, Math.max(1, Number(searchParams.get('limit')) || 24))
    const category = searchParams.get('category') as BrandCategory | null

    let response
    if (category && ['car', 'accessory', 'parts'].includes(category)) {
      response = await getBrandsByCategory(category, page, limit)
    } else {
      // Use getBrandsByCategory with no category to get all brands
      response = await getBrandsByCategory(undefined, page, limit)
    }

    // Cache for 5 minutes, allow stale while revalidating
    const headers = {
      'Cache-Control': 's-maxage=300, stale-while-revalidate'
    }

    return NextResponse.json({
      success: true,
      ...response
    }, { headers })
    
  } catch (error) {
    console.error('Brands API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        data: [],
        total: 0,
        page: 1,
        totalPages: 0,
        error: 'Failed to load brands'
      },
      { status: 200 } // Return 200 with empty data instead of 500 error
    )
  }
} 