'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { ChevronDownIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { 
  VehicleSelectorProps, 
  VehicleSelection, 
  VehicleMake, 
  VehicleModel, 
  VehicleEngine,
  VehicleDropdownOption 
} from '@/types/vehicle'
import { getVehicleMakes, getVehicleModels, getVehicleYears, getVehicleEngines } from '@/services/vehicleService'
import { cn } from '@/lib/utils'

/**
 * VehicleSelector Component
 * 
 * Premium cascading dropdown component for vehicle selection in auto parts catalog.
 * Features Make → Model → Year → Engine progression with real-time filtering.
 */
export function VehicleSelector({
  onSelectionChange,
  initialSelection = {},
  showEngineSelector = true,
  showClearButton = true,
  className,
  size = 'md',
  placeholder = {}
}: VehicleSelectorProps) {
  // State for current selection
  const [selection, setSelection] = useState<VehicleSelection>(initialSelection)
  
  // State for dropdown options
  const [makes, setMakes] = useState<VehicleMake[]>([])
  const [models, setModels] = useState<VehicleModel[]>([])
  const [years, setYears] = useState<number[]>([])
  const [engines, setEngines] = useState<VehicleEngine[]>([])
  
  // Loading states
  const [loading, setLoading] = useState({
    makes: false,
    models: false,
    years: false,
    engines: false
  })
  
  // Error states
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Size-based styling
  const sizeClasses = {
    sm: 'text-sm py-2 px-3',
    md: 'text-base py-3 px-4',
    lg: 'text-lg py-4 px-5'
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
      loadModels(selection.make.id)
    } else {
      setModels([])
      setSelection(prev => ({ ...prev, model: undefined, year: undefined, engine: undefined }))
    }
  }, [selection.make])

  /**
   * Load years when model changes
   */
  useEffect(() => {
    if (selection.model) {
      loadYears(selection.model.id)
    } else {
      setYears([])
      setSelection(prev => ({ ...prev, year: undefined, engine: undefined }))
    }
  }, [selection.model])

  /**
   * Load engines when year changes
   */
  useEffect(() => {
    if (selection.model && selection.year && showEngineSelector) {
      loadEngines(selection.model.id, selection.year)
    } else {
      setEngines([])
      setSelection(prev => ({ ...prev, engine: undefined }))
    }
  }, [selection.model, selection.year, showEngineSelector])

  /**
   * Notify parent component of selection changes
   */
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selection)
    }
  }, [selection, onSelectionChange])

  /**
   * Load available makes
   */
  const loadMakes = async () => {
    try {
      setLoading(prev => ({ ...prev, makes: true }))
      setErrors(prev => ({ ...prev, makes: '' }))
      
      const makesData = await getVehicleMakes()
      setMakes(makesData)
    } catch (error) {
      setErrors(prev => ({ ...prev, makes: 'Failed to load vehicle makes' }))
    } finally {
      setLoading(prev => ({ ...prev, makes: false }))
    }
  }

  /**
   * Load models for selected make
   */
  const loadModels = async (makeId: string) => {
    try {
      setLoading(prev => ({ ...prev, models: true }))
      setErrors(prev => ({ ...prev, models: '' }))
      
      const modelsData = await getVehicleModels(makeId)
      setModels(modelsData)
    } catch (error) {
      setErrors(prev => ({ ...prev, models: 'Failed to load vehicle models' }))
    } finally {
      setLoading(prev => ({ ...prev, models: false }))
    }
  }

  /**
   * Load years for selected model
   */
  const loadYears = async (modelId: string) => {
    try {
      setLoading(prev => ({ ...prev, years: true }))
      setErrors(prev => ({ ...prev, years: '' }))
      
      const yearsData = await getVehicleYears(modelId)
      setYears(yearsData)
    } catch (error) {
      setErrors(prev => ({ ...prev, years: 'Failed to load vehicle years' }))
    } finally {
      setLoading(prev => ({ ...prev, years: false }))
    }
  }

  /**
   * Load engines for selected model and year
   */
  const loadEngines = async (modelId: string, year: number) => {
    try {
      setLoading(prev => ({ ...prev, engines: true }))
      setErrors(prev => ({ ...prev, engines: '' }))
      
      const enginesData = await getVehicleEngines(modelId, year)
      setEngines(enginesData)
    } catch (error) {
      setErrors(prev => ({ ...prev, engines: 'Failed to load vehicle engines' }))
    } finally {
      setLoading(prev => ({ ...prev, engines: false }))
    }
  }

  /**
   * Handle make selection
   */
  const handleMakeChange = useCallback((makeId: string) => {
    const selectedMake = makes.find(make => make.id === makeId)
    setSelection(prev => ({
      make: selectedMake,
      model: undefined,
      year: undefined,
      engine: undefined
    }))
  }, [makes])

  /**
   * Handle model selection
   */
  const handleModelChange = useCallback((modelId: string) => {
    const selectedModel = models.find(model => model.id === modelId)
    setSelection(prev => ({
      ...prev,
      model: selectedModel,
      year: undefined,
      engine: undefined
    }))
  }, [models])

  /**
   * Handle year selection
   */
  const handleYearChange = useCallback((year: string) => {
    const selectedYear = parseInt(year)
    setSelection(prev => ({
      ...prev,
      year: selectedYear,
      engine: undefined
    }))
  }, [])

  /**
   * Handle engine selection
   */
  const handleEngineChange = useCallback((engineId: string) => {
    const selectedEngine = engines.find(engine => engine.id === engineId)
    setSelection(prev => ({
      ...prev,
      engine: selectedEngine
    }))
  }, [engines])

  /**
   * Clear all selections
   */
  const handleClear = useCallback(() => {
    setSelection({})
    setModels([])
    setYears([])
    setEngines([])
  }, [])

  /**
   * Generate dropdown options for years
   */
  const yearOptions = useMemo(() => {
    return years.map(year => ({
      value: year.toString(),
      label: year.toString()
    }))
  }, [years])

  /**
   * Check if selection is complete
   */
  const isSelectionComplete = useMemo(() => {
    const hasBasicSelection = selection.make && selection.model && selection.year
    return showEngineSelector ? hasBasicSelection && selection.engine : hasBasicSelection
  }, [selection, showEngineSelector])

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900">
            Изберете автомобил
          </h3>
        </div>
        
        {showClearButton && (selection.make || selection.model || selection.year || selection.engine) && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1 px-3 py-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <XMarkIcon className="h-4 w-4" />
            Изчисти
          </button>
        )}
      </div>

      {/* Dropdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Make Selector */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Марка
          </label>
          <div className="relative">
            <select
              value={selection.make?.id || ''}
              onChange={(e) => handleMakeChange(e.target.value)}
              disabled={loading.makes}
              className={cn(
                'w-full appearance-none rounded-lg border border-gray-300 bg-white pr-10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors',
                sizeClasses[size],
                loading.makes && 'opacity-50 cursor-not-allowed',
                errors.makes && 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
              )}
            >
              <option value="">
                {loading.makes ? 'Зареждане...' : placeholder.make || 'Изберете марка'}
              </option>
              {makes.map((make) => (
                <option key={make.id} value={make.id}>
                  {make.name}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          {errors.makes && (
            <p className="text-sm text-red-600">{errors.makes}</p>
          )}
        </div>

        {/* Model Selector */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Модел
          </label>
          <div className="relative">
            <select
              value={selection.model?.id || ''}
              onChange={(e) => handleModelChange(e.target.value)}
              disabled={!selection.make || loading.models}
              className={cn(
                'w-full appearance-none rounded-lg border border-gray-300 bg-white pr-10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors',
                sizeClasses[size],
                (!selection.make || loading.models) && 'opacity-50 cursor-not-allowed',
                errors.models && 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
              )}
            >
              <option value="">
                {!selection.make
                  ? 'Първо изберете марка'
                  : loading.models
                  ? 'Зареждане...'
                  : placeholder.model || 'Изберете модел'
                }
              </option>
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          {errors.models && (
            <p className="text-sm text-red-600">{errors.models}</p>
          )}
        </div>

        {/* Year Selector */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Година
          </label>
          <div className="relative">
            <select
              value={selection.year?.toString() || ''}
              onChange={(e) => handleYearChange(e.target.value)}
              disabled={!selection.model || loading.years}
              className={cn(
                'w-full appearance-none rounded-lg border border-gray-300 bg-white pr-10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors',
                sizeClasses[size],
                (!selection.model || loading.years) && 'opacity-50 cursor-not-allowed',
                errors.years && 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
              )}
            >
              <option value="">
                {!selection.model
                  ? 'Първо изберете модел'
                  : loading.years
                  ? 'Зареждане...'
                  : placeholder.year || 'Изберете година'
                }
              </option>
              {yearOptions.map((year) => (
                <option key={year.value} value={year.value}>
                  {year.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          {errors.years && (
            <p className="text-sm text-red-600">{errors.years}</p>
          )}
        </div>

        {/* Engine Selector (Optional) */}
        {showEngineSelector && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Двигател
            </label>
            <div className="relative">
              <select
                value={selection.engine?.id || ''}
                onChange={(e) => handleEngineChange(e.target.value)}
                disabled={!selection.year || loading.engines}
                className={cn(
                  'w-full appearance-none rounded-lg border border-gray-300 bg-white pr-10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors',
                  sizeClasses[size],
                  (!selection.year || loading.engines) && 'opacity-50 cursor-not-allowed',
                  errors.engines && 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                )}
              >
                <option value="">
                  {!selection.year
                    ? 'Първо изберете година'
                    : loading.engines
                    ? 'Зареждане...'
                    : placeholder.engine || 'Изберете двигател'
                  }
                </option>
                {engines.map((engine) => (
                  <option key={engine.id} value={engine.id}>
                    {engine.name} ({engine.displacement}L, {engine.power}HP)
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {errors.engines && (
              <p className="text-sm text-red-600">{errors.engines}</p>
            )}
          </div>
        )}
      </div>

      {/* Selection Summary */}
      {isSelectionComplete && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <h4 className="text-sm font-medium text-green-800">
              Избран автомобил:
            </h4>
          </div>
          <p className="mt-1 text-sm text-green-700">
            {selection.make?.name} {selection.model?.name} ({selection.year})
            {selection.engine && ` - ${selection.engine.name}`}
          </p>
        </div>
      )}
    </div>
  )
} 