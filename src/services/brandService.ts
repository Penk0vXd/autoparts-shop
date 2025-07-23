import { supabase, handleDbError } from '@/lib/db'
import { isFeatureEnabled } from '@/config/features'
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

// Mock brand data for MVP mode
const MOCK_BRANDS: Brand[] = [
  {
    id: '1',
    name: 'BMW',
    slug: 'bmw',
    logo_url: '/logos/bmw.png',
    description: 'Премиум немска марка автомобили',
    is_active: true,
    category: 'car' as BrandCategory,
    website_url: 'https://bmw.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Mercedes-Benz',
    slug: 'mercedes-benz',
    logo_url: '/logos/mercedes-benz.png',
    description: 'Луксозни немски автомобили',
    is_active: true,
    category: 'car' as BrandCategory,
    website_url: 'https://mercedes-benz.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Audi',
    slug: 'audi',
    logo_url: '/logos/audi.png',
    description: 'Немски премиум автомобили',
    is_active: true,
    category: 'car' as BrandCategory,
    website_url: 'https://audi.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Volkswagen',
    slug: 'volkswagen',
    logo_url: '/logos/volkswagen.png',
    description: 'Народната кола от Германия',
    is_active: true,
    category: 'car' as BrandCategory,
    website_url: 'https://volkswagen.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Toyota',
    slug: 'toyota',
    logo_url: '/logos/toyota.png',
    description: 'Японско качество и надеждност',
    is_active: true,
    category: 'car' as BrandCategory,
    website_url: 'https://toyota.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Ford',
    slug: 'ford',
    logo_url: '/logos/ford.png',
    description: 'Американска автомобилна традиция',
    is_active: true,
    category: 'car' as BrandCategory,
    website_url: 'https://ford.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '7',
    name: 'Bosch',
    slug: 'bosch',
    logo_url: '/logos/parts/bosch.svg',
    description: 'Водещ производител на авточасти',
    is_active: true,
    category: 'parts' as BrandCategory,
    website_url: 'https://bosch.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '8',
    name: 'Brembo',
    slug: 'brembo',
    logo_url: '/logos/parts/brembo.svg',
    description: 'Професионални спирачни системи',
    is_active: true,
    category: 'parts' as BrandCategory,
    website_url: 'https://brembo.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

/**
 * Get paginated list of active brands
 */
export async function getBrands(
  page: number = 1,
  limit: number = 24
): Promise<BrandsResponse> {
  if (!isFeatureEnabled('brands')) {
    return {
      data: [],
      total: 0,
      page,
      totalPages: 0
    }
  }

  try {
    // Calculate offset
    const from = (page - 1) * limit
    const to = from + limit - 1

    // Get brands from database (without category filtering)
    const { data, error, count } = await supabase
      .from('brands')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .order('name', { ascending: true })
      .range(from, to)

    if (error) {
      console.warn('Supabase brands query failed, using mock data:', error)
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedMockBrands = MOCK_BRANDS.slice(startIndex, endIndex)
      
      return {
        data: paginatedMockBrands,
        total: MOCK_BRANDS.length,
        page,
        totalPages: Math.ceil(MOCK_BRANDS.length / limit)
      }
    }

    // Map database brands to include default category
    const brandsWithCategory = (data || []).map(brand => ({
      ...brand,
      category: 'car' as BrandCategory // Default to 'car' since DB doesn't have category
    }))

    const totalPages = Math.ceil((count || 0) / limit)

    return {
      data: brandsWithCategory,
      total: count || 0,
      page,
      totalPages
    }

  } catch (error) {
    console.warn('Brand service error, using mock data:', error)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedMockBrands = MOCK_BRANDS.slice(startIndex, endIndex)
    
    return {
      data: paginatedMockBrands,
      total: MOCK_BRANDS.length,
      page,
      totalPages: Math.ceil(MOCK_BRANDS.length / limit)
    }
  }
}

/**
 * Get brand counts by category
 */
export async function getBrandCounts(): Promise<BrandCounts> {
  if (!isFeatureEnabled('brands')) {
    return { car: 0, accessory: 0, parts: 0 }
  }

  try {
    const { count, error } = await supabase
      .from('brands')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    if (error) {
      console.warn('Brand counts query failed, using mock data:', error)
      return {
        car: MOCK_BRANDS.filter(b => b.category === 'car').length,
        accessory: MOCK_BRANDS.filter(b => b.category === 'accessory').length,
        parts: MOCK_BRANDS.filter(b => b.category === 'parts').length
      }
    }

    // Since DB doesn't have categories, assume most brands are car brands
    return {
      car: count || 0,
      accessory: 0,
      parts: 0
    }

  } catch (error) {
    console.warn('Brand counts error, using mock data:', error)
    return {
      car: MOCK_BRANDS.filter(b => b.category === 'car').length,
      accessory: MOCK_BRANDS.filter(b => b.category === 'accessory').length,
      parts: MOCK_BRANDS.filter(b => b.category === 'parts').length
    }
  }
}

/**
 * Get single brand by slug
 */
export async function getBrand(slug: string): Promise<Brand | null> {
  if (!isFeatureEnabled('brands')) {
    return null
  }

  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error) {
      console.warn(`Brand query failed for slug ${slug}, checking mock data:`, error)
      return MOCK_BRANDS.find(b => b.slug === slug) || null
    }

    // Add default category since DB doesn't have it
    return {
      ...data,
      category: 'car' as BrandCategory
    } as Brand

  } catch (error) {
    console.warn(`Brand service error for slug ${slug}, using mock data:`, error)
    return MOCK_BRANDS.find(b => b.slug === slug) || null
  }
}

/**
 * Get brands filtered by category (ignores category since DB doesn't have it)
 */
export async function getBrandsByCategory(
  category?: BrandCategory,
  page: number = 1,
  limit: number = 24
): Promise<BrandsResponse> {
  // Just return all brands since we don't have categories in DB
  return getBrands(page, limit)
}

/**
 * Search brands by name
 */
export async function searchBrands(
  query: string,
  limit: number = 10
): Promise<Brand[]> {
  if (!isFeatureEnabled('brands') || !query.trim()) {
    return []
  }

  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .ilike('name', `%${query}%`)
      .eq('is_active', true)
      .limit(limit)

    if (error) {
      console.warn(`Brand search failed for query ${query}, using mock data:`, error)
      const searchTerm = query.toLowerCase()
      return MOCK_BRANDS
        .filter(b => b.name.toLowerCase().includes(searchTerm))
        .slice(0, limit)
    }

    // Add default category to search results
    return (data || []).map(brand => ({
      ...brand,
      category: 'car' as BrandCategory
    }))

  } catch (error) {
    console.warn(`Brand search error for query ${query}, using mock data:`, error)
    const searchTerm = query.toLowerCase()
    return MOCK_BRANDS
      .filter(b => b.name.toLowerCase().includes(searchTerm))
      .slice(0, limit)
  }
} 