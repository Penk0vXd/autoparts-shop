import { NextRequest, NextResponse } from 'next/server'
import { getProductBySlug, getRelatedProducts } from '@/services/productService'

// This route connects to database - make it fully dynamic
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const product = await getProductBySlug(params.slug)
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    const relatedProducts = await getRelatedProducts(
      product.id,
      product.category_id,
      product.brand_id
    )

    return NextResponse.json({
      success: true,
      data: relatedProducts
    })
  } catch (error) {
    console.error('Related products API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 