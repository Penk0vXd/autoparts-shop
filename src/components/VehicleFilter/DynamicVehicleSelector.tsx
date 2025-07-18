'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronDownIcon, CheckIcon, TruckIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';
import type { 
  VehicleBrand, 
  VehicleModel, 
  VehicleYear, 
  VehicleEngine,
  VehicleSelection,
  VehicleFilterState,
  VehicleDisplayItem
} from '@/types/vehicle-filter';
import { 
  formatEngineDisplay,
  brandToDisplayItem,
  modelToDisplayItem,
  yearToDisplayItem,
  engineToDisplayItem,
  getSelectionSummary,
  isSelectionComplete,
  validateSelection,
  resetSelectionFromLevel
} from '@/types/vehicle-filter';

interface DynamicVehicleSelectorProps {
  onSelectionChange?: (selection: VehicleSelection) => void;
  onSelectionComplete?: (selection: VehicleSelection) => void;
  initialSelection?: VehicleSelection;
  showSummary?: boolean;
  compact?: boolean;
  className?: string;
}

interface DropdownProps {
  label: string;
  placeholder: string;
  items: VehicleDisplayItem[];
  selectedItem?: VehicleDisplayItem;
  onSelect: (item: VehicleDisplayItem) => void;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  icon?: React.ReactNode;
}

/**
 * 🚗 Dynamic Vehicle Selector Component
 * 
 * Supreme UX for 4-level vehicle selection:
 * Brand → Model → Year → Engine
 * 
 * Features:
 * - Cascading dropdowns with auto-reset
 * - Loading states and error handling
 * - Responsive design with mobile-first approach
 * - Bulgarian language support
 * - Accessibility compliant
 * - Premium animations and polish
 */
