/**
 * TypeScript interfaces for Cascading Vehicle Dropdown System
 * 
 * Comprehensive type definitions for automotive Make/Model/Year/Engine cascading selection
 */

// Base interfaces for vehicle data
export interface VehicleMake {
  id: string
  name: string
  slug: string
  logo_url?: string
  country?: string
  is_active: boolean
  product_count?: number
  created_at: string
  updated_at: string
}

export interface VehicleModel {
  id: string
  make_id: string
  name: string
  slug: string
  generation?: string
  body_type?: string
  year_start: number
  year_end?: number
  is_active: boolean
  product_count?: number
  created_at: string
  updated_at: string
}

export interface VehicleEngine {
  id: string
  model_id: string
  code?: string
  name: string
  displacement: number
  power: number
  fuel: 'gasoline' | 'diesel' | 'hybrid' | 'electric'
  year_start: number
  year_end?: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// Year interface for consistency
export interface VehicleYear {
  year: number
  is_active: boolean
}

// Selection state interface
export interface CascadingVehicleSelection {
  make?: VehicleMake
  model?: VehicleModel
  year?: number
  engine?: VehicleEngine
}

// Configuration interfaces
export interface CascadingPlaceholderConfig {
  make?: string
  model?: string
  year?: string
  engine?: string
}

export interface CascadingVehicleConfig {
  showCounts?: boolean
  showLogos?: boolean
  showDescriptions?: boolean
  enableSearch?: boolean
  placeholder?: CascadingPlaceholderConfig
  emptyState?: CascadingPlaceholderConfig
}

// Event handler interfaces
export interface CascadingVehicleEventHandlers {
  onMakeChange?: (make: VehicleMake | null, selection: CascadingVehicleSelection) => void
  onModelChange?: (model: VehicleModel | null, selection: CascadingVehicleSelection) => void
  onYearChange?: (year: number | null, selection: CascadingVehicleSelection) => void
  onEngineChange?: (engine: VehicleEngine | null, selection: CascadingVehicleSelection) => void
  onSelectionComplete?: (selection: CascadingVehicleSelection) => void
  onSelectionClear?: () => void
  onError?: (error: string, context: string) => void
}

// Component props interface
export interface CascadingVehicleDropdownsProps {
  /** Initial selection state */
  initialSelection?: CascadingVehicleSelection
  
  /** Callback fired when selection changes */
  onSelectionChange?: (selection: CascadingVehicleSelection) => void
  
  /** Whether to show engine selector */
  showEngineSelector?: boolean
  
  /** Whether to show clear button */
  showClearButton?: boolean
  
  /** Component size */
  size?: 'sm' | 'md' | 'lg'
  
  /** Whether component is disabled */
  disabled?: boolean
  
  /** Whether selection is required */
  required?: boolean
  
  /** Custom placeholder text */
  placeholder?: CascadingPlaceholderConfig
  
  /** Additional CSS classes */
  className?: string
  
  /** Event handlers */
  eventHandlers?: CascadingVehicleEventHandlers
  
  /** Configuration options */
  config?: CascadingVehicleConfig
}

// Loading state interface
export interface CascadingLoadingState {
  makes: boolean
  models: boolean
  years: boolean
  engines: boolean
  initializing?: boolean
}

// Error state interface
export interface CascadingErrorState {
  makes?: string
  models?: string
  years?: string
  engines?: string
}

// Dropdown option base interface
export interface BaseDropdownOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
  count?: number
}

// Specific dropdown option interfaces
export interface MakeDropdownOption extends BaseDropdownOption {
  data: VehicleMake
  country?: string
  logo_url?: string
}

export interface ModelDropdownOption extends BaseDropdownOption {
  data: VehicleModel
  generation?: string
  year_range?: string
}

export interface YearDropdownOption extends BaseDropdownOption {
  data: number
}

export interface EngineDropdownOption extends BaseDropdownOption {
  data: VehicleEngine
  engine_code?: string
  fuel_type?: string
  displacement?: number
  power?: number
}

// Combined dropdown option type
export type CascadingDropdownOption = 
  | MakeDropdownOption 
  | ModelDropdownOption 
  | YearDropdownOption 
  | EngineDropdownOption

// API response interfaces
export interface VehicleApiResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  has_more: boolean
}

export interface CascadingApiResponses {
  makes: VehicleApiResponse<VehicleMake>
  models: VehicleApiResponse<VehicleModel>
  years: VehicleApiResponse<VehicleYear>
  engines: VehicleApiResponse<VehicleEngine>
}

// Filter interfaces
export interface VehicleFilters {
  search?: string
  country?: string
  fuel?: string
  year_min?: number
  year_max?: number
  is_active?: boolean
}

export interface CascadingFilters {
  make?: VehicleFilters
  model?: VehicleFilters
  year?: VehicleFilters
  engine?: VehicleFilters
}

// Validation interfaces
export interface ValidationRule {
  required?: boolean
  custom?: (value: any) => string | null
}

export interface CascadingValidationRules {
  make?: ValidationRule
  model?: ValidationRule
  year?: ValidationRule
  engine?: ValidationRule
}

export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface CascadingValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

// Accessibility interfaces
export interface CascadingAccessibilityLabels {
  make?: string
  model?: string
  year?: string
  engine?: string
}

export interface CascadingAccessibilityAnnouncements {
  makeSelected?: (makeName: string) => string
  modelSelected?: (modelName: string) => string
  yearSelected?: (year: number) => string
  engineSelected?: (engineName: string) => string
}

