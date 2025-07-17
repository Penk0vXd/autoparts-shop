/**
 * ProductCard Component Exports
 * 
 * Contains all ProductCard variations:
 * - Original ProductCard (full-featured)
 * - MVP ProductCard (simplified)
 * - Bulgarian ProductCard (bulletproof)
 */

// Original ProductCard exports
export { default as ProductCard } from './ProductCard'
export { default as ProductGallery } from './ProductGallery'
export { default as ProductGrid } from './ProductGrid'

// MVP Product Card exports
export { MVPProductCard } from './MVPProductCard'
export { MVPProductGrid } from './MVPProductGrid' 
export { MVPProductCardDemo } from './MVPProductCardDemo'

// Bulgarian ProductCard exports (Production-Ready)
export { ProductCardBG } from './ProductCardBG'
export { ProductCardBGDemo } from './ProductCardBGDemo'

// Re-export types for convenience
export type { ProductCardProps, ProductCardData, ProductCardState } from '@/types/product-card'
export type { MVPProductCardProps, MVPProductCardData, MVPProductGridProps } from '@/types/mvp-product-card'
export type { ProductCardBGProps, ProductCardBG as ProductCardBGType } from '@/types/product-card-bg'

// Re-export SafeImage utilities
export { SafeImage, ProductImagePlaceholder, ProductImageError } from '@/components/ui/SafeImage' 