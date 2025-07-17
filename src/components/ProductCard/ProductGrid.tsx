'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ProductCard } from './ProductCard'
import { 
  ProductGridProps, 
  ProductCardData,
  ProductGridConfig 
} from '@/types/product-card'
import { cn } from '@/lib/utils'

/**
 * Responsive Product Grid Component
 * 
 * A responsive grid system for displaying product cards with:
 * - 1 column on mobile
 * - 2-3 columns on tablet
 * - 4 columns on desktop
 * 
 * Features:
 * - Mobile-first responsive design
 * - Configurable column layouts
 * - Loading states
 * - Empty states
 * - Error handling
 * - Infinite scroll support
 * - Virtual scrolling for performance
 * 
 * @author God of Programming
 * @version 1.0.0
 */
export function ProductGrid({
  products,
  columns = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    xl: 4
  },
  gap = {
    mobile: '1rem',
    tablet: '1.5rem',
    desktop: '2rem',
    xl: '2rem'
  },
  className,
  itemClassName,
  emptyState,
  loadingState,
  errorState,
  onLoadMore,
  hasMore = false,
  isLoading = false,
  error,
  virtualScrolling = false,
  infiniteScroll = false,
  searchQuery,
  filters,
  sortBy,
  sortOrder = 'asc',
  selectedVehicle,
  onProductClick,
  onProductAddToCart,
  onProductAddToWishlist,
  showQuickActions = true,
  showCompatibility = true,
  enableAnalytics = false,
  trackingPrefix = 'product-grid'
}: ProductGridProps) {
  
  const [mounted, setMounted] = useState(false)
  const [visibleItems, setVisibleItems] = useState(virtualScrolling ? 20 : products.length)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  
  // Handle component mount
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Handle infinite scroll
  useEffect(() => {
    if (!infiniteScroll || !hasMore || isLoading) return
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && onLoadMore && !isLoadingMore) {
          setIsLoadingMore(true)
          onLoadMore()
        }
      },
      { threshold: 0.1 }
    )
    
    const sentinel = document.getElementById('scroll-sentinel')
    if (sentinel) {
      observer.observe(sentinel)
    }
    
    observerRef.current = observer
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [infiniteScroll, hasMore, isLoading, onLoadMore, isLoadingMore])
  
  // Handle virtual scrolling
  useEffect(() => {
    if (!virtualScrolling) return
    
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const itemHeight = 400 // Approximate item height
      const visibleCount = Math.ceil(windowHeight / itemHeight) * columns.desktop
      const startIndex = Math.floor(scrollTop / itemHeight) * columns.desktop
      
      setVisibleItems(Math.min(startIndex + visibleCount * 2, products.length))
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [virtualScrolling, columns.desktop, products.length])
  
  // Reset loading state when new products arrive
  useEffect(() => {
    if (isLoadingMore && !isLoading) {
      setIsLoadingMore(false)
    }
  }, [isLoading, isLoadingMore])
  
  // Handle product interactions
  const handleProductClick = (product: ProductCardData) => {
    if (enableAnalytics) {
      // Track product click
      console.log(`${trackingPrefix}-product-click`, {
        productId: product.id,
        productName: product.name,
        position: products.indexOf(product),
        searchQuery,
        filters,
        sortBy,
        sortOrder
      })
    }
    
    if (onProductClick) {
      onProductClick(product)
    }
  }
  
  const handleProductAddToCart = (product: ProductCardData) => {
    if (enableAnalytics) {
      // Track add to cart
      console.log(`${trackingPrefix}-add-to-cart`, {
        productId: product.id,
        productName: product.name,
        price: product.price.current,
        position: products.indexOf(product)
      })
    }
    
    if (onProductAddToCart) {
      onProductAddToCart(product)
    }
  }
  
  const handleProductAddToWishlist = (product: ProductCardData) => {
    if (enableAnalytics) {
      // Track add to wishlist
      console.log(`${trackingPrefix}-add-to-wishlist`, {
        productId: product.id,
        productName: product.name,
        position: products.indexOf(product)
      })
    }
    
    if (onProductAddToWishlist) {
      onProductAddToWishlist(product)
    }
  }
  
  // Generate grid CSS classes
  const gridClasses = cn(
    'grid w-full',
    // Responsive columns
    `grid-cols-${columns.mobile}`,
    `md:grid-cols-${columns.tablet}`,
    `lg:grid-cols-${columns.desktop}`,
    `xl:grid-cols-${columns.xl}`,
    // Responsive gaps
    `gap-4`, // Mobile gap
    `md:gap-6`, // Tablet gap
    `lg:gap-8`, // Desktop gap
    `xl:gap-8`, // XL gap
    className
  )
  
  // Get products to display
  const displayProducts = virtualScrolling 
    ? products.slice(0, visibleItems)
    : products
  
  // Loading state
  if (isLoading && products.length === 0) {
    if (loadingState) {
      return <div className="w-full">{loadingState}</div>
    }
    
    return (
      <div className={gridClasses}>
        {Array.from({ length: columns.desktop * 2 }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'bg-white rounded-lg border border-gray-200 p-4 animate-pulse',
              itemClassName
            )}
          >
            {/* Image skeleton */}
            <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
            
            {/* Brand skeleton */}
            <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
            
            {/* Title skeleton */}
            <div className="h-5 bg-gray-200 rounded w-full mb-2" />
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
            
            {/* Compatibility skeleton */}
            <div className="h-4 bg-gray-200 rounded w-32 mb-3" />
            
            {/* Rating skeleton */}
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-4 h-4 bg-gray-200 rounded" />
              ))}
              <div className="h-4 bg-gray-200 rounded w-16 ml-2" />
            </div>
            
            {/* Price skeleton */}
            <div className="h-6 bg-gray-200 rounded w-24 mb-4" />
            
            {/* Availability skeleton */}
            <div className="h-4 bg-gray-200 rounded w-20 mb-4" />
            
            {/* Button skeleton */}
            <div className="h-12 bg-gray-200 rounded-full w-full" />
          </div>
        ))}
      </div>
    )
  }
  
  // Error state
  if (error) {
    if (errorState) {
      return <div className="w-full">{errorState}</div>
    }
    
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Възникна грешка при зареждане на продуктите
        </h3>
        <p className="text-gray-600 mb-4">
          Моля, опитайте отново по-късно
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Опитай отново
        </button>
      </div>
    )
  }
  
  // Empty state
  if (displayProducts.length === 0) {
    if (emptyState) {
      return <div className="w-full">{emptyState}</div>
    }
    
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Няма намерени продукти
        </h3>
        <p className="text-gray-600">
          {searchQuery 
            ? `Няма резултати за "${searchQuery}". Опитайте с други ключови думи.`
            : 'Няма налични продукти за показване.'
          }
        </p>
        {(searchQuery || filters) && (
          <button
            onClick={() => {
              // Reset filters/search
              if (typeof window !== 'undefined') {
                window.location.href = window.location.pathname
              }
            }}
            className="mt-4 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Изчисти филтрите
          </button>
        )}
      </div>
    )
  }
  
  // Prevent hydration mismatch
  if (!mounted) {
    return null
  }
  
  return (
    <div className="w-full">
      {/* Product Grid */}
      <div ref={gridRef} className={gridClasses}>
        {displayProducts.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            onViewDetails={handleProductClick}
            onAddToCart={handleProductAddToCart}
            onAddToWishlist={handleProductAddToWishlist}
            showQuickActions={showQuickActions}
            showCompatibility={showCompatibility}
            showRating={true}
            showBrand={true}
            showAvailability={true}
            showBadges={true}
            enableHover={true}
            enableLazyLoading={true}
            priority={index < 4} // Prioritize first 4 items
            selectedVehicle={selectedVehicle}
            className={itemClassName}
            testId={`${trackingPrefix}-item-${index}`}
          />
        ))}
      </div>
      
      {/* Loading More Indicator */}
      {isLoadingMore && (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-600">Зареждане на още продукти...</span>
          </div>
        </div>
      )}
      
      {/* Infinite Scroll Sentinel */}
      {infiniteScroll && hasMore && !isLoadingMore && (
        <div
          id="scroll-sentinel"
          className="h-4 w-full"
          aria-hidden="true"
        />
      )}
      
      {/* Load More Button */}
      {!infiniteScroll && hasMore && onLoadMore && (
        <div className="text-center mt-8">
          <button
            onClick={() => {
              setIsLoadingMore(true)
              onLoadMore()
            }}
            disabled={isLoadingMore}
            className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoadingMore ? (
              <span className="inline-flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Зареждане...
              </span>
            ) : (
              'Покажи още продукти'
            )}
          </button>
        </div>
      )}
      
      {/* Grid Statistics */}
      {enableAnalytics && (
        <div className="mt-8 text-center text-sm text-gray-500">
          Показани {displayProducts.length} от {products.length} продукта
          {searchQuery && ` за "${searchQuery}"`}
        </div>
      )}
    </div>
  )
}

