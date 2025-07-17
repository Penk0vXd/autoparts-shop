'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { CheckIcon, XMarkIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { ProductCardBGProps, PriceDisplay, StockDisplay } from '@/types/product-card-bg'

/**
 * Production-Quality ProductCard for Bulgarian Auto Parts Store
 * 
 * 🏆 Features:
 * - Bulletproof pricing logic (never shows NaN)
 * - Premium design with brand colors
 * - Perfect Bulgarian localization
 * - Mobile-first responsive
 * - Accessibility optimized
 * - Edge case handling
 * - Trust-building elements
 * 
 * @author God of Programming
 * @version 1.0.0
 */
export function ProductCardBG({ 
  product, 
  onViewDetails, 
  onAddToCart, 
  className, 
  priority = false 
}: ProductCardBGProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  /**
   * Bulletproof price formatting
   * NEVER returns NaN - always has a fallback
   */
  const formatPrice = (amount?: number | null): PriceDisplay => {
    // Handle null, undefined, NaN, or invalid numbers
    if (amount === null || amount === undefined || isNaN(amount) || amount < 0) {
      return {
        text: 'Цена при запитване',
        isAvailable: false,
        className: 'text-gray-600 font-medium'
      }
    }

    // Format valid price
    try {
      const formatted = new Intl.NumberFormat('bg-BG', {
        style: 'currency',
        currency: 'BGN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount).replace('BGN', 'лв.')

      return {
        text: formatted,
        isAvailable: true,
        className: 'text-gray-900 font-bold'
      }
    } catch (error) {
      // Fallback if NumberFormat fails
      return {
        text: 'Цена при запитване',
        isAvailable: false,
        className: 'text-gray-600 font-medium'
      }
    }
  }

  /**
   * Get stock status display
   */
  const getStockDisplay = (): StockDisplay => {
    const { isInStock, status, deliveryText } = product.stock

    if (isInStock && status === 'in_stock') {
      return {
        text: 'В наличност',
        icon: CheckIcon,
        className: 'text-green-700',
        badgeClassName: 'bg-green-100 border-green-200'
      }
    }

    if (status === 'low_stock') {
      return {
        text: 'Ограничено количество',
        icon: CheckIcon,
        className: 'text-yellow-700',
        badgeClassName: 'bg-yellow-100 border-yellow-200'
      }
    }

    // Out of stock
    return {
      text: 'Изчерпан',
      icon: XMarkIcon,
      className: 'text-red-700',
      badgeClassName: 'bg-red-100 border-red-200'
    }
  }

  /**
   * Handle image loading
   */
  const handleImageLoad = () => {
    setIsImageLoaded(true)
  }

  /**
   * Handle image error
   */
  const handleImageError = () => {
    setImageError(true)
  }

  /**
   * Handle view details
   */
  const handleViewDetails = () => {
    onViewDetails(product)
  }

  /**
   * Handle add to cart
   */
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onAddToCart && product.stock.isInStock) {
      onAddToCart(product)
    }
  }

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleViewDetails()
    }
  }

  // Get formatted price
  const priceDisplay = formatPrice(product.price.amount)
  const originalPriceDisplay = product.price.originalAmount 
    ? formatPrice(product.price.originalAmount)
    : null

  // Get stock display
  const stockDisplay = getStockDisplay()
  const StockIcon = stockDisplay.icon

  // Check if product is available for purchase
  const isAvailable = product.stock.isInStock && priceDisplay.isAvailable

  return (
    <div
      className={cn(
        // Base layout
        'group relative bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 ease-out cursor-pointer',
        // Hover effects
        'hover:shadow-xl hover:-translate-y-1 hover:border-gray-300',
        // Focus states
        'focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:ring-offset-2',
        className
      )}
      onClick={handleViewDetails}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="article"
      aria-label={`${product.name} - ${priceDisplay.text}`}
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {product.image && !imageError ? (
          <Image
            src={product.image.url}
            alt={product.image.alt}
            fill
            className={cn(
              'object-cover object-center transition-all duration-500',
              isImageLoaded ? 'opacity-100' : 'opacity-0',
              'group-hover:scale-105'
            )}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            onLoad={handleImageLoad}
            onError={handleImageError}
            placeholder={product.image.placeholder ? 'blur' : 'empty'}
            blurDataURL={product.image.placeholder}
          />
        ) : (
          // Fallback placeholder
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">Няма изображение</span>
            </div>
          </div>
        )}

        {/* Loading state */}
        {!isImageLoaded && !imageError && product.image && (
          <div className="absolute inset-0 bg-gray-300 animate-pulse" />
        )}

        {/* Product badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.isNew && (
            <span className="inline-flex items-center px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
              Ново
            </span>
          )}
          {product.isFeatured && (
            <span className="inline-flex items-center px-2 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full">
              Препоръчано
            </span>
          )}
          {product.price.isOnSale && product.price.discountPercent && (
            <span className="inline-flex items-center px-2 py-1 bg-red-600 text-white text-xs font-semibold rounded-full">
              -{product.price.discountPercent}%
            </span>
          )}
        </div>

        {/* Stock status overlay */}
        {!product.stock.isInStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-2 rounded-full font-semibold">
              ИЗЧЕРПАН
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Brand */}
        {product.brand && (
          <div className="flex items-center gap-2">
            {product.brand.logo && (
              <img 
                src={product.brand.logo} 
                alt={`${product.brand.name} лого`}
                className="w-5 h-5 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            )}
            <span className="text-sm font-medium text-gray-600">{product.brand.name}</span>
          </div>
        )}

        {/* Product Name */}
        <h3 className="text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors duration-200">
          {product.name}
        </h3>

        {/* Part Number */}
        {product.partNumber && (
          <p className="text-sm text-gray-500">
            Артикул: {product.partNumber}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className={cn('text-xl', priceDisplay.className)}>
            {priceDisplay.text}
          </span>
          {originalPriceDisplay && product.price.isOnSale && originalPriceDisplay.isAvailable && (
            <span className="text-sm text-gray-500 line-through">
              {originalPriceDisplay.text}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="flex items-center gap-2">
          <span className={cn(
            'inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border',
            stockDisplay.badgeClassName,
            stockDisplay.className
          )}>
            <StockIcon className="w-4 h-4" />
            {stockDisplay.text}
          </span>
        </div>

        {/* Delivery Info */}
        {product.stock.deliveryText && product.stock.isInStock && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TruckIcon className="w-4 h-4" />
            {product.stock.deliveryText}
          </div>
        )}

        {/* Warranty */}
        {product.warranty?.included && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <ShieldCheckIcon className="w-4 h-4" />
            <span>
              {product.warranty.duration 
                ? `Гаранция ${product.warranty.duration}`
                : 'Гаранция включена'
              }
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {/* Primary CTA - View Details */}
          <button
            onClick={handleViewDetails}
            className={cn(
              'flex-1 min-h-[44px] px-4 py-3 rounded-full font-semibold transition-all duration-200',
              'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white',
              'hover:shadow-lg hover:shadow-red-500/25 active:scale-95',
              'focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2'
            )}
            aria-label={`Виж детайли за ${product.name}`}
          >
            Виж детайли
          </button>

          {/* Add to Cart (if available and callback provided) */}
          {onAddToCart && isAvailable && (
            <button
              onClick={handleAddToCart}
              className={cn(
                'min-h-[44px] px-4 py-3 rounded-full font-semibold transition-all duration-200',
                'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700',
                'hover:shadow-md active:scale-95',
                'focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:ring-offset-2'
              )}
              aria-label={`Добави ${product.name} в количката`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6H19" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
} 