/**
 * MVP Product Card Types
 * 
 * TypeScript types and interfaces for the MVP Product Card component.
 * Designed for Bulgarian automotive parts store with conversion optimization.
 */

export interface ProductCardData {
  id: string
  name: string
  slug: string
  description?: string
  shortDescription?: string
  price: ProductPrice
  images: ProductImage[]
  availability: ProductAvailability
  compatibility: ProductCompatibility
  brand: ProductBrand
  category: ProductCategory
  specifications?: ProductSpecification[]
  tags?: string[]
  sku?: string
  partNumber?: string
  isNew?: boolean
  isFeatured?: boolean
  isOnSale?: boolean
  rating?: ProductRating
  reviews?: ProductReview[]
  createdAt?: string
  updatedAt?: string
}

export interface ProductPrice {
  current: number
  original?: number
  currency: string
  currencySymbol: string
  isOnSale: boolean
  discountPercent?: number
  installments?: ProductInstallment[]
  pricePerUnit?: number
  unit?: string
  vatIncluded: boolean
  minOrderQuantity?: number
  maxOrderQuantity?: number
}

export interface ProductImage {
  id: string
  url: string
  alt: string
  title?: string
  width: number
  height: number
  isPrimary: boolean
  priority?: boolean
  blurDataURL?: string
  placeholder?: string
  sizes?: string
  srcSet?: string
}

export interface ProductAvailability {
  status: 'in_stock' | 'out_of_stock' | 'pre_order' | 'coming_soon' | 'discontinued'
  quantity?: number
  inStockText: string
  outOfStockText: string
  preOrderText?: string
  comingSoonText?: string
  deliveryTime?: string
  leadTime?: string
  location?: string
  supplier?: string
  lastUpdated?: string
}

export interface ProductCompatibility {
  vehicles: CompatibleVehicle[]
  universalFit: boolean
  compatibilityNote?: string
  displayText: string
  shortDisplayText?: string
  checkRequired: boolean
  restrictions?: string[]
}

export interface CompatibleVehicle {
  make: string
  model: string
  yearFrom: number
  yearTo: number
  engine?: string
  variant?: string
  bodyType?: string
  transmission?: string
  fuelType?: string
  notes?: string
}

export interface ProductBrand {
  id: string
  name: string
  logo?: string
  country?: string
  website?: string
  isOriginal: boolean
  isAftermarket: boolean
  qualityRating?: number
  description?: string
}

export interface ProductCategory {
  id: string
  name: string
  slug: string
  parentId?: string
  path?: string
  level?: number
  description?: string
  image?: string
  icon?: string
}

export interface ProductSpecification {
  name: string
  value: string
  unit?: string
  group?: string
  isImportant: boolean
  displayOrder?: number
}

export interface ProductRating {
  average: number
  count: number
  distribution: Record<number, number>
  breakdown?: {
    quality: number
    value: number
    fitment: number
    delivery: number
  }
}

export interface ProductReview {
  id: string
  userId: string
  userName: string
  rating: number
  title: string
  content: string
  pros?: string[]
  cons?: string[]
  recommendToFriend: boolean
  verifiedPurchase: boolean
  vehicle?: CompatibleVehicle
  createdAt: string
  updatedAt?: string
  helpfulCount: number
  reportCount: number
}

export interface ProductInstallment {
  months: number
  monthlyPayment: number
  totalAmount: number
  interestRate: number
  provider: string
  minAmount?: number
  maxAmount?: number
}

/**
 * Component Props
 */
