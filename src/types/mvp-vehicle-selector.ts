/**
 * MVP Vehicle Selector Types
 * 
 * TypeScript types and interfaces for the MVP Vehicle Selector component.
 * Includes types for static data, component props, and state management.
 */

export interface MVPVehicleMake {
  id: string
  name: string
  logo?: string
  popularity: number // 1-10 scale for default sorting
}

export interface MVPVehicleModel {
  id: string
  name: string
  makeId: string
  years: number[]
  popularity: number // 1-10 scale for default sorting
}

export interface MVPVehicleSelection {
  make?: MVPVehicleMake
  model?: MVPVehicleModel
  year?: number
}

export interface MVPVehicleData {
  makes: MVPVehicleMake[]
  models: MVPVehicleModel[]
}

/**
 * Component Props
 */
export interface MVPVehicleSelectorProps {
  onSelectionChange?: (selection: MVPVehicleSelection) => void
  onFindParts?: (selection: MVPVehicleSelection) => void
  onReset?: () => void
  initialSelection?: Partial<MVPVehicleSelection>
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showConfirmation?: boolean
  autoFocus?: boolean
  disabled?: boolean
  testId?: string
  // UX Enhancement props
  showProgress?: boolean
  showTooltips?: boolean
  enableKeyboardNavigation?: boolean
  sortByPopularity?: boolean
  maxDropdownHeight?: number
  // Accessibility props
  ariaLabel?: string
  ariaDescribedBy?: string
  // Design customization
  colorScheme?: 'default' | 'premium' | 'minimal'
  showLogos?: boolean
  showStepNumbers?: boolean
}

/**
 * Component State
 */
export interface MVPVehicleSelectorState {
  selection: MVPVehicleSelection
  availableModels: MVPVehicleModel[]
  availableYears: number[]
  loading: MVPVehicleLoadingState
  errors: MVPVehicleErrorState
  openDropdown: string | null
  showConfirmation: boolean
  touched: MVPVehicleTouchedState
  validationErrors: MVPVehicleValidationState
}

/**
 * Loading States
 */
export interface MVPVehicleLoadingState {
  makes: boolean
  models: boolean
  years: boolean
  findingParts: boolean
  resetting: boolean
}

/**
 * Error States
 */
export interface MVPVehicleErrorState {
  make?: string
  model?: string
  year?: string
  general?: string
}

/**
 * Touched States (for validation)
 */
export interface MVPVehicleTouchedState {
  make: boolean
  model: boolean
  year: boolean
}

/**
 * Validation States
 */
export interface MVPVehicleValidationState {
  make?: string
  model?: string
  year?: string
  isValid: boolean
  isComplete: boolean
}

/**
 * Dropdown Option Type
 */
export interface MVPDropdownOption {
  value: string
  label: string
  logo?: string
  disabled?: boolean
  popularity?: number
  metadata?: Record<string, any>
}

/**
 * Step Information
 */
export interface MVPVehicleStep {
  id: 'make' | 'model' | 'year'
  label: string
  placeholder: string
  required: boolean
  completed: boolean
  disabled: boolean
  options: MVPDropdownOption[]
  selectedOption?: MVPDropdownOption
  errorMessage?: string
  tooltip?: string
}

/**
 * Confirmation Data
 */
export interface MVPVehicleConfirmation {
  make: string
  model: string
  year: string
  formatted: string
  isComplete: boolean
  canProceed: boolean
}

/**
 * Vehicle Selector Context
 */
export interface MVPVehicleContext {
  selection: MVPVehicleSelection
  setSelection: (selection: MVPVehicleSelection) => void
  updateSelection: (partialSelection: Partial<MVPVehicleSelection>) => void
  clearSelection: () => void
  isSelectionComplete: boolean
  isSelectionValid: boolean
  getAvailableModels: () => MVPVehicleModel[]
  getAvailableYears: () => number[]
  findParts: () => void
  reset: () => void
}

/**
 * Component Event Handlers
 */
export interface MVPVehicleEventHandlers {
  onMakeChange: (make: MVPVehicleMake | null) => void
  onModelChange: (model: MVPVehicleModel | null) => void
  onYearChange: (year: number | null) => void
  onReset: () => void
  onClear: () => void
  onFindParts: () => void
  onDropdownToggle: (dropdownId: string) => void
  onDropdownClose: () => void
  onKeyDown: (event: KeyboardEvent, dropdownId: string) => void
  onBlur: (field: 'make' | 'model' | 'year') => void
  onFocus: (field: 'make' | 'model' | 'year') => void
}

/**
 * Component Configuration
 */
export interface MVPVehicleConfig {
  enableAnimations: boolean
  enableSounds: boolean
  enableHaptics: boolean
  enableAutoComplete: boolean
  enablePersistence: boolean
  enableAnalytics: boolean
  enableTelemetry: boolean
  maxRecentSelections: number
  debounceDelay: number
  animationDuration: number
  dropdownMaxHeight: number
  touchTargetSize: number
  // UX Settings
  showPopularityIndicator: boolean
  showStepProgress: boolean
  showConfirmationDialog: boolean
  showTooltips: boolean
  showErrorDetails: boolean
  showSuccessMessages: boolean
  // Accessibility Settings
  enableScreenReader: boolean
  enableKeyboardNavigation: boolean
  enableHighContrast: boolean
  enableReducedMotion: boolean
  announceChanges: boolean
  // Performance Settings
  virtualizeLongLists: boolean
  preloadImages: boolean
  cacheResults: boolean
  lazyLoadOptions: boolean
}

