'use client';

import { useState } from 'react';
import VehicleSelector from '@/components/VehicleSelector/VehicleSelector';
// Using VehicleSelection from VehicleSelector component

export default function VehicleSelectorDemo() {
  const [selection, setSelection] = useState<any>({});
  const [completedSelection, setCompletedSelection] = useState<any>(null);

  const handleSelectionChange = (newSelection: any) => {
    setSelection(newSelection);
  };

  const handleSelectionComplete = (finalSelection: any) => {
    setCompletedSelection(finalSelection);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Селектор за автомобили
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Интелигентен четири-стъпков селектор за избор на автомобил
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Vehicle Selector */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <VehicleSelector
            onSelectionChange={handleSelectionChange}
            onSelectionComplete={handleSelectionComplete}
          />
        </div>

        {/* Selection Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Selection */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Текуща селекция
            </h2>
            
            {Object.keys(selection).length === 0 ? (
              <p className="text-gray-500">Няма направена селекция</p>
            ) : (
              <div className="space-y-4">
                {selection.brand && (
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Марка</h3>
                      <p className="text-gray-600">{selection.brand.name}</p>
                    </div>
                  </div>
                )}
                
                {selection.model && (
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Модел</h3>
                      <p className="text-gray-600">{selection.model.name}</p>
                      <p className="text-sm text-gray-500">{selection.model.body_type}</p>
                    </div>
                  </div>
                )}
                
                {selection.year && (
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600 font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Година</h3>
                      <p className="text-gray-600">{selection.year.year}</p>
                      <p className="text-sm text-gray-500">Поколение: {selection.year.generation}</p>
                    </div>
                  </div>
                )}
                
                {selection.engine && (
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-bold">4</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Двигател</h3>
                      <p className="text-gray-600">{selection.engine.name}</p>
                      <div className="flex space-x-4 text-sm text-gray-500">
                        <span>{selection.engine.horsepower} к.с.</span>
                        <span>{selection.engine.torque} Nm</span>
                        <span>{selection.engine.displacement}L</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Completed Selection */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Завършена селекция
            </h2>
            
            {!completedSelection ? (
              <p className="text-gray-500">Няма завършена селекция</p>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <h3 className="font-semibold text-green-800">Избран автомобил</h3>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-green-700">Марка:</span>
                      <span className="font-medium text-green-900">{completedSelection.brand?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Модел:</span>
                      <span className="font-medium text-green-900">{completedSelection.model?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Година:</span>
                      <span className="font-medium text-green-900">{completedSelection.year?.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Двигател:</span>
                      <span className="font-medium text-green-900">{completedSelection.engine?.name}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Технически данни</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Тип гориво:</span>
                      <span className="font-medium text-blue-900">{completedSelection.engine?.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Мощност:</span>
                      <span className="font-medium text-blue-900">{completedSelection.engine?.horsepower} к.с.</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Въртящ момент:</span>
                      <span className="font-medium text-blue-900">{completedSelection.engine?.torque} Nm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Обем:</span>
                      <span className="font-medium text-blue-900">{completedSelection.engine?.displacement}L</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Код двигател:</span>
                      <span className="font-medium text-blue-900">{completedSelection.engine?.engine_code}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Usage Guide */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Как да използвате селектора
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Изберете марка</h3>
              <p className="text-sm text-gray-600">
                Започнете с избор на марката на вашия автомобил от списъка
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Изберете модел</h3>
              <p className="text-sm text-gray-600">
                Изберете конкретния модел от наличните опции за тази марка
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-yellow-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Изберете година</h3>
              <p className="text-sm text-gray-600">
                Изберете годината на производство на вашия автомобил
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">4</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Изберете двигател</h3>
              <p className="text-sm text-gray-600">
                Изберете двигателя с подходящата мощност и тип гориво
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 