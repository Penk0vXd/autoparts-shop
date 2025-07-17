// TypeScript types for CarSelector component

export interface CarMake {
  id: string
  name: string
  logo?: string
}

export interface CarModel {
  id: string
  name: string
  makeId: string
}

export interface CarYear {
  value: number
  label: string
}

export interface CarSelection {
  make?: CarMake
  model?: CarModel
  year?: CarYear
}

export interface CarSelectorProps {
  onSelectionChange?: (selection: CarSelection) => void
  initialSelection?: CarSelection
  showYearSelector?: boolean
  showClearButton?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

export interface CarSelectorLoadingState {
  makes: boolean
  models: boolean
}

// Static car data structure
export interface CarMakeData {
  makes: CarMake[]
  models: CarModel[]
}

// Year range configuration
export interface YearRange {
  start: number
  end: number
} 