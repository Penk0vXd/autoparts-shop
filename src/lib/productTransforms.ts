/**
 * Product data transformation utilities
 * Converts database product data into the format expected by ProductCard component
 */

export interface DatabaseProduct {
  id: string
  name: string
  price: number | null
  stock: number
  images?: string[]
  brand?: {
    name: string
    logo?: string
  }
  category?: {
    name: string
  }
  availability?: string
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface ProductCardProduct {
  id: string
  name: string
  price: {
    current: number | null
    original?: number | null
    isOnSale?: boolean
    discountPercent?: number
  }
  stock: number
  images?: Array<{
    url: string
    alt: string
    title?: string
    isPrimary?: boolean
  }>
  brand?: {
    name: string
    logo?: string
    isOriginal?: boolean
  }
  category?: {
    name: string
  }
  availability?: {
    status: 'in_stock' | 'out_of_stock' | 'pre_order' | 'coming_soon' | 'discontinued'
    deliveryTime?: string
    location?: string
  }
  compatibility?: {
    displayText?: string
    shortDisplayText?: string
    universalFit?: boolean
    vehicles?: Array<{
      make: string
      model: string
      year: string
    }>
  }
  rating?: {
    average: number
    count: number
  }
  isNew?: boolean
  isFeatured?: boolean
  isOnSale?: boolean
  shortDescription?: string
}

/**
 * Transforms a database product into ProductCard format
 */
export function transformDatabaseProduct(dbProduct: DatabaseProduct): ProductCardProduct {
  // Transform images
  const images = dbProduct.images?.map((imageUrl, index) => ({
    url: imageUrl,
    alt: dbProduct.name,
    title: dbProduct.name,
    isPrimary: index === 0
  }))

  // Determine availability status
  const getAvailabilityStatus = () => {
    if (!dbProduct.is_active) return 'discontinued'
    if (dbProduct.stock === 0) return 'out_of_stock'
    if (dbProduct.stock > 0) return 'in_stock'
    return 'out_of_stock'
  }

  // Transform compatibility - simple fallback for now
  const compatibility = {
    displayText: 'Проверка необходима',
    shortDisplayText: 'Проверка необходима',
    universalFit: false,
    vehicles: []
  }

  return {
    id: dbProduct.id,
    name: dbProduct.name,
    price: {
      current: dbProduct.price,
      isOnSale: false
    },
    stock: dbProduct.stock || 0,
    images,
    brand: dbProduct.brand ? {
      name: dbProduct.brand.name,
      logo: dbProduct.brand.logo,
      isOriginal: true
    } : undefined,
    category: dbProduct.category,
    availability: {
      status: getAvailabilityStatus(),
      deliveryTime: dbProduct.stock > 0 ? '1-2 работни дни' : 'При наличност'
    },
    compatibility,
    rating: {
      average: 4.5,
      count: 0
    },
    isNew: false,
    isFeatured: false,
    isOnSale: false,
    shortDescription: `${dbProduct.category?.name || 'Авточаст'} за ${dbProduct.brand?.name || 'различни марки'}`
  }
}

/**
 * Transforms an array of database products
 */
export function transformDatabaseProducts(dbProducts: DatabaseProduct[]): ProductCardProduct[] {
  return dbProducts.map(transformDatabaseProduct)
}

/**
 * Validates if a product has the minimum required data for display
 */
export function isValidProductForDisplay(product: ProductCardProduct): boolean {
  return !!(
    product.id &&
    product.name &&
    product.name.trim().length > 0
  )
}

/**
 * Filters valid products for display
 */
export function filterValidProductsForDisplay(products: ProductCardProduct[]): ProductCardProduct[] {
  return products.filter(isValidProductForDisplay)
} 