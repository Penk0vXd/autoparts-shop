/**
 * VehicleSelector Component Exports
 * 
 * Centralizes all VehicleSelector related exports for easy importing
 */

export { VehicleSelector } from './VehicleSelector'
export { VehicleSelectorDemo, VehicleSelectorUsageExample } from './VehicleSelectorDemo'

// Re-export types for convenience
export type { 
  VehicleSelectorProps,
  VehicleSelection,
  VehicleMake,
  VehicleModel,
  VehicleEngine,
  VehicleDropdownOption,
  VehicleCompatibility
} from '@/types/vehicle'

// Re-export context and hooks
export {
  VehicleProvider,
  useVehicle,
  useVehicleSelection,
  useVehicleCompatibility
} from '@/contexts/VehicleContext'

// Re-export service functions
export {
  getVehicleMakes,
  getVehicleModels,
  getVehicleYears,
  getVehicleEngines,
  searchVehicleByVIN,
  getVehicleCompatibility
} from '@/services/vehicleService' 