export interface ProductCardProps {
  product: ProductCardData
  onViewDetails?: (product: ProductCardData) => void
  onAddToCart?: (product: ProductCardData) => void
  onAddToWishlist?: (product: ProductCardData) => void
  onQuickView?: (product: ProductCardData) => void
  onCompatibilityCheck?: (product: ProductCardData) => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
  layout?: 'vertical' | 'horizontal'
  showQuickActions?: boolean
  showCompatibility?: boolean
  showRating?: boolean
  showBrand?: boolean
  showAvailability?: boolean
  showInstallments?: boolean
  showLocalPickup?: boolean
  enableHover?: boolean
  enableLazyLoading?: boolean
  priority?: boolean
  testId?: string
  // UX Enhancement props
  selectedVehicle?: CompatibleVehicle
  isInWishlist?: boolean
  isInCart?: boolean
  showBadges?: boolean
  showQuickView?: boolean
  showAddToCart?: boolean
  maxNameLines?: number
  maxDescriptionLines?: number
  // Accessibility props
  ariaLabel?: string
  ariaDescribedBy?: string
  // Design customization
  colorScheme?: 'default' | 'premium' | 'minimal'
  borderRadius?: 'sm' | 'md' | 'lg' | 'xl'
  shadowIntensity?: 'sm' | 'md' | 'lg'
  hoverEffect?: 'lift' | 'zoom' | 'glow' | 'none'
  imageAspectRatio?: 'square' | '4:3' | '16:9' | '3:2'
}

/**
 * Component State
 */
export interface ProductCardState {
  isLoading: boolean
  isImageLoaded: boolean
  isHovered: boolean
  isFocused: boolean
  showQuickView: boolean
  error?: string
  imageError: boolean
  currentImageIndex: number
}

/**
 * Product Card Configuration
 */
export interface ProductCardConfig {
  enableAnimations: boolean
  enableHoverEffects: boolean
  enableLazyLoading: boolean
  enableQuickView: boolean
  enableWishlist: boolean
  enableCompatibilityCheck: boolean
  enableInstallments: boolean
  enableLocalPickup: boolean
  enableRating: boolean
  enableBrand: boolean
  enableAvailability: boolean
  enableBadges: boolean
  enableQuickActions: boolean
  maxNameLength: number
  maxDescriptionLength: number
  imageLoadingStrategy: 'eager' | 'lazy' | 'auto'
  imageQuality: number
  imageSizes: string
  defaultImageAspectRatio: string
  hoverDelayMs: number
  animationDurationMs: number
  loadingPlaceholderColor: string
  errorPlaceholderColor: string
}

/**
 * Product Card Analytics
 */
export interface ProductCardAnalytics {
  productId: string
  impressions: number
  clicks: number
  conversions: number
  addToCartClicks: number
  wishlistClicks: number
  quickViewClicks: number
  compatibilityCheckClicks: number
  averageViewTime: number
  bounceRate: number
  conversionRate: number
  clickThroughRate: number
  events: ProductCardEvent[]
}

export interface ProductCardEvent {
  type: 'impression' | 'click' | 'hover' | 'add_to_cart' | 'wishlist' | 'quick_view' | 'compatibility_check'
  timestamp: number
  userId?: string
  sessionId?: string
  productId: string
  metadata?: Record<string, any>
  duration?: number
  source?: string
  campaign?: string
}

/**
 * Responsive Grid Configuration
 */
export interface ProductGridConfig {
  columns: {
    mobile: number
    tablet: number
    desktop: number
    xl: number
  }
  gap: {
    mobile: string
    tablet: string
    desktop: string
    xl: string
  }
  containerMaxWidth?: string
  breakpoints: {
    mobile: number
    tablet: number
    desktop: number
    xl: number
  }
}

/**
 * Product Card Theme
 */
export interface ProductCardTheme {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textSecondary: string
    textMuted: string
    border: string
    borderLight: string
    success: string
    error: string
    warning: string
    info: string
    price: string
    priceOriginal: string
    discount: string
    availability: {
      inStock: string
      outOfStock: string
      preOrder: string
      comingSoon: string
    }
  }
  typography: {
    fontFamily: string
    fontSize: Record<string, string>
    fontWeight: Record<string, string>
    lineHeight: Record<string, string>
    letterSpacing?: Record<string, string>
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  borderRadius: {
    sm: string
    md: string
    lg: string
    xl: string
    full: string
  }
  shadows: {
    sm: string
    md: string
    lg: string
    xl: string
  }
  transitions: {
    fast: string
    medium: string
    slow: string
  }
  zIndex: {
    base: number
    elevated: number
    overlay: number
    modal: number
  }
}

