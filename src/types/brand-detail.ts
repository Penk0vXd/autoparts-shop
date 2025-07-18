/**
 * Enhanced Brand Detail Types
 * Supreme full-stack architecture for premium brand experiences
 */

export interface EnhancedBrand {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  description: string | null;
  country: string;
  founded_year: number;
  is_premium: boolean;
  website_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BrandStatistics {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  country: string;
  founded_year: number;
  is_premium: boolean;
  website_url: string | null;
  sort_order: number;
  total_products: number;
  total_categories: number;
  avg_price: number;
  min_price: number;
  max_price: number;
  total_stock: number;
  in_stock_products: number;
  featured_products: number;
}

export interface BrandCategoryBreakdown {
  brand_id: string;
  brand_name: string;
  brand_slug: string;
  category_id: string;
  category_name: string;
  category_slug: string;
  category_description: string | null;
  product_count: number;
  avg_price: number;
  min_price: number;
  max_price: number;
  total_stock: number;
  in_stock_count: number;
}

export interface CategoryWithIcon extends BrandCategoryBreakdown {
  icon: string;
  order: number;
}

export interface BrandDetailData {
  brand: BrandStatistics;
  categories: CategoryWithIcon[];
  sampleProducts: BrandProduct[];
  filters: BrandFilters;
}

export interface BrandProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_price: number | null;
  stock: number;
  image_url: string | null;
  category_name: string;
  category_slug: string;
  is_featured: boolean;
  availability: 'in_stock' | 'out_of_stock' | 'low_stock';
  specifications: Record<string, any>;
  compatibility: Record<string, any>;
}

export interface BrandFilters {
  sortBy: 'name' | 'price_low' | 'price_high' | 'newest' | 'popular';
  page: number;
  limit: number;
}

export interface BrandDetailFilters extends BrandFilters {
  category?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  fuelType?: string;
  engineType?: string;
  priceMin?: number;
  priceMax?: number;
  availability?: 'in_stock' | 'low_stock' | 'out_of_stock';
  partType?: 'oem' | 'aftermarket';
}

export interface BrandDetailResponse {
  success: boolean;
  data: BrandDetailData;
  meta: {
    totalProducts: number;
    totalCategories: number;
    lastUpdated: string;
  };
}

export interface BrandStatsResponse {
  success: boolean;
  data: BrandStatistics;
  meta: {
    generated_at: string;
    cache_duration: string;
  };
}

export interface BrandCategoriesResponse {
  success: boolean;
  data: CategoryWithIcon[];
  meta: {
    total_categories: number;
    total_products: number;
    generated_at: string;
  };
}

export interface BrandProductsResponse {
  success: boolean;
  data: BrandProduct[];
  brand: EnhancedBrand;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: BrandDetailFilters;
}

// Country flags mapping for premium display
export const COUNTRY_FLAGS: Record<string, string> = {
  'Germany': '🇩🇪',
  'Japan': '🇯🇵',
  'USA': '🇺🇸',
  'South Korea': '🇰🇷',
  'Sweden': '🇸🇪',
  'Italy': '🇮🇹',
  'France': '🇫🇷',
  'United Kingdom': '🇬🇧',
  'Spain': '🇪🇸',
  'Czech Republic': '🇨🇿',
  'Romania': '🇷🇴',
  'India': '🇮🇳',
  'China': '🇨🇳',
  'Unknown': '🌍'
};

// Category icons for visual appeal
export const CATEGORY_ICONS: Record<string, string> = {
  'engine': '🔧',
  'brakes': '🛑',
  'suspension': '🚗',
  'exhaust': '💨',
  'filters': '🔍',
  'oils': '🛢️',
  'electrical': '⚡',
  'lighting': '💡',
  'body': '🚙',
  'interior': '🪑',
  'wheels': '🛞',
  'tires': '🏁',
  'transmission': '⚙️',
  'cooling': '❄️',
  'fuel': '⛽',
  'ignition': '🔥',
  'sensors': '📡',
  'belts': '🔗',
  'gaskets': '🔒',
  'bearings': '⚪',
  'clutch': '🔄',
  'steering': '🎯',
  'windshield': '🪟',
  'mirrors': '🪞',
  'wipers': '🌧️',
  'tools': '🔨',
  'accessories': '✨',
  'maintenance': '🛠️',
  'performance': '🏎️',
  'safety': '🛡️',
  'default': '📦'
};

