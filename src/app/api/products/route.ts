import { NextRequest, NextResponse } from 'next/server'
import { getProducts, createProduct } from '@/services/productService'
import { requireServerAuth, isAdmin } from '@/lib/db'
import type { ProductFilters, ProductPagination } from '@/services/productService'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    // Parse pagination parameters
    const pagination: ProductPagination = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '12')
    }

    // Parse filter parameters
    const filters: ProductFilters = {}
    
    if (searchParams.get('category')) {
      filters.category = searchParams.get('category')!
    }
    
    if (searchParams.get('brand')) {
      filters.brand = searchParams.get('brand')!
    }
    
    if (searchParams.get('minPrice')) {
      filters.minPrice = parseFloat(searchParams.get('minPrice')!)
    }
    
    if (searchParams.get('maxPrice')) {
      filters.maxPrice = parseFloat(searchParams.get('maxPrice')!)
    }
    
    if (searchParams.get('inStock') === 'true') {
      filters.inStock = true
    }
    
    if (searchParams.get('featured') === 'true') {
      filters.featured = true
    }
    
    if (searchParams.get('search')) {
      filters.search = searchParams.get('search')!
    }

    const result = await getProducts(filters, pagination)

    return NextResponse.json({
      success: true,
      data: result.products,
      pagination: {
        page: result.page,
        limit: pagination.limit,
        total: result.total,
        totalPages: result.totalPages
      }
    })
  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const user = await requireServerAuth()
    
    // Check if user is admin
    const userIsAdmin = await isAdmin(user.id)
    if (!userIsAdmin) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const productData = await request.json()
    
    // Validate required fields
    if (!productData.name || !productData.sku || !productData.price) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const product = await createProduct(productData)

    return NextResponse.json({
      success: true,
      data: product
    }, { status: 201 })
  } catch (error) {
    console.error('Create product API error:', error)
    
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 