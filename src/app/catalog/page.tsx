'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import useSWR from 'swr'
import { ProductCard } from '@/components/ProductCard/ProductCard'
import { fetchProducts, getProductsKey, type ProductsParams } from '@/services/products'

/**
 * Catalog page displaying products with filtering and pagination
 */
export default function CatalogPage() {
  const t = useTranslations('products')
  const tCommon = useTranslations('common')
  
  const [filters, setFilters] = useState<ProductsParams>({
    page: 1,
    limit: 12,
  })

  const { data, error, isLoading } = useSWR(
    getProductsKey(filters),
    () => fetchProducts(filters)
  )

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const handleFilterChange = (newFilters: Partial<ProductsParams>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }))
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          <p>{tCommon('error')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t('title')}
        </h1>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder={tCommon('search')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              onChange={(e) => {
                const value = e.target.value
                setTimeout(() => {
                  handleFilterChange({ search: value || undefined })
                }, 300)
              }}
            />
          </div>
          
          <select
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            onChange={(e) => handleFilterChange({ category: e.target.value || undefined })}
          >
            <option value="">Всички категории</option>
            <option value="dvigatel">Двигател</option>
            <option value="spirachki">Спирачки</option>
            <option value="okachvane">Окачване</option>
            <option value="elektrika">Електрика</option>
          </select>
          
          <select
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            onChange={(e) => handleFilterChange({ brand: e.target.value || undefined })}
          >
            <option value="">Всички марки</option>
            <option value="bosch">Bosch</option>
            <option value="febi">Febi</option>
            <option value="sachs">Sachs</option>
            <option value="brembo">Brembo</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-600">{tCommon('loading')}</p>
        </div>
      )}

      {/* Products Grid */}
      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {data.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {data.pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => handlePageChange(data.pagination.page - 1)}
                disabled={data.pagination.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                {tCommon('previous')}
              </button>
              
              <span className="px-4 py-2 text-gray-700">
                Страница {data.pagination.page} от {data.pagination.totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(data.pagination.page + 1)}
                disabled={data.pagination.page === data.pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                {tCommon('next')}
              </button>
            </div>
          )}

          {/* Results Info */}
          <div className="text-center mt-4 text-gray-600">
            Показани {data.data.length} от {data.pagination.total} продукта
          </div>
        </>
      )}

      {/* No Results */}
      {data && data.data.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Няма намерени продукти</p>
        </div>
      )}
    </div>
  )
} 