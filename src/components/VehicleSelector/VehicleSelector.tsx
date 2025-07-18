'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// TYPESCRIPT INTERFACES - The Divine Data Structures
// ============================================================================

interface VehicleBrand {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  country: string;
}

interface VehicleModel {
  id: string;
  name: string;
  slug: string;
  brand_id: string;
  body_type: string;
}

interface VehicleYear {
  id: string;
  year: number;
  model_id: string;
  generation: string;
}

interface VehicleEngine {
  id: string;
  engine_code: string;
  name: string;
  type: string;
  displacement: number;
  horsepower: number;
  torque: number;
  year_id: string;
}

interface VehicleSelection {
  brand?: VehicleBrand;
  model?: VehicleModel;
  year?: VehicleYear;
  engine?: VehicleEngine;
}

interface VehicleSelectorProps {
  onSelectionComplete?: (selection: VehicleSelection) => void;
  onSelectionChange?: (selection: VehicleSelection) => void;
  initialSelection?: VehicleSelection;
  className?: string;
}

// ============================================================================
// VEHICLE SELECTOR COMPONENT - The Wizard of Automotive Dreams
// ============================================================================

export function VehicleSelector({
  onSelectionComplete,
  onSelectionChange,
  initialSelection,
  className = ''
}: VehicleSelectorProps) {
  
  // State Management - The Heart of the Wizard
  const [currentStep, setCurrentStep] = useState(1);
  const [selection, setSelection] = useState<VehicleSelection>(initialSelection || {});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Data State - The Repositories of Knowledge
  const [brands, setBrands] = useState<VehicleBrand[]>([]);
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [years, setYears] = useState<VehicleYear[]>([]);
  const [engines, setEngines] = useState<VehicleEngine[]>([]);

  // ============================================================================
  // DATA FETCHING FUNCTIONS - The Divine Queries
  // ============================================================================

  const fetchBrands = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/vehicle-selector/brands');
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch brands');
      }
      
      setBrands(result.data || []);
    } catch (err) {
      setError('Грешка при зареждане на марките. Моля, опитайте отново.');
      console.error('Error fetching brands:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchModels = async (brandId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/vehicle-selector/models?brandId=${brandId}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch models');
      }
      
      setModels(result.data || []);
    } catch (err) {
      setError('Грешка при зареждане на моделите. Моля, опитайте отново.');
      console.error('Error fetching models:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchYears = async (modelId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/vehicle-selector/years?modelId=${modelId}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch years');
      }
      
      setYears(result.data || []);
    } catch (err) {
      setError('Грешка при зареждане на годините. Моля, опитайте отново.');
      console.error('Error fetching years:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEngines = async (yearId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/vehicle-selector/engines?yearId=${yearId}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch engines');
      }
      
      setEngines(result.data || []);
    } catch (err) {
      setError('Грешка при зареждане на двигателите. Моля, опитайте отново.');
      console.error('Error fetching engines:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // SELECTION HANDLERS - The Divine Actions
  // ============================================================================

  const handleBrandSelect = (brand: VehicleBrand) => {
    const newSelection = { 
      brand, 
      model: undefined, 
      year: undefined, 
      engine: undefined 
    };
    setSelection(newSelection);
    setCurrentStep(2);
    fetchModels(brand.id);
    onSelectionChange?.(newSelection);
  };

  const handleModelSelect = (model: VehicleModel) => {
    const newSelection = { 
      ...selection, 
      model, 
      year: undefined, 
      engine: undefined 
    };
    setSelection(newSelection);
    setCurrentStep(3);
    fetchYears(model.id);
    onSelectionChange?.(newSelection);
  };

  const handleYearSelect = (year: VehicleYear) => {
    const newSelection = { 
      ...selection, 
      year, 
      engine: undefined 
    };
    setSelection(newSelection);
    setCurrentStep(4);
    fetchEngines(year.id);
    onSelectionChange?.(newSelection);
  };

  const handleEngineSelect = (engine: VehicleEngine) => {
    const newSelection = { 
      ...selection, 
      engine 
    };
    setSelection(newSelection);
    onSelectionComplete?.(newSelection);
    onSelectionChange?.(newSelection);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setSelection({});
    setCurrentStep(1);
    setBrands([]);
    setModels([]);
    setYears([]);
    setEngines([]);
    setError(null);
  };

  // ============================================================================
  // EFFECTS - The Divine Initialization
  // ============================================================================

  useEffect(() => {
    fetchBrands();
  }, []);

  // ============================================================================
  // RENDER FUNCTIONS - The Divine UI Elements
  // ============================================================================

  const renderProgressBar = () => {
    const steps = ['Марка', 'Модел', 'Година', 'Двигател'];
    
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${index + 1 <= currentStep 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-400'
                }
              `}>
                {index + 1}
              </div>
              <span className={`
                ml-2 text-sm font-medium
                ${index + 1 <= currentStep 
                  ? 'text-blue-600' 
                  : 'text-gray-400'
                }
              `}>
                {step}
              </span>
              {index < steps.length - 1 && (
                <div className={`
                  w-full h-0.5 mx-4
                  ${index + 1 < currentStep 
                    ? 'bg-blue-600' 
                    : 'bg-gray-200'
                  }
                `} />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderBrandCard = (brand: VehicleBrand) => (
    <motion.div
      key={brand.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => handleBrandSelect(brand)}
    >
      {brand.logo_url && (
        <div className="flex justify-center mb-4">
          <img 
            src={brand.logo_url} 
            alt={brand.name}
            className="w-16 h-16 object-contain"
          />
        </div>
      )}
      <h3 className="text-lg font-semibold text-center text-gray-900">
        {brand.name}
      </h3>
      <p className="text-sm text-center text-gray-500 mt-1">
        {brand.country}
      </p>
    </motion.div>
  );

  const renderModelCard = (model: VehicleModel) => (
    <motion.div
      key={model.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => handleModelSelect(model)}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {model.name}
      </h3>
      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
        {model.body_type}
      </span>
    </motion.div>
  );

  const renderYearCard = (year: VehicleYear) => (
    <motion.div
      key={year.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => handleYearSelect(year)}
    >
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        {year.year}
      </h3>
      <p className="text-sm text-gray-500">
        Поколение: {year.generation}
      </p>
    </motion.div>
  );

  const renderEngineCard = (engine: VehicleEngine) => (
    <motion.div
      key={engine.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => handleEngineSelect(engine)}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">
          {engine.name}
        </h3>
        <span className={`
          px-2 py-1 rounded text-xs font-medium
          ${engine.type === 'Petrol' ? 'bg-green-100 text-green-800' : ''}
          ${engine.type === 'Diesel' ? 'bg-blue-100 text-blue-800' : ''}
          ${engine.type === 'Hybrid' ? 'bg-yellow-100 text-yellow-800' : ''}
          ${engine.type === 'Electric' ? 'bg-purple-100 text-purple-800' : ''}
        `}>
          {engine.type}
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Мощност:</span>
          <span className="font-medium">{engine.horsepower} к.с.</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Въртящ момент:</span>
          <span className="font-medium">{engine.torque} Nm</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Обем:</span>
          <span className="font-medium">{engine.displacement}L</span>
        </div>
      </div>
    </motion.div>
  );

  const renderCurrentStep = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Зареждане...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-red-600 hover:text-red-800 font-medium"
          >
            Опитайте отново
          </button>
        </div>
      );
    }

    const stepContent = {
      1: {
        title: 'Изберете марка',
        subtitle: 'Изберете марката на вашия автомобил',
        items: brands,
        renderItem: renderBrandCard
      },
      2: {
        title: 'Изберете модел',
        subtitle: `Изберете модела на ${selection.brand?.name}`,
        items: models,
        renderItem: renderModelCard
      },
      3: {
        title: 'Изберете година',
        subtitle: `Изберете годината на ${selection.brand?.name} ${selection.model?.name}`,
        items: years,
        renderItem: renderYearCard
      },
      4: {
        title: 'Изберете двигател',
        subtitle: `Изберете двигателя на ${selection.brand?.name} ${selection.model?.name} ${selection.year?.year}`,
        items: engines,
        renderItem: renderEngineCard
      }
    };

    const current = stepContent[currentStep as keyof typeof stepContent];

    return (
      <div>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {current.title}
          </h2>
          <p className="text-gray-600">
            {current.subtitle}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {current.items.map((item) => current.renderItem(item as any))}
          </motion.div>
        </AnimatePresence>

        {current.items.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              Няма налични {current.title.toLowerCase().replace('изберете ', '')}
            </p>
          </div>
        )}
      </div>
    );
  };

  // ============================================================================
  // MAIN RENDER - The Divine Interface
  // ============================================================================

  return (
    <div className={`max-w-6xl mx-auto p-6 ${className}`}>
      {renderProgressBar()}
      
      {/* Navigation */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className={`
            flex items-center px-4 py-2 rounded-lg font-medium transition-colors
            ${currentStep === 1 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-blue-600 hover:bg-blue-50'
            }
          `}
        >
          <ChevronLeftIcon className="w-5 h-5 mr-2" />
          Назад
        </button>
        
        <button
          onClick={handleReset}
          className="text-gray-500 hover:text-gray-700 font-medium"
        >
          Започни отново
        </button>
      </div>

      {/* Current Step Content */}
      {renderCurrentStep()}
    </div>
  );
}

export default VehicleSelector; 