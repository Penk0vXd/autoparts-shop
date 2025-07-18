'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  CascadingVehicleSelection,
  VehicleMake,
  VehicleModel,
  VehicleEngine,
  VehicleYear,
  MakeDropdownOption,
  ModelDropdownOption,
  YearDropdownOption,
  EngineDropdownOption,
  CascadingLoadingState,
  CascadingErrorState,
  ValidationError,
  CascadingVehicleHookReturn,
  CascadingDropdownOption,
  VehicleFilters
} from '@/types/cascading-vehicle'

/**
 * Custom hook for managing cascading vehicle selection
 * 
 * Handles Make → Model → Year → Engine progression with proper state management,
 * error handling, and performance optimization.
 */

interface UseCascadingVehicleOptions {
  initialSelection?: Partial<CascadingVehicleSelection>
  config?: CascadingDropdownOption
  filters?: VehicleFilters
  onSelectionChange?: (selection: CascadingVehicleSelection) => void
  onError?: (error: ValidationError) => void
}

// Mock API service - replace with real implementation
const mockApiService = {
  async getMakes(filters?: VehicleFilters): Promise<VehicleMake[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const makes: VehicleMake[] = [
      {
        id: '1',
        name: 'BMW',
        slug: 'bmw',
        logo_url: '/logos/bmw.svg',
        country: 'Germany',
        is_active: true,
        product_count: 1250,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: '2',
        name: 'Mercedes-Benz',
        slug: 'mercedes-benz',
        logo_url: '/logos/mercedes.svg',
        country: 'Germany',
        is_active: true,
        product_count: 1100,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: '3',
        name: 'Audi',
        slug: 'audi',
        logo_url: '/logos/audi.svg',
        country: 'Germany',
        is_active: true,
        product_count: 980,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: '4',
        name: 'Volkswagen',
        slug: 'volkswagen',
        logo_url: '/logos/volkswagen.svg',
        country: 'Germany',
        is_active: true,
        product_count: 850,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: '5',
        name: 'Toyota',
        slug: 'toyota',
        logo_url: '/logos/toyota.svg',
        country: 'Japan',
        is_active: true,
        product_count: 750,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: '6',
        name: 'Honda',
        slug: 'honda',
        logo_url: '/logos/honda.svg',
        country: 'Japan',
        is_active: true,
        product_count: 680,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: '7',
        name: 'Ford',
        slug: 'ford',
        logo_url: '/logos/ford.svg',
        country: 'USA',
        is_active: true,
        product_count: 720,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: '8',
        name: 'Opel',
        slug: 'opel',
        logo_url: '/logos/opel.svg',
        country: 'Germany',
        is_active: true,
        product_count: 590,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: '9',
        name: 'Peugeot',
        slug: 'peugeot',
        logo_url: '/logos/peugeot.svg',
        country: 'France',
        is_active: true,
        product_count: 520,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: '10',
        name: 'Renault',
        slug: 'renault',
        logo_url: '/logos/renault.svg',
        country: 'France',
        is_active: true,
        product_count: 480,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ]
    
    return filters?.search 
      ? makes.filter(make => make.name.toLowerCase().includes(filters.search!.toLowerCase()))
      : makes
  },

  async getModels(makeId: string, filters?: VehicleFilters): Promise<VehicleModel[]> {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const allModels: Record<string, VehicleModel[]> = {
      '1': [ // BMW
        {
          id: '1-1',
          make_id: '1',
          name: '3 Series',
          slug: '3-series',
          generation: 'F30',
          body_type: 'Седан',
          year_start: 2012,
          year_end: 2019,
          is_active: true,
          product_count: 320,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '1-2',
          make_id: '1',
          name: '5 Series',
          slug: '5-series',
          generation: 'F10',
          body_type: 'Седан',
          year_start: 2010,
          year_end: 2017,
          is_active: true,
          product_count: 280,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '1-3',
          make_id: '1',
          name: 'X3',
          slug: 'x3',
          generation: 'F25',
          body_type: 'SUV',
          year_start: 2010,
          year_end: 2017,
          is_active: true,
          product_count: 250,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '1-4',
          make_id: '1',
          name: 'X5',
          slug: 'x5',
          generation: 'F15',
          body_type: 'SUV',
          year_start: 2013,
          year_end: 2018,
          is_active: true,
          product_count: 290,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ],
      '2': [ // Mercedes-Benz
        {
          id: '2-1',
          make_id: '2',
          name: 'C-Class',
          slug: 'c-class',
          generation: 'W205',
          body_type: 'Седан',
          year_start: 2014,
          year_end: 2021,
          is_active: true,
          product_count: 300,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '2-2',
          make_id: '2',
          name: 'E-Class',
          slug: 'e-class',
          generation: 'W213',
          body_type: 'Седан',
          year_start: 2016,
          year_end: 2023,
          is_active: true,
          product_count: 270,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '2-3',
          make_id: '2',
          name: 'GLC',
          slug: 'glc',
          generation: 'X253',
          body_type: 'SUV',
          year_start: 2015,
          year_end: 2022,
          is_active: true,
          product_count: 260,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ],
      '3': [ // Audi
        {
          id: '3-1',
          make_id: '3',
          name: 'A4',
          slug: 'a4',
          generation: 'B9',
          body_type: 'Седан',
          year_start: 2015,
          year_end: 2023,
          is_active: true,
          product_count: 290,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '3-2',
          make_id: '3',
          name: 'Q5',
          slug: 'q5',
          generation: 'FY',
          body_type: 'SUV',
          year_start: 2017,
          year_end: 2023,
          is_active: true,
          product_count: 260,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '3-3',
          make_id: '3',
          name: 'A6',
          slug: 'a6',
          generation: 'C8',
          body_type: 'Седан',
          year_start: 2018,
          year_end: 2023,
          is_active: true,
          product_count: 240,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ],
      '5': [ // Toyota
        {
          id: '5-1',
          make_id: '5',
          name: 'Camry',
          slug: 'camry',
          generation: 'XV70',
          body_type: 'Седан',
          year_start: 2017,
          year_end: 2023,
          is_active: true,
          product_count: 180,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '5-2',
          make_id: '5',
          name: 'RAV4',
          slug: 'rav4',
          generation: 'XA50',
          body_type: 'SUV',
          year_start: 2018,
          year_end: 2023,
          is_active: true,
          product_count: 200,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '5-3',
          make_id: '5',
          name: 'Corolla',
          slug: 'corolla',
          generation: 'E210',
          body_type: 'Хечбек',
          year_start: 2018,
          year_end: 2023,
          is_active: true,
          product_count: 160,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ]
    }
    
    return allModels[makeId] || []
  },

  async getYears(modelId: string): Promise<VehicleYear[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const model = await this.getModelById(modelId)
    if (!model) return []
    
    const years: VehicleYear[] = []
    const startYear = model.year_start
    const endYear = model.year_end || new Date().getFullYear()
    
    for (let year = startYear; year <= endYear; year++) {
      years.push({
        year,
        engine_count: Math.floor(Math.random() * 8) + 2, // 2-10 engines
        product_count: Math.floor(Math.random() * 150) + 50 // 50-200 products
      } as any)
    }
    
    return years.reverse() // Most recent first
  },

  async getEngines(modelId: string, year?: number): Promise<VehicleEngine[]> {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const allEngines: any = {
      '1-1': [ // BMW 3 Series
        {
          id: '1-1-1',
          model_id: '1-1',
          code: 'N20B20',
          name: '320i',
          displacement: 2.0,
          power: 184,
          torque: 270,
          fuel_type: 'gasoline',
          aspiration: 'turbocharged',
          cylinders: 4,
          valves: 16,
          year_start: 2012,
          year_end: 2016,
          is_active: true,
          product_count: 85,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        } as any,
        {
          id: '1-1-2',
          model_id: '1-1',
          code: 'N47D20',
          name: '318d',
          displacement: 2.0,
          power: 143,
          torque: 320,
          fuel_type: 'diesel',
          aspiration: 'turbocharged',
          cylinders: 4,
          valves: 16,
          year_start: 2012,
          year_end: 2015,
          is_active: true,
          product_count: 78,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '1-1-3',
          model_id: '1-1',
          code: 'B47D20',
          name: '320d',
          displacement: 2.0,
          power: 190,
          torque: 400,
          fuel_type: 'diesel',
          aspiration: 'turbocharged',
          cylinders: 4,
          valves: 16,
          year_start: 2014,
          year_end: 2019,
          is_active: true,
          product_count: 92,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ],
      '2-1': [ // Mercedes C-Class
        {
          id: '2-1-1',
          model_id: '2-1',
          code: 'M274',
          name: 'C200',
          displacement: 2.0,
          power: 184,
          torque: 300,
          fuel_type: 'gasoline',
          aspiration: 'turbocharged',
          cylinders: 4,
          valves: 16,
          year_start: 2014,
          year_end: 2018,
          is_active: true,
          product_count: 88,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '2-1-2',
          model_id: '2-1',
          code: 'OM651',
          name: 'C220d',
          displacement: 2.1,
          power: 170,
          torque: 400,
          fuel_type: 'diesel',
          aspiration: 'turbocharged',
          cylinders: 4,
          valves: 16,
          year_start: 2014,
          year_end: 2018,
          is_active: true,
          product_count: 95,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ]
    }
    
    const engines = allEngines[modelId] || []
    
    // Filter by year if specified
    return year ? engines.filter((engine: any) => 
      year >= engine.year_start && year <= (engine.year_end || new Date().getFullYear())
    ) : engines
  },

  async getModelById(modelId: string): Promise<VehicleModel | null> {
    const allModels = await Promise.all([
      this.getModels('1'),
      this.getModels('2'),
      this.getModels('3'),
      this.getModels('5')
    ])
    
    const model = allModels.flat().find(m => m.id === modelId)
    return model || null
  }
}

export function useCascadingVehicle(options: UseCascadingVehicleOptions = {}): CascadingVehicleHookReturn {
  const {
    initialSelection = {},
    config = {},
    filters = {},
    onSelectionChange,
    onError
  } = options

  // Core state
  const [selection, setSelection] = useState<CascadingVehicleSelection>(initialSelection)
  
  // Options state
  const [makes, setMakes] = useState<VehicleMake[]>([])
  const [models, setModels] = useState<VehicleModel[]>([])
  const [years, setYears] = useState<VehicleYear[]>([])
  const [engines, setEngines] = useState<VehicleEngine[]>([])
  
  // Loading state
  const [loading, setLoading] = useState<CascadingLoadingState>({
    makes: false,
    models: false,
    years: false,
    engines: false,
    initializing: true
  })
  
  // Error state
  const [errors, setErrors] = useState<CascadingErrorState>({})

  // Helper function to create error
  const createError = useCallback((
    step: 'make' | 'model' | 'year' | 'engine',
    type: string,
    message: string,
    details?: any
  ): any => ({
    step,
    type,
    message,
    details,
    retryable: type === 'network'
  }), [])

  // Helper function to handle API errors
  const handleApiError = useCallback((
    step: 'make' | 'model' | 'year' | 'engine',
    error: any
  ) => {
    const cascadingError = createError(
      step,
      'network',
      `Failed to load ${step} options`,
      error
    )
    
    setErrors(prev => ({ ...prev, [step]: cascadingError }))
    onError?.(cascadingError)
  }, [createError, onError])

  // Clear error for specific step
  const clearError = useCallback((step: 'make' | 'model' | 'year' | 'engine') => {
    setErrors(prev => {
      const newErrors = { ...prev } as any
      delete newErrors[step]
      return newErrors
    })
  }, [])

  // Load makes
  const loadMakes = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, make: true }))
      clearError('make')
      
      const makesData = await mockApiService.getMakes(filters)
      setMakes(makesData)
    } catch (error) {
      handleApiError('make', error)
    } finally {
      setLoading(prev => ({ ...prev, make: false, initializing: false }))
    }
  }, [filters, handleApiError, clearError])

  // Load models
  const loadModels = useCallback(async (makeId: string) => {
    try {
      setLoading(prev => ({ ...prev, model: true }))
      clearError('model')
      
      const modelsData = await mockApiService.getModels(makeId, filters)
      setModels(modelsData)
    } catch (error) {
      handleApiError('model', error)
      setModels([])
    } finally {
      setLoading(prev => ({ ...prev, model: false }))
    }
  }, [filters, handleApiError, clearError])

  // Load years
  const loadYears = useCallback(async (modelId: string) => {
    try {
      setLoading(prev => ({ ...prev, year: true }))
      clearError('year')
      
      const yearsData = await mockApiService.getYears(modelId)
      setYears(yearsData)
    } catch (error) {
      handleApiError('year', error)
      setYears([])
    } finally {
      setLoading(prev => ({ ...prev, year: false }))
    }
  }, [handleApiError, clearError])

  // Load engines
  const loadEngines = useCallback(async (modelId: string, year?: number) => {
    try {
      setLoading(prev => ({ ...prev, engine: true }))
      clearError('engine')
      
      const enginesData = await mockApiService.getEngines(modelId, year)
      setEngines(enginesData)
    } catch (error) {
      handleApiError('engine', error)
      setEngines([])
    } finally {
      setLoading(prev => ({ ...prev, engine: false }))
    }
  }, [handleApiError, clearError])

  // Selection handlers
  const selectMake = useCallback((make: VehicleMake | null) => {
    const newSelection: CascadingVehicleSelection = { make: make || undefined }
    setSelection(newSelection)
    
    // Clear dependent selections
    setModels([])
    setYears([])
    setEngines([])
    
    // Load models if make is selected
    if (make) {
      loadModels(make.id)
    }
  }, [loadModels])

  const selectModel = useCallback((model: VehicleModel | null) => {
    const newSelection: CascadingVehicleSelection = {
      ...selection,
      model: model || undefined,
      year: undefined,
      engine: undefined
    }
    setSelection(newSelection)
    
    // Clear dependent selections
    setYears([])
    setEngines([])
    
    // Load years if model is selected
    if (model) {
      loadYears(model.id)
    }
  }, [selection, loadYears])

  const selectYear = useCallback((year: number | null) => {
    const newSelection: CascadingVehicleSelection = {
      ...selection,
      year: year || undefined,
      engine: undefined
    }
    setSelection(newSelection)
    
    // Clear dependent selections
    setEngines([])
    
    // Load engines if year and model are selected
    if (year && selection.model) {
      loadEngines(selection.model.id, year)
    }
  }, [selection, loadEngines])

  const selectEngine = useCallback((engine: VehicleEngine | null) => {
    const newSelection: CascadingVehicleSelection = {
      ...selection,
      engine: engine || undefined
    }
    setSelection(newSelection)
  }, [selection])

  // Utility methods
  const clearSelection = useCallback(() => {
    setSelection({})
    setModels([])
    setYears([])
    setEngines([])
  }, [])

  const resetFrom = useCallback((step: 'make' | 'model' | 'year' | 'engine') => {
    switch (step) {
      case 'make':
        clearSelection()
        break
      case 'model':
        setSelection(prev => ({ make: prev.make }))
        setModels([])
        setYears([])
        setEngines([])
        if (selection.make) {
          loadModels(selection.make.id)
        }
        break
      case 'year':
        setSelection(prev => ({ make: prev.make, model: prev.model }))
        setYears([])
        setEngines([])
        if (selection.model) {
          loadYears(selection.model.id)
        }
        break
      case 'engine':
        setSelection(prev => ({ make: prev.make, model: prev.model, year: prev.year }))
        setEngines([])
        if (selection.model && selection.year) {
          loadEngines(selection.model.id, selection.year)
        }
        break
    }
  }, [selection, clearSelection, loadModels, loadYears, loadEngines])

  const isStepEnabled = useCallback((step: 'make' | 'model' | 'year' | 'engine') => {
    switch (step) {
      case 'make':
        return true
      case 'model':
        return !!selection.make
      case 'year':
        return !!selection.model
      case 'engine':
        return !!selection.year
      default:
        return false
    }
  }, [selection])

  const isSelectionComplete = useCallback(() => {
    return !!(selection.make && selection.model && selection.year)
  }, [selection])

  const isSelectionValid = useCallback(() => {
    return isSelectionComplete() && !Object.keys(errors).length
  }, [isSelectionComplete, errors])

  const getSelectionPath = useCallback(() => {
    const parts = []
    if (selection.make) parts.push(selection.make.name)
    if (selection.model) parts.push(selection.model.name)
    if (selection.year) parts.push(selection.year.toString())
    if (selection.engine) parts.push(selection.engine.name)
    return parts.join(' > ')
  }, [selection])

  const getCompatibleProductCount = useCallback(() => {
    if (selection.engine) return (selection.engine as any).product_count || 0
    if (selection.year) return (years.find(y => y.year === selection.year) as any)?.product_count || 0
    if (selection.model) return (selection.model as any).product_count || 0
    if (selection.make) return (selection.make as any).product_count || 0
    return 0
  }, [selection, years])

  // Convert data to dropdown options
  const makeOptions = useMemo<MakeDropdownOption[]>(() => {
    return makes.map(make => ({
      value: make.id,
      label: make.name,
      data: make,
      country: make.country,
      logo_url: make.logo_url,
      description: `${make.country} • ${(config as any).showCounts ? `${(make as any).product_count} части` : 'Премиум марка'}`,
      count: (config as any).showCounts ? (make as any).product_count : undefined
    }))
  }, [makes, config])

  const modelOptions = useMemo<ModelDropdownOption[]>(() => {
    return models.map(model => ({
      value: model.id,
      label: model.name,
      data: model,
      generation: model.generation,
      yearRange: `${model.year_start}-${model.year_end || 'сега'}`,
      bodyType: model.body_type,
      description: `${model.generation ? `${model.generation} • ` : ''}${model.body_type} • ${model.year_start}-${model.year_end || 'сега'}`,
      count: (config as any).showCounts ? (model as any).product_count : undefined
    }))
  }, [models, config])

  const yearOptions = useMemo<any[]>(() => {
    return years.map(year => ({
      value: year.year.toString(),
      label: year.year.toString(),
      data: year,
      engineCount: year.engine_count,
      description: `${year.engine_count} двигателя • ${config.showCounts ? `${year.product_count} части` : 'Налично'}`,
      count: config.showCounts ? year.product_count : undefined
    }))
  }, [years, config.showCounts])

  const engineOptions = useMemo<EngineDropdownOption[]>(() => {
    return engines.map(engine => ({
      value: engine.id,
      label: engine.name,
      data: engine,
      fuelType: engine.fuel_type,
      specs: `${engine.displacement}L ${engine.fuel_type}`,
      power: engine.power,
      displacement: engine.displacement,
      description: `${engine.power}HP • ${engine.displacement}L • ${engine.fuel_type === 'gasoline' ? 'Бензин' : engine.fuel_type === 'diesel' ? 'Дизел' : engine.fuel_type}`,
      count: config.showCounts ? engine.product_count : undefined
    }))
  }, [engines, config.showCounts])

  // Load initial data
  useEffect(() => {
    loadMakes()
  }, [loadMakes])

  // Handle cascading on selection changes
  useEffect(() => {
    if (selection.make && !models.length && !loading.model) {
      loadModels(selection.make.id)
    }
  }, [selection.make, models.length, loading.model, loadModels])

  useEffect(() => {
    if (selection.model && !years.length && !loading.year) {
      loadYears(selection.model.id)
    }
  }, [selection.model, years.length, loading.year, loadYears])

  useEffect(() => {
    if (selection.model && selection.year && !engines.length && !loading.engine) {
      loadEngines(selection.model.id, selection.year)
    }
  }, [selection.model, selection.year, engines.length, loading.engine, loadEngines])

  // Notify parent of selection changes
  useEffect(() => {
    onSelectionChange?.(selection)
  }, [selection, onSelectionChange])

  return {
    // Current state
    selection,
    options: {
      makes: makeOptions,
      models: modelOptions,
      years: yearOptions,
      engines: engineOptions
    },
    loading,
    errors,

    // Selection methods
    selectMake,
    selectModel,
    selectYear,
    selectEngine,

    // Utility methods
    clearSelection,
    resetFrom,
    isStepEnabled,
    isSelectionComplete,
    isSelectionValid,

    // Data refresh methods
    refreshMakes: loadMakes,
    refreshModels: () => selection.make ? loadModels(selection.make.id) : Promise.resolve(),
    refreshYears: () => selection.model ? loadYears(selection.model.id) : Promise.resolve(),
    refreshEngines: () => selection.model ? loadEngines(selection.model.id, selection.year) : Promise.resolve(),

    // Analytics methods
    getSelectionPath,
    getCompatibleProductCount
  }
} 