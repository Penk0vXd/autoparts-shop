'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { 
  ChevronDownIcon, 
  XMarkIcon, 
  CheckIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { 
  CarSelection, 
  CarMake, 
  CarModel, 
  CarSelectionProps,
  CarSelectionLoadingState,
  CarSelectionErrorState 
} from '@/types/nhtsa'
import { 
  getNHTSAMakes, 
  getNHTSAModels, 
  generateYearRange 
} from '@/services/nhtsaService'
import { cn } from '@/lib/utils'

/**
 * CarSelection Component
 * 
 * Premium car selection component with cascading dropdowns for Make, Model, and Year.
 * Fetches real-time data from NHTSA vPIC API with modern white/red design.
 * 
 * Features:
 * - Cascading dropdowns (Make → Model → Year)
 * - Real-time NHTSA API integration
 * - Mobile-first responsive design
 * - Accessibility compliant (ARIA labels, keyboard navigation)
 * - Loading states and error handling
 * - Clean white/red color scheme
 */
export function CarSelection({
  onSelectionChange,
  initialSelection = {},
  showYearSelector = true,
  showClearButton = true,
  className,
  size = 'md',
  placeholder = {},
  yearRange = { start: 1990, end: new Date().getFullYear() + 1 }
}: CarSelectionProps) {
  // State for current selection
  const [selection, setSelection] = useState<CarSelection>(initialSelection)
  
  // State for dropdown options
  const [makes, setMakes] = useState<CarMake[]>([])
  const [models, setModels] = useState<CarModel[]>([])
  const [years, setYears] = useState<number[]>([])
  
  // Dropdown open states
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  
  // Loading states
  const [loading, setLoading] = useState<CarSelectionLoadingState>({
    makes: false,
    models: false
  })
  
  // Error states
  const [errors, setErrors] = useState<CarSelectionErrorState>({
    makes: '',
    models: ''
  })

  // Refs for dropdown buttons (for keyboard navigation)
  const makeButtonRef = useRef<HTMLButtonElement>(null)
  const modelButtonRef = useRef<HTMLButtonElement>(null)
  const yearButtonRef = useRef<HTMLButtonElement>(null)

  // Size-based styling
  const sizeClasses = {
    sm: 'h-10 px-3 text-sm',
    md: 'h-12 px-4 text-base',
    lg: 'h-14 px-5 text-lg'
  }

  // Placeholder text
  const placeholderText = {
    make: placeholder.make || 'Select Make',
    model: placeholder.model || 'Select Model',
    year: placeholder.year || 'Select Year'
  }

  /**
   * Load vehicle makes on component mount
   */
  useEffect(() => {
    loadMakes()
  }, [])

  /**
   * Load models when make changes
   */
  useEffect(() => {
    if (selection.make) {
      loadModels(selection.make.name)
    } else {
      setModels([])
      setSelection(prev => ({ ...prev, model: undefined, year: undefined }))
    }
  }, [selection.make])

  /**
   * Generate years when year selector is enabled
   */
  useEffect(() => {
    if (showYearSelector) {
      const yearList = generateYearRange(yearRange.start, yearRange.end)
      setYears(yearList)
    }
  }, [showYearSelector, yearRange])

  /**
   * Notify parent component of selection changes
   */
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selection)
    }
  }, [selection, onSelectionChange])

  /**
   * Load available makes from NHTSA API
   */
  const loadMakes = async () => {
    try {
      setLoading(prev => ({ ...prev, makes: true }))
      setErrors(prev => ({ ...prev, makes: '' }))
      
      const makesData = await getNHTSAMakes()
      setMakes(makesData)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load vehicle makes'
      setErrors(prev => ({ ...prev, makes: errorMessage }))
    } finally {
      setLoading(prev => ({ ...prev, makes: false }))
    }
  }

  /**
   * Load models for selected make from NHTSA API
   */
  const loadModels = async (makeName: string) => {
    try {
      setLoading(prev => ({ ...prev, models: true }))
      setErrors(prev => ({ ...prev, models: '' }))
      
      const modelsData = await getNHTSAModels(makeName)
      setModels(modelsData)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load vehicle models'
      setErrors(prev => ({ ...prev, models: errorMessage }))
    } finally {
      setLoading(prev => ({ ...prev, models: false }))
    }
  }

  /**
   * Handle make selection
   */
  const handleMakeChange = useCallback((make: CarMake) => {
    setSelection(prev => ({
      make,
      model: undefined,
      year: undefined
    }))
    setOpenDropdown(null)
  }, [])

  /**
   * Handle model selection
   */
  const handleModelChange = useCallback((model: CarModel) => {
    setSelection(prev => ({
      ...prev,
      model,
      year: undefined
    }))
    setOpenDropdown(null)
  }, [])

  /**
   * Handle year selection
   */
  const handleYearChange = useCallback((year: number) => {
    setSelection(prev => ({
      ...prev,
      year
    }))
    setOpenDropdown(null)
  }, [])

  /**
   * Clear all selections
   */
  const handleClear = useCallback(() => {
    setSelection({})
    setOpenDropdown(null)
  }, [])

  /**
   * Handle dropdown toggle
   */
  const handleDropdownToggle = useCallback((dropdownId: string) => {
    setOpenDropdown(prev => prev === dropdownId ? null : dropdownId)
  }, [])

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = useCallback((event: React.KeyboardEvent, dropdownId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleDropdownToggle(dropdownId)
    } else if (event.key === 'Escape') {
      setOpenDropdown(null)
    }
  }, [handleDropdownToggle])

  /**
   * Close dropdown when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown && 
          !((event.target as Element)?.closest('.car-selection-dropdown'))) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openDropdown])

  /**
   * Render skeleton loader
   */
  const renderSkeleton = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-12 bg-gray-200 rounded-lg"></div>
      <div className="h-12 bg-gray-200 rounded-lg"></div>
      <div className="h-12 bg-gray-200 rounded-lg"></div>
    </div>
  )

  /**
   * Render error message
   */
  const renderError = (error: string, onRetry: () => void) => (
    <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-center space-x-2">
        <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
        <span className="text-sm text-red-700">{error}</span>
      </div>
      <button
        onClick={onRetry}
        className="flex items-center space-x-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors"
      >
        <ArrowPathIcon className="h-4 w-4" />
        <span className="text-sm">Retry</span>
      </button>
    </div>
  )

  /**
   * Render dropdown button
   */
  const renderDropdownButton = (
    dropdownId: string,
    selectedText: string,
    isDisabled: boolean,
    isLoading: boolean,
    error: string,
    buttonRef: React.RefObject<HTMLButtonElement>
  ) => (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => !isDisabled && handleDropdownToggle(dropdownId)}
        onKeyDown={(e) => !isDisabled && handleKeyDown(e, dropdownId)}
        disabled={isDisabled}
        aria-expanded={openDropdown === dropdownId}
        aria-haspopup="listbox"
        className={cn(
          'w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-200',
          sizeClasses[size],
          isDisabled 
            ? 'cursor-not-allowed opacity-50' 
            : 'hover:border-red-300 hover:shadow-md focus:ring-2 focus:ring-red-500 focus:border-red-500',
          error ? 'border-red-300 bg-red-50' : '',
          openDropdown === dropdownId ? 'border-red-500 shadow-md' : ''
        )}
      >
        <span className={cn(
          'truncate',
          selectedText === placeholderText.make || 
          selectedText === placeholderText.model || 
          selectedText === placeholderText.year
            ? 'text-gray-500' 
            : 'text-gray-900'
        )}>
          {selectedText}
        </span>
        <div className="flex items-center space-x-2">
          {isLoading && (
            <ArrowPathIcon className="h-4 w-4 text-gray-400 animate-spin" />
          )}
          <ChevronDownIcon 
            className={cn(
              'h-4 w-4 text-gray-400 transition-transform duration-200',
              openDropdown === dropdownId ? 'rotate-180' : ''
            )} 
          />
        </div>
      </button>
      
      {error && (
        <div className="absolute top-full left-0 right-0 mt-1 z-10">
          {renderError(error, dropdownId === 'make' ? loadMakes : () => loadModels(selection.make?.name || ''))}
        </div>
      )}
    </div>
  )

  /**
   * Render dropdown options
   */
  const renderDropdownOptions = (
    dropdownId: string,
    options: any[],
    onSelect: (option: any) => void,
    selectedValue?: any,
    renderOption?: (option: any) => React.ReactNode
  ) => {
    if (openDropdown !== dropdownId) return null

    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
        {options.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No options available
          </div>
        ) : (
          <div className="py-2" role="listbox">
            {options.map((option, index) => {
              const isSelected = selectedValue === option || 
                (typeof selectedValue === 'object' && selectedValue?.id === option.id)
              
              return (
                <button
                  key={typeof option === 'object' ? option.id : option}
                  type="button"
                  onClick={() => onSelect(option)}
                  className={cn(
                    'w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors',
                    isSelected ? 'bg-red-50 text-red-700' : 'text-gray-900'
                  )}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span className="truncate">
                    {renderOption ? renderOption(option) : (typeof option === 'object' ? option.name : option)}
                  </span>
                  {isSelected && (
                    <CheckIcon className="h-4 w-4 text-red-600 flex-shrink-0" />
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  // Show skeleton while loading initial makes
  if (loading.makes && makes.length === 0) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Select Your Vehicle
          </h3>
          <p className="text-gray-600 text-sm">
            Loading vehicle makes...
          </p>
        </div>
        {renderSkeleton()}
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Select Your Vehicle
        </h3>
        <p className="text-gray-600 text-sm">
          Choose your car make, model, and year to find compatible parts
        </p>
      </div>

      {/* Dropdowns */}
      <div className="space-y-4">
        {/* Make Dropdown */}
        <div className="relative car-selection-dropdown">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Make *
          </label>
          {renderDropdownButton(
            'make',
            selection.make?.name || placeholderText.make,
            loading.makes,
            loading.makes,
            errors.makes,
            makeButtonRef
          )}
          {renderDropdownOptions(
            'make',
            makes,
            handleMakeChange,
            selection.make
          )}
        </div>

        {/* Model Dropdown */}
        <div className="relative car-selection-dropdown">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Model {selection.make ? '*' : ''}
          </label>
          {renderDropdownButton(
            'model',
            selection.model?.name || placeholderText.model,
            !selection.make || loading.models,
            loading.models,
            errors.models,
            modelButtonRef
          )}
          {renderDropdownOptions(
            'model',
            models,
            handleModelChange,
            selection.model
          )}
        </div>

        {/* Year Dropdown */}
        {showYearSelector && (
          <div className="relative car-selection-dropdown">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year
            </label>
            {renderDropdownButton(
              'year',
              selection.year?.toString() || placeholderText.year,
              false,
              false,
              '',
              yearButtonRef
            )}
            {renderDropdownOptions(
              'year',
              years,
              handleYearChange,
              selection.year
            )}
          </div>
        )}
      </div>

      {/* Clear Button */}
      {showClearButton && (selection.make || selection.model || selection.year) && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
          >
            <XMarkIcon className="h-4 w-4" />
            <span>Clear Selection</span>
          </button>
        </div>
      )}

      {/* Selection Summary */}
      {(selection.make || selection.model || selection.year) && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Selected Vehicle:</h4>
          <div className="text-sm text-gray-700 space-y-1">
            {selection.make && (
              <div>
                <span className="font-medium">Make:</span> {selection.make.name}
              </div>
            )}
            {selection.model && (
              <div>
                <span className="font-medium">Model:</span> {selection.model.name}
              </div>
            )}
            {selection.year && (
              <div>
                <span className="font-medium">Year:</span> {selection.year}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 