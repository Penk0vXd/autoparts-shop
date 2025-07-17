'use client'

import { useState, useEffect } from 'react'
import { Search, X, Car, Settings, Clock } from 'lucide-react'
import { Dialog, DialogContent, DialogOverlay, DialogClose, DialogPortal } from '@/components/ui/dialog'
import { useSearchStore, type VehicleInfo } from '@/store/searchStore'
import { ResultsList } from './ResultsList'
import { cn } from '@/lib/utils'

// Mock vehicle data - in real app, fetch from API
const VEHICLE_MAKES = ['BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Toyota', 'Ford', 'Opel', 'Peugeot', 'Renault', 'Fiat']
const VEHICLE_MODELS: Record<string, string[]> = {
  'BMW': ['Series 1', 'Series 3', 'Series 5', 'X1', 'X3', 'X5'],
  'Mercedes-Benz': ['A-Class', 'C-Class', 'E-Class', 'GLA', 'GLC', 'GLE'],
  'Audi': ['A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7'],
  'Volkswagen': ['Golf', 'Passat', 'Polo', 'Tiguan', 'Touran', 'Arteon'],
  'Toyota': ['Corolla', 'Camry', 'RAV4', 'Yaris', 'Avensis', 'Auris']
}
const VEHICLE_YEARS = Array.from({ length: 25 }, (_, i) => (2024 - i).toString())

/**
 * Enhanced search dialog with vehicle compatibility and filters
 */
export function SearchDialog() {
  const [query, setQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState<'search' | 'vehicle'>('search')
  
  const { 
    isOpen, 
    close, 
    vehicleInfo, 
    setVehicleInfo, 
    compatibilityMode, 
    toggleCompatibilityMode,
    recentSearches,
    addRecentSearch
  } = useSearchStore()

  // Clear query when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      setActiveTab('search')
      setShowFilters(false)
    }
  }, [isOpen])

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      addRecentSearch(searchQuery)
    }
  }

  const handleVehicleChange = (field: keyof VehicleInfo, value: string) => {
    const updated = vehicleInfo ? { ...vehicleInfo } : { make: '', model: '', year: '' }
    updated[field] = value
    
    // Reset dependent fields
    if (field === 'make') {
      updated.model = ''
      updated.year = ''
    } else if (field === 'model') {
      updated.year = ''
    }
    
    setVehicleInfo(updated)
  }

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        
        <div className="fixed left-[50%] top-[50%] z-50 w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <div className="relative mx-4 mt-16 rounded-2xl bg-background/95 ring-1 ring-border shadow-xl backdrop-blur-md max-h-[80vh] flex flex-col">
            
            {/* Header with tabs */}
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setActiveTab('search')}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors",
                    activeTab === 'search' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                  )}
                >
                  <Search className="w-4 h-4" />
                  <span>Търсене</span>
                </button>
                <button
                  onClick={() => setActiveTab('vehicle')}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors",
                    activeTab === 'vehicle' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                  )}
                >
                  <Car className="w-4 h-4" />
                  <span>Автомобил</span>
                  {vehicleInfo && (
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </button>
              </div>
              
              {/* Compatibility mode toggle */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleCompatibilityMode}
                  className={cn(
                    "text-xs px-2 py-1 rounded-full transition-colors",
                    compatibilityMode 
                      ? "bg-green-100 text-green-800 border border-green-200" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {compatibilityMode ? '✓ Съвместими части' : 'Всички части'}
                </button>
                
                <DialogClose 
                  aria-label="Затвори търсачката"
                  className="rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <X className="h-5 w-5" />
                </DialogClose>
              </div>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-hidden">
              {activeTab === 'search' ? (
                <>
                  {/* Search Input */}
                  <div className="flex items-center border-b border-border/50 px-5 py-4">
                    <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Търси авточасти, номера на части..."
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value)
                        handleSearch(e.target.value)
                      }}
                      className="w-full border-0 bg-transparent px-4 py-0 text-lg leading-tight text-foreground placeholder:text-muted-foreground focus:outline-none"
                      aria-label="Търсене на продукти"
                    />
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        showFilters ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      )}
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quick filters */}
                  {showFilters && (
                    <div className="border-b border-border/50 p-4 bg-muted/30">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <label className="block text-xs font-medium mb-1">Цена до:</label>
                          <input 
                            type="range" 
                            min="0" 
                            max="2000" 
                            className="w-full" 
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>0 лв</span><span>2000+ лв</span>
                          </div>
                        </div>
                        <div>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" className="rounded" />
                            <span>Само налични</span>
                          </label>
                        </div>
                        <div>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" className="rounded" />
                            <span>С отстъпка</span>
                          </label>
                        </div>
                        <div>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" className="rounded" />
                            <span>Високо оценени</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recent searches */}
                  {!query && recentSearches.length > 0 && (
                    <div className="p-4 border-b border-border/50">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Последни търсения</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.slice(0, 5).map((search, index) => (
                          <button
                            key={index}
                            onClick={() => setQuery(search)}
                            className="px-3 py-1 bg-muted hover:bg-muted/80 rounded-full text-sm transition-colors"
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Results */}
                  <div className="flex-1 overflow-y-auto">
                    <ResultsList query={query} />
                  </div>
                </>
              ) : (
                /* Vehicle Selection Tab */
                <div className="p-6 space-y-6">
                  <div className="text-center mb-6">
                    <Car className="w-12 h-12 mx-auto text-primary mb-2" />
                    <h3 className="text-lg font-semibold">Изберете вашия автомобил</h3>
                    <p className="text-sm text-muted-foreground">
                      За точни и съвместими резултати при търсене
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Make selection */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Марка</label>
                      <select
                        value={vehicleInfo?.make || ''}
                        onChange={(e) => handleVehicleChange('make', e.target.value)}
                        className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="">Изберете марка</option>
                        {VEHICLE_MAKES.map(make => (
                          <option key={make} value={make}>{make}</option>
                        ))}
                      </select>
                    </div>

                    {/* Model selection */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Модел</label>
                      <select
                        value={vehicleInfo?.model || ''}
                        onChange={(e) => handleVehicleChange('model', e.target.value)}
                        disabled={!vehicleInfo?.make}
                        className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-muted disabled:cursor-not-allowed"
                      >
                        <option value="">Изберете модел</option>
                        {vehicleInfo?.make && VEHICLE_MODELS[vehicleInfo.make]?.map(model => (
                          <option key={model} value={model}>{model}</option>
                        ))}
                      </select>
                    </div>

                    {/* Year selection */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Година</label>
                      <select
                        value={vehicleInfo?.year || ''}
                        onChange={(e) => handleVehicleChange('year', e.target.value)}
                        disabled={!vehicleInfo?.model}
                        className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-muted disabled:cursor-not-allowed"
                      >
                        <option value="">Изберете година</option>
                        {VEHICLE_YEARS.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Current selection display */}
                  {vehicleInfo?.make && (
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-primary">Избран автомобил:</h4>
                          <p className="text-sm">
                            {vehicleInfo.make} 
                            {vehicleInfo.model && ` ${vehicleInfo.model}`}
                            {vehicleInfo.year && ` (${vehicleInfo.year})`}
                          </p>
                        </div>
                        <button
                          onClick={() => setVehicleInfo(null)}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Изчисти
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-center">
                    <button
                      onClick={() => setActiveTab('search')}
                      className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Започни търсене
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {activeTab === 'search' && (
              <div className="border-t border-border/50 px-5 py-3">
                <div className="flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">
                    Използвайте ↑↓ за навигация, Enter за избор, ESC за затваряне
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogPortal>
    </Dialog>
  )
} 