'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { CheckIcon, ClockIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { MVPProductCardProps } from '@/types/mvp-product-card'

/**
 * MVP Product Card - God-Mode Version
 * 
 * World-class product card designed for Bulgarian automotive parts store.
 * Focused on conversion, trust-building, and mobile-first UX.
 * 
 * ✅ Core Features:
 * - Clean, conversion-optimized design
 * - Bulgarian localization throughout
 * - Mobile-first responsive layout
 * - Trust-building availability badges
 * - Clear compatibility messaging
 * - Premium hover effects
 * - Accessible 44px+ touch targets
 * - High-performance image loading
 * 
 * @author God of Programming
 * @version 1.0.0
 */
export function MVPProductCard({ 
  product, 
  onViewDetails, 
  className, 
  priority = false 
}: MVPProductCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Format price in Bulgarian format
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('bg-BG', {
      style: 'currency',
      currency: 'BGN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price).replace('BGN', 'лв.')
  }

  // Get availability badge config
  const getAvailabilityConfig = () => {
    const configs = {
      in_stock: {
        icon: CheckIcon,
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        borderColor: 'border-green-200'
      },
      out_of_stock: {
        icon: XMarkIcon,
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        borderColor: 'border-red-200'
      },
      coming_soon: {
        icon: ClockIcon,
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        borderColor: 'border-yellow-200'
      }
    }
    return configs[product.availability.status]
  }

  // Handle image loading
  const handleImageLoad = () => {
    setIsImageLoaded(true)
  }

  // Handle image error
  const handleImageError = () => {
    setImageError(true)
  }

  // Handle view details
  const handleViewDetails = () => {
    onViewDetails(product)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleViewDetails()
    }
  }

  const availabilityConfig = getAvailabilityConfig()
  const AvailabilityIcon = availabilityConfig.icon
  const isAvailable = product.availability.status === 'in_stock'

  return (
    <div
      className={cn(
        // Base styles
        'group relative bg-white border border-gray-200 rounded-lg overflow-hidden',
        // Shadows and hover effects
        'shadow-md hover:shadow-xl transition-all duration-300 ease-out',
        // Transform effects
        'hover:-translate-y-1 hover:scale-[1.02]',
        // Focus styles
        'focus-within:ring-2 focus-within:ring-red-500/20 focus-within:ring-offset-2',
        // Cursor
        'cursor-pointer',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleViewDetails}
      onKeyDown={handleKeyDown}
      role="article"
      tabIndex={0}
      aria-label={`${product.name} - ${formatPrice(product.price.current)}`}
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {!imageError ? (
          <Image
            src={product.image.url}
            alt={product.image.alt}
            fill
            className={cn(
              'object-cover object-center transition-all duration-500',
              isImageLoaded ? 'opacity-100' : 'opacity-0',
              isHovered ? 'scale-105' : 'scale-100'
            )}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={priority}
            onLoad={handleImageLoad}
            onError={handleImageError}
            placeholder={product.image.blurDataURL ? 'blur' : 'empty'}
            blurDataURL={product.image.blurDataURL}
          />
        ) : (
          // Error state
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">Няма изображение</span>
            </div>
          </div>
        )}

        {/* Loading placeholder */}
        {!isImageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}

        {/* Product badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.isNew && (
            <span className="inline-flex items-center px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
              Ново
            </span>
          )}
          {product.isOnSale && product.price.discountPercent && (
            <span className="inline-flex items-center px-2 py-1 bg-red-600 text-white text-xs font-semibold rounded-full">
              -{product.price.discountPercent}%
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Brand */}
        {product.brand && (
          <div className="flex items-center gap-2">
            {product.brand.logo && (
              <img 
                src={product.brand.logo} 
                alt={product.brand.name}
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

        {/* Compatibility */}
        <div className="flex items-center gap-2">
          <CheckIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span className="text-sm font-medium text-green-600 line-clamp-1">
            {product.compatibility.displayText}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-900">
            {formatPrice(product.price.current)}
          </span>
          {product.price.isOnSale && product.price.original && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.price.original)}
            </span>
          )}
        </div>

        {/* Availability */}
        <div className="flex items-center gap-2">
          <span className={cn(
            'inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border',
            availabilityConfig.bgColor,
            availabilityConfig.textColor,
            availabilityConfig.borderColor
          )}>
            <AvailabilityIcon className="w-4 h-4" />
            {product.availability.text}
          </span>
          {product.availability.deliveryTime && (
            <span className="text-sm text-gray-600">
              • {product.availability.deliveryTime}
            </span>
          )}
        </div>

        {/* CTA Button */}
        <button
          onClick={handleViewDetails}
          className={cn(
            'w-full min-h-[44px] px-4 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800',
            'text-white font-semibold rounded-full transition-all duration-200',
            'hover:shadow-lg hover:shadow-red-500/25 active:scale-95',
            'focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2',
            // Disabled state for out of stock
            !isAvailable && 'opacity-75 cursor-not-allowed'
          )}
          disabled={!isAvailable}
          aria-label={`Виж детайли за ${product.name}`}
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Виж детайли
          </span>
        </button>
      </div>
    </div>
  )
} 