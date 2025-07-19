'use client';

import { useState, forwardRef } from 'react'
import Image, { ImageProps } from 'next/image'
import { ExclamationTriangleIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

/**
 * Production-Grade SafeImage Component
 * 
 * Enhanced Image component with bulletproof error handling for Vercel deployment.
 * Handles all edge cases: broken URLs, network failures, CORS issues.
 */

interface SafeImageProps extends Omit<ImageProps, 'onError' | 'onLoad'> {
  fallbackSrc?: string
  showFallbackIcon?: boolean
  fallbackClassName?: string
  loadingClassName?: string
  errorClassName?: string
  onLoad?: () => void
  onError?: () => void
}

export const SafeImage = forwardRef<HTMLImageElement, SafeImageProps>(
  (
    {
      src,
      alt,
      className,
      fallbackSrc = '/images/placeholder-product.svg',
      showFallbackIcon = true,
      fallbackClassName,
      loadingClassName,
      errorClassName,
      onLoad,
      onError,
      ...props
    },
    ref
  ) => {
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)
    const [currentSrc, setCurrentSrc] = useState(src)
    const [retryCount, setRetryCount] = useState(0)
  
    // Helper function to determine if this is a real image URL vs placeholder
    const isRealImageUrl = (url: string) => {
      if (!url || typeof url !== 'string') return false
      return url.startsWith('http') || url.startsWith('https') || url.startsWith('/')
    }

    // Handle successful image load
    const handleLoad = () => {
      setIsLoading(false)
      setHasError(false)
      setRetryCount(0) // Reset retry count on successful load
      onLoad?.()
    }

    // Enhanced error handling with retry logic
    const handleError = () => {
      setIsLoading(false)
      onError?.()
      
      // First try: use fallback if different from current
      if (fallbackSrc && currentSrc !== fallbackSrc && retryCount === 0) {
        setCurrentSrc(fallbackSrc)
        setIsLoading(true)
        setHasError(false)
        setRetryCount(1)
        return
      }
      
      // Second try: use default placeholder if not already tried
      const defaultPlaceholder = '/images/default-product.jpg'
      if (currentSrc !== defaultPlaceholder && retryCount === 1) {
        setCurrentSrc(defaultPlaceholder)
        setIsLoading(true)
        setHasError(false)
        setRetryCount(2)
        return
      }
      
      // Final fallback: show error state
      setHasError(true)
    }

    // Final error state - show placeholder content
    if (hasError || !isRealImageUrl(String(currentSrc))) {
      return (
        <div
          className={cn(
            'flex items-center justify-center bg-gray-100 text-gray-400',
            'min-h-[200px] w-full', // Ensure minimum size
            fallbackClassName,
            className
          )}
        >
          {showFallbackIcon ? (
            <div className="flex flex-col items-center justify-center p-4">
              <PhotoIcon className="h-8 w-8 mb-2" />
              <span className="text-xs text-center">Няма изображение</span>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <ExclamationTriangleIcon className="h-6 w-6" />
            </div>
          )}
        </div>
      )
    }

    return (
      <Image
        ref={ref}
        src={currentSrc}
        alt={alt || 'Product image'}
        className={cn(
          'transition-opacity duration-200',
          isLoading && 'opacity-0',
          !isLoading && !hasError && 'opacity-100',
          isLoading && loadingClassName,
          hasError && errorClassName,
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        // Enhanced props for better loading
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        {...props}
      />
    )
  }
)

SafeImage.displayName = 'SafeImage'

export default SafeImage

// Additional export for backwards compatibility
export const ProductImagePlaceholder = ({ className, ...props }: any) => (
  <div className={cn('bg-gray-100 flex items-center justify-center', className)} {...props}>
    <PhotoIcon className="h-8 w-8 text-gray-400" />
  </div>
)

export const ProductImageError = ({ className, ...props }: any) => (
  <div className={cn('bg-red-50 flex items-center justify-center', className)} {...props}>
    <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
  </div>
) 