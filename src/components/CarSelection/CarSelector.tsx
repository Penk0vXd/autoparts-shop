'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ChevronDownIcon, XMarkIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

// TypeScript interfaces for the component data structure
interface CarMake {
  id: string
  name: string
  models: string[]
}

interface CarSelection {
  make?: string
  model?: string
  year?: number
}

interface CarSelectorProps {
  onSelectionChange?: (selection: CarSelection) => void
  onFindParts?: (selection: CarSelection) => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

// Static JSON data for car makes, models, and years
const CAR_DATA: CarMake[] = [
  {
    id: 'mercedes-benz',
    name: 'Mercedes-Benz',
    models: ['GLE', 'C-Class', 'E-Class', 'S-Class', 'GLC', 'GLS', 'A-Class', 'CLA', 'GLA', 'GLB']
  },
  {
    id: 'bmw',
    name: 'BMW',
    models: ['3 Series', '5 Series', '7 Series', 'X1', 'X3', 'X5', 'X7', 'Z4', 'i3', 'i8']
  },
  {
    id: 'audi',
    name: 'Audi',
    models: ['A3', 'A4', 'A6', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'TT', 'R8']
  },
  {
    id: 'toyota',
    name: 'Toyota',
    models: ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Prius', 'Sienna', 'Tacoma', 'Tundra', '4Runner', 'Sequoia']
  },
  {
    id: 'honda',
    name: 'Honda',
    models: ['Civic', 'Accord', 'CR-V', 'Pilot', 'Odyssey', 'Fit', 'HR-V', 'Passport', 'Ridgeline']
  },
  {
    id: 'ford',
    name: 'Ford',
    models: ['F-150', 'Escape', 'Explorer', 'Fusion', 'Focus', 'Mustang', 'Edge', 'Expedition', 'Ranger']
  },
  {
    id: 'chevrolet',
    name: 'Chevrolet',
    models: ['Silverado', 'Equinox', 'Malibu', 'Tahoe', 'Suburban', 'Traverse', 'Cruze', 'Impala', 'Camaro']
  },
  {
    id: 'nissan',
    name: 'Nissan',
    models: ['Altima', 'Sentra', 'Rogue', 'Pathfinder', 'Murano', 'Frontier', 'Titan', 'Armada', 'Maxima']
  },
  {
    id: 'hyundai',
    name: 'Hyundai',
    models: ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Palisade', 'Kona', 'Venue', 'Ioniq', 'Genesis']
  },
  {
    id: 'kia',
    name: 'Kia',
    models: ['Forte', 'Optima', 'Sorento', 'Sportage', 'Telluride', 'Soul', 'Rio', 'Stinger', 'Niro']
  },
  {
    id: 'volkswagen',
    name: 'Volkswagen',
    models: ['Jetta', 'Passat', 'Tiguan', 'Atlas', 'Golf', 'Beetle', 'Arteon', 'ID.4', 'Touareg']
  },
  {
    id: 'tesla',
    name: 'Tesla',
    models: ['Model S', 'Model 3', 'Model X', 'Model Y', 'Cybertruck', 'Roadster']
  },
  {
    id: 'lexus',
    name: 'Lexus',
    models: ['ES', 'IS', 'GS', 'LS', 'NX', 'RX', 'GX', 'LX', 'LC', 'RC']
  },
  {
    id: 'porsche',
    name: 'Porsche',
    models: ['911', 'Cayenne', 'Macan', 'Panamera', 'Taycan', 'Boxster', 'Cayman']
  },
  {
    id: 'jaguar',
    name: 'Jaguar',
    models: ['XE', 'XF', 'XJ', 'F-PACE', 'E-PACE', 'I-PACE', 'F-TYPE']
  }
]

// Generate years from 2000 to current year + 1
const YEARS = Array.from({ length: new Date().getFullYear() - 1999 + 1 }, (_, i) => 2000 + i).reverse()

/**
 * CarSelector Component
 * 
 * A production-ready car selection component with cascading dropdowns.
 * Features static JSON data, modern design, and comprehensive UX states.
 * 
 * @param onSelectionChange - Callback when selection changes
 * @param onFindParts - Callback when Find Parts button is clicked
 * @param className - Additional CSS classes
 * @param size - Component size variant
 */
export function CarSelector({
  onSelectionChange,
  onFindParts,
  className,
  size = 'md'
}: CarSelectorProps) {
  // Component state
  const [selection, setSelection] = useState<CarSelection>({})
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Refs for dropdown management
  const dropdownRefs = {
    make: useRef<HTMLDivElement>(null),
    model: useRef<HTMLDivElement>(null),
    year: useRef<HTMLDivElement>(null)
  }
  
  // Size variants for consistent styling
  const sizeClasses = {
    sm: 'h-10 px-3 text-sm',
    md: 'h-12 px-4 text-base',
    lg: 'h-14 px-5 text-lg'
  }
  
  // Get available models for selected make
  const availableModels = selection.make 
    ? CAR_DATA.find(make => make.name === selection.make)?.models || []
    : []
  
  // Check if selection is complete
  const isSelectionComplete = selection.make && selection.model && selection.year
  
  // Simulate loading state for better UX
  const simulateLoading = async (duration: number = 300) => {
    setIsLoading(true)
    setError(null)
    await new Promise(resolve => setTimeout(resolve, duration))
    setIsLoading(false)
  }
  
  // Handle make selection
  const handleMakeChange = async (make: string) => {
    await simulateLoading(200)
    const newSelection = { 
      make, 
      model: undefined, 
      year: selection.year // Keep year if already selected
    }
    setSelection(newSelection)
    setOpenDropdown(null)
    setShowSuccess(false)
    setError(null)
  }
  
  // Handle model selection
  const handleModelChange = async (model: string) => {
    await simulateLoading(150)
    const newSelection = { 
      ...selection, 
      model 
    }
    setSelection(newSelection)
    setOpenDropdown(null)
    setShowSuccess(false)
    setError(null)
  }
  
  // Handle year selection
  const handleYearChange = async (year: number) => {
    await simulateLoading(100)
    const newSelection = { 
      ...selection, 
      year 
    }
    setSelection(newSelection)
    setOpenDropdown(null)
    setShowSuccess(true)
    setError(null)
    
    // Auto-hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000)
  }
  
  // Handle clear selection
  const handleClear = () => {
    setSelection({})
    setOpenDropdown(null)
    setShowSuccess(false)
    setError(null)
  }
  
     // Handle find parts click
   const handleFindParts = () => {
     if (!isSelectionComplete) {
       setError('Моля изберете марка, модел и година, за да намерите части')
       return
     }
     
     setError(null)
     onFindParts?.(selection)
   }
  
  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const isClickInside = Object.values(dropdownRefs).some(ref => 
        ref.current?.contains(target)
      )
      
      if (!isClickInside) {
        setOpenDropdown(null)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  // Notify parent of selection changes
  useEffect(() => {
    onSelectionChange?.(selection)
  }, [selection, onSelectionChange])
  
  // Dropdown Component
  const Dropdown = ({ 
    id, 
    label, 
    value, 
    placeholder, 
    options, 
    onSelect, 
    disabled = false,
    showSkeleton = false
  }: {
    id: string
    label: string
    value?: string | number
    placeholder: string
    options: (string | number)[]
    onSelect: (value: string | number) => void
    disabled?: boolean
    showSkeleton?: boolean
  }) => {
    const isOpen = openDropdown === id
    const isEmpty = options.length === 0
    
    return (
      <div className="relative" ref={dropdownRefs[id as keyof typeof dropdownRefs]}>
        <label 
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
        
        <button
          id={id}
          type="button"
          onClick={() => !disabled && !isEmpty && setOpenDropdown(isOpen ? null : id)}
          disabled={disabled || isEmpty || isLoading}
                     className={cn(
             'w-full flex items-center justify-between rounded-lg border bg-white text-left shadow-sm transition-all duration-200',
             sizeClasses[size],
             (disabled || isEmpty || isLoading)
               ? 'cursor-not-allowed opacity-50 border-gray-200'
               : 'cursor-pointer border-gray-300 hover:border-red-300 hover:shadow-md focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none',
             isOpen ? 'border-red-500 ring-2 ring-red-200 shadow-md' : ''
           )}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label={`${label} dropdown`}
        >
          <span className={cn(
            'truncate flex items-center gap-2',
            !value && 'text-gray-500'
          )}>
            {showSkeleton ? (
                             <div className="flex items-center gap-2">
                 <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                 <span className="text-gray-500">Зареждане...</span>
               </div>
            ) : (
              value || placeholder
            )}
          </span>
          
          <ChevronDownIcon 
            className={cn(
              'w-5 h-5 text-gray-400 transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
          />
        </button>
        
        {/* Dropdown Menu */}
        {isOpen && !showSkeleton && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            <div className="py-1">
              {options.length > 0 ? (
                options.map((option, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => onSelect(option)}
                    className={cn(
                      'w-full px-4 py-2 text-left text-sm transition-colors duration-150',
                      'hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600 focus:outline-none',
                      value === option && 'bg-red-50 text-red-600 font-medium'
                    )}
                    role="option"
                    aria-selected={value === option}
                  >
                    {option}
                  </button>
                ))
                               ) : (
                 <div className="px-4 py-2 text-sm text-gray-500">
                   Няма налични опции
                 </div>
               )}
            </div>
          </div>
        )}
      </div>
    )
  }
  
  return (
    <div className={cn('max-w-4xl mx-auto', className)}>
      {/* Main Selection Interface */}
      <div className="space-y-6">
        {/* Dropdowns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     {/* Make Dropdown */}
           <Dropdown
             id="make"
             label="Марка"
             value={selection.make}
             placeholder="Изберете марка"
             options={CAR_DATA.map(make => make.name)}
             onSelect={(value) => handleMakeChange(value as string)}
             showSkeleton={isLoading && !selection.make}
           />
           
           {/* Model Dropdown */}
           <Dropdown
             id="model"
             label="Модел"
             value={selection.model}
             placeholder="Изберете модел"
             options={availableModels}
             onSelect={(value) => handleModelChange(value as string)}
             disabled={!selection.make}
             showSkeleton={Boolean(isLoading && selection.make && !selection.model)}
           />
           
           {/* Year Dropdown */}
           <Dropdown
             id="year"
             label="Година"
             value={selection.year}
             placeholder="Изберете година"
             options={YEARS}
             onSelect={(value) => handleYearChange(value as number)}
             showSkeleton={Boolean(isLoading && selection.model && !selection.year)}
           />
        </div>
        
        {/* Error State */}
        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
            <ExclamationCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        
                 {/* Success State */}
         {showSuccess && isSelectionComplete && (
           <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg animate-pulse">
             <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
             <p className="text-sm text-green-600">
               Автомобилът е избран успешно! Готов за намиране на части.
             </p>
           </div>
         )}
        
        {/* Selection Summary Card */}
        {(selection.make || selection.model || selection.year) && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                         <div className="flex items-center justify-between mb-4">
               <h3 className="text-lg font-semibold text-gray-900">
                 Избор на автомобил
               </h3>
               <button
                 onClick={handleClear}
                 className="inline-flex items-center gap-1 px-3 py-1 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-150"
                 aria-label="Clear selection"
               >
                 <XMarkIcon className="w-4 h-4" />
                 Изчисти
               </button>
             </div>
            
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
               <div>
                 <span className="font-medium text-gray-700">Марка:</span>
                 <p className="text-gray-900 mt-1">
                   {selection.make || <span className="text-gray-400">Не е избрана</span>}
                 </p>
               </div>
               <div>
                 <span className="font-medium text-gray-700">Модел:</span>
                 <p className="text-gray-900 mt-1">
                   {selection.model || <span className="text-gray-400">Не е избран</span>}
                 </p>
               </div>
               <div>
                 <span className="font-medium text-gray-700">Година:</span>
                 <p className="text-gray-900 mt-1">
                   {selection.year || <span className="text-gray-400">Не е избрана</span>}
                 </p>
               </div>
             </div>
            
            {/* Find Parts Button */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleFindParts}
                disabled={!isSelectionComplete}
                className={cn(
                  'inline-flex items-center gap-2 px-8 py-3 text-base font-semibold rounded-lg transition-all duration-200 transform',
                  isSelectionComplete
                    ? 'bg-red-600 text-white hover:bg-red-700 hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                )}
              >
                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                 </svg>
                 Намери части
              </button>
            </div>
          </div>
        )}
        
        {/* Progress Indicator */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2">
            <div className={cn(
              'w-3 h-3 rounded-full transition-colors duration-200',
              selection.make ? 'bg-red-500' : 'bg-gray-300'
            )} />
            <div className="w-6 h-0.5 bg-gray-300" />
            <div className={cn(
              'w-3 h-3 rounded-full transition-colors duration-200',
              selection.model ? 'bg-red-500' : 'bg-gray-300'
            )} />
            <div className="w-6 h-0.5 bg-gray-300" />
            <div className={cn(
              'w-3 h-3 rounded-full transition-colors duration-200',
              selection.year ? 'bg-red-500' : 'bg-gray-300'
            )} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarSelector 