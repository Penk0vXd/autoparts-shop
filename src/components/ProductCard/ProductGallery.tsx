'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import type { ProductImage } from '@/types/supabase'

interface ProductGalleryProps {
  images: ProductImage[]
  productName: string
  className?: string
  autoPlay?: boolean
  showDots?: boolean
}

/**
 * ProductGallery component for cycling through product images
 * Supports auto-play on hover, manual navigation, and swipe gestures
 */
export default function ProductGallery({ 
  images, 
  productName, 
  className = '',
  autoPlay = true,
  showDots = true
}: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Sort images by sort_order, primary first
  const sortedImages = [...images].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1
    if (!a.is_primary && b.is_primary) return 1
    return a.sort_order - b.sort_order
  })

  // Fallback to placeholder if no images
  const displayImages = sortedImages.length > 0 ? sortedImages : [{
    id: 'placeholder',
    product_id: '',
    url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop',
    alt_text: `${productName} - изображение`,
    sort_order: 0,
    is_primary: true,
    created_at: '',
    updated_at: ''
  }]

  // Auto-cycle through images on hover
  useEffect(() => {
    if (!isHovered || !autoPlay || displayImages.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayImages.length)
    }, 1500) // Change image every 1.5 seconds

    return () => clearInterval(interval)
  }, [isHovered, autoPlay, displayImages.length])

  // Reset to first image when not hovering
  useEffect(() => {
    if (!isHovered && autoPlay) {
      setCurrentIndex(0)
    }
  }, [isHovered, autoPlay])

  const handleDotClick = (index: number) => {
    setCurrentIndex(index)
  }

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setCurrentIndex((prev) => (prev + 1) % displayImages.length)
    } else {
      setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)
    }
  }

  return (
    <div 
      className={`relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ 
            duration: 0.4,
            ease: [0.25, 0.25, 0, 1]
          }}
          className="absolute inset-0"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={(_, info) => {
            const threshold = 50
            if (info.offset.x > threshold) {
              handleSwipe('right')
            } else if (info.offset.x < -threshold) {
              handleSwipe('left')
            }
          }}
        >
          <Image
            src={displayImages[currentIndex].url}
            alt={displayImages[currentIndex].alt_text || `${productName} - изображение ${currentIndex + 1}`}
            fill
            className="object-contain p-4 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={currentIndex === 0}
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none" />

      {/* Navigation dots - only show if multiple images and showDots is true */}
      {showDots && displayImages.length > 1 && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {displayImages.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-primary shadow-lg scale-125'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Покажи изображение ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image counter for accessibility */}
      {displayImages.length > 1 && (
        <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full z-10">
          {currentIndex + 1}/{displayImages.length}
        </div>
      )}
    </div>
  )
} 