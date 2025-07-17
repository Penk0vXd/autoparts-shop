/**
 * Vehicle-related TypeScript interfaces for the auto parts catalog
 */

export interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  engine?: string
  engineCode?: string
  fuel?: 'gasoline' | 'diesel' | 'hybrid' | 'electric'
  transmission?: 'manual' | 'automatic' | 'cvt'
  bodyType?: string
  doors?: number
  displacement?: number // in liters
  power?: number // in HP
  created_at: string
  updated_at: string
}

export interface VehicleMake {
  id: string
  name: string
  slug: string
  logo_url?: string
  country?: string
  is_active: boolean
}

export interface VehicleModel {
  id: string
  make_id: string
  name: string
  slug: string
  generation?: string
  year_start: number
  year_end?: number
  is_active: boolean
}

export interface VehicleEngine {
  id: string
  model_id: string
  code: string
  name: string
  displacement: number
  power: number
  fuel: 'gasoline' | 'diesel' | 'hybrid' | 'electric'
  year_start: number
  year_end?: number
  is_active: boolean
}

export interface VehicleSelection {
  make?: VehicleMake
  model?: VehicleModel
  year?: number
  engine?: VehicleEngine
}

export interface VehicleCompatibility {
  makes: string[]
  models?: string[]
  years: string[]
  engines?: string[]
  engineCodes?: string[]
}

export interface VehicleDropdownOption {
  value: string
  label: string
  disabled?: boolean
  data?: any
}

export interface VehicleSelectorProps {
  onSelectionChange?: (selection: VehicleSelection) => void
  initialSelection?: Partial<VehicleSelection>
  showEngineSelector?: boolean
  showClearButton?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
  placeholder?: {
    make?: string
    model?: string
    year?: string
    engine?: string
  }
} 