/**
 * Product Card Accessibility
 */
export interface ProductCardAccessibility {
  ariaLabel: string
  ariaDescribedBy?: string
  role: string
  tabIndex: number
  keyboardShortcuts: {
    view: string
    addToCart: string
    wishlist: string
    quickView: string
  }
  screenReaderText: {
    price: string
    availability: string
    compatibility: string
    rating: string
    addToCart: string
    wishlist: string
    quickView: string
  }
}

/**
 * Product Card Validation
 */
export interface ProductCardValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
  requiredFields: string[]
  optionalFields: string[]
}

/**
 * Product Card Methods
 */
export interface ProductCardMethods {
  refresh: () => void
  addToCart: () => void
  addToWishlist: () => void
  removeFromWishlist: () => void
  checkCompatibility: () => void
  openQuickView: () => void
  viewDetails: () => void
  updateQuantity: (quantity: number) => void
  selectVariant: (variant: string) => void
  reportError: (error: string) => void
  trackEvent: (event: ProductCardEvent) => void
  focus: () => void
  blur: () => void
  scrollIntoView: () => void
}

/**
 * Product Card Context
 */
export interface ProductCardContext {
  currency: string
  currencySymbol: string
  locale: string
  timezone: string
  userVehicle?: CompatibleVehicle
  wishlistItems: string[]
  cartItems: string[]
  isLoggedIn: boolean
  enablePersonalization: boolean
  enableRecommendations: boolean
  enableSocialProof: boolean
  enableUrgency: boolean
  enableTrustBadges: boolean
  theme: ProductCardTheme
  config: ProductCardConfig
  analytics: ProductCardAnalytics
}

/**
 * Utility Types
 */
export type ProductCardSize = 'sm' | 'md' | 'lg'
export type ProductCardLayout = 'vertical' | 'horizontal'
export type ProductCardColorScheme = 'default' | 'premium' | 'minimal'
export type ProductCardBorderRadius = 'sm' | 'md' | 'lg' | 'xl'
export type ProductCardShadowIntensity = 'sm' | 'md' | 'lg'
export type ProductCardHoverEffect = 'lift' | 'zoom' | 'glow' | 'none'
export type ProductCardImageAspectRatio = 'square' | '4:3' | '16:9' | '3:2'
export type ProductAvailabilityStatus = 'in_stock' | 'out_of_stock' | 'pre_order' | 'coming_soon' | 'discontinued'

/**
 * Product Card Ref
 */
export interface ProductCardRef {
  element: HTMLDivElement | null
  focus: () => void
  blur: () => void
  refresh: () => void
  addToCart: () => void
  addToWishlist: () => void
  checkCompatibility: () => void
  openQuickView: () => void
  viewDetails: () => void
  trackEvent: (event: ProductCardEvent) => void
  validate: () => ProductCardValidation
  getAnalytics: () => ProductCardAnalytics
  updateConfig: (config: Partial<ProductCardConfig>) => void
}

/**
 * Grid System Types
 */
export interface ProductGridProps {
  products: ProductCardData[]
  columns?: ProductGridConfig['columns']
  gap?: ProductGridConfig['gap']
  className?: string
  itemClassName?: string
  emptyState?: React.ReactNode
  loadingState?: React.ReactNode
  errorState?: React.ReactNode
  onLoadMore?: () => void
  hasMore?: boolean
  isLoading?: boolean
  error?: string
  virtualScrolling?: boolean
  infiniteScroll?: boolean
  searchQuery?: string
  filters?: Record<string, any>
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  selectedVehicle?: CompatibleVehicle
  onProductClick?: (product: ProductCardData) => void
  onProductAddToCart?: (product: ProductCardData) => void
  onProductAddToWishlist?: (product: ProductCardData) => void
  showQuickActions?: boolean
  showCompatibility?: boolean
  enableAnalytics?: boolean
  trackingPrefix?: string
}

