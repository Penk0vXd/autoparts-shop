import { supabase } from '@/lib/db'
import { Category, Product } from '@/types/db'

/**
 * Enhanced Category Service for Bulgarian Auto Parts Store
 * Fetches real-time data from Supabase with product counts
 */

export interface CategoryWithCount extends Category {
  productCount: number
}

export interface CategoryOverviewData {
  categories: CategoryWithCount[]
  totalProducts: number
  totalCategories: number
}

/**
 * Get all active categories with live product counts
 */
export async function getCategoriesWithProductCounts(): Promise<CategoryOverviewData> {
  try {
    // First, get all categories
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError)
      throw new Error('Failed to fetch categories')
    }

    // Then, get product counts for each category
    const categoriesWithCounts: CategoryWithCount[] = []
    let totalProducts = 0

    for (const category of categoriesData || []) {
      const { count: productCount, error: countError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', category.id)
        .eq('is_active', true)

      if (countError) {
        console.error('Error counting products for category:', category.id, countError)
      }

      const finalCount = productCount || 0
      totalProducts += finalCount

      categoriesWithCounts.push({
        ...category,
        productCount: finalCount
      })
    }

    return {
      categories: categoriesWithCounts,
      totalProducts,
      totalCategories: categoriesWithCounts.length
    }
  } catch (error) {
    console.error('Error in getCategoriesWithProductCounts:', error)
    throw error
  }
}

/**
 * Get category by slug with product count
 */
export async function getCategoryBySlug(slug: string): Promise<CategoryWithCount | null> {
  try {
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (categoryError || !categoryData) {
      return null
    }

    // Get product count for this category
    const { count: productCount, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', categoryData.id)
      .eq('is_active', true)

    if (countError) {
      console.error('Error counting products:', countError)
    }

    return {
      ...categoryData,
      productCount: productCount || 0
    }
  } catch (error) {
    console.error('Error in getCategoryBySlug:', error)
    return null
  }
}

/**
 * Get categories with filtering and sorting options
 */
export async function getCategoriesWithFilters(
  options: {
    sortBy?: 'name' | 'product_count' | 'created_at'
    sortOrder?: 'asc' | 'desc'
    minProducts?: number
    maxProducts?: number
    search?: string
  } = {}
): Promise<CategoryWithCount[]> {
  try {
    const { sortBy = 'name', sortOrder = 'asc', minProducts, maxProducts, search } = options

    let query = supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)

    // Add search filter
    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    const { data: categoriesData, error } = await query

    if (error) {
      console.error('Error fetching filtered categories:', error)
      throw new Error('Failed to fetch categories')
    }

    // Get product counts for each category
    const categoriesWithCounts: CategoryWithCount[] = []
    
    for (const category of categoriesData || []) {
      const { count: productCount, error: countError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', category.id)
        .eq('is_active', true)

      if (countError) {
        console.error('Error counting products for category:', category.id, countError)
      }

      const finalCount = productCount || 0
      
      categoriesWithCounts.push({
        ...category,
        productCount: finalCount
      })
    }

    let categories = categoriesWithCounts

    // Apply product count filters
    if (minProducts !== undefined) {
      categories = categories.filter(cat => cat.productCount >= minProducts)
    }
    if (maxProducts !== undefined) {
      categories = categories.filter(cat => cat.productCount <= maxProducts)
    }

    // Apply sorting
    categories.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'product_count':
          comparison = a.productCount - b.productCount
          break
        case 'created_at':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          break
      }
      
      return sortOrder === 'desc' ? -comparison : comparison
    })

    return categories
  } catch (error) {
    console.error('Error in getCategoriesWithFilters:', error)
    throw error
  }
}

/**
 * Get category statistics for admin/analytics
 */
export async function getCategoryStats(): Promise<{
  totalCategories: number
  totalProducts: number
  avgProductsPerCategory: number
  categoriesWithMostProducts: CategoryWithCount[]
  emptyCategoriesCount: number
}> {
  try {
    const { categories, totalProducts, totalCategories } = await getCategoriesWithProductCounts()
    
    const avgProductsPerCategory = totalCategories > 0 ? totalProducts / totalCategories : 0
    const categoriesWithMostProducts = [...categories]
      .sort((a, b) => b.productCount - a.productCount)
      .slice(0, 5)
    
    const emptyCategoriesCount = categories.filter(cat => cat.productCount === 0).length

    return {
      totalCategories,
      totalProducts,
      avgProductsPerCategory,
      categoriesWithMostProducts,
      emptyCategoriesCount
    }
  } catch (error) {
    console.error('Error in getCategoryStats:', error)
    throw error
  }
}

/**
 * Validate category slug for URL safety
 */
export function validateCategorySlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  return slugRegex.test(slug) && slug.length <= 50
}

/**
 * Generate category URL
 */
export function generateCategoryUrl(slug: string): string {
  if (!validateCategorySlug(slug)) {
    throw new Error('Invalid category slug')
  }
  return `/categories/${slug}`
}

/**
 * Get default category image URL
 */
export function getDefaultCategoryImage(): string {
  return '/api/placeholder/400/300?text=Category'
}

/**
 * Format product count for display
 */
export function formatProductCount(count: number): string {
  if (count === 0) return '0 продукта'
  if (count === 1) return '1 продукт'
  return `${count} продукта`
} 