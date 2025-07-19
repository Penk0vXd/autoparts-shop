/**
 * Image Fallback System for Production
 * 
 * Provides bulletproof image fallback handling for Vercel deployment
 */

export const IMAGE_FALLBACKS = {
  // Product category fallbacks
  'brake-pads': '/images/products/brake-pads-bmw-001-1.jpg',
  'oil-filter': '/images/products/oil-filter-mercedes-002-1.jpg',
  'air-filter': '/images/products/air-filter-volkswagen-004-1.jpg',
  'spark-plugs': '/images/products/spark-plugs-audi-003-1.jpg',
  'shock-absorber': '/images/products/shock-absorber-opel-005-1.jpg',
  'battery': '/images/products/battery-toyota-006-1.jpg',
  'wiper': '/images/products/universal-wiper-007-1.jpg',
  'clutch': '/images/products/clutch-kit-ford-008-1.jpg',
  
  // Default fallbacks (ordered by preference)
  default: '/images/placeholder-product.svg',
  productDefault: '/images/default-product.jpg',
  brandDefault: '/images/default-brand-logo.png',
  
  // Brand logo fallbacks
  brands: {
    'audi': '/logos/audi.png',
    'bmw': '/logos/bmw.png',
    'mercedes-benz': '/logos/mercedes-benz.png',
    'volkswagen': '/logos/volkswagen.png',
    'toyota': '/logos/toyota.png',
    'ford': '/logos/ford.png',
    'honda': '/logos/honda.png',
    'nissan': '/logos/nissan.png',
  }
} as const

/**
 * Get the best fallback image for a product based on its name/category
 */
export function getProductImageFallback(productName: string): string {
  const name = productName.toLowerCase()
  
  // Try to match product category
  if (name.includes('brake') || name.includes('спирач')) {
    return IMAGE_FALLBACKS['brake-pads']
  }
  if (name.includes('oil') || name.includes('масло')) {
    return IMAGE_FALLBACKS['oil-filter']
  }
  if (name.includes('air') || name.includes('въздуш')) {
    return IMAGE_FALLBACKS['air-filter']
  }
  if (name.includes('spark') || name.includes('свещ')) {
    return IMAGE_FALLBACKS['spark-plugs']
  }
  if (name.includes('shock') || name.includes('амортис')) {
    return IMAGE_FALLBACKS['shock-absorber']
  }
  if (name.includes('battery') || name.includes('акумулатор')) {
    return IMAGE_FALLBACKS.battery
  }
  if (name.includes('wiper') || name.includes('чистачк')) {
    return IMAGE_FALLBACKS.wiper
  }
  if (name.includes('clutch') || name.includes('съединител')) {
    return IMAGE_FALLBACKS.clutch
  }
  
  // Default fallback
  return IMAGE_FALLBACKS.default
}

/**
 * Get brand logo fallback
 */
export function getBrandLogoFallback(brandSlug: string): string {
  const slug = brandSlug.toLowerCase()
  return IMAGE_FALLBACKS.brands[slug as keyof typeof IMAGE_FALLBACKS.brands] || IMAGE_FALLBACKS.brandDefault
}

/**
 * Validate if an image URL is likely to work
 */
export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false
  
  // Check if it's a valid URL format
  const urlPattern = /^(https?:\/\/|\/)/
  if (!urlPattern.test(url)) return false
  
  // Check for common image extensions
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i
  const hasExtension = imageExtensions.test(url)
  
  // Allow Unsplash and other known good domains without extension check
  const knownGoodDomains = [
    'images.unsplash.com',
    'unsplash.com',
    'cdn.example.com'
  ]
  
  const isKnownDomain = knownGoodDomains.some(domain => url.includes(domain))
  
  return hasExtension || isKnownDomain || url.startsWith('/')
}

/**
 * Get optimized image source with fallback chain
 */
export function getOptimizedImageSrc(
  originalSrc: string | null | undefined,
  productName?: string,
  brandSlug?: string
): string {
  // Try original source first
  if (originalSrc && isValidImageUrl(originalSrc)) {
    return originalSrc
  }
  
  // Try product category fallback
  if (productName) {
    return getProductImageFallback(productName)
  }
  
  // Try brand fallback
  if (brandSlug) {
    return getBrandLogoFallback(brandSlug)
  }
  
  // Final fallback
  return IMAGE_FALLBACKS.default
} 