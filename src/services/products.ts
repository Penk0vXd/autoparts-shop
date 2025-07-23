import type { ProductWithRelations } from '@/types/supabase'
import { isFeatureEnabled } from '@/config/features'

export type ProductsParams = {
  page?: number
  limit?: number
  category?: string
  brand?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  featured?: boolean
}

export type ProductsResponse = {
  success: boolean
  data: ProductWithRelations[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

/**
 * Fetch products from API with optional filters
 * Used with SWR for data fetching and caching
 */
export async function fetchProducts(params: ProductsParams = {}): Promise<ProductsResponse> {
  // Return empty results if products feature is disabled
  if (!isFeatureEnabled('products')) {
    return {
      success: true,
      data: [],
      pagination: {
        page: 1,
        limit: params.limit || 10,
        total: 0,
        totalPages: 0
      }
    }
  }

  try {
    const searchParams = new URLSearchParams()
    
    // Add pagination params
    searchParams.append('page', (params.page || 1).toString())
    searchParams.append('limit', (params.limit || 10).toString())
    
    // Add filter params
    if (params.category) searchParams.append('category', params.category)
    if (params.brand) searchParams.append('brand', params.brand)
    if (params.search) searchParams.append('search', params.search)
    if (params.minPrice) searchParams.append('minPrice', params.minPrice.toString())
    if (params.maxPrice) searchParams.append('maxPrice', params.maxPrice.toString())
    if (params.inStock) searchParams.append('inStock', 'true')
    if (params.featured) searchParams.append('featured', 'true')
    
    const response = await fetch(`/api/products?${searchParams}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data
    
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

/**
 * Get cache key for SWR
 */
export function getProductsKey(params: ProductsParams): string | null {
  // Return null if products are disabled (prevents SWR from making requests)
  if (!isFeatureEnabled('products')) {
    return null
  }
  
  return `products-${JSON.stringify(params)}`
}

/**
 * Fetch single product by slug
 */
export async function fetchProduct(slug: string): Promise<ProductWithRelations | null> {
  if (!isFeatureEnabled('products')) {
    return null
  }

  try {
    const response = await fetch(`/api/products/${slug}`)
    
    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data.success ? data.data : null
    
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

/**
 * Get cache key for single product SWR
 */
export function getProductKey(slug: string): string | null {
  if (!isFeatureEnabled('products')) {
    return null
  }
  
  return `product-${slug}`
}

/**
 * Fetch related products for a product
 */
export async function fetchRelatedProducts(productId: string, limit = 4): Promise<ProductWithRelations[]> {
  if (!isFeatureEnabled('products')) {
    return []
  }

  try {
    const response = await fetch(`/api/products/${productId}/related?limit=${limit}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data.success ? data.data : []
    
  } catch (error) {
    console.error('Error fetching related products:', error)
    return []
  }
}

/**
 * Get cache key for related products SWR
 */
export function getRelatedProductsKey(productId: string, limit = 4): string | null {
  if (!isFeatureEnabled('products')) {
    return null
  }
  
  return `related-products-${productId}-${limit}`
}

/**
 * Fetch brands
 */
export async function fetchBrands() {
  const response = await fetch('/api/brands')
  
  if (!response.ok) {
    throw new Error('Failed to fetch brands')
  }

  const data = await response.json()
  return data.data
}

/**
 * Fetch categories
 */
export async function fetchCategories() {
  const response = await fetch('/api/categories')
  
  if (!response.ok) {
    throw new Error('Failed to fetch categories')
  }

  const data = await response.json()
  return data.data
} 