/**
 * Product Grid Skeleton Component
 * 
 * Loading state for the product grid
 */
export function ProductGridSkeleton({ 
  count = 8,
  columns = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    xl: 4
  },
  className 
}: { 
  count?: number
  columns?: ProductGridConfig['columns']
  className?: string 
}) {
  return (
    <div className={cn(
      'grid w-full gap-4 md:gap-6 lg:gap-8 xl:gap-8',
      `grid-cols-${columns.mobile}`,
      `md:grid-cols-${columns.tablet}`,
      `lg:grid-cols-${columns.desktop}`,
      `xl:grid-cols-${columns.xl}`,
      className
    )}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse"
        >
          {/* Image skeleton */}
          <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
          
          {/* Brand skeleton */}
          <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
          
          {/* Title skeleton */}
          <div className="h-5 bg-gray-200 rounded w-full mb-2" />
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
          
          {/* Compatibility skeleton */}
          <div className="h-4 bg-gray-200 rounded w-32 mb-3" />
          
          {/* Rating skeleton */}
          <div className="flex items-center gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-200 rounded" />
            ))}
            <div className="h-4 bg-gray-200 rounded w-16 ml-2" />
          </div>
          
          {/* Price skeleton */}
          <div className="h-6 bg-gray-200 rounded w-24 mb-4" />
          
          {/* Availability skeleton */}
          <div className="h-4 bg-gray-200 rounded w-20 mb-4" />
          
          {/* Button skeleton */}
          <div className="h-12 bg-gray-200 rounded-full w-full" />
        </div>
      ))}
    </div>
  )
}

/**
 * Product Grid Container Component
 * 
 * Wrapper component with consistent spacing and layout
 */
export function ProductGridContainer({
  children,
  title,
  description,
  className,
  maxWidth = '1200px',
  padding = true
}: {
  children: React.ReactNode
  title?: string
  description?: string
  className?: string
  maxWidth?: string
  padding?: boolean
}) {
  return (
    <div 
      className={cn(
        'w-full mx-auto',
        padding && 'px-4 sm:px-6 lg:px-8',
        className
      )}
      style={{ maxWidth }}
    >
      {(title || description) && (
        <div className="text-center mb-8">
          {title && (
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

export default ProductGrid 