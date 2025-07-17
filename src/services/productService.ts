import { supabase, supabaseAdmin, handleDbError } from '@/lib/db'
import type { 
  Product, 
  ProductWithRelations, 
  CreateProduct, 
  UpdateProduct,
  Brand,
  Category 
} from '@/types/supabase'

/**
 * Validates if a product has valid data for display
 */
function isValidProduct(product: ProductWithRelations): boolean {
  // Basic validation
  if (!product.name || !product.id) return false
  
  // Price validation - allow null/undefined prices (will show "Цена при запитване")
  // but reject clearly invalid negative prices
  if (product.price !== null && product.price !== undefined) {
    if (product.price < 0) return false
  }
  
  // Stock validation - allow any stock value including 0
  if (product.stock !== null && product.stock !== undefined) {
    if (product.stock < 0) return false
  }
  
  return true
}

/**
 * Filters and cleans product data
 */
function filterValidProducts(products: ProductWithRelations[]): ProductWithRelations[] {
  return products.filter(isValidProduct)
}

export type ProductFilters = {
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  featured?: boolean
  search?: string
}

export type ProductPagination = {
  page: number
  limit: number
}

export type ProductsResponse = {
  products: ProductWithRelations[]
  total: number
  page: number
  totalPages: number
}

/**
 * Get paginated and filtered products
 */
