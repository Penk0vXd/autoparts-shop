/**
 * 🚗 Dynamic Vehicle Filtering System - TypeScript Interfaces
 * 
 * Complete type definitions for the 4-level vehicle hierarchy:
 * Brand → Model → Year → Engine
 * 
 * @author Supreme Full-Stack Automotive Architect
 */

// ===================
// CORE INTERFACES
// ===================

export interface VehicleBrand {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  country: string;
  founded_year: number;
  is_premium?: boolean;
  website_url?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VehicleModel {
  id: string;
  brand_id: string;
  name: string;
  slug: string;
  generation?: string;
  body_type?: string;
  year_start: number;
  year_end?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Relations
  brand?: VehicleBrand;
}

export interface VehicleYear {
  id: string;
  model_id: string;
  year: number;
  facelift_type?: string;
  production_start_date?: string;
  production_end_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Relations
  model?: VehicleModel;
}

export interface VehicleEngine {
  id: string;
  year_id: string;
  engine_name: string;
  engine_code?: string;
  displacement_liters?: number;
  displacement_cc?: number;
  fuel_type: 'petrol' | 'diesel' | 'hybrid' | 'electric' | 'lpg' | 'cng';
  horsepower: number;
  torque_nm?: number;
  cylinder_count?: number;
  valve_count?: number;
  aspiration?: 'naturally_aspirated' | 'turbo' | 'supercharged' | 'twin_turbo';
  transmission_type?: 'manual' | 'automatic' | 'cvt' | 'dual_clutch';
  drivetrain?: 'fwd' | 'rwd' | 'awd' | '4wd';
  euro_emission_standard?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Relations
  year?: VehicleYear;
}

// ===================
// SELECTION INTERFACES
// ===================

export interface VehicleSelection {
  brand?: VehicleBrand;
  model?: VehicleModel;
  year?: VehicleYear;
  engine?: VehicleEngine;
}

export interface VehicleFilterState {
  selectedBrand?: VehicleBrand;
  selectedModel?: VehicleModel;
  selectedYear?: VehicleYear;
  selectedEngine?: VehicleEngine;
  availableModels: VehicleModel[];
  availableYears: VehicleYear[];
  availableEngines: VehicleEngine[];
  loading: {
    brands: boolean;
    models: boolean;
    years: boolean;
    engines: boolean;
  };
  error?: string;
}

// ===================
// API RESPONSE INTERFACES
// ===================

export interface VehicleApiResponse<T> {
  success: boolean;
  data: T[];
  count: number;
  error?: string;
}

export interface VehicleBrandResponse extends VehicleApiResponse<VehicleBrand> {}
export interface VehicleModelResponse extends VehicleApiResponse<VehicleModel> {
  brandId?: string;
}
export interface VehicleYearResponse extends VehicleApiResponse<VehicleYear> {
  modelId?: string;
}
export interface VehicleEngineResponse extends VehicleApiResponse<VehicleEngine> {
  yearId?: string;
}

// ===================
// DISPLAY INTERFACES
// ===================

export interface VehicleDisplayItem {
  id: string;
  label: string;
  value: string;
  subtitle?: string;
  icon?: string;
  disabled?: boolean;
  metadata?: Record<string, any>;
}

export interface VehicleHierarchy {
  brand_id: string;
  brand_name: string;
  brand_slug: string;
  model_id: string;
  model_name: string;
  model_slug: string;
  year_id: string;
  year_value: number;
  engine_id: string;
  engine_name: string;
  engine_horsepower: number;
  engine_fuel_type: string;
}

export interface VehicleStatistics {
  total_brands: number;
  total_models: number;
  total_years: number;
  total_engines: number;
  avg_horsepower: number;
}

// ===================
// HELPER FUNCTIONS
// ===================

/**
 * Format engine display name with horsepower and fuel type
 */
export function formatEngineDisplay(engine: VehicleEngine): string {
  const fuelTypeEmoji = {
    petrol: '⛽',
    diesel: '🛢️',
    hybrid: '🔋',
    electric: '⚡',
    lpg: '🔥',
    cng: '💨'
  };

  const emoji = fuelTypeEmoji[engine.fuel_type] || '🚗';
  return `${engine.engine_name} ${emoji} ${engine.horsepower}hp`;
}

/**
 * Format horsepower with localized number formatting
 */
export function formatHorsepower(hp: number): string {
  return `${hp.toLocaleString()} к.с.`;
}

/**
 * Format displacement for display
 */
export function formatDisplacement(
  liters?: number,
  cc?: number
): string {
  if (liters) {
    return `${liters.toFixed(1)}L`;
  }
  if (cc) {
    return `${cc.toLocaleString()}cc`;
  }
  return '';
}

/**
 * Get fuel type icon emoji
 */
export function getFuelTypeIcon(fuelType: VehicleEngine['fuel_type']): string {
  const icons = {
    petrol: '⛽',
    diesel: '🛢️',
    hybrid: '🔋',
    electric: '⚡',
    lpg: '🔥',
    cng: '💨'
  };
  return icons[fuelType] || '🚗';
}

/**
 * Get fuel type Bulgarian name
 */
export function getFuelTypeName(fuelType: VehicleEngine['fuel_type']): string {
  const names = {
    petrol: 'Бензин',
    diesel: 'Дизел',
    hybrid: 'Хибрид',
    electric: 'Електрически',
    lpg: 'ГАЗ',
    cng: 'Метан'
  };
  return names[fuelType] || 'Неизвестен';
}

/**
 * Get drivetrain Bulgarian name
 */
export function getDrivetrainName(drivetrain?: VehicleEngine['drivetrain']): string {
  if (!drivetrain) return '';
  
  const names = {
    fwd: 'Предно',
    rwd: 'Задно',
    awd: 'Постоянно 4x4',
    '4wd': 'Включваемо 4x4'
  };
  return names[drivetrain] || drivetrain;
}

/**
 * Get transmission Bulgarian name
 */
export function getTransmissionName(transmission?: VehicleEngine['transmission_type']): string {
  if (!transmission) return '';
  
  const names = {
    manual: 'Ръчна',
    automatic: 'Автоматична',
    cvt: 'CVT',
    dual_clutch: 'Двойно съединение'
  };
  return names[transmission] || transmission;
}

/**
 * Check if vehicle selection is complete
 */
export function isSelectionComplete(selection: VehicleSelection): boolean {
  return !!(
    selection.brand &&
    selection.model &&
    selection.year &&
    selection.engine
  );
}

/**
 * Get vehicle selection summary
 */
export function getSelectionSummary(selection: VehicleSelection): string {
  if (!selection.brand) return '';
  
  const parts = [selection.brand.name];
  
  if (selection.model) {
    parts.push(selection.model.name);
  }
  
  if (selection.year) {
    parts.push(`(${selection.year.year})`);
  }
  
  if (selection.engine) {
    parts.push(`- ${formatEngineDisplay(selection.engine)}`);
  }
  
  return parts.join(' ');
}

/**
 * Convert VehicleBrand to VehicleDisplayItem
 */
export function brandToDisplayItem(brand: VehicleBrand): VehicleDisplayItem {
  return {
    id: brand.id,
    label: brand.name,
    value: brand.slug,
    subtitle: brand.country,
    icon: brand.logo_url,
    metadata: {
      country: brand.country,
      founded_year: brand.founded_year,
      is_premium: brand.is_premium
    }
  };
}

/**
 * Convert VehicleModel to VehicleDisplayItem
 */
export function modelToDisplayItem(model: VehicleModel): VehicleDisplayItem {
  const yearRange = model.year_end 
    ? `${model.year_start}-${model.year_end}`
    : `${model.year_start}+`;
    
  return {
    id: model.id,
    label: model.name,
    value: model.slug,
    subtitle: `${model.generation || ''} ${yearRange}`,
    metadata: {
      generation: model.generation,
      body_type: model.body_type,
      year_start: model.year_start,
      year_end: model.year_end
    }
  };
}

/**
 * Convert VehicleYear to VehicleDisplayItem
 */
export function yearToDisplayItem(year: VehicleYear): VehicleDisplayItem {
  return {
    id: year.id,
    label: year.year.toString(),
    value: year.year.toString(),
    subtitle: year.facelift_type,
    metadata: {
      facelift_type: year.facelift_type,
      production_start_date: year.production_start_date,
      production_end_date: year.production_end_date
    }
  };
}

/**
 * Convert VehicleEngine to VehicleDisplayItem
 */
export function engineToDisplayItem(engine: VehicleEngine): VehicleDisplayItem {
  const displacement = formatDisplacement(engine.displacement_liters, engine.displacement_cc);
  const fuelIcon = getFuelTypeIcon(engine.fuel_type);
  
  return {
    id: engine.id,
    label: `${engine.engine_name} ${fuelIcon}`,
    value: engine.id,
    subtitle: `${formatHorsepower(engine.horsepower)} • ${displacement}`,
    metadata: {
      engine_code: engine.engine_code,
      fuel_type: engine.fuel_type,
      horsepower: engine.horsepower,
      torque_nm: engine.torque_nm,
      displacement_liters: engine.displacement_liters,
      displacement_cc: engine.displacement_cc,
      aspiration: engine.aspiration,
      transmission_type: engine.transmission_type,
      drivetrain: engine.drivetrain
    }
  };
}

/**
 * Validate vehicle selection step by step
 */
export function validateSelection(selection: VehicleSelection): {
  isValid: boolean;
  nextStep: 'brand' | 'model' | 'year' | 'engine' | 'complete';
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!selection.brand) {
    return {
      isValid: false,
      nextStep: 'brand',
      errors: ['Моля, изберете марка']
    };
  }
  
