import { supabase } from '@/lib/db'
import type { ProductWithRelations } from '@/types/supabase'
import { isFeatureEnabled } from '@/config/features'

/**
 * Enhanced search service with real-time suggestions and semantic search
 * Returns empty results when product search is disabled
 */
export async function searchProducts(query: string): Promise<ProductWithRelations[]> {
  // Return empty results if product search is disabled
  if (!isFeatureEnabled('productSearch') || !query.trim()) {
    return []
  }

  try {
    console.log(`[Search] Searching for: "${query}"`)
    
    // First try semantic/full-text search
    const { data: rpcData, error: rpcError } = await supabase
      .rpc('search_products_semantic', { 
        search_query: query.trim(),
        max_results: 20
      })

    if (rpcError) {
      console.warn('[Search] RPC search failed, falling back to manual search:', rpcError)
      
      // Fallback to manual search if RPC fails
      const { data: fullData, error: selectError } = await supabase
        .from('products')
        .select(`
          *,
          brand:brands(id, name, logo_url),
          category:categories(id, name),
          images:product_images(url, alt, is_primary)
        `)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,part_number.ilike.%${query}%`)
        .eq('is_active', true)
        .limit(20)

      if (selectError) throw selectError
      return fullData || []
    }

    return rpcData || []
    
  } catch (error) {
    console.error('[Search] Search error:', error)
    return []
  }
}

/**
 * Get search suggestions based on partial query
 */
export async function getSearchSuggestions(query: string, limit = 8): Promise<string[]> {
  if (!isFeatureEnabled('productSearch') || !query.trim() || query.length < 2) {
    return []
  }

  try {
    const { data: rpcData, error: rpcError } = await supabase
      .rpc('get_search_suggestions', { 
        partial_query: query.trim(),
        max_suggestions: limit
      })

    if (rpcError) {
      console.warn('[Search] Suggestions RPC failed, using basic suggestions:', rpcError)
      
      // Fallback: Get product names that match
      const { data: fullData, error: selectError } = await supabase
        .from('products')
        .select('name')
        .ilike('name', `%${query}%`)
        .eq('is_active', true)
        .limit(limit)

      if (selectError) throw selectError
      return fullData?.map(p => p.name) || []
    }

    return rpcData || []
    
  } catch (error) {
    console.error('[Search] Suggestions error:', error)
    return []
  }
}

/**
 * Advanced search with multiple filters and faceted results
 */
export async function advancedSearch(params: {
  query?: string
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  limit?: number
}): Promise<{
  products: ProductWithRelations[]
  total: number
  facets: {
    brands: Array<{ name: string; count: number }>
    categories: Array<{ name: string; count: number }>
    priceRange: { min: number; max: number }
  }
}> {
  if (!isFeatureEnabled('productSearch')) {
    return {
      products: [],
      total: 0,
      facets: {
        brands: [],
        categories: [],
        priceRange: { min: 0, max: 0 }
      }
    }
  }

  try {
    const { query, category, brand, minPrice, maxPrice, inStock, limit = 20 } = params

    // Build the search query
    let queryBuilder = supabase
      .from('products')
      .select(`
        *,
        brand:brands(id, name, logo_url),
        category:categories(id, name),
        images:product_images(url, alt, is_primary)
      `, { count: 'exact' })
      .eq('is_active', true)

    // Apply filters
    if (query) {
      queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%,part_number.ilike.%${query}%`)
    }
    
    if (category) {
      queryBuilder = queryBuilder.eq('category_id', category)
    }
    
    if (brand) {
      queryBuilder = queryBuilder.eq('brand_id', brand)
    }
    
    if (minPrice !== undefined) {
      queryBuilder = queryBuilder.gte('price', minPrice)
    }
    
    if (maxPrice !== undefined) {
      queryBuilder = queryBuilder.lte('price', maxPrice)
    }
    
    if (inStock) {
      queryBuilder = queryBuilder.gt('stock_quantity', 0)
    }

    const { data, error, count } = await queryBuilder.limit(limit)

    if (error) throw error

    // Get facets (simplified for now)
    const facets = {
      brands: [] as Array<{ name: string; count: number }>,
      categories: [] as Array<{ name: string; count: number }>,
      priceRange: { min: 0, max: 1000 }
    }

    return {
      products: data || [],
      total: count || 0,
      facets
    }
    
  } catch (error) {
    console.error('[Search] Advanced search error:', error)
    return {
      products: [],
      total: 0,
      facets: {
        brands: [],
        categories: [],
        priceRange: { min: 0, max: 0 }
      }
    }
  }
} 