export async function getProducts(
  filters: ProductFilters = {},
  pagination: ProductPagination = { page: 1, limit: 12 }
): Promise<ProductsResponse> {
  try {
    let query = supabase
      .from('products')
      .select(`
        *
      `, { count: 'exact' })
      .eq('is_active', true)
      .eq('is_deleted', false)

    // Apply filters
    if (filters.category) {
      query = query.eq('category_id', filters.category)
    }
    
    if (filters.brand) {
      query = query.eq('brand_id', filters.brand)
    }
    
    if (filters.minPrice) {
      query = query.gte('price', filters.minPrice)
    }
    
    if (filters.maxPrice) {
      query = query.lte('price', filters.maxPrice)
    }
    
    if (filters.inStock) {
      query = query.gt('stock', 0)
    }
    
    if (filters.featured) {
      query = query.eq('is_featured', true)
    }
    
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%, description.ilike.%${filters.search}%`)
    }

    // Apply pagination
    const from = (pagination.page - 1) * pagination.limit
    const to = from + pagination.limit - 1
    
    query = query.range(from, to).order('created_at', { ascending: false })

    const { data, error, count } = await query

    if (error) {
      handleDbError(error, 'getProducts')
    }

    const totalPages = Math.ceil((count || 0) / pagination.limit)

    // Filter out invalid products
    const validProducts = filterValidProducts(data as ProductWithRelations[] || [])
    
    return {
      products: validProducts,
      total: count || 0,
      page: pagination.page,
      totalPages,
    }
  } catch (error) {
    handleDbError(error, 'getProducts')
    throw error
  }
}

/**
 * Get product by slug
 */
export async function getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .eq('is_deleted', false)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      handleDbError(error, 'getProductBySlug')
    }

    const product = data as ProductWithRelations
    
    // Validate product data
    if (!isValidProduct(product)) {
      return null
    }
    
    return product
  } catch (error) {
    handleDbError(error, 'getProductBySlug')
    throw error
  }
}

/**
 * Create new product (admin only)
 */
export async function createProduct(productData: CreateProduct): Promise<Product> {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .insert(productData)
      .select()
      .single()

    if (error) {
      handleDbError(error, 'createProduct')
    }

    return data as Product
  } catch (error) {
    handleDbError(error, 'createProduct')
    throw error
  }
}

/**
 * Update product (admin only)
 */
export async function updateProduct(id: string, productData: UpdateProduct): Promise<Product> {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .update({ ...productData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      handleDbError(error, 'updateProduct')
    }

    return data as Product
  } catch (error) {
    handleDbError(error, 'updateProduct')
    throw error
  }
}

/**
 * Soft delete product (admin only)
 */
export async function deleteProduct(id: string): Promise<void> {
  try {
    const { error } = await supabaseAdmin
      .from('products')
      .update({ 
        is_deleted: true, 
        is_active: false,
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)

    if (error) {
      handleDbError(error, 'deleteProduct')
    }
  } catch (error) {
    handleDbError(error, 'deleteProduct')
    throw error
  }
}

/**
 * Get all brands
 */
export async function getBrands(): Promise<Brand[]> {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (error) {
      handleDbError(error, 'getBrands')
    }

    return data || []
  } catch (error) {
    handleDbError(error, 'getBrands')
    throw error
  }
}

/**
 * Get all categories
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (error) {
      handleDbError(error, 'getCategories')
    }

    return data || []
  } catch (error) {
    handleDbError(error, 'getCategories')
    throw error
  }
}

/**
 * Update product stock
 */
export async function updateProductStock(id: string, quantity: number): Promise<void> {
  try {
    const { error } = await supabaseAdmin
      .from('products')
      .update({ 
        stock: quantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      handleDbError(error, 'updateProductStock')
    }
  } catch (error) {
    handleDbError(error, 'updateProductStock')
    throw error
  }
}

/**
 * Get related products based on category and brand
 */
export async function getRelatedProducts(
  productId: string,
  categoryId: string | null,
  brandId: string | null,
  limit: number = 4
): Promise<ProductWithRelations[]> {
  try {
    const baseQuery = () => supabase
      .from('products')
      .select(`
        *
      `)
      .eq('is_active', true)
      .eq('is_deleted', false)
      .neq('id', productId)
      .limit(limit)

    // Try to find products in same category and brand
    if (categoryId && brandId) {
      const { data: sameCategoryAndBrand } = await baseQuery()
        .eq('category_id', categoryId)
        .eq('brand_id', brandId)
      
      if (sameCategoryAndBrand && sameCategoryAndBrand.length >= limit) {
        return filterValidProducts(sameCategoryAndBrand as ProductWithRelations[])
      }
    }

    // Try to find products in same category
    if (categoryId) {
      const { data: sameCategory } = await baseQuery()
        .eq('category_id', categoryId)
      
      if (sameCategory && sameCategory.length >= limit) {
        return filterValidProducts(sameCategory as ProductWithRelations[])
      }
    }

    // Try to find products from same brand
    if (brandId) {
      const { data: sameBrand } = await baseQuery()
        .eq('brand_id', brandId)
      
      if (sameBrand && sameBrand.length >= limit) {
        return filterValidProducts(sameBrand as ProductWithRelations[])
      }
    }

    // Fallback to random active products
    const { data: random } = await baseQuery()
      .order('created_at', { ascending: false })

    return filterValidProducts((random || []) as ProductWithRelations[])
  } catch (error) {
    handleDbError(error, 'getRelatedProducts')
    throw error
  }
} 

/**
 * Get products by category with pagination and sorting
 */
export async function getProductsByCategory(
  categoryId: string,
  options: {
    page?: number
    limit?: number
    sort?: string
    brand?: string
  } = {}
): Promise<Product[]> {
  const { page = 1, limit = 24, sort = 'name', brand } = options
  
  try {
    let query = supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .range((page - 1) * limit, page * limit - 1)

    // Add brand filter if provided
    if (brand) {
      query = query.eq('brand_id', brand)
    }

    // Add sorting
    switch (sort) {
      case 'price_asc':
        query = query.order('price', { ascending: true })
        break
      case 'price_desc':
        query = query.order('price', { ascending: false })
        break
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
      default:
        query = query.order('name', { ascending: true })
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching products by category:', error)
      throw new Error('Failed to fetch products')
    }

    return data || []
  } catch (error) {
    console.error('Error in getProductsByCategory:', error)
    throw error
  }
} 