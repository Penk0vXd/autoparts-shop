/**
 * NHTSA vPIC API Response Types
 * 
 * Type definitions for the National Highway Traffic Safety Administration
 * Vehicle Product Information Catalog API responses.
 */

// Base API response structure
export interface NHTSABaseResponse {
  Count: number
  Message: string
  SearchCriteria: string | null
  Results: any[]
}

// Vehicle Make from NHTSA API
export interface NHTSAMake {
  Make_ID: number
  Make_Name: string
}

// Vehicle Model from NHTSA API
export interface NHTSAModel {
  Make_ID: number
  Make_Name: string
  Model_ID: number
  Model_Name: string
}

// NHTSA API response for makes
export interface NHTSAMakesResponse extends NHTSABaseResponse {
  Results: NHTSAMake[]
}

// NHTSA API response for models
export interface NHTSAModelsResponse extends NHTSABaseResponse {
  Results: NHTSAModel[]
}

// Processed make data for our component
export interface CarMake {
  id: string
  name: string
  originalId: number
}

// Processed model data for our component
export interface CarModel {
  id: string
  name: string
  makeId: string
  originalId: number
}

// Car selection state
export interface CarSelection {
  make?: CarMake
  model?: CarModel
  year?: number
}

// Car selection component props
export interface CarSelectionProps {
  onSelectionChange?: (selection: CarSelection) => void
  initialSelection?: Partial<CarSelection>
  showYearSelector?: boolean
  showClearButton?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
  placeholder?: {
    make?: string
    model?: string
    year?: string
  }
  yearRange?: {
    start: number
    end: number
  }
}

// Loading states
export interface CarSelectionLoadingState {
  makes: boolean
  models: boolean
}

// Error states
export interface CarSelectionErrorState {
  makes: string
  models: string
} 