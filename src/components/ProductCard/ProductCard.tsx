'use client'

import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import Image from 'next/image'
import { 
  HeartIcon, 
  StarIcon, 
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  TruckIcon,
  InformationCircleIcon,
  EyeIcon,
  ShoppingCartIcon,
  CurrencyEuroIcon,
  TagIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { 
  HeartIcon as HeartIconSolid, 
  StarIcon as StarIconSolid,
  CheckIcon as CheckIconSolid
} from '@heroicons/react/24/solid'
import { cn } from '@/lib/utils'
import { 
  ProductCardProps, 
  ProductCardData, 
  ProductCardState,
  ProductCardRef,
  ProductAvailabilityStatus
} from '@/types/product-card'

/**
 * MVP Product Card Component
 * 
 * A world-class product card component designed for Bulgarian automotive parts store.
 * Transforms browsing into a trust-building, conversion-optimized experience.
 * 
 * ✅ Core Features:
 * - Product Name (Bulgarian, clear)
 * - Primary Image (high-quality, optimized)
 * - Price (with currency, clearly formatted)
 * - Compatibility note (e.g. "Подходящо за BMW 3 Series 2015-2020")
 * - Availability badge (e.g. "В наличност" / "Очаква се")
 * - CTA Button: "Виж детайли"
 * 
 * ✅ Design Excellence:
 * - Clean White (#FFFFFF) base, Premium Red (#D32F2F) for CTAs/highlights
 * - Rounded corners (8px radius minimum) for premium feel
 * - Subtle shadow to lift from background
 * - Hover State: Slight shadow increase, image zoom 1.02x
 * - Mobile-first responsive design
 * 
 * ✅ UX Principles:
 * - Visual hierarchy: Image dominant, price clearly visible
 * - Immediate compatibility reassurance
 * - Clear primary action: Single CTA only
 * - Accessibility: 44px minimum tap targets, ARIA labels in Bulgarian
 * 
 * @author God of Programming
 * @version 1.0.0
 */
export const ProductCard = forwardRef<ProductCardRef, ProductCardProps>(({
  product,
  onViewDetails,
  onAddToCart,
  onAddToWishlist,
  onQuickView,
  onCompatibilityCheck,
  className,
  size = 'md',
  layout = 'vertical',
  showQuickActions = true,
  showCompatibility = true,
  showRating = true,
  showBrand = true,
  showAvailability = true,
  showInstallments = false,
  showLocalPickup = false,
  enableHover = true,
  enableLazyLoading = true,
  priority = false,
  testId = 'product-card',
  selectedVehicle,
  isInWishlist = false,
  isInCart = false,
  showBadges = true,
  showQuickView = false,
  showAddToCart = false,
  maxNameLines = 2,
  maxDescriptionLines = 3,
  ariaLabel,
  ariaDescribedBy,
  colorScheme = 'default',
  borderRadius = 'md',
  shadowIntensity = 'md',
  hoverEffect = 'lift',
  imageAspectRatio = 'square'
}, ref) => {
  
  // Component state
  const [state, setState] = useState<ProductCardState>({
    isLoading: false,
    isImageLoaded: false,
    isHovered: false,
    isFocused: false,
    showQuickView: false,
    imageError: false,
    currentImageIndex: 0
  })
  
  // Refs for DOM manipulation
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const ctaButtonRef = useRef<HTMLButtonElement>(null)
  
  // Size-based styling
  const sizeClasses = {
    sm: {
      container: 'p-3',
      image: 'h-32',
      title: 'text-sm',
      price: 'text-base',
      button: 'px-3 py-2 text-sm',
      badge: 'px-2 py-1 text-xs'
    },
    md: {
      container: 'p-4',
      image: 'h-40',
      title: 'text-base',
      price: 'text-lg',
      button: 'px-4 py-3 text-base',
      badge: 'px-3 py-1 text-sm'
    },
    lg: {
      container: 'p-6',
      image: 'h-48',
      title: 'text-lg',
      price: 'text-xl',
      button: 'px-6 py-4 text-lg',
      badge: 'px-4 py-2 text-base'
    }
  }
  
  // Border radius classes
  const borderRadiusClasses = {
    sm: 'rounded-sm',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl'
  }
  
  // Shadow classes
  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  }
  
  // Hover effect classes
  const hoverEffectClasses = {
    lift: 'hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]',
    zoom: 'hover:scale-[1.02]',
    glow: 'hover:shadow-2xl hover:shadow-red-500/20',
    none: ''
  }
  
  const currentSize = sizeClasses[size]
  
  // Format price display with bulletproof error handling
  const formatPrice = (price: number | null | undefined, currency: string = 'BGN') => {
    // Handle null, undefined, NaN, or invalid prices
    if (price === null || price === undefined || isNaN(price) || price < 0) {
      return 'Цена при запитване'
    }
    
    try {
      return new Intl.NumberFormat('bg-BG', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(price).replace('BGN', 'лв.')
    } catch (error) {
      // Fallback if formatting fails
      return 'Цена при запитване'
    }
  }
  
  // Get availability display
  const getAvailabilityDisplay = (status: ProductAvailabilityStatus) => {
    const displays = {
      in_stock: { text: 'В наличност', color: 'bg-green-100 text-green-800', icon: CheckIconSolid },
      out_of_stock: { text: 'Изчерпан', color: 'bg-red-100 text-red-800', icon: XMarkIcon },
      pre_order: { text: 'Предварителна поръчка', color: 'bg-blue-100 text-blue-800', icon: ClockIcon },
      coming_soon: { text: 'Очаква се', color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
      discontinued: { text: 'Спрян', color: 'bg-gray-100 text-gray-800', icon: XMarkIcon }
    }
    return displays[status] || displays.out_of_stock
  }
  
  // Get compatibility display
  const getCompatibilityDisplay = () => {
    if (product.compatibility?.universalFit) {
      return {
        text: 'Универсални',
        color: 'text-blue-600',
        icon: CheckIconSolid
      }
    }
    
    if (product.compatibility?.vehicles?.length > 0) {
      const vehicle = product.compatibility?.vehicles?.[0]
      return {
        text: product.compatibility?.shortDisplayText || product.compatibility?.displayText || 'Съвместим',
        color: 'text-green-600',
        icon: CheckIconSolid
      }
    }
    
    return {
      text: 'Проверка необходима',
      color: 'text-orange-600',
      icon: InformationCircleIcon
    }
  }
  
  // Generate rating stars
  const generateStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => {
      const isFilled = i < Math.floor(rating)
      const isHalfFilled = i === Math.floor(rating) && rating % 1 !== 0
      
      return (
        <StarIcon
          key={i}
          className={cn(
            'h-4 w-4',
            isFilled ? 'text-yellow-400 fill-current' : 'text-gray-300'
          )}
        />
      )
    })
  }
  
  // Handle image load
  const handleImageLoad = () => {
    setState(prev => ({ ...prev, isImageLoaded: true }))
  }
  
  // Handle image error
  const handleImageError = () => {
    setState(prev => ({ ...prev, imageError: true }))
  }
  
  // Handle hover states
  const handleMouseEnter = () => {
    if (enableHover) {
      setState(prev => ({ ...prev, isHovered: true }))
    }
  }
  
  const handleMouseLeave = () => {
    if (enableHover) {
      setState(prev => ({ ...prev, isHovered: false }))
    }
  }
  
  // Handle focus states
  const handleFocus = () => {
    setState(prev => ({ ...prev, isFocused: true }))
  }
  
  const handleBlur = () => {
    setState(prev => ({ ...prev, isFocused: false }))
  }
  
  // Handle view details
  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(product)
    }
  }
  
  // Handle add to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onAddToCart) {
      onAddToCart(product)
    }
  }
  
  // Handle add to wishlist
  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onAddToWishlist) {
      onAddToWishlist(product)
    }
  }
  
  // Handle quick view
  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onQuickView) {
      onQuickView(product)
    }
  }
  
  // Handle compatibility check
  const handleCompatibilityCheck = () => {
    if (onCompatibilityCheck) {
      onCompatibilityCheck(product)
    }
  }
  
  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    element: containerRef.current,
    focus: () => containerRef.current?.focus(),
    blur: () => containerRef.current?.blur(),
    refresh: () => {
      setState(prev => ({ ...prev, isLoading: true }))
      // Simulate refresh
      setTimeout(() => {
        setState(prev => ({ ...prev, isLoading: false }))
      }, 500)
    },
    addToCart: () => handleAddToCart({} as React.MouseEvent),
    addToWishlist: () => handleAddToWishlist({} as React.MouseEvent),
    checkCompatibility: handleCompatibilityCheck,
    openQuickView: () => handleQuickView({} as React.MouseEvent),
    viewDetails: handleViewDetails,
    trackEvent: (event) => {
      // Track analytics event
      console.log('Product card event:', event)
    },
    validate: () => ({
      isValid: true,
      errors: [],
      warnings: [],
      requiredFields: ['name', 'price', 'images'],
      optionalFields: ['description', 'rating', 'brand']
    }),
    getAnalytics: () => ({
      productId: product.id,
      impressions: 1,
      clicks: 0,
      conversions: 0,
      addToCartClicks: 0,
      wishlistClicks: 0,
      quickViewClicks: 0,
      compatibilityCheckClicks: 0,
      averageViewTime: 0,
      bounceRate: 0,
      conversionRate: 0,
      clickThroughRate: 0,
      events: []
    }),
    updateConfig: (config) => {
      // Update component configuration
      console.log('Product card config update:', config)
    }
  }), [product, handleAddToCart, handleAddToWishlist, handleCompatibilityCheck, handleQuickView, handleViewDetails])
  
  // Get primary image
  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0]
  
  // Get availability info
  const availabilityInfo = getAvailabilityDisplay(product.availability?.status || 'out_of_stock')
  
  // Get compatibility info
  const compatibilityInfo = getCompatibilityDisplay()
  
  // Check if product is available
  const isAvailable = product.availability?.status === 'in_stock'
  
  // Generate aspect ratio classes
  const aspectRatioClasses = {
    square: 'aspect-square',
    '4:3': 'aspect-[4/3]',
    '16:9': 'aspect-video',
    '3:2': 'aspect-[3/2]'
  }
  
  return (
    <div
      ref={containerRef}
      className={cn(
        'bg-white border border-gray-200 transition-all duration-300 cursor-pointer',
        borderRadiusClasses[borderRadius],
        shadowClasses[shadowIntensity],
        enableHover && hoverEffectClasses[hoverEffect],
        state.isFocused && 'ring-2 ring-red-500/20 ring-offset-2',
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={handleViewDetails}
      role="article"
      aria-label={ariaLabel || `${product.name} - ${formatPrice(product.price?.current)}`}
      aria-describedby={ariaDescribedBy}
      tabIndex={0}
      data-testid={testId}
    >
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <div 
          ref={imageRef}
          className={cn(
            'relative w-full bg-gray-100 transition-transform duration-300',
            aspectRatioClasses[imageAspectRatio],
            state.isHovered && hoverEffect === 'zoom' && 'scale-105'
          )}
        >
          {primaryImage && !state.imageError ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt}
              title={primaryImage.title}
              fill
              className="object-cover object-center"
              sizes={primaryImage.sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
              priority={priority}
              loading={priority ? 'eager' : 'lazy'}
              onLoad={handleImageLoad}
              onError={handleImageError}
              placeholder={primaryImage.blurDataURL ? 'blur' : 'empty'}
              blurDataURL={primaryImage.blurDataURL}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">Без изображение</span>
              </div>
            </div>
          )}
          
          {/* Image Loading Overlay */}
          {!state.isImageLoaded && !state.imageError && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse" />
          )}
        </div>
        
        {/* Product Badges */}
        {showBadges && (
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && (
              <span className={cn(
                'bg-blue-600 text-white font-semibold rounded-full',
                currentSize.badge
              )}>
                Ново
              </span>
            )}
            {product.isFeatured && (
              <span className={cn(
                'bg-purple-600 text-white font-semibold rounded-full',
                currentSize.badge
              )}>
                Препоръчано
              </span>
            )}
            {product.isOnSale && product.price?.discountPercent && (
              <span className={cn(
                'bg-red-600 text-white font-semibold rounded-full',
                currentSize.badge
              )}>
                -{product.price.discountPercent}%
              </span>
            )}
          </div>
        )}
        
        {/* Quick Actions */}
        {showQuickActions && (
          <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {/* Wishlist Button */}
            <button
              onClick={handleAddToWishlist}
              className="w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center hover:scale-110 active:scale-95"
              aria-label={isInWishlist ? 'Премахни от желания' : 'Добави в желания'}
            >
              {isInWishlist ? (
                <HeartIconSolid className="w-5 h-5 text-red-500" />
              ) : (
                <HeartIcon className="w-5 h-5 text-gray-600 hover:text-red-500" />
              )}
            </button>
            
            {/* Quick View Button */}
            {showQuickView && (
              <button
                onClick={handleQuickView}
                className="w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center hover:scale-110 active:scale-95"
                aria-label="Бърз преглед"
              >
                <EyeIcon className="w-5 h-5 text-gray-600 hover:text-blue-500" />
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className={cn('flex flex-col', currentSize.container)}>
        {/* Brand */}
        {showBrand && product.brand && (
          <div className="flex items-center gap-2 mb-2">
            {product.brand.logo && (
              <img 
                src={product.brand.logo} 
                alt={product.brand.name}
                className="w-6 h-6 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            )}
            <span className="text-sm text-gray-600 font-medium">{product.brand.name}</span>
            {product.brand.isOriginal && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Оригинална
              </span>
            )}
          </div>
        )}
        
        {/* Product Name */}
        <h3 className={cn(
          'font-semibold text-gray-900 mb-2 transition-colors duration-200',
          currentSize.title,
          `line-clamp-${maxNameLines}`,
          state.isHovered && 'text-red-600'
        )}>
          {product.name}
        </h3>
        
        {/* Short Description */}
        {product.shortDescription && (
          <p className={cn(
            'text-gray-600 mb-3 text-sm',
            `line-clamp-${maxDescriptionLines}`
          )}>
            {product.shortDescription}
          </p>
        )}
        
        {/* Compatibility */}
        {showCompatibility && (
          <div className="flex items-center gap-2 mb-3">
            <compatibilityInfo.icon className="w-4 h-4 text-green-600" />
            <span className={cn('text-sm font-medium', compatibilityInfo.color)}>
              {compatibilityInfo.text}
            </span>
          </div>
        )}
        
        {/* Rating */}
        {showRating && product.rating && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {generateStars(product.rating.average)}
            </div>
            <span className="text-sm text-gray-600">
              {product.rating.average.toFixed(1)} ({product.rating.count} отзива)
            </span>
          </div>
        )}
        
        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className={cn('font-bold text-gray-900', currentSize.price)}>
            {formatPrice(product.price?.current)}
          </span>
          {product.price?.original && product.price?.isOnSale && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.price.original)}
            </span>
          )}
        </div>
        
        {/* Installments */}
        {showInstallments && product.price?.installments && product.price.installments.length > 0 && (
          <div className="mb-4">
            <div className="text-sm text-gray-600">
              от {formatPrice(product.price.installments[0].monthlyPayment)} месечно
            </div>
          </div>
        )}
        
        {/* Availability */}
        {showAvailability && (
          <div className="flex items-center gap-2 mb-4">
            <span className={cn(
              'inline-flex items-center gap-1 rounded-full font-medium',
              currentSize.badge,
              availabilityInfo.color
            )}>
              <availabilityInfo.icon className="w-4 h-4" />
              {availabilityInfo.text}
            </span>
            {product.availability?.deliveryTime && (
              <span className="text-sm text-gray-600">
                • {product.availability?.deliveryTime}
              </span>
            )}
          </div>
        )}
        
        {/* Local Pickup */}
        {showLocalPickup && product.availability?.location && (
          <div className="flex items-center gap-2 mb-4">
            <TruckIcon className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-gray-600">
              Вземане от {product.availability?.location}
            </span>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          {/* Primary CTA - View Details */}
          <button
            ref={ctaButtonRef}
            onClick={handleViewDetails}
            className={cn(
              'flex-1 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold rounded-full transition-all duration-200 hover:shadow-lg active:scale-95',
              currentSize.button,
              'min-h-[44px]' // Accessibility: minimum 44px touch target
            )}
            aria-label={`Виж детайли за ${product.name}`}
          >
            Виж детайли
          </button>
          
          {/* Add to Cart (if enabled) */}
          {showAddToCart && isAvailable && (
            <button
              onClick={handleAddToCart}
              className={cn(
                'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 font-semibold rounded-full transition-all duration-200 hover:shadow-md active:scale-95',
                currentSize.button,
                'min-h-[44px]' // Accessibility: minimum 44px touch target
              )}
              aria-label={`Добави ${product.name} в количката`}
            >
              <ShoppingCartIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
})

ProductCard.displayName = 'ProductCard'

export default ProductCard 