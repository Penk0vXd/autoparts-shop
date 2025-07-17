'use client'

import React, { useState, useRef } from 'react'
import { MVPVehicleSelector } from './MVPVehicleSelector'
import { 
  MVPVehicleSelection, 
  MVPVehicleSelectorRef,
  MVPVehicleColorScheme,
  MVPVehicleSize
} from '@/types/mvp-vehicle-selector'

/**
 * MVP Vehicle Selector Demo Component
 * 
 * Demonstrates various configurations and use cases of the MVP Vehicle Selector.
 * Perfect for testing, development, and showcasing features.
 */
export function MVPVehicleSelectorDemo() {
  const [selection, setSelection] = useState<MVPVehicleSelection>({})
  const [lastAction, setLastAction] = useState<string>('')
  const [colorScheme, setColorScheme] = useState<MVPVehicleColorScheme>('default')
  const [size, setSize] = useState<MVPVehicleSize>('md')
  const [showConfirmation, setShowConfirmation] = useState(true)
  const [showProgress, setShowProgress] = useState(true)
  const [showLogos, setShowLogos] = useState(true)
  const [showStepNumbers, setShowStepNumbers] = useState(true)
  const [enableKeyboardNavigation, setEnableKeyboardNavigation] = useState(true)
  const [sortByPopularity, setSortByPopularity] = useState(true)
  
  const selectorRef = useRef<MVPVehicleSelectorRef>(null)
  
  // Event handlers
  const handleSelectionChange = (newSelection: MVPVehicleSelection) => {
    setSelection(newSelection)
    setLastAction(`Selection changed: ${JSON.stringify(newSelection, null, 2)}`)
    console.log('Selection changed:', newSelection)
  }
  
  const handleFindParts = (selection: MVPVehicleSelection) => {
    setLastAction(`Find parts clicked for: ${selection.make?.name} ${selection.model?.name} ${selection.year}`)
    console.log('Find parts:', selection)
    
    // Simulate navigation or API call
    alert(`Търсене на части за:\n${selection.make?.name} ${selection.model?.name} ${selection.year}`)
  }
  
  const handleReset = () => {
    setLastAction('Reset clicked')
    console.log('Reset clicked')
  }
  
  // Control functions
  const handleManualReset = () => {
    selectorRef.current?.reset()
    setLastAction('Manual reset triggered')
  }
  
  const handleManualFocus = () => {
    selectorRef.current?.focus()
    setLastAction('Manual focus triggered')
  }
  
  const handleValidate = () => {
    const isValid = selectorRef.current?.validate()
    setLastAction(`Validation result: ${isValid ? 'Valid' : 'Invalid'}`)
  }
  
  const handleGetSelection = () => {
    const currentSelection = selectorRef.current?.getSelection()
    setLastAction(`Current selection: ${JSON.stringify(currentSelection, null, 2)}`)
  }
  
  const handleSetPredefinedSelection = () => {
    const predefinedSelection: MVPVehicleSelection = {
      make: { id: 'bmw', name: 'BMW', popularity: 10 },
      model: { id: 'bmw-3-series', name: '3 Series', makeId: 'bmw', years: [2020, 2021, 2022, 2023, 2024], popularity: 10 },
      year: 2023
    }
    selectorRef.current?.setSelection(predefinedSelection)
    setLastAction(`Set predefined selection: BMW 3 Series 2023`)
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            MVP Vehicle Selector Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Демонстрация на MVP Vehicle Selector компонента с различни конфигурации и функционалности.
          </p>
        </div>
        
        {/* Configuration Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Конфигурация
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Color Scheme */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Цветова схема
              </label>
              <select
                value={colorScheme}
                onChange={(e) => setColorScheme(e.target.value as MVPVehicleColorScheme)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="default">Default</option>
                <option value="premium">Premium</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>
            
            {/* Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Размер
              </label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value as MVPVehicleSize)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </div>
            
            {/* Show Confirmation */}
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showConfirmation}
                  onChange={(e) => setShowConfirmation(e.target.checked)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Показвай потвърждение
                </span>
              </label>
            </div>
            
            {/* Show Progress */}
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showProgress}
                  onChange={(e) => setShowProgress(e.target.checked)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Показвай прогрес
                </span>
              </label>
            </div>
            
            {/* Show Logos */}
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showLogos}
                  onChange={(e) => setShowLogos(e.target.checked)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Показвай логота
                </span>
              </label>
            </div>
            
            {/* Show Step Numbers */}
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showStepNumbers}
                  onChange={(e) => setShowStepNumbers(e.target.checked)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Показвай номера на стъпки
                </span>
              </label>
            </div>
            
            {/* Enable Keyboard Navigation */}
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={enableKeyboardNavigation}
                  onChange={(e) => setEnableKeyboardNavigation(e.target.checked)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Клавиатурна навигация
                </span>
              </label>
            </div>
            
            {/* Sort By Popularity */}
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={sortByPopularity}
                  onChange={(e) => setSortByPopularity(e.target.checked)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Сортирай по популярност
                </span>
              </label>
            </div>
          </div>
        </div>
        
        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Контроли
          </h2>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleManualReset}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
            >
              Ръчно нулиране
            </button>
            
            <button
              onClick={handleManualFocus}
              className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors"
            >
              Фокусирай
            </button>
            
            <button
              onClick={handleValidate}
              className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-md transition-colors"
            >
              Валидирай
            </button>
            
            <button
              onClick={handleGetSelection}
              className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-md transition-colors"
            >
              Вземи избора
            </button>
            
            <button
              onClick={handleSetPredefinedSelection}
              className="px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-md transition-colors"
            >
              Задай BMW 3 Series 2023
            </button>
          </div>
        </div>
        
        {/* MVP Vehicle Selector */}
        <MVPVehicleSelector
          ref={selectorRef}
          onSelectionChange={handleSelectionChange}
          onFindParts={handleFindParts}
          onReset={handleReset}
          colorScheme={colorScheme}
          size={size}
          showConfirmation={showConfirmation}
          showProgress={showProgress}
          showLogos={showLogos}
          showStepNumbers={showStepNumbers}
          enableKeyboardNavigation={enableKeyboardNavigation}
          sortByPopularity={sortByPopularity}
          className="mb-8"
        />
        
        {/* Status Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Състояние
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Selection */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">
                Текущ избор
              </h3>
              <div className="bg-gray-50 rounded-md p-4">
                <pre className="text-sm text-gray-800 overflow-x-auto">
                  {JSON.stringify(selection, null, 2)}
                </pre>
              </div>
            </div>
            
            {/* Last Action */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">
                Последно действие
              </h3>
              <div className="bg-gray-50 rounded-md p-4">
                <pre className="text-sm text-gray-800 overflow-x-auto whitespace-pre-wrap">
                  {lastAction || 'Няма действия'}
                </pre>
              </div>
            </div>
          </div>
        </div>
        
        {/* Usage Examples */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Примери за употреба
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Основна употреба
              </h3>
              <pre className="bg-gray-50 rounded-md p-4 text-sm overflow-x-auto">
{`import { MVPVehicleSelector } from '@/components/MVPVehicleSelector'

function MyComponent() {
  const handleSelectionChange = (selection) => {
    console.log('Selection:', selection)
  }
  
  const handleFindParts = (selection) => {
    // Navigate to parts catalog with filters
    router.push(\`/catalog?make=\${selection.make.id}&model=\${selection.model.id}&year=\${selection.year}\`)
  }
  
  return (
    <MVPVehicleSelector
      onSelectionChange={handleSelectionChange}
      onFindParts={handleFindParts}
      showConfirmation={true}
      showProgress={true}
      colorScheme="default"
      size="md"
    />
  )
}`}
              </pre>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                С референция
              </h3>
              <pre className="bg-gray-50 rounded-md p-4 text-sm overflow-x-auto">
{`import { useRef } from 'react'
import { MVPVehicleSelector, MVPVehicleSelectorRef } from '@/components/MVPVehicleSelector'

function MyComponent() {
  const selectorRef = useRef<MVPVehicleSelectorRef>(null)
  
  const handleSubmit = () => {
    if (selectorRef.current?.validate()) {
      const selection = selectorRef.current.getSelection()
      // Process selection
    }
  }
  
  return (
    <MVPVehicleSelector
      ref={selectorRef}
      onFindParts={handleFindParts}
    />
  )
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MVPVehicleSelectorDemo 