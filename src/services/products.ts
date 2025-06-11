import type { ProductWithRelations } from '@/types/supabase'

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
  const searchParams = new URLSearchParams()
  
  if (params.page) {
    searchParams.set('page', params.page.toString())
  }
  if (params.limit) {
    searchParams.set('limit', params.limit.toString())
  }
  if (params.category) {
    searchParams.set('category', params.category)
  }
  if (params.brand) {
    searchParams.set('brand', params.brand)
  }
  if (params.search) {
    searchParams.set('search', params.search)
  }
  if (params.minPrice) {
    searchParams.set('minPrice', params.minPrice.toString())
  }
  if (params.maxPrice) {
    searchParams.set('maxPrice', params.maxPrice.toString())
  }
  if (params.inStock) {
    searchParams.set('inStock', 'true')
  }
  if (params.featured) {
    searchParams.set('featured', 'true')
  }

  const response = await fetch(`/api/products?${searchParams.toString()}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }

  return response.json()
}

/**
 * Fetch a single product by slug
 */
export async function fetchProduct(slug: string): Promise<ProductWithRelations> {
  const response = await fetch(`/api/products/${slug}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch product')
  }

  const data = await response.json()
  return data.data
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

/**
 * SWR key generator for products
 */
export function getProductsKey(params: ProductsParams = {}) {
  return ['products', params]
}

/**
 * SWR key generator for single product
 */
export function getProductKey(slug: string) {
  return ['product', slug]
}

/**
 * SWR key generator for brands
 */
export function getBrandsKey() {
  return ['brands']
}

/**
 * SWR key generator for categories
 */
export function getCategoriesKey() {
  return ['categories']
} 