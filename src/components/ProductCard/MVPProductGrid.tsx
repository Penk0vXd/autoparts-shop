'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { MVPProductGridProps } from '@/types/mvp-product-card'
import { MVPProductCard } from './MVPProductCard'

/**
 * MVP Product Grid - God-Mode Version
 * 
 * Responsive grid component for displaying product cards in Bulgarian automotive parts catalog.
 * Optimized for conversion and perfect mobile experience.
 * 
 * ✅ Features:
 * - Responsive grid: 1 mobile → 2-3 tablet → 4 desktop
 * - Loading skeleton states
 * - Empty state handling
 * - Proper accessibility
 * - Optimized image loading priorities
 * - Bulgarian localization
 * 
 * @author God of Programming
 * @version 1.0.0
 */
export function MVPProductGrid({ 
  products, 
  onProductClick, 
  className, 
  isLoading = false,
  emptyMessage = 'Няма намерени продукти'
}: MVPProductGridProps) {
  
  // Loading skeleton component
  const ProductSkeleton = () => (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-square bg-gray-200" />
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Brand skeleton */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-200 rounded" />
          <div className="w-16 h-4 bg-gray-200 rounded" />
        </div>
        
        {/* Name skeleton */}
        <div className="space-y-2">
          <div className="w-full h-4 bg-gray-200 rounded" />
          <div className="w-3/4 h-4 bg-gray-200 rounded" />
        </div>
        
        {/* Compatibility skeleton */}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded" />
          <div className="w-32 h-4 bg-gray-200 rounded" />
        </div>
        
        {/* Price skeleton */}
        <div className="w-24 h-6 bg-gray-200 rounded" />
        
        {/* Availability skeleton */}
        <div className="w-20 h-6 bg-gray-200 rounded-full" />
        
        {/* Button skeleton */}
        <div className="w-full h-11 bg-gray-200 rounded-full" />
      </div>
    </div>
  )

  // Empty state component
  const EmptyState = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
      <div className="text-center">
        {/* Empty state icon */}
        <svg 
          className="w-16 h-16 mx-auto mb-4 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1} 
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" 
          />
        </svg>
        
        {/* Empty state text */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {emptyMessage}
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Опитайте да промените филтрите или търсенето, за да намерите желаните части.
        </p>
      </div>
    </div>
  )

  // If loading, show skeleton grid
  if (isLoading) {
    return (
      <div className={cn(
        'grid gap-4 md:gap-6',
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className
      )}>
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    )
  }

  // If no products, show empty state
  if (!products || products.length === 0) {
    return (
      <div className={cn(
        'grid gap-4 md:gap-6',
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className
      )}>
        <EmptyState />
      </div>
    )
  }

  return (
    <div 
      className={cn(
        'grid gap-4 md:gap-6',
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className
      )}
      role="grid"
      aria-label="Каталог с авточасти"
    >
      {products.map((product, index) => (
        <MVPProductCard
          key={product.id}
          product={product}
          onViewDetails={onProductClick}
          priority={index < 4} // Priority loading for first 4 products
        />
      ))}
    </div>
  )
} 