/**
 * Feature flags configuration for MVP mode
 * Allows easy toggling of features without deleting code
 */
export const FEATURES = {
  // Product-related features - DISABLED for MVP
  products: false,
  productSearch: false,
  productCategories: false,
  productCatalog: false,
  shoppingCart: false,
  vehicleSelector: false,
  
  // Core MVP features - ENABLED
  brands: true,
  inquiry: true,
  contact: true,
  about: true,
  reviews: true,
  
  // Admin features
  admin: true,
  adminRequests: true,
} as const

export type FeatureFlag = keyof typeof FEATURES

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: FeatureFlag): boolean {
  return FEATURES[feature]
}

/**
 * Get all enabled features
 */
export function getEnabledFeatures(): FeatureFlag[] {
  return Object.entries(FEATURES)
    .filter(([_, enabled]) => enabled)
    .map(([feature, _]) => feature as FeatureFlag)
}

/**
 * Feature-specific configuration
 */
export const FEATURE_CONFIG = {
  // Inquiry page settings
  inquiry: {
    title: "Заявка за част",
    description: "Не намирате нужната част? Изпратете ни запитване и ще ви помогнем.",
    ctaText: "Изпрати запитване",
    successMessage: "Вашето запитване е изпратено успешно!"
  },
  
  // Homepage MVP mode settings
  homepage: {
    heroTitle: "Професионални Авточасти",
    heroSubtitle: "Свържете се с нас за консултация и поръчка на качествени авточасти",
    heroCTA: "Изпратете запитване",
    heroCTALink: "/inquiry"
  }
} as const 