// Utility functions for brand display
export const formatPrice = (price: number | null): string => {
  if (!price) return 'N/A';
  return new Intl.NumberFormat('bg-BG', {
    style: 'currency',
    currency: 'BGN',
    minimumFractionDigits: 2
  }).format(price);
};

export const formatProductCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

export const getBrandAge = (foundedYear: number): number => {
  return new Date().getFullYear() - foundedYear;
};

export const getAvailabilityStatus = (stock: number): 'in_stock' | 'low_stock' | 'out_of_stock' => {
  if (stock === 0) return 'out_of_stock';
  if (stock <= 5) return 'low_stock';
  return 'in_stock';
};

export const getAvailabilityText = (availability: 'in_stock' | 'low_stock' | 'out_of_stock'): string => {
  switch (availability) {
    case 'in_stock':
      return 'В наличност';
    case 'low_stock':
      return 'Малко на склад';
    case 'out_of_stock':
      return 'Няма наличност';
    default:
      return 'Неизвестно';
  }
};

export const getAvailabilityColor = (availability: 'in_stock' | 'low_stock' | 'out_of_stock'): string => {
  switch (availability) {
    case 'in_stock':
      return 'bg-green-100 text-green-800';
    case 'low_stock':
      return 'bg-yellow-100 text-yellow-800';
    case 'out_of_stock':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const isPremiumBrand = (brand: BrandStatistics): boolean => {
  return brand.is_premium === true;
};

export const getBrandDisplayName = (brand: BrandStatistics): string => {
  return brand.name;
};

export const getBrandCountryFlag = (country: string): string => {
  return COUNTRY_FLAGS[country] || COUNTRY_FLAGS['Unknown'];
};

export const getCategoryIcon = (categorySlug: string): string => {
  return CATEGORY_ICONS[categorySlug] || CATEGORY_ICONS['default'];
};

export const formatBrandFoundedYear = (year: number): string => {
  return `Since ${year}`;
};

export const calculateDiscount = (price: number, comparePrice: number | null): number | null => {
  if (!comparePrice || comparePrice <= price) return null;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
};

export const formatDiscountPercent = (discount: number): string => {
  return `-${discount}%`;
};

export const getPriceRange = (categories: CategoryWithIcon[]): { min: number; max: number } => {
  if (categories.length === 0) return { min: 0, max: 0 };
  
  const allPrices = categories.flatMap(cat => [cat.min_price, cat.max_price]);
  return {
    min: Math.min(...allPrices),
    max: Math.max(...allPrices)
  };
};

export const sortBrandsByPremium = (brands: BrandStatistics[]): BrandStatistics[] => {
  return [...brands].sort((a, b) => {
    // Premium brands first
    if (a.is_premium && !b.is_premium) return -1;
    if (!a.is_premium && b.is_premium) return 1;
    
    // Then by sort order
    if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
    
    // Finally by name
    return a.name.localeCompare(b.name);
  });
};

export const filterCategoriesByStock = (categories: CategoryWithIcon[], onlyInStock: boolean = false): CategoryWithIcon[] => {
  if (!onlyInStock) return categories;
  return categories.filter(cat => cat.in_stock_count > 0);
};

export const getBrandTrustScore = (brand: BrandStatistics): number => {
  let score = 0;
  
  // Age factor (older brands are more trustworthy)
  const age = getBrandAge(brand.founded_year);
  score += Math.min(age / 100, 0.3) * 100; // Max 30 points for age
  
  // Product variety factor
  score += Math.min(brand.total_categories / 20, 0.25) * 100; // Max 25 points for variety
  
  // Premium factor
  if (brand.is_premium) score += 20;
  
  // Stock availability factor
  const stockRatio = brand.total_stock > 0 ? brand.in_stock_products / brand.total_products : 0;
  score += stockRatio * 25; // Max 25 points for stock availability
  
  return Math.round(Math.min(score, 100));
};

export const getBrandTrustBadge = (trustScore: number): { text: string; color: string } => {
  if (trustScore >= 90) return { text: 'Excellent', color: 'bg-green-100 text-green-800' };
  if (trustScore >= 80) return { text: 'Very Good', color: 'bg-blue-100 text-blue-800' };
  if (trustScore >= 70) return { text: 'Good', color: 'bg-yellow-100 text-yellow-800' };
  if (trustScore >= 60) return { text: 'Fair', color: 'bg-orange-100 text-orange-800' };
  return { text: 'Poor', color: 'bg-red-100 text-red-800' };
};

// SEO and Meta utilities
export const generateBrandSEOTitle = (brand: BrandStatistics): string => {
  return `${brand.name} Car Parts - Over ${formatProductCount(brand.total_products)} Auto Parts | AutoParts BG`;
};

export const generateBrandSEODescription = (brand: BrandStatistics): string => {
  return `Buy genuine and aftermarket ${brand.name} car parts online. Premium quality parts from ${brand.country}, established ${brand.founded_year}. Fast delivery across Bulgaria.`;
};

export const generateBrandKeywords = (brand: BrandStatistics): string[] => {
  return [
    `${brand.name} parts`,
    `${brand.name} auto parts`,
    `${brand.name} car parts Bulgaria`,
    'genuine parts',
    'aftermarket parts',
    'automotive parts',
    'car accessories',
    `${brand.name} ${brand.country}`
  ];
};

export const generateBrandStructuredData = (brand: BrandStatistics, products: BrandProduct[]): object => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: brand.name,
    url: brand.website_url || `${process.env.NEXT_PUBLIC_SITE_URL}/brands/${brand.slug}`,
    logo: brand.logo_url,
    foundingDate: brand.founded_year.toString(),
    address: {
      '@type': 'PostalAddress',
      addressCountry: brand.country
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${brand.name} Car Parts`,
      itemListElement: products.slice(0, 5).map((product, index) => ({
        '@type': 'Offer',
        position: index + 1,
        name: product.name,
        price: product.price,
        priceCurrency: 'BGN',
        availability: product.availability === 'in_stock' 
          ? 'https://schema.org/InStock' 
          : 'https://schema.org/OutOfStock',
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`
      }))
    }
  };
};

// Animation and UI utilities
export const SHIMMER_ANIMATION_DURATION = 1500; // ms
export const PREMIUM_GRADIENT_COLORS = 'from-yellow-400 to-yellow-600';
export const TRUST_BADGE_COLORS = {
  excellent: 'from-green-400 to-green-600',
  good: 'from-blue-400 to-blue-600',
  fair: 'from-yellow-400 to-yellow-600',
  poor: 'from-red-400 to-red-600'
};

export const DEFAULT_BRAND_LOGO = '/images/default-brand-logo.png';
export const DEFAULT_PRODUCT_IMAGE = '/images/default-product.jpg';

// Type guards
export const isBrandStatistics = (obj: any): obj is BrandStatistics => {
  return obj && typeof obj === 'object' && 'total_products' in obj && 'total_categories' in obj;
};

export const isBrandProduct = (obj: any): obj is BrandProduct => {
  return obj && typeof obj === 'object' && 'availability' in obj && 'category_name' in obj;
};

export const isCategoryWithIcon = (obj: any): obj is CategoryWithIcon => {
  return obj && typeof obj === 'object' && 'icon' in obj && 'product_count' in obj;
}; 