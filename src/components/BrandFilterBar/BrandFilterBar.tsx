'use client'

import { useTranslations } from 'next-intl'
import useSWR from 'swr'
import { cn } from '@/lib/utils'
import type { BrandCounts, BrandCategory } from '@/services/brandService'

type FilterBarProps = {
  activeCategory: BrandCategory
  onCategoryChange: (category: BrandCategory) => void
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function BrandFilterBar({ activeCategory, onCategoryChange }: FilterBarProps) {
  const t = useTranslations()
  
  const { data: counts, error } = useSWR<BrandCounts>('/api/brands/counts', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })

  const filters = [
    { cat: 'car' as BrandCategory, label: t('brands.filters.cars') },
    { cat: 'accessory' as BrandCategory, label: t('brands.filters.accessories') },
    { cat: 'parts' as BrandCategory, label: t('brands.filters.parts') }
  ]

  if (error) {
    console.error('Failed to load brand counts:', error)
  }

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => (
          <button
            key={filter.cat}
            onClick={() => onCategoryChange(filter.cat)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-colors',
              activeCategory === filter.cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
            type="button"
          >
            {filter.label} ({counts?.[filter.cat] ?? 0})
          </button>
        ))}
      </div>
    </div>
  )
} 