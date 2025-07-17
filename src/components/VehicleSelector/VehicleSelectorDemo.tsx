'use client'

import { useState } from 'react'
import { VehicleSelector } from './VehicleSelector'
import { VehicleProvider, useVehicle, useVehicleSelection, useVehicleCompatibility } from '@/contexts/VehicleContext'
import { VehicleSelection } from '@/types/vehicle'
import { ShoppingBagIcon, FunnelIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

/**
 * Vehicle Selector Demo Component
 * 
 * Demonstrates how to integrate the VehicleSelector component with:
 * - Context provider for state management
 * - Product filtering based on vehicle compatibility
 * - Real-time selection updates
 * - Vehicle selection summary display
 */

/**
 * Demo Content - shows the selected vehicle and filtered products
 */
function DemoContent() {
  const { selection, hasSelection, clearSelection } = useVehicle()
  const { summary, shortSummary, isCompleteSelection } = useVehicleSelection()
  const { getProductFilters, checkProductCompatibility, hasFilters } = useVehicleCompatibility()

  // Mock product data to demonstrate filtering
  const mockProducts = [
    {
      id: '1',
      name: 'Маслен филтър Bosch',
      compatibility: {
        makes: ['BMW', 'Mercedes-Benz', 'Audi'],
        models: ['3 Series', 'C-Class', 'A4'],
        years: ['2012-2019', '2014-2021', '2015-2023'],
        engines: ['320i', '318d', '320d', 'C200', 'C220d']
      }
    },
    {
      id: '2',
      name: 'Спирачни накладки Brembo',
      compatibility: {
        makes: ['BMW', 'Audi'],
        models: ['3 Series', 'A4'],
        years: ['2015-2019'],
        engines: ['320i', '320d', '2.0 TFSI']
      }
    },
    {
      id: '3',
      name: 'Въздушен филтър Mann',
      compatibility: {
        makes: ['Mercedes-Benz'],
        models: ['C-Class'],
        years: ['2014-2018'],
        engines: ['C200', 'C220d']
      }
    },
    {
      id: '4',
      name: 'Амортисьор Sachs',
      compatibility: {
        makes: ['BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen'],
        models: ['3 Series', 'C-Class', 'A4', 'Golf'],
        years: ['2010-2020'],
        engines: ['320i', '318d', '320d', 'C200', '2.0 TFSI', '1.4 TSI']
      }
    }
  ]

  // Filter products based on vehicle selection
  const filteredProducts = hasFilters 
    ? mockProducts.filter(product => checkProductCompatibility(product.compatibility))
    : mockProducts

  const handleSelectionChange = (newSelection: VehicleSelection) => {
    console.log('Vehicle selection changed:', newSelection)
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Избор на автомобил
        </h1>
        <p className="text-lg text-gray-600">
          Изберете вашия автомобил за намиране на съвместими части
        </p>
      </div>

      {/* Vehicle Selector */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <VehicleSelector
          onSelectionChange={handleSelectionChange}
          showEngineSelector={true}
          showClearButton={true}
          size="md"
          className="w-full"
        />
      </div>

      {/* Selection Summary */}
      {hasSelection && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircleIcon className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900">
                  Избран автомобил
                </h3>
                <p className="text-blue-700">
                  {summary || 'Неполна селекция'}
                </p>
              </div>
            </div>
            <button
              onClick={clearSelection}
              className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              Смени автомобил
            </button>
          </div>
          
          {/* Selection Details */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-white p-3 rounded-md">
              <div className="font-medium text-gray-900">Марка</div>
              <div className="text-gray-600">{selection.make?.name || 'Не е избрана'}</div>
            </div>
            <div className="bg-white p-3 rounded-md">
              <div className="font-medium text-gray-900">Модел</div>
              <div className="text-gray-600">{selection.model?.name || 'Не е избран'}</div>
            </div>
            <div className="bg-white p-3 rounded-md">
              <div className="font-medium text-gray-900">Година</div>
              <div className="text-gray-600">{selection.year || 'Не е избрана'}</div>
            </div>
            <div className="bg-white p-3 rounded-md">
              <div className="font-medium text-gray-900">Двигател</div>
              <div className="text-gray-600">{selection.engine?.name || 'Не е избран'}</div>
            </div>
          </div>
        </div>
      )}

      {/* Product Filtering Results */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FunnelIcon className="h-6 w-6 text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-900">
                Съвместими части
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <ShoppingBagIcon className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600">
                {filteredProducts.length} от {mockProducts.length} продукта
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Марки:</span> {product.compatibility.makes.join(', ')}
                    </div>
                    <div>
                      <span className="font-medium">Модели:</span> {product.compatibility.models.join(', ')}
                    </div>
                    <div>
                      <span className="font-medium">Години:</span> {product.compatibility.years.join(', ')}
                    </div>
                    {product.compatibility.engines && (
                      <div>
                        <span className="font-medium">Двигатели:</span> {product.compatibility.engines.join(', ')}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-600">
                      {Math.floor(Math.random() * 100) + 20}.99 лв
                    </span>
                    <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
                      Добави в количката
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FunnelIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Няма съвместими части
              </h3>
              <p className="text-gray-600">
                Не са намерени части за избрания автомобил. Моля, проверете селекцията си.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Debug Info (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Debug Info</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Has Selection:</span> {hasSelection ? 'Yes' : 'No'}
            </div>
            <div>
              <span className="font-medium">Complete Selection:</span> {isCompleteSelection ? 'Yes' : 'No'}
            </div>
            <div>
              <span className="font-medium">Short Summary:</span> {shortSummary || 'None'}
            </div>
            <div>
              <span className="font-medium">Product Filters:</span> {JSON.stringify(getProductFilters())}
            </div>
            <div>
              <span className="font-medium">Full Selection:</span>
              <pre className="mt-1 text-xs bg-white p-2 rounded border overflow-x-auto">
                {JSON.stringify(selection, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Main Demo Component with Provider
 */
export function VehicleSelectorDemo() {
  return (
    <VehicleProvider>
      <DemoContent />
    </VehicleProvider>
  )
}

/**
 * Usage Example for Integration
 */
export function VehicleSelectorUsageExample() {
  const [selection, setSelection] = useState<VehicleSelection>({})

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Usage Example</h2>
      
      {/* Basic Usage */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Basic Usage</h3>
        <VehicleSelector
          onSelectionChange={setSelection}
          showEngineSelector={true}
          showClearButton={true}
          size="md"
        />
      </div>

      {/* With Context Provider */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">With Context Provider</h3>
        <VehicleProvider>
          <VehicleSelector
            showEngineSelector={true}
            showClearButton={true}
            size="lg"
          />
          {/* Other components can now access vehicle selection via useVehicle() */}
        </VehicleProvider>
      </div>
    </div>
  )
} 