  if (!selection.model) {
    return {
      isValid: false,
      nextStep: 'model',
      errors: ['Моля, изберете модел']
    };
  }
  
  if (!selection.year) {
    return {
      isValid: false,
      nextStep: 'year',
      errors: ['Моля, изберете година']
    };
  }
  
  if (!selection.engine) {
    return {
      isValid: false,
      nextStep: 'engine',
      errors: ['Моля, изберете двигател']
    };
  }
  
  return {
    isValid: true,
    nextStep: 'complete',
    errors: []
  };
}

/**
 * Reset selection from a specific level
 */
export function resetSelectionFromLevel(
  selection: VehicleSelection,
  level: 'brand' | 'model' | 'year' | 'engine'
): VehicleSelection {
  const newSelection = { ...selection };
  
  switch (level) {
    case 'brand':
      newSelection.brand = undefined;
      newSelection.model = undefined;
      newSelection.year = undefined;
      newSelection.engine = undefined;
      break;
    case 'model':
      newSelection.model = undefined;
      newSelection.year = undefined;
      newSelection.engine = undefined;
      break;
    case 'year':
      newSelection.year = undefined;
      newSelection.engine = undefined;
      break;
    case 'engine':
      newSelection.engine = undefined;
      break;
  }
  
  return newSelection;
}

