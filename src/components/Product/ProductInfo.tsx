'use client'

import { motion } from 'framer-motion'
import { Star, Check, ShieldCheck, Truck, RefreshCw } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { useCartStore } from '@/store/cartStore'
import type { ProductWithRelations } from '@/types/supabase'

interface ProductInfoProps {
  product: ProductWithRelations
}

/**
 * ProductInfo component - Product details with psychology-driven design
 * Features pricing, trust signals, stock status, and CTA
 */
export function ProductInfo({ product }: ProductInfoProps) {
  const { toast } = useToast()
  const { addItem } = useCartStore()

  // Price formatting
  const currentPrice = new Intl.NumberFormat('bg-BG', {
    style: 'currency',
    currency: 'BGN',
  }).format(product.price)

  const oldPrice = product.compare_price ? new Intl.NumberFormat('bg-BG', {
    style: 'currency',
    currency: 'BGN',
  }).format(product.compare_price) : null

  const discountPercent = product.compare_price 
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null

  // Stock status
  const isInStock = product.stock > 0
  const isLowStock = product.stock > 0 && product.stock <= 5

  // Rating (placeholder - you might want to implement reviews)
  const rating = 4.5
  const reviewCount = 23

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.images?.[0]?.url || '/placeholder-product.jpg',
      stock: product.stock
    })

    toast({
      title: '✔ Добавено',
      description: `${product.name} е добавено във вашата количка`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Brand Logo/Name */}
      {product.brand && (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-xs font-bold text-gray-600">
              {product.brand.name.charAt(0)}
            </span>
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {product.brand.name}
          </span>
        </div>
      )}

      {/* Product Name */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
          {product.name}
        </h1>
        
        {/* Short tagline/description */}
        {product.short_description && (
          <p className="text-lg text-muted-foreground mt-2">
            {product.short_description}
          </p>
        )}
      </div>

      {/* Rating & Reviews */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-5 h-5 ${
                star <= rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-sm font-medium text-foreground ml-2">
            {rating}
          </span>
        </div>
        <span className="text-sm text-muted-foreground">
          ({reviewCount} отзива)
        </span>
      </div>

      {/* Price Block */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-2xl border border-red-100">
        <div className="flex items-end space-x-4">
          <div className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            {currentPrice}
          </div>
          
          {oldPrice && (
            <div className="flex flex-col items-start">
              <div className="text-lg text-muted-foreground line-through">
                {oldPrice}
              </div>
              {discountPercent && (
                <div className="bg-primary text-white text-sm font-bold px-2 py-1 rounded-lg">
                  -{discountPercent}%
                </div>
              )}
            </div>
          )}
        </div>

        {/* Savings highlight */}
        {oldPrice && discountPercent && (
          <div className="mt-2 text-sm font-medium text-green-600">
                         ✨ Спестявате {new Intl.NumberFormat('bg-BG', {
               style: 'currency',
               currency: 'BGN',
             }).format(product.compare_price! - product.price)}
          </div>
        )}
      </div>

      {/* Stock Status */}
      <div className="flex items-center space-x-3">
        {isInStock ? (
          <>
            <div className="flex items-center space-x-2 text-green-600">
              <Check className="w-5 h-5" />
              <span className="font-medium">В наличност</span>
            </div>
            {isLowStock && (
              <span className="bg-orange-100 text-orange-800 text-sm font-medium px-2 py-1 rounded-lg">
                Остават {product.stock} бр.
              </span>
            )}
          </>
        ) : (
          <div className="flex items-center space-x-2 text-red-600">
            <span className="w-5 h-5 flex items-center justify-center">✕</span>
            <span className="font-medium">Няма наличност</span>
          </div>
        )}
      </div>

      {/* Trust Signals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="font-medium text-sm">3 години</div>
            <div className="text-xs text-muted-foreground">гаранция</div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Truck className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="font-medium text-sm">Експресна</div>
            <div className="text-xs text-muted-foreground">доставка</div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="font-medium text-sm">14 дни</div>
            <div className="text-xs text-muted-foreground">връщане</div>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <motion.button
        onClick={handleAddToCart}
        disabled={!isInStock}
        className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-200 ${
          isInStock
            ? 'bg-primary hover:bg-primary/90 active:bg-primary/80 text-white shadow-lg hover:shadow-xl'
            : 'bg-border text-foreground/30 cursor-not-allowed'
        }`}
        whileHover={isInStock ? { scale: 1.02 } : {}}
        whileTap={isInStock ? { scale: 0.98 } : {}}
        aria-label={`Добави в количката – ${product.name}`}
      >
        {isInStock ? 'Добави в количката' : 'Няма наличност'}
      </motion.button>

      {/* SKU and Category */}
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-4 border-t border-gray-200">
        {product.sku && (
          <div>
            <span className="font-medium">Каталожен номер:</span> {product.sku}
          </div>
        )}
        {product.category && (
          <div>
            <span className="font-medium">Категория:</span> {product.category.name}
          </div>
        )}
      </div>
    </div>
  )
} 