/**
 * Component Analytics
 */
export interface MVPVehicleAnalytics {
  selectionStarted: number
  selectionCompleted: number
  selectionAbandoned: number
  averageCompletionTime: number
  mostPopularMakes: string[]
  mostPopularModels: string[]
  mostPopularYears: number[]
  errorRates: Record<string, number>
  conversionRate: number
  userJourney: MVPVehicleUserJourney[]
}

/**
 * User Journey Tracking
 */
export interface MVPVehicleUserJourney {
  timestamp: number
  action: 'started' | 'make_selected' | 'model_selected' | 'year_selected' | 'completed' | 'reset' | 'abandoned'
  data?: any
  duration?: number
  errors?: string[]
}

/**
 * Accessibility Props
 */
export interface MVPVehicleAccessibilityProps {
  ariaLabel?: string
  ariaDescribedBy?: string
  ariaRequired?: boolean
  ariaInvalid?: boolean
  ariaExpanded?: boolean
  ariaActivedescendant?: string
  role?: string
  tabIndex?: number
  announceSelection?: boolean
  screenReaderInstructions?: string
}

/**
 * Theme Configuration
 */
export interface MVPVehicleTheme {
  colors: {
    primary: string
    secondary: string
    success: string
    error: string
    warning: string
    info: string
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
    focus: string
    hover: string
    active: string
    disabled: string
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  typography: {
    fontFamily: string
    fontSize: Record<string, string>
    fontWeight: Record<string, string>
    lineHeight: Record<string, string>
  }
  borderRadius: Record<string, string>
  shadows: Record<string, string>
  transitions: Record<string, string>
  breakpoints: Record<string, string>
}

/**
 * Validation Rules
 */
export interface MVPVehicleValidationRules {
  make: {
    required: boolean
    validator?: (value: MVPVehicleMake | null) => string | null
  }
  model: {
    required: boolean
    validator?: (value: MVPVehicleModel | null) => string | null
  }
  year: {
    required: boolean
    min?: number
    max?: number
    validator?: (value: number | null) => string | null
  }
}

/**
 * Component Methods
 */
export interface MVPVehicleMethods {
  focus: () => void
  blur: () => void
  reset: () => void
  clear: () => void
  validate: () => boolean
  submit: () => void
  getSelection: () => MVPVehicleSelection
  setSelection: (selection: MVPVehicleSelection) => void
  updateSelection: (partialSelection: Partial<MVPVehicleSelection>) => void
  openDropdown: (dropdownId: string) => void
  closeDropdown: () => void
  scrollToTop: () => void
  scrollToError: () => void
}

/**
 * Utility Types
 */
export type MVPVehicleField = 'make' | 'model' | 'year'
export type MVPVehicleStepId = 'make' | 'model' | 'year'
export type MVPVehicleSize = 'sm' | 'md' | 'lg'
export type MVPVehicleColorScheme = 'default' | 'premium' | 'minimal'
export type MVPVehicleAnimationType = 'fade' | 'slide' | 'scale' | 'none'
export type MVPVehicleDropdownDirection = 'down' | 'up' | 'auto'
export type MVPVehicleValidationTrigger = 'change' | 'blur' | 'submit'
export type MVPVehicleErrorDisplayMode = 'inline' | 'tooltip' | 'summary'

/**
 * Component Ref
 */
export interface MVPVehicleSelectorRef {
  focus: () => void
  blur: () => void
  reset: () => void
  clear: () => void
  validate: () => boolean
  submit: () => void
  getSelection: () => MVPVehicleSelection
  setSelection: (selection: MVPVehicleSelection) => void
  element: HTMLDivElement | null
}

/**
 * Hook Return Types
 */
export interface UseMVPVehicleSelector {
  selection: MVPVehicleSelection
  state: MVPVehicleSelectorState
  handlers: MVPVehicleEventHandlers
  methods: MVPVehicleMethods
  validation: MVPVehicleValidationState
  analytics: MVPVehicleAnalytics
  isLoading: boolean
  isValid: boolean
  isComplete: boolean
  canProceed: boolean
  availableModels: MVPVehicleModel[]
  availableYears: number[]
  confirmation: MVPVehicleConfirmation
}

/**
 * Persistence Configuration
 */
export interface MVPVehiclePersistenceConfig {
  enabled: boolean
  storageKey: string
  storageType: 'localStorage' | 'sessionStorage' | 'cookie'
  expiryDays?: number
  encrypt?: boolean
  includeAnalytics?: boolean
}

/**
 * Service Configuration
 */
export interface MVPVehicleServiceConfig {
  dataSource: 'static' | 'api' | 'hybrid'
  apiEndpoint?: string
  apiKey?: string
  cacheTimeout?: number
  retryAttempts?: number
  retryDelay?: number
  enableOffline?: boolean
  enablePrefetch?: boolean
} 