/**
 * Get vehicle compatibility key for parts matching
 */
export function getCompatibilityKey(selection: VehicleSelection): string | null {
  if (!isSelectionComplete(selection)) return null;
  
  return `${selection.brand!.slug}-${selection.model!.slug}-${selection.year!.year}-${selection.engine!.id}`;
}

/**
 * Sort brands by premium status and name
 */
export function sortBrands(brands: VehicleBrand[]): VehicleBrand[] {
  return [...brands].sort((a, b) => {
    // Premium brands first (treat undefined as false)
    const aIsPremium = a.is_premium === true;
    const bIsPremium = b.is_premium === true;
    
    if (aIsPremium && !bIsPremium) return -1;
    if (!aIsPremium && bIsPremium) return 1;
    
    // Then by sort_order
    if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
    
    // Finally by name
    return a.name.localeCompare(b.name);
  });
}

/**
 * Sort models by year start (newest first)
 */
export function sortModels(models: VehicleModel[]): VehicleModel[] {
  return [...models].sort((a, b) => {
    // Newest models first
    if (a.year_start !== b.year_start) return b.year_start - a.year_start;
    
    // Then by name
    return a.name.localeCompare(b.name);
  });
}

/**
 * Sort years in descending order (newest first)
 */
export function sortYears(years: VehicleYear[]): VehicleYear[] {
  return [...years].sort((a, b) => b.year - a.year);
}

/**
 * Sort engines by horsepower (descending)
 */
export function sortEngines(engines: VehicleEngine[]): VehicleEngine[] {
  return [...engines].sort((a, b) => {
    // Highest horsepower first
    if (a.horsepower !== b.horsepower) return b.horsepower - a.horsepower;
    
    // Then by fuel type (petrol, diesel, hybrid, electric)
    const fuelTypeOrder = ['petrol', 'diesel', 'hybrid', 'electric', 'lpg', 'cng'];
    const aIndex = fuelTypeOrder.indexOf(a.fuel_type);
    const bIndex = fuelTypeOrder.indexOf(b.fuel_type);
    
    if (aIndex !== bIndex) return aIndex - bIndex;
    
    // Finally by engine name
    return a.engine_name.localeCompare(b.engine_name);
  });
}

// ===================
// CONSTANTS
// ===================

export const VEHICLE_FILTER_CONSTANTS = {
  LOADING_DELAY: 300,
  SEARCH_DEBOUNCE: 500,
  MAX_RESULTS: 100,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  
  FUEL_TYPES: [
    { value: 'petrol', label: 'Бензин', icon: '⛽' },
    { value: 'diesel', label: 'Дизел', icon: '🛢️' },
    { value: 'hybrid', label: 'Хибрид', icon: '🔋' },
    { value: 'electric', label: 'Електрически', icon: '⚡' },
    { value: 'lpg', label: 'ГАЗ', icon: '🔥' },
    { value: 'cng', label: 'Метан', icon: '💨' }
  ] as const,
  
  TRANSMISSION_TYPES: [
    { value: 'manual', label: 'Ръчна' },
    { value: 'automatic', label: 'Автоматична' },
    { value: 'cvt', label: 'CVT' },
    { value: 'dual_clutch', label: 'Двойно съединение' }
  ] as const,
  
  DRIVETRAIN_TYPES: [
    { value: 'fwd', label: 'Предно' },
    { value: 'rwd', label: 'Задно' },
    { value: 'awd', label: 'Постоянно 4x4' },
    { value: '4wd', label: 'Включваемо 4x4' }
  ] as const
} as const; 