export default function DynamicVehicleSelector({
  onSelectionChange,
  onSelectionComplete,
  initialSelection,
  showSummary = true,
  compact = false,
  className = ''
}: DynamicVehicleSelectorProps) {
  const [state, setState] = useState<VehicleFilterState>({
    selectedBrand: initialSelection?.brand,
    selectedModel: initialSelection?.model,
    selectedYear: initialSelection?.year,
    selectedEngine: initialSelection?.engine,
    availableModels: [],
    availableYears: [],
    availableEngines: [],
    loading: {
      brands: false,
      models: false,
      years: false,
      engines: false
    }
  });

  const [brands, setBrands] = useState<VehicleBrand[]>([]);

  // Fetch brands on mount
  useEffect(() => {
    fetchBrands();
  }, []);

  // Fetch brands
  const fetchBrands = async () => {
    setState(prev => ({ ...prev, loading: { ...prev.loading, brands: true } }));
    
    try {
      const response = await fetch('/api/vehicle-filter/brands');
      const result = await response.json();
      
      if (result.success) {
        setBrands(result.data);
      } else {
        setState(prev => ({ ...prev, error: result.error }));
      }
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Грешка при зареждане на марките' }));
    } finally {
      setState(prev => ({ ...prev, loading: { ...prev.loading, brands: false } }));
    }
  };

  // Fetch models when brand changes
  const fetchModels = useCallback(async (brandId: string) => {
    setState(prev => ({ ...prev, loading: { ...prev.loading, models: true } }));
    
    try {
      const response = await fetch(`/api/vehicle-filter/models?brandId=${brandId}`);
      const result = await response.json();
      
      if (result.success) {
        setState(prev => ({ 
          ...prev, 
          availableModels: result.data,
          loading: { ...prev.loading, models: false }
        }));
      } else {
        setState(prev => ({ 
          ...prev, 
          error: result.error,
          loading: { ...prev.loading, models: false }
        }));
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Грешка при зареждане на моделите',
        loading: { ...prev.loading, models: false }
      }));
    }
  }, []);

  // Fetch years when model changes
  const fetchYears = useCallback(async (modelId: string) => {
    setState(prev => ({ ...prev, loading: { ...prev.loading, years: true } }));
    
    try {
      const response = await fetch(`/api/vehicle-filter/years?modelId=${modelId}`);
      const result = await response.json();
      
      if (result.success) {
        setState(prev => ({ 
          ...prev, 
          availableYears: result.data,
          loading: { ...prev.loading, years: false }
        }));
      } else {
        setState(prev => ({ 
          ...prev, 
          error: result.error,
          loading: { ...prev.loading, years: false }
        }));
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Грешка при зареждане на годините',
        loading: { ...prev.loading, years: false }
      }));
    }
  }, []);

  // Fetch engines when year changes
  const fetchEngines = useCallback(async (yearId: string) => {
    setState(prev => ({ ...prev, loading: { ...prev.loading, engines: true } }));
    
    try {
      const response = await fetch(`/api/vehicle-filter/engines?yearId=${yearId}`);
      const result = await response.json();
      
      if (result.success) {
        setState(prev => ({ 
          ...prev, 
          availableEngines: result.data,
          loading: { ...prev.loading, engines: false }
        }));
      } else {
        setState(prev => ({ 
          ...prev, 
          error: result.error,
          loading: { ...prev.loading, engines: false }
        }));
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Грешка при зареждане на двигателите',
        loading: { ...prev.loading, engines: false }
      }));
    }
  }, []);

  // Handle brand selection
  const handleBrandSelect = useCallback((brandItem: VehicleDisplayItem) => {
    const brand = brands.find(b => b.id === brandItem.id);
    if (!brand) return;

    const newSelection = resetSelectionFromLevel(
      { brand, model: state.selectedModel, year: state.selectedYear, engine: state.selectedEngine },
      'model'
    );

    setState(prev => ({
      ...prev,
      selectedBrand: brand,
      selectedModel: undefined,
      selectedYear: undefined,
      selectedEngine: undefined,
      availableModels: [],
      availableYears: [],
      availableEngines: []
    }));

    fetchModels(brand.id);
    onSelectionChange?.(newSelection);
  }, [brands, state, fetchModels, onSelectionChange]);

  // Handle model selection
  const handleModelSelect = useCallback((modelItem: VehicleDisplayItem) => {
    const model = state.availableModels.find(m => m.id === modelItem.id);
    if (!model) return;

    const newSelection = resetSelectionFromLevel(
      { brand: state.selectedBrand, model, year: state.selectedYear, engine: state.selectedEngine },
      'year'
    );

    setState(prev => ({
      ...prev,
      selectedModel: model,
      selectedYear: undefined,
      selectedEngine: undefined,
      availableYears: [],
      availableEngines: []
    }));

    fetchYears(model.id);
    onSelectionChange?.(newSelection);
  }, [state, fetchYears, onSelectionChange]);

  // Handle year selection
  const handleYearSelect = useCallback((yearItem: VehicleDisplayItem) => {
    const year = state.availableYears.find(y => y.id === yearItem.id);
    if (!year) return;

    const newSelection = resetSelectionFromLevel(
      { brand: state.selectedBrand, model: state.selectedModel, year, engine: state.selectedEngine },
      'engine'
    );

    setState(prev => ({
      ...prev,
      selectedYear: year,
      selectedEngine: undefined,
      availableEngines: []
    }));

    fetchEngines(year.id);
    onSelectionChange?.(newSelection);
  }, [state, fetchEngines, onSelectionChange]);

  // Handle engine selection
  const handleEngineSelect = useCallback((engineItem: VehicleDisplayItem) => {
    const engine = state.availableEngines.find(e => e.id === engineItem.id);
    if (!engine) return;

    const newSelection = {
      brand: state.selectedBrand,
      model: state.selectedModel,
      year: state.selectedYear,
      engine
    };

    setState(prev => ({
      ...prev,
      selectedEngine: engine
    }));

    onSelectionChange?.(newSelection);
    
    if (isSelectionComplete(newSelection)) {
      onSelectionComplete?.(newSelection);
    }
  }, [state, onSelectionChange, onSelectionComplete]);

  // Get current selection
  const currentSelection: VehicleSelection = {
    brand: state.selectedBrand,
    model: state.selectedModel,
    year: state.selectedYear,
    engine: state.selectedEngine
  };

  // Validation
  const validation = validateSelection(currentSelection);

  return (
    <div className={`dynamic-vehicle-selector ${compact ? 'compact' : ''} ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <TruckIcon className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">
            Избор на превозно средство
          </h2>
        </div>
        <p className="text-sm text-gray-600">
          Изберете вашия автомобил за да намерите съвместими части
        </p>
      </div>

      {/* Error Message */}
      {state.error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {state.error}
        </div>
      )}

      {/* Step-by-step Selection */}
      <div className="space-y-4">
        {/* Step 1: Brand */}
        <VehicleDropdown
          label="1. Марка"
          placeholder="Изберете марка на автомобила"
          items={brands.map(brandToDisplayItem)}
          selectedItem={state.selectedBrand ? brandToDisplayItem(state.selectedBrand) : undefined}
          onSelect={handleBrandSelect}
          loading={state.loading.brands}
          icon={<SparklesIcon className="h-4 w-4 text-amber-500" />}
        />

        {/* Step 2: Model */}
        <VehicleDropdown
          label="2. Модел"
          placeholder="Изберете модел"
          items={state.availableModels.map(modelToDisplayItem)}
          selectedItem={state.selectedModel ? modelToDisplayItem(state.selectedModel) : undefined}
          onSelect={handleModelSelect}
          disabled={!state.selectedBrand}
          loading={state.loading.models}
          icon={<TruckIcon className="h-4 w-4 text-blue-500" />}
        />

        {/* Step 3: Year */}
        <VehicleDropdown
          label="3. Година"
          placeholder="Изберете година на производство"
          items={state.availableYears.map(yearToDisplayItem)}
          selectedItem={state.selectedYear ? yearToDisplayItem(state.selectedYear) : undefined}
          onSelect={handleYearSelect}
          disabled={!state.selectedModel}
          loading={state.loading.years}
          icon={<span className="text-xs font-bold text-green-600">📅</span>}
        />

        {/* Step 4: Engine */}
        <VehicleDropdown
          label="4. Двигател"
          placeholder="Изберете двигател и мощност"
          items={state.availableEngines.map(engineToDisplayItem)}
          selectedItem={state.selectedEngine ? engineToDisplayItem(state.selectedEngine) : undefined}
          onSelect={handleEngineSelect}
          disabled={!state.selectedYear}
          loading={state.loading.engines}
          icon={<Cog6ToothIcon className="h-4 w-4 text-purple-500" />}
        />
      </div>

      {/* Selection Summary */}
      {showSummary && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Избрано превозно средство:</h3>
          {validation.isValid ? (
            <div className="flex items-center gap-2">
              <CheckIcon className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                {getSelectionSummary(currentSelection)}
              </span>
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              Моля, завършете избора си следвайки стъпките по-горе
            </div>
          )}
        </div>
      )}

      {/* Completion Status */}
      {validation.isValid && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckIcon className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-700">
              Готово! Можете да търсите съвместими части
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Dropdown Component for Vehicle Selection
 */
function VehicleDropdown({
  label,
  placeholder,
  items,
  selectedItem,
  onSelect,
  disabled = false,
  loading = false,
  error,
  icon
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        <div className="flex items-center gap-2">
          {icon}
          {label}
        </div>
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
          disabled={disabled || loading}
          className={`
            w-full px-4 py-3 text-left bg-white border rounded-lg shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'hover:bg-gray-50'}
            ${selectedItem ? 'text-gray-900' : 'text-gray-500'}
            ${loading ? 'animate-pulse' : ''}
          `}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {selectedItem?.icon && (
                <img 
                  src={selectedItem.icon} 
                  alt="" 
                  className="h-5 w-5 rounded object-contain"
                />
              )}
              <div>
                <div className="font-medium">
                  {loading ? 'Зареждане...' : selectedItem?.label || placeholder}
                </div>
                {selectedItem?.subtitle && (
                  <div className="text-xs text-gray-500 mt-1">
                    {selectedItem.subtitle}
                  </div>
                )}
              </div>
            </div>
            <ChevronDownIcon 
              className={`h-5 w-5 text-gray-400 transition-transform ${
                isOpen ? 'transform rotate-180' : ''
              }`}
            />
          </div>
        </button>

        {/* Dropdown Menu */}
        {isOpen && !disabled && !loading && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {items.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500">
                Няма налични опции
              </div>
            ) : (
              items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelect(item);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50
                    focus:outline-none border-b border-gray-100 last:border-b-0
                    ${selectedItem?.id === item.id ? 'bg-blue-50 text-blue-900' : ''}
                  `}
                >
                  <div className="flex items-center gap-3">
                    {item.icon && (
                      <img 
                        src={item.icon} 
                        alt="" 
                        className="h-5 w-5 rounded object-contain"
                      />
                    )}
                    <div>
                      <div className="font-medium">{item.label}</div>
                      {item.subtitle && (
                        <div className="text-xs text-gray-500 mt-1">
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="mt-1 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
} 