import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import { getBrandBySlug } from '@/services/brandService'
import { BrandProduct, BrandDetailFilters, getAvailabilityStatus } from '@/types/brand-detail'

// This route connects to database - make it fully dynamic
export const dynamic = 'force-dynamic'

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

    // Enhanced filtering parameters
    const filters: BrandDetailFilters = {
      category: searchParams.get('category') || undefined,
      model: searchParams.get('model') || undefined,
      yearMin: searchParams.get('yearMin') ? Number(searchParams.get('yearMin')) : undefined,
      yearMax: searchParams.get('yearMax') ? Number(searchParams.get('yearMax')) : undefined,
      fuelType: searchParams.get('fuelType') || undefined,
      engineType: searchParams.get('engineType') || undefined,
      priceMin: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined,
      priceMax: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined,
      availability: searchParams.get('availability') as any || undefined,
      partType: searchParams.get('partType') as any || undefined,
      sortBy: searchParams.get('sortBy') as any || 'name',
      page,
      limit
    }

    // Build dynamic query
    let query = supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        price,
        compare_price,
        stock,
        image_url,
        is_featured,
        specifications,
        compatibility,
        categories!inner(
          id,
          name,
          slug
        )
      `, { count: 'exact' })
      .eq('brand_id', brand.id)
      .eq('is_active', true)
      .eq('is_deleted', false)

    // Apply filters
    if (filters.category) {
      query = query.eq('categories.slug', filters.category)
    }

    if (filters.priceMin) {
      query = query.gte('price', filters.priceMin)
    }

    if (filters.priceMax) {
      query = query.lte('price', filters.priceMax)
    }

    if (filters.availability) {
      switch (filters.availability) {
        case 'in_stock':
          query = query.gt('stock', 5)
          break
        case 'low_stock':
          query = query.gte('stock', 1).lte('stock', 5)
          break
        case 'out_of_stock':
          query = query.eq('stock', 0)
          break
      }
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'price_low':
        query = query.order('price', { ascending: true })
        break
      case 'price_high':
        query = query.order('price', { ascending: false })
        break
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
      case 'popular':
        query = query.eq('is_featured', true).order('created_at', { ascending: false })
        break
      default:
        query = query.order('name', { ascending: true })
    }

    // Apply pagination
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data: products, error, count } = await query

    if (error) {
      console.error('Products query error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch products' },
        { status: 500 }
      )
    }

    // Transform products to match BrandProduct interface
    const transformedProducts: BrandProduct[] = (products || []).map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      compare_price: product.compare_price,
      stock: product.stock,
      image_url: product.image_url,
      category_name: (product.categories as any)?.name || 'Unknown',
      category_slug: (product.categories as any)?.slug || 'unknown',
      is_featured: product.is_featured,
      availability: getAvailabilityStatus(product.stock),
      specifications: product.specifications || {},
      compatibility: product.compatibility || {}
    }))

    const totalPages = Math.ceil((count || 0) / limit)

    // Cache for 2 minutes, allow stale while revalidating
    const headers = {
      'Cache-Control': 's-maxage=120, stale-while-revalidate'
    }

    return NextResponse.json({
      success: true,
      data: transformedProducts,
      brand,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages
      },
      filters
    }, { headers })

  } catch (error) {
    console.error('Brand products API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 