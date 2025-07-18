'use client'

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { VehicleSelection } from '@/types/vehicle'

/**
 * Vehicle Context
 * 
 * Provides vehicle selection state management across the application.
 * Used for filtering products by vehicle compatibility and remembering user selection.
 */

interface VehicleContextType {
  selection: VehicleSelection
  setSelection: (selection: VehicleSelection) => void
  updateSelection: (partialSelection: Partial<VehicleSelection>) => void
  clearSelection: () => void
  hasSelection: boolean
  isCompleteSelection: boolean
  getCompatibilityFilter: () => string[]
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined)

// Action types for the reducer
type VehicleAction = 
  | { type: 'SET_SELECTION'; payload: VehicleSelection }
  | { type: 'UPDATE_SELECTION'; payload: Partial<VehicleSelection> }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'LOAD_FROM_STORAGE'; payload: VehicleSelection }

// Reducer function
function vehicleReducer(state: VehicleSelection, action: VehicleAction): VehicleSelection {
  switch (action.type) {
    case 'SET_SELECTION':
      return action.payload
    
    case 'UPDATE_SELECTION':
      return { ...state, ...action.payload }
    
    case 'CLEAR_SELECTION':
      return {}
    
    case 'LOAD_FROM_STORAGE':
      return action.payload
    
    default:
      return state
  }
}

// Storage key for persisting selection
const STORAGE_KEY = 'vehicle-selection'

/**
 * Vehicle Context Provider
 */
interface VehicleProviderProps {
  children: ReactNode
}

export function VehicleProvider({ children }: VehicleProviderProps) {
  const [selection, dispatch] = useReducer(vehicleReducer, {})

  // Load selection from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          dispatch({ type: 'LOAD_FROM_STORAGE', payload: parsed })
        }
      } catch (error) {
        console.warn('Failed to load vehicle selection from storage:', error)
      }
    }
  }, [])

  // Save selection to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(selection))
      } catch (error) {
        console.warn('Failed to save vehicle selection to storage:', error)
      }
    }
  }, [selection])

  // Context value
  const value: VehicleContextType = {
    selection,
    
    setSelection: (newSelection: VehicleSelection) => {
      dispatch({ type: 'SET_SELECTION', payload: newSelection })
    },
    
    updateSelection: (partialSelection: Partial<VehicleSelection>) => {
      dispatch({ type: 'UPDATE_SELECTION', payload: partialSelection })
    },
    
    clearSelection: () => {
      dispatch({ type: 'CLEAR_SELECTION' })
    },
    
    hasSelection: Boolean(selection.make || selection.model || selection.year || selection.engine),
    
    isCompleteSelection: Boolean(selection.make && selection.model && selection.year),
    
    getCompatibilityFilter: () => {
      const filters: string[] = []
      
      if (selection.make) {
        filters.push(selection.make.name)
      }
      
      if (selection.model) {
        filters.push(selection.model.name)
      }
      
      if (selection.year) {
        filters.push(selection.year.toString())
      }
      
      if (selection.engine) {
        filters.push(selection.engine.code)
        filters.push(selection.engine.name)
      }
      
      return filters
    }
  }

  return (
    <VehicleContext.Provider value={value}>
      {children}
    </VehicleContext.Provider>
  )
}

/**
 * Hook to use vehicle context
 */
export function useVehicle() {
  const context = useContext(VehicleContext)
  
  if (context === undefined) {
    throw new Error('useVehicle must be used within a VehicleProvider')
  }
  
  return context
}

/**
 * Hook to get vehicle selection summary
 */
export function useVehicleSelection() {
  const { selection, isCompleteSelection } = useVehicle()
  
  const getSummary = () => {
    if (!selection.make) return null
    
    const parts: string[] = []
    
    if (selection.make) {
      parts.push(selection.make.name)
    }
    
    if (selection.model) {
      parts.push(selection.model.name)
    }
    
    if (selection.year) {
      parts.push(`(${selection.year})`)
    }
    
    if (selection.engine) {
      parts.push(`- ${selection.engine.name}`)
    }
    
    return parts.join(' ')
  }
  
  const getShortSummary = () => {
    if (!selection.make) return null
    
    const parts: string[] = []
    
    if (selection.make) {
      parts.push(selection.make.name)
    }
    
    if (selection.model) {
      parts.push(selection.model.name)
    }
    
    if (selection.year) {
      parts.push(selection.year.toString())
    }
    
    return parts.join(' ')
  }
  
  return {
    selection,
    isCompleteSelection,
    summary: getSummary(),
    shortSummary: getShortSummary()
  }
}

/**
 * Hook for vehicle-based product filtering
 */
export function useVehicleCompatibility() {
  const { selection, getCompatibilityFilter } = useVehicle()
  
  const getProductFilters = () => {
    const compatibilityFilters = getCompatibilityFilter()
    
    if (compatibilityFilters.length === 0) {
      return {}
    }
    
    return {
      compatibility: compatibilityFilters,
      // Add more specific filters based on selection
      ...(selection.make && { make: selection.make.slug }),
      ...(selection.year && { year: selection.year })
    }
  }
  
  const checkProductCompatibility = (productCompatibility: any): boolean => {
    if (!selection.make) return true
    
    const compatibility = productCompatibility || {}
    
    // Check make compatibility
    if (compatibility.makes && Array.isArray(compatibility.makes)) {
      if (!compatibility.makes.includes(selection.make.name)) {
        return false
      }
    }
    
    // Check model compatibility
    if (selection.model && compatibility.models && Array.isArray(compatibility.models)) {
      if (!compatibility.models.includes(selection.model.name)) {
        return false
      }
    }
    
    // Check year compatibility
    if (selection.year && compatibility.years && Array.isArray(compatibility.years)) {
      const yearStrings = compatibility.years.map(String)
      const yearRanges = yearStrings.filter((y: string) => y.includes('-'))
      const exactYears = yearStrings.filter((y: string) => !y.includes('-'))
      
      let yearMatch = exactYears.includes(selection.year.toString())
      
      if (!yearMatch && yearRanges.length > 0) {
        yearMatch = yearRanges.some((range: string) => {
          const [start, end] = range.split('-').map(Number)
          return selection.year! >= start && selection.year! <= end
        })
      }
      
      if (!yearMatch) {
        return false
      }
    }
    
    // Check engine compatibility
    if (selection.engine && compatibility.engines && Array.isArray(compatibility.engines)) {
      const engineMatch = compatibility.engines.includes(selection.engine.name) ||
                          compatibility.engines.includes(selection.engine.code)
      
      if (!engineMatch) {
        return false
      }
    }
    
    return true
  }
  
  return {
    getProductFilters,
    checkProductCompatibility,
    hasFilters: Boolean(selection.make)
  }
} 