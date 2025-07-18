'use client'

import { useState, useEffect } from 'react'
import { CategoryFilter, CategoryFilterOptions, CategoryLocalization } from '@/types/category'
import { FunnelIcon, XMarkIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'

interface CategoryFilterProps {
  filters: CategoryFilter
  filterOptions: CategoryFilterOptions
  onFiltersChange: (filters: CategoryFilter) => void
  onApplyFilters: () => void
  className?: string
}

/**
 * Advanced Category Filter Panel
 * Mobile-first with drawer functionality and Bulgarian localization
 */
export function CategoryFilterPanel({ 
  filters, 
  filterOptions, 
  onFiltersChange, 
  onApplyFilters,
  className = '' 
}: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState<CategoryFilter>(filters)
  const [hasChanges, setHasChanges] = useState(false)

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters)
    setHasChanges(false)
  }, [filters])

  // Check if filters have changed
  useEffect(() => {
    const filtersChanged = JSON.stringify(localFilters) !== JSON.stringify(filters)
    setHasChanges(filtersChanged)
  }, [localFilters, filters])

  const handleFilterChange = (key: keyof CategoryFilter, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleApplyFilters = () => {
    onFiltersChange(localFilters)
    onApplyFilters()
    setIsOpen(false)
  }

  const handleClearFilters = () => {
    const clearedFilters: CategoryFilter = {
      brands: [],
      priceRange: { min: null, max: null },
      stockStatus: 'all',
      isOnSale: false,
      isNew: false,
      sortBy: 'popular'
    }
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
    onApplyFilters()
  }

  const toggleBrand = (brandValue: string) => {
    const newBrands = localFilters.brands.includes(brandValue)
      ? localFilters.brands.filter(b => b !== brandValue)
      : [...localFilters.brands, brandValue]
    
    handleFilterChange('brands', newBrands)
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (localFilters.brands.length > 0) {
      count++
    }
    if (localFilters.priceRange.min !== null || localFilters.priceRange.max !== null) {
      count++
    }
    if (localFilters.stockStatus !== 'all') {
      count++
    }
    if (localFilters.isOnSale) {
      count++
    }
    if (localFilters.isNew) {
      count++
    }
    return count
  }

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200"
          aria-label="Open filters"
        >
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-500" />
            <span className="font-medium text-gray-700">
              Филтри
            </span>
            {getActiveFiltersCount() > 0 && (
              <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                {getActiveFiltersCount()}
              </span>
            )}
          </div>
          <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      {/* Mobile Filter Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Филтри
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                aria-label="Close filters"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto h-full pb-24">
              <FilterContent
                localFilters={localFilters}
                filterOptions={filterOptions}
                onFilterChange={handleFilterChange}
                onToggleBrand={toggleBrand}
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
              <div className="flex space-x-3">
                <button
                  onClick={handleClearFilters}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  {CategoryLocalization.filters.clearFilters}
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                >
                  {CategoryLocalization.filters.applyFilters}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Filter Panel */}
      <div className={`hidden lg:block ${className}`}>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <FunnelIcon className="h-5 w-5 mr-2 text-gray-500" />
              Филтри
            </h2>
            {getActiveFiltersCount() > 0 && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-red-600 hover:text-red-700 transition-colors duration-200"
              >
                {CategoryLocalization.filters.clearFilters}
              </button>
            )}
          </div>

          <FilterContent
            localFilters={localFilters}
            filterOptions={filterOptions}
            onFilterChange={handleFilterChange}
            onToggleBrand={toggleBrand}
          />

          {hasChanges && (
            <div className="mt-6 pt-6 border-t">
              <button
                onClick={handleApplyFilters}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
              >
                {CategoryLocalization.filters.applyFilters}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

/**
 * Filter Content Component (shared between mobile and desktop)
 */
interface FilterContentProps {
  localFilters: CategoryFilter
  filterOptions: CategoryFilterOptions
  onFilterChange: (key: keyof CategoryFilter, value: any) => void
  onToggleBrand: (brandValue: string) => void
}

function FilterContent({ localFilters, filterOptions, onFilterChange, onToggleBrand }: FilterContentProps) {
  return (
    <div className="space-y-6">
      {/* Brand Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">
          {CategoryLocalization.filters.brand}
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {filterOptions.brands.map((brand) => (
            <label key={brand.value} className="flex items-center">
              <input
                type="checkbox"
                checked={localFilters.brands.includes(brand.value)}
                onChange={() => onToggleBrand(brand.value)}
                className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
              />
              <span className="ml-2 text-sm text-gray-700">
                {brand.label} ({brand.count})
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">
          {CategoryLocalization.filters.priceRange}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Минимална</label>
            <input
              type="number"
              value={localFilters.priceRange.min || ''}
              onChange={(e) => onFilterChange('priceRange', {
                ...localFilters.priceRange,
                min: e.target.value ? Number(e.target.value) : null
              })}
              placeholder={`${filterOptions.priceRange.min}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Максимална</label>
            <input
              type="number"
              value={localFilters.priceRange.max || ''}
              onChange={(e) => onFilterChange('priceRange', {
                ...localFilters.priceRange,
                max: e.target.value ? Number(e.target.value) : null
              })}
              placeholder={`${filterOptions.priceRange.max}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>
      </div>

      {/* Stock Status Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">
          {CategoryLocalization.filters.stockStatus}
        </h3>
        <div className="space-y-2">
          {Object.entries(CategoryLocalization.stock).map(([key, label]) => (
            <label key={key} className="flex items-center">
              <input
                type="radio"
                name="stockStatus"
                value={key}
                checked={localFilters.stockStatus === key}
                onChange={(e) => onFilterChange('stockStatus', e.target.value)}
                className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500 focus:ring-2"
              />
              <span className="ml-2 text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Quick Filters */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Бързи филтри</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={localFilters.isOnSale}
              onChange={(e) => onFilterChange('isOnSale', e.target.checked)}
              className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
            />
            <span className="ml-2 text-sm text-gray-700">
              Намалени цени ({filterOptions.saleCounts.onSale})
            </span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={localFilters.isNew}
              onChange={(e) => onFilterChange('isNew', e.target.checked)}
              className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
            />
            <span className="ml-2 text-sm text-gray-700">
              Нови продукти ({filterOptions.saleCounts.new})
            </span>
          </label>
        </div>
      </div>

      {/* Sort By */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">
          {CategoryLocalization.filters.sortBy}
        </h3>
        <select
          value={localFilters.sortBy}
          onChange={(e) => onFilterChange('sortBy', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-red-500 focus:border-red-500"
        >
          {Object.entries(CategoryLocalization.sort).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>
    </div>
  )
} 