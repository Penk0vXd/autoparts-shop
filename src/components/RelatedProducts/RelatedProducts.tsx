'use client'

import { useTranslations } from 'next-intl'
import useSWR from 'swr'
import type { ProductWithRelations } from '@/types/supabase'
import { ProductCard } from '@/components/ProductCard/ProductCard'

const fetcher = (url: string) => fetch(url).then(res => res.json())

type RelatedProductsProps = {
  productId: string
  categoryId: string | null
  brandId: string | null
}

export function RelatedProducts({ productId, categoryId, brandId }: RelatedProductsProps) {
  const t = useTranslations('products')
  
  const { data, error } = useSWR<{ success: boolean; data: ProductWithRelations[] }>(
    `/api/products/${productId}/related`,
    fetcher
  )

  if (error || !data?.success || !data.data.length) {
    return null
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
          {t('relatedProducts')}
        </h2>
        
        {/* Mobile: Horizontal scroll */}
        <div className="md:hidden -mx-4">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 pb-6 scrollbar-hide">
            {data.data.map((product) => (
              <div key={product.id} className="snap-start w-[280px] flex-shrink-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: 2x2 Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
          {data.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
} 