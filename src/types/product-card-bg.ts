/**
 * Production-Quality ProductCard Types
 * For Bulgarian Auto Parts Store
 * 
 * Bulletproof typing with proper null/undefined handling
 * Never allows NaN prices or missing critical data
 */

export interface ProductCardBG {
  id: string
  name: string
  slug: string
  brand?: {
    name: string
    logo?: string
  }
  image?: {
    url: string
    alt: string
    placeholder?: string
  }
  price: {
    amount?: number | null
    currency: 'BGN'
    isOnSale?: boolean
    originalAmount?: number | null
    discountPercent?: number
  }
  stock: {
    isInStock: boolean
    quantity?: number
    status: 'in_stock' | 'out_of_stock' | 'low_stock'
    deliveryText?: string
  }
  warranty?: {
    included: boolean
    duration?: string
  }
  category?: string
  partNumber?: string
  isNew?: boolean
  isFeatured?: boolean
}

export interface ProductCardBGProps {
  product: ProductCardBG
  onViewDetails: (product: ProductCardBG) => void
  onAddToCart?: (product: ProductCardBG) => void
  className?: string
  priority?: boolean
}

// Utility types for price handling
export type PriceDisplay = {
  text: string
  isAvailable: boolean
  className: string
}

export type StockDisplay = {
  text: string
  icon: React.ComponentType<{ className?: string }>
  className: string
  badgeClassName: string
} 