/**
 * Product Card Hook Return Types
 */
export interface UseProductCard {
  product: ProductCardData
  state: ProductCardState
  methods: ProductCardMethods
  analytics: ProductCardAnalytics
  validation: ProductCardValidation
  isLoading: boolean
  error?: string
  isInWishlist: boolean
  isInCart: boolean
  compatibility: {
    isCompatible: boolean
    reason?: string
    suggestions?: string[]
  }
  pricing: {
    displayPrice: string
    savings?: string
    installmentText?: string
  }
  availability: {
    displayText: string
    color: string
    icon?: string
  }
}

/**
 * Product Card Hooks
 */
export interface UseProductCardAnalytics {
  trackImpression: (productId: string) => void
  trackClick: (productId: string) => void
  trackAddToCart: (productId: string) => void
  trackWishlist: (productId: string) => void
  trackQuickView: (productId: string) => void
  trackCompatibilityCheck: (productId: string) => void
  getAnalytics: (productId: string) => ProductCardAnalytics
  clearAnalytics: (productId: string) => void
}

export interface UseProductCardCompatibility {
  checkCompatibility: (product: ProductCardData, vehicle: CompatibleVehicle) => boolean
  getCompatibilityReason: (product: ProductCardData, vehicle: CompatibleVehicle) => string
  getCompatibilitySuggestions: (product: ProductCardData, vehicle: CompatibleVehicle) => string[]
  isUniversalFit: (product: ProductCardData) => boolean
  needsCompatibilityCheck: (product: ProductCardData) => boolean
}

export interface UseProductCardPricing {
  formatPrice: (price: number, currency: string) => string
  calculateSavings: (current: number, original: number) => string
  formatInstallment: (installment: ProductInstallment) => string
  getTotalPrice: (price: number, quantity: number) => number
  getDiscountPercent: (current: number, original: number) => number
  isPriceValid: (price: ProductPrice) => boolean
}

/**
 * Error Types
 */
export interface ProductCardError {
  type: 'validation' | 'network' | 'image' | 'compatibility' | 'pricing' | 'availability'
  message: string
  code?: string
  details?: Record<string, any>
  timestamp: number
  productId?: string
  recoverable: boolean
  suggestions?: string[]
}

/**
 * Loading States
 */
export interface ProductCardLoadingState {
  isLoading: boolean
  isImageLoading: boolean
  isDataLoading: boolean
  isCompatibilityLoading: boolean
  isPricingLoading: boolean
  isAvailabilityLoading: boolean
  progress?: number
  stage?: 'initial' | 'images' | 'data' | 'compatibility' | 'complete'
}

/**
 * Performance Monitoring
 */
export interface ProductCardPerformance {
  renderTime: number
  imageLoadTime: number
  interactionTime: number
  memoryUsage: number
  bundleSize: number
  cacheHitRate: number
  errorRate: number
  userSatisfactionScore: number
  conversionRate: number
  bounceRate: number
  engagementRate: number
  metrics: Record<string, number>
}

/**
 * A11y Configuration
 */
export interface ProductCardA11yConfig {
  enableAnnouncements: boolean
  enableKeyboardNavigation: boolean
  enableScreenReaderSupport: boolean
  enableHighContrast: boolean
  enableReducedMotion: boolean
  enableFocusManagement: boolean
  announceChanges: boolean
  announceErrors: boolean
  announceLoading: boolean
  announceSuccess: boolean
  customAriaLabels: Record<string, string>
  customScreenReaderText: Record<string, string>
  keyboardShortcuts: Record<string, string>
  focusRingColor: string
  focusRingWidth: string
  focusRingOffset: string
} 