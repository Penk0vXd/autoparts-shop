'use client'

import React, { useState, useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from 'react'
import { 
  ChevronDownIcon, 
  XMarkIcon, 
  CheckIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { 
  MVPVehicleSelectorProps, 
  MVPVehicleSelection, 
  MVPVehicleMake, 
  MVPVehicleModel,
  MVPVehicleSelectorState,
  MVPVehicleLoadingState,
  MVPVehicleErrorState,
  MVPVehicleTouchedState,
  MVPVehicleValidationState,
  MVPVehicleSelectorRef,
  MVPDropdownOption
} from '@/types/mvp-vehicle-selector'
import { MVP_VEHICLE_DATA } from '@/data/mvp-vehicle-data'

/**
 * MVP Vehicle Selector Component
 * 
 * A world-class vehicle selection component designed for Bulgarian auto parts store.
 * Transforms buyer fear of wrong fit into absolute confidence through:
 * 
 * ✅ Three-step cascading selection (Make → Model → Year)
 * ✅ Mobile-first design with 44px+ touch targets
 * ✅ Bulgarian language throughout
 * ✅ Progressive disclosure UX
 * ✅ Zero errors principle
 * ✅ Accessibility (WCAG 2.1 AA compliant)
 * ✅ Psychological reinforcement
 * ✅ Premium red (#D32F2F) color scheme
 * ✅ Subtle animations and touch feedback
 * ✅ Static JSON data (no API dependency)
 * 
 * @author God of Programming
 * @version 1.0.0
 */
export const MVPVehicleSelector = forwardRef<MVPVehicleSelectorRef, MVPVehicleSelectorProps>(({
  onSelectionChange,
  onFindParts,
  onReset,
  initialSelection = {},
  className,
  size = 'md',
  showConfirmation = true,
  autoFocus = true,
  disabled = false,
  testId = 'mvp-vehicle-selector',
  showProgress = true,
  showTooltips = true,
  enableKeyboardNavigation = true,
  sortByPopularity = true,
  maxDropdownHeight = 320,
  ariaLabel = 'Изберете вашия автомобил',
  ariaDescribedBy,
  colorScheme = 'default',
  showLogos = true,
  showStepNumbers = true
}, ref) => {
  
  // Component state
  const [state, setState] = useState<MVPVehicleSelectorState>({
    selection: initialSelection as MVPVehicleSelection,
    availableModels: [],
    availableYears: [],
    loading: {
      makes: false,
      models: false,
      years: false,
      findingParts: false,
      resetting: false
    },
    errors: {},
    openDropdown: null,
    showConfirmation: false,
    touched: {
      make: false,
      model: false,
      year: false
    },
    validationErrors: {
      isValid: false,
      isComplete: false
    }
  })
  
  // Refs for accessibility and DOM manipulation
  const containerRef = useRef<HTMLDivElement>(null)
  const makeButtonRef = useRef<HTMLButtonElement>(null)
  const modelButtonRef = useRef<HTMLButtonElement>(null)
  const yearButtonRef = useRef<HTMLButtonElement>(null)
  const confirmationRef = useRef<HTMLDivElement>(null)
  
  // Auto-focus on mount
  useEffect(() => {
    if (autoFocus && makeButtonRef.current) {
      makeButtonRef.current.focus()
    }
  }, [autoFocus])
  
  // Size-based styling
  const sizeClasses = {
    sm: 'h-10 px-3 text-sm',
    md: 'h-12 px-4 text-base',
    lg: 'h-14 px-5 text-lg'
  }
  
  // Color scheme styling
  const colorClasses = {
    default: {
      primary: 'bg-red-600 hover:bg-red-700 active:bg-red-800',
      secondary: 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300',
      border: 'border-gray-300 focus:border-red-600',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      success: 'bg-green-50 border-green-200 text-green-800',
      error: 'bg-red-50 border-red-200 text-red-800'
    },
    premium: {
      primary: 'bg-red-700 hover:bg-red-800 active:bg-red-900',
      secondary: 'bg-gray-50 hover:bg-gray-100 active:bg-gray-200',
      border: 'border-gray-400 focus:border-red-700',
      text: 'text-gray-900',
      textSecondary: 'text-gray-700',
      success: 'bg-green-100 border-green-300 text-green-900',
      error: 'bg-red-100 border-red-300 text-red-900'
    },
    minimal: {
      primary: 'bg-red-500 hover:bg-red-600 active:bg-red-700',
      secondary: 'bg-white hover:bg-gray-50 active:bg-gray-100',
      border: 'border-gray-200 focus:border-red-500',
      text: 'text-gray-800',
      textSecondary: 'text-gray-500',
      success: 'bg-green-25 border-green-100 text-green-700',
      error: 'bg-red-25 border-red-100 text-red-700'
    }
  }
  
  const colors = colorClasses[colorScheme]
  
  // Available makes sorted by popularity
  const availableMakes = sortByPopularity 
    ? [...MVP_VEHICLE_DATA.makes].sort((a, b) => b.popularity - a.popularity)
    : MVP_VEHICLE_DATA.makes
  
  // Get available models for selected make
  const getAvailableModels = useCallback((makeId: string): MVPVehicleModel[] => {
    const models = MVP_VEHICLE_DATA.models.filter(model => model.makeId === makeId)
    return sortByPopularity 
      ? models.sort((a, b) => b.popularity - a.popularity)
      : models
  }, [sortByPopularity])
  
  // Get available years for selected model
  const getAvailableYears = useCallback((model: MVPVehicleModel): number[] => {
    return [...model.years].sort((a, b) => b - a) // Latest years first
  }, [])
  
  // Update available options when selection changes
  useEffect(() => {
    if (state.selection.make) {
      const models = getAvailableModels(state.selection.make.id)
      const years = state.selection.model ? getAvailableYears(state.selection.model) : []
      
      setState(prev => ({
        ...prev,
        availableModels: models,
        availableYears: years
      }))
    } else {
      setState(prev => ({
        ...prev,
        availableModels: [],
        availableYears: []
      }))
    }
  }, [state.selection.make, state.selection.model, getAvailableModels, getAvailableYears])
  
  // Validation logic
  const validateSelection = useCallback((selection: MVPVehicleSelection): MVPVehicleValidationState => {
    const errors: MVPVehicleValidationState = {
      isValid: true,
      isComplete: false
    }
    
    if (!selection.make) {
      errors.make = 'Моля, изберете марка.'
      errors.isValid = false
    }
    
    if (!selection.model && selection.make) {
      errors.model = 'Моля, изберете модел.'
      errors.isValid = false
    }
    
    if (!selection.year && selection.model) {
      errors.year = 'Моля, изберете година.'
      errors.isValid = false
    }
    
    errors.isComplete = !!(selection.make && selection.model && selection.year)
    
    return errors
  }, [])
  
  // Update validation when selection changes
  useEffect(() => {
    const validation = validateSelection(state.selection)
    setState(prev => ({
      ...prev,
      validationErrors: validation,
      showConfirmation: validation.isComplete && showConfirmation
    }))
    
    // Notify parent component
    if (onSelectionChange) {
      onSelectionChange(state.selection)
    }
  }, [state.selection, validateSelection, onSelectionChange, showConfirmation])
  
  // Handle make selection
  const handleMakeChange = useCallback(async (make: MVPVehicleMake) => {
    // Simulate loading for better UX
    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, models: true }
    }))
    
    // Small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 150))
    
    setState(prev => ({
      ...prev,
      selection: {
        make,
        model: undefined,
        year: undefined
      },
      touched: { ...prev.touched, make: true },
      errors: { ...prev.errors, make: undefined },
      openDropdown: null,
      loading: { ...prev.loading, models: false }
    }))
    
    // Auto-focus next step
    if (modelButtonRef.current) {
      setTimeout(() => modelButtonRef.current?.focus(), 100)
    }
  }, [])
  
  // Handle model selection
  const handleModelChange = useCallback(async (model: MVPVehicleModel) => {
    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, years: true }
    }))
    
    await new Promise(resolve => setTimeout(resolve, 100))
    
    setState(prev => ({
      ...prev,
      selection: {
        ...prev.selection,
        model,
        year: undefined
      },
      touched: { ...prev.touched, model: true },
      errors: { ...prev.errors, model: undefined },
      openDropdown: null,
      loading: { ...prev.loading, years: false }
    }))
    
    // Auto-focus next step
    if (yearButtonRef.current) {
      setTimeout(() => yearButtonRef.current?.focus(), 100)
    }
  }, [])
  
  // Handle year selection
  const handleYearChange = useCallback(async (year: number) => {
    setState(prev => ({
      ...prev,
      selection: {
        ...prev.selection,
        year
      },
      touched: { ...prev.touched, year: true },
      errors: { ...prev.errors, year: undefined },
      openDropdown: null
    }))
    
    // Auto-focus confirmation or find parts button
    if (confirmationRef.current) {
      setTimeout(() => confirmationRef.current?.focus(), 100)
    }
  }, [])
  
  // Handle dropdown toggle
  const handleDropdownToggle = useCallback((dropdownId: string) => {
    setState(prev => ({
      ...prev,
      openDropdown: prev.openDropdown === dropdownId ? null : dropdownId
    }))
  }, [])
  
  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent, dropdownId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleDropdownToggle(dropdownId)
    } else if (event.key === 'Escape') {
      setState(prev => ({ ...prev, openDropdown: null }))
    }
  }, [handleDropdownToggle])
  
  // Handle reset
  const handleReset = useCallback(async () => {
    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, resetting: true }
    }))
    
    await new Promise(resolve => setTimeout(resolve, 200))
    
    setState(prev => ({
      ...prev,
      selection: {},
      availableModels: [],
      availableYears: [],
      errors: {},
      openDropdown: null,
      showConfirmation: false,
      touched: {
        make: false,
        model: false,
        year: false
      },
      validationErrors: {
        isValid: false,
        isComplete: false
      },
      loading: { ...prev.loading, resetting: false }
    }))
    
    if (onReset) {
      onReset()
    }
    
    // Auto-focus first step
    if (makeButtonRef.current) {
      setTimeout(() => makeButtonRef.current?.focus(), 100)
    }
  }, [onReset])
  
  // Handle find parts
  const handleFindParts = useCallback(async () => {
    if (!state.validationErrors.isComplete) {
      return
    }
    
    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, findingParts: true }
    }))
    
    await new Promise(resolve => setTimeout(resolve, 300))
    
    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, findingParts: false }
    }))
    
    if (onFindParts) {
      onFindParts(state.selection)
    }
  }, [state.validationErrors.isComplete, state.selection, onFindParts])
  
  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    focus: () => makeButtonRef.current?.focus(),
    blur: () => containerRef.current?.blur(),
    reset: handleReset,
    clear: handleReset,
    validate: () => state.validationErrors.isValid,
    submit: handleFindParts,
    getSelection: () => state.selection,
    setSelection: (selection: MVPVehicleSelection) => {
      setState(prev => ({ ...prev, selection }))
    },
    element: containerRef.current
  }), [handleReset, handleFindParts, state.validationErrors.isValid, state.selection])
  
  // Dropdown option renderer
  const renderDropdownOption = (option: MVPDropdownOption, isSelected: boolean, onClick: () => void) => (
    <button
      key={option.value}
      type="button"
      onClick={onClick}
      className={cn(
        'w-full flex items-center justify-between px-4 py-3 text-left transition-colors',
        'hover:bg-gray-50 active:bg-gray-100',
        'focus:outline-none focus:bg-gray-50',
        isSelected ? 'bg-red-50 text-red-700' : colors.text
      )}
      role="option"
      aria-selected={isSelected}
    >
      <div className="flex items-center gap-3">
        {showLogos && option.logo && (
          <img 
            src={option.logo} 
            alt={option.label}
            className="w-6 h-6 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        )}
        <span className="truncate">{option.label}</span>
      </div>
      {isSelected && (
        <CheckIcon className="h-4 w-4 text-red-600 flex-shrink-0" />
      )}
    </button>
  )
  
  // Dropdown component
  const renderDropdown = (
    id: string,
    label: string,
    placeholder: string,
    options: MVPDropdownOption[],
    selectedOption: MVPDropdownOption | undefined,
    onSelect: (option: any) => void,
    disabled: boolean = false,
    loading: boolean = false,
    error?: string,
    buttonRef?: React.RefObject<HTMLButtonElement>
  ) => (
    <div className="relative">
      {/* Label */}
      <label 
        htmlFor={id}
        className={cn(
          'block text-sm font-semibold mb-2',
          colors.text,
          disabled && 'opacity-50'
        )}
      >
        {label}
        {showStepNumbers && (
          <span className="ml-1 text-red-600">*</span>
        )}
      </label>
      
      {/* Dropdown Button */}
      <button
        ref={buttonRef}
        id={id}
        type="button"
        onClick={() => !disabled && !loading && handleDropdownToggle(id)}
        onKeyDown={(e) => enableKeyboardNavigation && handleKeyDown(e, id)}
        disabled={disabled || loading}
        className={cn(
          'w-full flex items-center justify-between rounded-lg border transition-all duration-200',
          sizeClasses[size],
          colors.border,
          'bg-white text-left shadow-sm',
          'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-600/20',
          'active:scale-[0.98] active:shadow-sm',
          disabled && 'opacity-50 cursor-not-allowed bg-gray-50',
          loading && 'opacity-75 cursor-wait',
          error && 'border-red-300 focus:border-red-500',
          state.openDropdown === id && 'border-red-600 ring-2 ring-red-600/20'
        )}
        aria-label={`${label} - ${selectedOption?.label || placeholder}`}
        aria-expanded={state.openDropdown === id}
        aria-haspopup="listbox"
        aria-describedby={error ? `${id}-error` : undefined}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-500">Зареждане...</span>
            </div>
          ) : selectedOption ? (
            <>
              {showLogos && selectedOption.logo && (
                <img 
                  src={selectedOption.logo} 
                  alt={selectedOption.label}
                  className="w-5 h-5 object-contain flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              )}
              <span className="truncate font-medium">{selectedOption.label}</span>
            </>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>
        
        <ChevronDownIcon 
          className={cn(
            'h-5 w-5 text-gray-400 transition-transform duration-200',
            state.openDropdown === id && 'rotate-180'
          )}
        />
      </button>
      
      {/* Dropdown Menu */}
      {state.openDropdown === id && (
        <div 
          className={cn(
            'absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg',
            'max-h-80 overflow-y-auto',
            'animate-in fade-in-0 zoom-in-95 duration-200'
          )}
          style={{ maxHeight: `${maxDropdownHeight}px` }}
          role="listbox"
          aria-label={`${label} options`}
        >
          {options.length === 0 ? (
            <div className="px-4 py-6 text-center text-gray-500">
              <ExclamationTriangleIcon className="h-6 w-6 mx-auto mb-2" />
              <p>Няма налични опции</p>
            </div>
          ) : (
            options.map(option => renderDropdownOption(
              option,
              selectedOption?.value === option.value,
              () => onSelect(option.metadata || option.value)
            ))
          )}
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <p 
          id={`${id}-error`}
          className="mt-1 text-sm text-red-600 flex items-center gap-1"
          role="alert"
        >
          <ExclamationTriangleIcon className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  )
  
  // Convert data to dropdown options
  const makeOptions: MVPDropdownOption[] = availableMakes.map(make => ({
    value: make.id,
    label: make.name,
    logo: make.logo,
    popularity: make.popularity,
    metadata: make
  }))
  
  const modelOptions: MVPDropdownOption[] = state.availableModels.map(model => ({
    value: model.id,
    label: model.name,
    popularity: model.popularity,
    metadata: model
  }))
  
  const yearOptions: MVPDropdownOption[] = state.availableYears.map(year => ({
    value: year.toString(),
    label: year.toString(),
    metadata: year
  }))
  
  return (
    <div 
      ref={containerRef}
      className={cn(
        'max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8',
        'transition-all duration-300',
        className
      )}
      data-testid={testId}
      role="region"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Изберете вашия автомобил
        </h2>
        <p className="text-lg text-gray-600 mb-2">
          Въведете марка, модел и година за точно съвпадение на części
        </p>
        <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
          <SparklesIcon className="w-5 h-5" />
          <span>100% съвместимост гарантирана</span>
        </div>
      </div>
      
      {/* Progress Indicator */}
      {showProgress && (
        <div className="mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold',
              state.selection.make ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            )}>
              1
            </div>
            <div className={cn(
              'w-16 h-1 rounded-full',
              state.selection.make ? 'bg-green-200' : 'bg-gray-200'
            )} />
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold',
              state.selection.model ? 'bg-green-100 text-green-700' : 
              state.selection.make ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-400'
            )}>
              2
            </div>
            <div className={cn(
              'w-16 h-1 rounded-full',
              state.selection.model ? 'bg-green-200' : 'bg-gray-200'
            )} />
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold',
              state.selection.year ? 'bg-green-100 text-green-700' : 
              state.selection.model ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-400'
            )}>
              3
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Марка</span>
            <span>Модел</span>
            <span>Година</span>
          </div>
        </div>
      )}
      
      {/* Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Make Dropdown */}
        {renderDropdown(
          'make',
          'Марка',
          'Изберете марка',
          makeOptions,
          state.selection.make ? {
            value: state.selection.make.id,
            label: state.selection.make.name,
            logo: state.selection.make.logo
          } : undefined,
          handleMakeChange,
          disabled || state.loading.resetting,
          state.loading.makes,
          state.validationErrors.make,
          makeButtonRef
        )}
        
        {/* Model Dropdown */}
        {renderDropdown(
          'model',
          'Модел',
          'Изберете модел',
          modelOptions,
          state.selection.model ? {
            value: state.selection.model.id,
            label: state.selection.model.name
          } : undefined,
          handleModelChange,
          disabled || !state.selection.make || state.loading.resetting,
          state.loading.models,
          state.validationErrors.model,
          modelButtonRef
        )}
        
        {/* Year Dropdown */}
        {renderDropdown(
          'year',
          'Година',
          'Изберете година',
          yearOptions,
          state.selection.year ? {
            value: state.selection.year.toString(),
            label: state.selection.year.toString()
          } : undefined,
          handleYearChange,
          disabled || !state.selection.model || state.loading.resetting,
          state.loading.years,
          state.validationErrors.year,
          yearButtonRef
        )}
      </div>
      
      {/* Confirmation Section */}
      {state.showConfirmation && state.validationErrors.isComplete && (
        <div 
          ref={confirmationRef}
          className={cn(
            'mb-6 p-6 bg-green-50 border border-green-200 rounded-lg',
            'animate-in fade-in-0 slide-in-from-bottom-4 duration-300'
          )}
          role="status"
          aria-live="polite"
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <CheckIcon className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-green-800">
                Вашият избор:
              </h3>
            </div>
            <p className="text-2xl font-bold text-green-900 mb-2">
              {state.selection.make?.name} → {state.selection.model?.name} → {state.selection.year}
            </p>
            <p className="text-green-700 font-medium">
              Избрахте правилно! Сега можете да търсите части.
            </p>
          </div>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {/* Find Parts Button */}
        <button
          type="button"
          onClick={handleFindParts}
          disabled={!state.validationErrors.isComplete || state.loading.findingParts}
          className={cn(
            'flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-white',
            'transition-all duration-200 shadow-lg hover:shadow-xl',
            'active:scale-[0.98] active:shadow-lg',
            'focus:outline-none focus:ring-2 focus:ring-red-600/20',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
            state.validationErrors.isComplete 
              ? colors.primary 
              : 'bg-gray-400 cursor-not-allowed'
          )}
          aria-label="Намери части за избрания автомобил"
        >
          {state.loading.findingParts ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Търсене...</span>
            </>
          ) : (
            <>
              <MagnifyingGlassIcon className="w-5 h-5" />
              <span>Намери части</span>
            </>
          )}
        </button>
        
        {/* Reset Button */}
        <button
          type="button"
          onClick={handleReset}
          disabled={state.loading.resetting}
          className={cn(
            'flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-semibold',
            'border border-gray-300 text-gray-700 bg-white',
            'hover:bg-gray-50 active:bg-gray-100',
            'transition-all duration-200 shadow-sm hover:shadow-md',
            'active:scale-[0.98] active:shadow-sm',
            'focus:outline-none focus:ring-2 focus:ring-gray-500/20',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
          )}
          aria-label="Започни отначало избора на автомобил"
        >
          {state.loading.resetting ? (
            <>
              <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
              <span>Зареждане...</span>
            </>
          ) : (
            <>
              <ArrowPathIcon className="w-5 h-5" />
              <span>Започни отначало</span>
            </>
          )}
        </button>
      </div>
      
      {/* Click outside to close dropdowns */}
      {state.openDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setState(prev => ({ ...prev, openDropdown: null }))}
          aria-hidden="true"
        />
      )}
    </div>
  )
})

MVPVehicleSelector.displayName = 'MVPVehicleSelector'

export default MVPVehicleSelector 