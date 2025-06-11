import { supabase } from '@/lib/db'
import type { ProductWithRelations } from '@/types/supabase'

export interface SearchProduct {
  id: string
  name: string
  slug: string
  price: number
  compare_price?: number
  images?: string[] | null
  brand?: {
    name: string
    slug: string
  }
}

/**
 * Search products using prefix-only full-text search
 * @param query - Search query string
 * @param limit - Maximum number of results (default: 8)
 * @returns Array of matching products
 */
export async function searchProducts(query: string, limit = 8): Promise<SearchProduct[]> {
  const trimmedQuery = query.trim()
  if (!trimmedQuery) {
    return []
  }

  try {
    // Use the new prefix search function
    const { data: rpcData, error: rpcError } = await supabase
      .rpc('search_products_prefix', { 
        query: trimmedQuery, 
        lim: limit 
      })

    if (rpcError) {
      console.warn('Prefix search failed, falling back to simple search:', rpcError.message)
      // Fallback to the old function if prefix search fails
      return await fallbackToOldSearch(trimmedQuery, limit)
    }

    // If RPC worked, we need to get the full data with relations
    if (rpcData && rpcData.length > 0) {
      const productIds = rpcData.map((p: any) => p.id)
      const { data: fullData, error: selectError } = await supabase
        .from('products')
        .select(`
          id,
          name,
          slug,
          price,
          compare_price,
          images,
          brand:brands(name, slug)
        `)
        .in('id', productIds)
        .eq('is_active', true)

      if (selectError) {
        console.error('Failed to fetch full product data:', selectError)
        return await fallbackToOldSearch(trimmedQuery, limit)
      }

      return fullData || []
    }

    return []
  } catch (error) {
    console.error('Search service error:', error)
    // Fallback to old search method
    return await fallbackToOldSearch(trimmedQuery, limit)
  }
}

/**
 * Fallback to old search function if prefix search fails
 */
async function fallbackToOldSearch(query: string, limit = 8): Promise<SearchProduct[]> {
  try {
    const { data: rpcData, error: rpcError } = await supabase
      .rpc('search_products', { 
        query: query, 
        lim: limit 
      })

    if (!rpcError && rpcData && rpcData.length > 0) {
      const productIds = rpcData.map((p: any) => p.id)
      const { data: fullData, error: selectError } = await supabase
        .from('products')
        .select(`
          id,
          name,
          slug,
          price,
          compare_price,
          images,
          brand:brands(name, slug)
        `)
        .in('id', productIds)
        .eq('is_active', true)

      if (!selectError) {
        return fullData || []
      }
    }
  } catch (error) {
    console.warn('Old search function also failed:', error)
  }

  // Final fallback to ILIKE search (only prefix matching)
  return await prefixFallbackSearch(query, limit)
}

/**
 * Final fallback using ILIKE with prefix matching only
 */
async function prefixFallbackSearch(query: string, limit = 8): Promise<SearchProduct[]> {
  const tokens = query.split(/\s+/).filter(t => t.trim().length > 0)
  if (tokens.length === 0) return []

  // Create ILIKE conditions for prefix matching only
  const conditions = tokens.map(token => 
    `name.ilike.${token}%,description.ilike.${token}%`
  ).join(',')

  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      price,
      compare_price,
      images,
      brand:brands(name, slug)
    `)
    .or(conditions)
    .eq('is_active', true)
    .limit(limit)

  if (error) {
    console.error('Prefix fallback search error:', error)
    return []
  }

  return data || []
} 