'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ProductImage } from '@/types/supabase'

interface ProductGalleryProps {
  images: ProductImage[]
  productName: string
}

/**
 * Enhanced ProductGallery for product detail pages
 * Features main display with thumbnail rail and navigation arrows
 */
export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

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
    url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=600&fit=crop',
    alt_text: `${productName} - изображение`,
    sort_order: 0,
    is_primary: true,
    created_at: '',
    updated_at: ''
  }]

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % displayImages.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={displayImages[currentIndex].url}
              alt={displayImages[currentIndex].alt_text || `${productName} - изображение ${currentIndex + 1}`}
              fill
              className="object-contain p-8"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={currentIndex === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows - Only show if multiple images */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              aria-label="Предишно изображение"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              aria-label="Следващо изображение"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {displayImages.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
            {currentIndex + 1} / {displayImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail Rail - Only show if multiple images */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-4 xl:grid-cols-6 gap-2">
          {displayImages.map((image, index) => (
            <motion.button
              key={image.id}
              onClick={() => goToSlide(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === currentIndex
                  ? 'border-primary shadow-lg ring-2 ring-primary/20'
                  : 'border-transparent hover:border-gray-300'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src={image.url}
                alt={image.alt_text || `${productName} - миниатюра ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
              
              {/* Overlay for non-selected thumbnails */}
              {index !== currentIndex && (
                <div className="absolute inset-0 bg-white/30" />
              )}
            </motion.button>
          ))}
        </div>
      )}

      {/* Mobile Swipe Indicator */}
      {displayImages.length > 1 && (
        <div className="flex justify-center space-x-2 md:hidden">
          {displayImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-primary scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Покажи изображение ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
} 