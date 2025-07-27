/**
 * MVP Vehicle Selector Component
 * 
 * Export barrel for the MVP Vehicle Selector component and related utilities.
 */

// Import and re-export the component properly
export { MVPVehicleSelector, MVPVehicleSelector as default } from './MVPVehicleSelector'

// Re-export types for convenience
export type {
  MVPVehicleSelectorProps,
  MVPVehicleSelection,
  MVPVehicleMake,
  MVPVehicleModel,
  MVPVehicleSelectorRef,
  MVPVehicleSelectorState,
  MVPVehicleLoadingState,
  MVPVehicleErrorState,
  MVPVehicleTouchedState,
  MVPVehicleValidationState,
  MVPDropdownOption,
  MVPVehicleStep,
  MVPVehicleConfirmation,
  MVPVehicleEventHandlers,
  MVPVehicleConfig,
  MVPVehicleTheme,
  MVPVehicleValidationRules,
  MVPVehicleMethods,
  MVPVehicleField,
  MVPVehicleSize,
  MVPVehicleColorScheme
} from '@/types/mvp-vehicle-selector'

// Re-export data for convenience
export { MVP_VEHICLE_DATA } from '@/data/mvp-vehicle-data'
export type { MVPVehicleData } from '@/data/mvp-vehicle-data' 