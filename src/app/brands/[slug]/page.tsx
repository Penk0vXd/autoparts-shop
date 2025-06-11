'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import useSWRInfinite from 'swr/infinite'
import Image from 'next/image'
import { ProductCard } from '@/components/ProductCard/ProductCard'
import type { Brand } from '@/types/db'
import type { ProductWithRelations } from '@/types/supabase'

const LIMIT = Number(process.env.NEXT_PUBLIC_BRAND_PRODUCTS_PAGE_LIMIT) || 24

type BrandPageProps = {
  params: {
    slug: string
  }
}

type BrandProductsResponse = {
  success: boolean
  data: ProductWithRelations[]
  brand: Brand
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

const getKey = (pageIndex: number, previousPageData: BrandProductsResponse | null, slug: string) => {
  if (previousPageData && !previousPageData.data.length) return null
  return `/api/brands/${slug.toLowerCase()}/products?page=${pageIndex + 1}&limit=${LIMIT}`
}

export default function BrandPage({ params }: BrandPageProps) {
  const t = useTranslations()
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  
  const { data, error, size, setSize } = useSWRInfinite<BrandProductsResponse>(
    (pageIndex, previousPageData) => getKey(pageIndex, previousPageData, params.slug.toLowerCase()),
    async (url) => {
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    }
  )

  const brand = data?.[0]?.brand
  const products = data?.flatMap(page => page.data) || []
  const total = data?.[0]?.pagination.total || 0
  const isLoadingInitialData = !data && !error
  const isReachingEnd = data?.slice(-1)[0]?.data.length < LIMIT
  
  const loadMore = async () => {
    if (isLoadingMore || isReachingEnd) return
    setIsLoadingMore(true)
    await setSize(size + 1)
    setIsLoadingMore(false)
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="text-red-600">{t('common.error')}</p>
      </div>
    )
  }

  if (isLoadingInitialData) {
    return (
      <div className="text-center py-16">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
      </div>
    )
  }

  if (!brand) {
    return (
      <div className="py-16 text-center">
        <p className="text-red-600">{t('brands.notFound')}</p>
      </div>
    )
  }

  return (
    <main className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Brand Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 md:mb-12 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4 md:mb-0">
            {brand.logo_url ? (
              <div className="relative w-24 h-24 mr-6">
                <Image
                  src={brand.logo_url}
                  alt={brand.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 96px) 100vw, 96px"
                />
              </div>
            ) : null}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {brand.name}
              </h1>
              {brand.description && (
                <p className="mt-2 text-gray-600 max-w-2xl">
                  {brand.description}
                </p>
              )}
            </div>
          </div>
          <div className="text-gray-600">
            {t('products.showing', { 
              current: products.length,
              total
            })}
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Load More Button */}
            {!isReachingEnd && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingMore ? (
                    <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent mr-2"></div>
                  ) : null}
                  {t('common.loadMore')}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">{t('products.noneFound')}</p>
          </div>
        )}
      </div>
    </main>
  )
} 