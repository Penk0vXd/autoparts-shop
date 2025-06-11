import { NextRequest, NextResponse } from 'next/server'
import { getProducts } from '@/services/productService'
import { getBrandBySlug } from '@/services/brandService'

const MAX_LIMIT = 48

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Normalize slug to lowercase
    const normalizedSlug = params.slug.toLowerCase()
    
    const brand = await getBrandBySlug(normalizedSlug)
    
    if (!brand) {
      return NextResponse.json(
        { success: false, error: 'Brand not found' },
        { status: 404 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const page = Math.max(1, Number(searchParams.get('page')) || 1)
    const limit = Math.min(MAX_LIMIT, Math.max(1, Number(searchParams.get('limit')) || 24))

    const result = await getProducts(
      { brand: normalizedSlug, inStock: true },
      { page, limit }
    )

    // Cache for 2 minutes, allow stale while revalidating
    const headers = {
      'Cache-Control': 's-maxage=120, stale-while-revalidate'
    }

    return NextResponse.json({
      success: true,
      data: result.products,
      brand,
      pagination: {
        page: result.page,
        limit,
        total: result.total,
        totalPages: result.totalPages
      }
    }, { headers })
  } catch (error) {
    console.error('Brand products API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 