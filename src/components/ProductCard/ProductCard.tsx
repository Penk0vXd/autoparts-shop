'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, ShoppingCart, Star } from 'lucide-react'
import type { ProductWithRelations } from '@/types/supabase'
import ProductGallery from './ProductGallery'

type ProductCardProps = {
  product: ProductWithRelations
  className?: string
}

/**
 * Enhanced ProductCard 2.0 - Conversion-optimized with psychology-driven design
 * Features multi-image gallery, trust cues, urgency indicators, and micro-interactions
 */
export function ProductCard({ product, className = '' }: ProductCardProps) {
  const t = useTranslations('products')
  const tCommon = useTranslations('common')

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('bg-BG', {
      style: 'currency',
      currency: 'BGN',
    }).format(price)
  }

  const hasDiscount = product.compare_price && product.compare_price > product.price
  const discountPercentage = hasDiscount ? Math.round(((product.compare_price! - product.price) / product.compare_price!) * 100) : 0
  const isLowStock = product.stock > 0 && product.stock < 5
  const isInStock = product.stock > 0

  return (
    <motion.div 
      className={`group relative flex flex-col rounded-3xl bg-surface shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-border ${className}`}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Image Gallery Section */}
      <Link href={`/products/${product.slug}`} className="block relative">
        <div className="relative overflow-hidden rounded-t-3xl">
          <ProductGallery 
            images={product.images || []} 
            productName={product.name}
            className="rounded-t-3xl"
          />
          
          {/* Badges Overlay */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
            {/* Discount Badge */}
            {hasDiscount && (
              <motion.span 
                className="bg-primary text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                -{discountPercentage}%
              </motion.span>
            )}
            
            {/* Top Product Badge */}
            {product.is_featured && (
              <motion.span 
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Star className="w-3 h-3 fill-current" />
                Топ
              </motion.span>
            )}
          </div>

          {/* Stock Urgency Badge */}
          {isLowStock && (
            <div className="absolute top-4 right-4 z-20">
              <motion.span 
                className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Остават {product.stock} бр.
              </motion.span>
            </div>
          )}
        </div>
      </Link>

      {/* Content Section */}
      <div className="flex flex-col flex-grow p-6">
        {/* Brand */}
        {product.brand && (
          <Link 
            href={`/brands/${product.brand.slug}`} 
            className="text-sm text-muted-foreground hover:text-primary uppercase tracking-wide font-medium transition-colors duration-200 mb-2"
          >
            {product.brand.name}
          </Link>
        )}

        {/* Product Name */}
        <Link href={`/products/${product.slug}`} className="block group-hover:text-primary transition-colors duration-200">
          <h3 className="font-bold text-foreground line-clamp-2 text-lg leading-tight">
            {product.name}
          </h3>
        </Link>

        {/* Short Description */}
        {product.short_description && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {product.short_description}
          </p>
        )}

        {/* Price Section with Psychology */}
        <div className="mt-4 flex items-end justify-between">
          <div className="flex flex-col">
            {/* Price Anchoring */}
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through mb-1">
                {formatPrice(product.compare_price!)}
              </span>
            )}
            <span className="text-2xl font-black text-primary tracking-tight">
              {formatPrice(product.price)}
            </span>
          </div>
          
          {/* Stock Status with Trust Cue */}
          <div className={`flex items-center gap-1 text-sm font-semibold ${
            isInStock ? 'text-green-600' : 'text-red-500'
          }`}>
            {isInStock && <Check className="w-4 h-4" />}
            {isInStock ? 'В наличност' : 'Изчерпан'}
          </div>
        </div>

        {/* CTA Button with Micro-interactions */}
        <motion.button
          disabled={!isInStock}
          whileTap={{ scale: 0.95 }}
          whileHover={{ 
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.2)",
            transition: { duration: 0.1 }
          }}
          className={`
            mt-6 w-full py-4 px-6 rounded-2xl font-bold text-sm
            transition-all duration-200 flex items-center justify-center gap-2
            ${isInStock
              ? 'bg-primary text-white hover:bg-primary/90 active:bg-primary/95 shadow-lg hover:shadow-xl'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
            }
          `}
          aria-label={`Добави в количката – ${product.name}`}
        >
          <ShoppingCart className="w-4 h-4" />
          {isInStock ? 'Добави в количката' : 'Няма в наличност'}
        </motion.button>
      </div>

      {/* Subtle Glow Effect on Hover */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  )
} 