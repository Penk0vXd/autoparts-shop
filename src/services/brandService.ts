import { supabase, handleDbError } from '@/lib/db'
import type { Brand } from '@/types/db'

export type BrandsResponse = {
  data: Brand[]
  total: number
  page: number
  totalPages: number
}

export type BrandCounts = {
  car: number
  accessory: number
  parts: number
}

export type BrandCategory = 'car' | 'accessory' | 'parts'

/**
 * Get paginated list of active brands
 */
export async function getBrands(
  page: number = 1,
  limit: number = 24
): Promise<BrandsResponse> {
  try {
    // Calculate offset
    const from = (page - 1) * limit
    const to = from + limit - 1

    // Get brands with count
    const { data, error, count } = await supabase
      .from('brands')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .order('name', { ascending: true })
      .range(from, to)

    if (error) {
      handleDbError(error, 'getBrands')
    }

    const totalPages = Math.ceil((count || 0) / limit)

    return {
      data: data as Brand[] || [],
      total: count || 0,
      page,
      totalPages
    }
  } catch (error) {
    handleDbError(error, 'getBrands')
    throw error
  }
}

/**
 * Get total count of active brands
 */
export async function countBrands(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('brands')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    if (error) {
      handleDbError(error, 'countBrands')
    }

    return count || 0
  } catch (error) {
    handleDbError(error, 'countBrands')
    throw error
  }
}

/**
 * Get a single brand by slug
 */
export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  try {
    const normalizedSlug = slug.toLowerCase()
    
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('is_active', true)
      .eq('slug', normalizedSlug)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      handleDbError(error, 'getBrandBySlug')
    }

    return data as Brand
  } catch (error) {
    handleDbError(error, 'getBrandBySlug')
    throw error
  }
}

export async function getBrandCounts(): Promise<BrandCounts> {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('category')
      .eq('is_active', true)

    if (error) {
      handleDbError(error, 'getBrandCounts')
    }

    const counts = (data || []).reduce((acc, brand) => {
      const category = brand.category as BrandCategory || 'car'
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {} as Partial<BrandCounts>)

    return {
      car: counts.car || 0,
      accessory: counts.accessory || 0,
      parts: counts.parts || 0
    }
  } catch (error) {
    handleDbError(error, 'getBrandCounts')
    throw error
  }
}

export async function getBrandsByCategory(
  category: BrandCategory, 
  page: number = 1, 
  limit: number = 24
): Promise<BrandsResponse> {
  try {
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await supabase
      .from('brands')
      .select('*', { count: 'exact' })
      .eq('category', category)
      .eq('is_active', true)
      .order('name', { ascending: true })
      .range(from, to)

    if (error) {
      handleDbError(error, 'getBrandsByCategory')
    }

    const totalPages = Math.ceil((count || 0) / limit)

    return {
      data: (data as Brand[]) || [],
      total: count || 0,
      page,
      totalPages
    }
  } catch (error) {
    handleDbError(error, 'getBrandsByCategory')
    throw error
  }
}

export async function getAllBrands(page: number = 1, limit: number = 24): Promise<BrandsResponse> {
  try {
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await supabase
      .from('brands')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .order('name', { ascending: true })
      .range(from, to)

    if (error) {
      handleDbError(error, 'getAllBrands')
    }

    const totalPages = Math.ceil((count || 0) / limit)

    return {
      data: (data as Brand[]) || [],
      total: count || 0,
      page,
      totalPages
    }
  } catch (error) {
    handleDbError(error, 'getAllBrands')
    throw error
  }
} 