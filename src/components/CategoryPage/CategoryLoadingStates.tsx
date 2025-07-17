'use client'

import { CategoryLocalization } from '@/types/category'
import { ExclamationTriangleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

/**
 * Product Card Skeleton Loader
 */
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-square bg-gray-200" />
      
      {/* Content skeleton */}
      <div className="p-4">
        {/* Brand skeleton */}
        <div className="h-4 bg-gray-200 rounded w-16 mb-2" />
        
        {/* Title skeleton */}
        <div className="h-5 bg-gray-200 rounded w-full mb-2" />
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
        
        {/* Price skeleton */}
        <div className="h-6 bg-gray-200 rounded w-24 mb-3" />
        
        {/* Stock badge skeleton */}
        <div className="h-5 bg-gray-200 rounded w-20 mb-3" />
        
        {/* Button skeleton */}
        <div className="h-10 bg-gray-200 rounded w-full" />
      </div>
    </div>
  )
}

/**
 * Product Grid Skeleton Loader
 */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}

/**
 * Category Header Skeleton
 */
export function CategoryHeaderSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="h-4 bg-gray-200 rounded w-16" />
        <div className="h-4 bg-gray-200 rounded w-2" />
        <div className="h-4 bg-gray-200 rounded w-20" />
        <div className="h-4 bg-gray-200 rounded w-2" />
        <div className="h-4 bg-gray-200 rounded w-24" />
      </div>
      
      {/* Title skeleton */}
      <div className="h-8 bg-gray-200 rounded w-48 mb-3" />
      
      {/* Description skeleton */}
      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
    </div>
  )
}

/**
 * Filter Panel Skeleton
 */
export function FilterPanelSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-6 bg-gray-200 rounded w-20" />
        <div className="h-4 bg-gray-200 rounded w-16" />
      </div>
      
      {/* Filter sections skeleton */}
      <div className="space-y-6">
        {[...Array(5)].map((_, index) => (
          <div key={index}>
            <div className="h-4 bg-gray-200 rounded w-16 mb-3" />
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="h-4 w-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-20" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Empty State Component
 */
interface EmptyStateProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export function EmptyState({ 
  title = CategoryLocalization.messages.noProducts,
  description = 'Моля, опитайте да промените филтрите или търсете други продукти.',
  icon,
  actions,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
          {icon || <MagnifyingGlassIcon className="h-12 w-12" />}
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-500 mb-6">
          {description}
        </p>
        
        {/* Actions */}
        {actions}
      </div>
    </div>
  )
}

/**
 * No Products Found State
 */
export function NoProductsFound({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <EmptyState
      title={CategoryLocalization.messages.noProducts}
      description="Не намерихме продукти, които да отговарят на вашите критерии. Моля, опитайте да промените филтрите."
      icon={<MagnifyingGlassIcon className="h-12 w-12" />}
      actions={
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onClearFilters}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
          >
            {CategoryLocalization.filters.clearFilters}
          </button>
          <a
            href="/catalog"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Виж всички продукти
          </a>
        </div>
      }
    />
  )
}

/**
 * Category Not Found State
 */
export function CategoryNotFound() {
  return (
    <EmptyState
      title="Категорията не е намерена"
      description="Търсената категория не съществува или не е достъпна в момента."
      icon={<ExclamationTriangleIcon className="h-12 w-12" />}
      actions={
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/catalog"
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
          >
            Виж всички категории
          </a>
          <a
            href="/"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Към началната страница
          </a>
        </div>
      }
    />
  )
}

/**
 * Error State Component
 */
export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <EmptyState
      title="Възникна грешка"
      description="Не успяхме да заредим продуктите. Моля, опитайте отново."
      icon={<ExclamationTriangleIcon className="h-12 w-12" />}
      actions={
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
        >
          Опитай отново
        </button>
      }
    />
  )
}

/**
 * Loading State for Full Category Page
 */
export function CategoryPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header skeleton */}
        <div className="mb-8">
          <CategoryHeaderSkeleton />
        </div>
        
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filter sidebar skeleton */}
          <div className="lg:col-span-1">
            <FilterPanelSkeleton />
          </div>
          
          {/* Products grid skeleton */}
          <div className="lg:col-span-3 mt-8 lg:mt-0">
            {/* Results header skeleton */}
            <div className="flex items-center justify-between mb-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-48" />
              <div className="h-8 bg-gray-200 rounded w-32" />
            </div>
            
            {/* Products grid */}
            <ProductGridSkeleton count={12} />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Mobile Loading States
 */
export function MobileFilterSkeleton() {
  return (
    <div className="lg:hidden mb-4 animate-pulse">
      <div className="h-12 bg-gray-200 rounded-lg" />
    </div>
  )
}

/**
 * Results Header Skeleton
 */
export function ResultsHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between mb-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-48" />
      <div className="h-8 bg-gray-200 rounded w-32" />
    </div>
  )
} 