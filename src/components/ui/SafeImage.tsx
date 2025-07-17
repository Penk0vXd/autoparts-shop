'use client';

import { useState, forwardRef } from 'react'
import Image, { ImageProps } from 'next/image'
import { ExclamationTriangleIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

/**
 * SafeImage Component
 * 
 * Enhanced Image component with error handling, loading states, and fallback support.
 * Designed for product images in auto parts catalog.
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
      fallbackSrc = '/images/placeholder-product.jpg',
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

    // Handle successful image load
    const handleLoad = () => {
      setIsLoading(false)
      setHasError(false)
      onLoad?.()
    }

    // Handle image error
    const handleError = () => {
      setIsLoading(false)
      setHasError(true)
      onError?.()
      
      // Try fallback image if available and not already tried
      if (fallbackSrc && currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc)
        setIsLoading(true)
        setHasError(false)
        return
      }
    }

    // Show fallback content if image failed to load
    if (hasError && currentSrc === fallbackSrc) {
      return (
        <div
          className={cn(
            'flex items-center justify-center bg-gray-100 text-gray-400',
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
        alt={alt}
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
        {...props}
      />
    )
  }
)

SafeImage.displayName = 'SafeImage'

/**
 * ProductImagePlaceholder Component
 * 
 * Placeholder component for product images with loading state
 */
interface ProductImagePlaceholderProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function ProductImagePlaceholder({ 
  className, 
  size = 'md' 
}: ProductImagePlaceholderProps) {
  const sizeClasses = {
    sm: 'h-32 w-32',
    md: 'h-48 w-48',
    lg: 'h-64 w-64'
  }

  return (
    <div className={cn(
      'flex items-center justify-center bg-gray-100 text-gray-400 rounded-lg',
      sizeClasses[size],
      className
    )}>
      <div className="flex flex-col items-center justify-center p-4">
        <PhotoIcon className="h-8 w-8 mb-2" />
        <span className="text-xs text-center">Зарежда се...</span>
      </div>
    </div>
  )
}

/**
 * ProductImageError Component
 * 
 * Error state component for product images
 */
interface ProductImageErrorProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  message?: string
}

export function ProductImageError({ 
  className, 
  size = 'md',
  message = 'Грешка при зареждане'
}: ProductImageErrorProps) {
  const sizeClasses = {
    sm: 'h-32 w-32',
    md: 'h-48 w-48',
    lg: 'h-64 w-64'
  }

  return (
    <div className={cn(
      'flex items-center justify-center bg-red-50 text-red-400 rounded-lg border border-red-200',
      sizeClasses[size],
      className
    )}>
      <div className="flex flex-col items-center justify-center p-4">
        <ExclamationTriangleIcon className="h-8 w-8 mb-2" />
        <span className="text-xs text-center">{message}</span>
      </div>
    </div>
  )
} 