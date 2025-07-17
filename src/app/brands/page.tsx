'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

import useSWRInfinite from 'swr/infinite'
import { BrandCard, type BrandCardProps } from '@/components/BrandCard/BrandCard'
import { BrandFilterBar } from '@/components/BrandFilterBar/BrandFilterBar'
import type { Brand } from '@/types/db'
import type { BrandCategory } from '@/services/brandService'

const LIMIT = Number(process.env.NEXT_PUBLIC_BRAND_PAGE_LIMIT) || 24

type BrandsResponse = {
  data: Brand[]
  total: number
  page: number
  totalPages: number
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

// Brand data adapter - converts database Brand to BrandCard interface
const adaptBrandForCard = (brand: Brand): BrandCardProps['brand'] => {
  // Fallback data for missing fields
  const brandCountries: Record<string, string> = {
    'bmw': 'Germany',
    'mercedes-benz': 'Germany', 
    'audi': 'Germany',
    'volkswagen': 'Germany',
    'toyota': 'Japan',
    'honda': 'Japan',
    'ford': 'USA',
    'chevrolet': 'USA',
    'nissan': 'Japan',
    'hyundai': 'South Korea',
    'kia': 'South Korea',
    'volvo': 'Sweden',
    'peugeot': 'France',
    'renault': 'France',
    'fiat': 'Italy',
    'ferrari': 'Italy',
    'lamborghini': 'Italy',
    'porsche': 'Germany',
  };

  const brandFounded: Record<string, number> = {
    'bmw': 1916,
    'mercedes-benz': 1926,
    'audi': 1909,
    'volkswagen': 1937,
    'toyota': 1937,
    'honda': 1948,
    'ford': 1903,
    'chevrolet': 1911,
    'nissan': 1933,
    'hyundai': 1967,
    'kia': 1944,
    'volvo': 1927,
    'peugeot': 1810,
    'renault': 1899,
    'fiat': 1899,
    'ferrari': 1939,
    'lamborghini': 1963,
    'porsche': 1931,
  };

  return {
    name: brand.name,
    slug: brand.slug,
    country: brandCountries[brand.slug] || 'Unknown',
    founded: brandFounded[brand.slug] || 1900,
    description: brand.description || undefined,
    logoUrl: brand.logo_url || undefined,
    productCount: Math.floor(Math.random() * 20000) + 1000, // TODO: Get real product count
    isPopular: ['bmw', 'mercedes-benz', 'toyota', 'honda', 'ford'].includes(brand.slug),
    isPremium: ['bmw', 'mercedes-benz', 'audi', 'ferrari', 'lamborghini', 'porsche'].includes(brand.slug),
  };
};

export default function BrandsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isIntersecting, setIsIntersecting] = useState(false)
  
  // Get category from URL or default to 'car'
  const [activeCategory, setActiveCategory] = useState<BrandCategory>(
    (searchParams.get('category') as BrandCategory) || 'car'
  )

  const getKey = (pageIndex: number, previousPageData: BrandsResponse | null) => {
    if (previousPageData && pageIndex + 1 > previousPageData.totalPages) {
      return null
    }
    return `/api/brands?page=${pageIndex + 1}&limit=${LIMIT}&category=${activeCategory}`
  }
  
  const { data, error, size, setSize, mutate } = useSWRInfinite<BrandsResponse>(
    getKey,
    fetcher,
    {
      revalidateFirstPage: false,
      persistSize: true
    }
  )

  const handleCategoryChange = (category: BrandCategory) => {
    setActiveCategory(category)
    
    // Update URL
    const params = new URLSearchParams(searchParams.toString())
    params.set('category', category)
    router.push(`/brands?${params.toString()}`)
    
    // Reset data and refetch
    mutate()
  }

  const brands = data ? data.flatMap(page => page.data).filter(Boolean) : []
  const isLoading = !data && !error
  const total = data?.[0]?.total || 0
  const hasMore = data ? data[data.length - 1]?.page < data[data.length - 1]?.totalPages : false

  // Debug logging
  if (error) {
    console.error('Brands API error:', error)
  }

  useEffect(() => {
    if (isIntersecting && hasMore) {
      setSize(size + 1)
    }
  }, [isIntersecting, hasMore])

  return (
    <main className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Марки автомобили
        </h1>
        
        <BrandFilterBar 
          activeCategory={activeCategory} 
          onCategoryChange={handleCategoryChange} 
        />
        
        <p className="text-gray-600 mb-8">
          Показани {brands.length} от {total} марки
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800">Error loading brands. Please try again.</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <BrandCard 
              key={brand.id} 
              brand={adaptBrandForCard(brand)}
              variant="compact"
            />
          ))}
        </div>

        {isLoading && (
          <div className="text-center mt-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          </div>
        )}

        {hasMore && !isLoading && (
          <div 
            className="mt-12 text-center"
            onMouseEnter={() => setIsIntersecting(true)}
            onMouseLeave={() => setIsIntersecting(false)}
          >
            <button
              onClick={() => setSize(size + 1)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Зареди още
            </button>
          </div>
        )}
      </div>
    </main>
  )
} 