export interface CascadingAccessibilityConfig {
  labels?: CascadingAccessibilityLabels
  announcements?: CascadingAccessibilityAnnouncements
}

// Hook interfaces
export interface CascadingVehicleHookOptions {
  initialSelection?: CascadingVehicleSelection
  config?: CascadingVehicleConfig
  filters?: CascadingFilters
  onSelectionChange?: (selection: CascadingVehicleSelection) => void
  onError?: (error: string, context: string) => void
}

export interface CascadingVehicleHookReturn {
  selection: CascadingVehicleSelection
  options: {
    makes: MakeDropdownOption[]
    models: ModelDropdownOption[]
    years: YearDropdownOption[]
    engines: EngineDropdownOption[]
  }
  loading: CascadingLoadingState
  errors: CascadingErrorState
  actions: {
    selectMake: (make: VehicleMake | null) => void
    selectModel: (model: VehicleModel | null) => void
    selectYear: (year: number | null) => void
    selectEngine: (engine: VehicleEngine | null) => void
    clearSelection: () => void
  }
  utilities: {
    isStepEnabled: (step: 'make' | 'model' | 'year' | 'engine') => boolean
    isSelectionComplete: () => boolean
    getSelectionPath: () => string
    getCompatibleProductCount: () => number
  }
  refresh: {
    refreshMakes: () => void
    refreshModels: () => void
    refreshYears: () => void
    refreshEngines: () => void
  }
}

// API service interfaces
export interface VehicleApiService {
  getMakes: (filters?: VehicleFilters) => Promise<VehicleMake[]>
  getModels: (makeId: string, filters?: VehicleFilters) => Promise<VehicleModel[]>
  getYears: (modelId: string, filters?: VehicleFilters) => Promise<number[]>
  getEngines: (modelId: string, year?: number, filters?: VehicleFilters) => Promise<VehicleEngine[]>
  searchVehicles: (query: string) => Promise<CascadingVehicleSelection[]>
  validateSelection: (selection: CascadingVehicleSelection) => Promise<boolean>
}

// Cache interfaces
export interface CascadingCacheEntry<T> {
  data: T
  timestamp: number
  expiry: number
}

export interface CascadingCacheConfig {
  ttl?: number // Time to live in milliseconds
  maxSize?: number // Maximum number of entries
  enabled?: boolean
}

// Export utility types
export type VehicleIdentifier = string | number
export type DropdownSize = 'sm' | 'md' | 'lg'
export type DropdownState = 'idle' | 'loading' | 'error' | 'success'
export type CascadingStep = 'make' | 'model' | 'year' | 'engine'

// Brand and compatibility interfaces
export interface VehicleBrand {
  id: string
  name: string
  slug: string
  logo_url?: string
  country: string
  founded_year?: number
  is_active: boolean
  makes: VehicleMake[]
}

export interface VehicleCompatibility {
  makes: string[]
  models?: string[]
  years?: number[]
  engines?: string[]
  excludes?: {
    makes?: string[]
    models?: string[]
    years?: number[]
    engines?: string[]
  }
}

// Product compatibility interface
export interface ProductVehicleCompatibility {
  product_id: string
  compatibility: VehicleCompatibility
  verified: boolean
  notes?: string
  created_at: string
  updated_at: string
}

// Search and filtering interfaces
export interface VehicleSearchQuery {
  query: string
  filters: VehicleFilters
  sort?: 'name' | 'popularity' | 'year'
  order?: 'asc' | 'desc'
}

export interface VehicleSearchResult {
  make: VehicleMake
  model: VehicleModel
  year: number
  engine?: VehicleEngine
  match_score: number
  match_fields: string[]
}

// Advanced dropdown configuration
export interface AdvancedDropdownConfig {
  virtualization?: boolean
  searchThreshold?: number
  searchDelay?: number
  maxHeight?: number
  showIcons?: boolean
  groupBy?: 'country' | 'fuel' | 'generation'
  sortBy?: 'name' | 'popularity' | 'year'
  customRenderer?: (option: any) => React.ReactNode
}

// Theme and styling interfaces
export interface CascadingThemeConfig {
  colors?: {
    primary?: string
    secondary?: string
    accent?: string
    error?: string
    success?: string
    warning?: string
    background?: string
    text?: string
    border?: string
  }
  borderRadius?: number
  spacing?: {
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  typography?: {
    fontSize?: {
      xs?: string
      sm?: string
      md?: string
      lg?: string
      xl?: string
    }
    fontWeight?: {
      normal?: number
      medium?: number
      semibold?: number
      bold?: number
    }
  }
}

// Animation and transition interfaces
export interface CascadingAnimationConfig {
  duration?: number
  easing?: string
  enabled?: boolean
  stagger?: number
}

export interface CascadingTransitionConfig {
  dropdown?: CascadingAnimationConfig
  selection?: CascadingAnimationConfig
  loading?: CascadingAnimationConfig
  error?: CascadingAnimationConfig
}

// Performance monitoring interfaces
export interface CascadingPerformanceMetrics {
  loadTime: {
    makes: number
    models: number
    years: number
    engines: number
  }
  renderTime: number
  interactionTime: number
  cacheHitRate: number
  errorRate: number
}

export interface CascadingPerformanceConfig {
  monitoring?: boolean
  reportingInterval?: number
  sampleRate?: number
  onMetrics?: (metrics: CascadingPerformanceMetrics) => void
}

// Export all interfaces for external use
export * from './vehicle' 