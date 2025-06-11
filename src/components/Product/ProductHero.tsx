'use client'

import { motion } from 'framer-motion'
import type { ProductWithRelations } from '@/types/supabase'
import { ProductGallery } from './ProductGallery'
import { ProductInfo } from './ProductInfo'

interface ProductHeroProps {
  product: ProductWithRelations
}

/**
 * ProductHero component - Main product display with gallery and info
 * Two-column layout on desktop, stacked on mobile
 */
export function ProductHero({ product }: ProductHeroProps) {
  return (
    <motion.section 
      className="grid gap-12 lg:grid-cols-2 mb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Product Gallery */}
      <div className="order-1 lg:order-1">
        <ProductGallery 
          images={product.images || []}
          productName={product.name}
        />
      </div>

      {/* Product Information */}
      <div className="order-2 lg:order-2">
        <ProductInfo product={product} />
      </div>
    </motion.section>
  )
} 