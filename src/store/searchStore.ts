import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface VehicleInfo {
  make: string
  model: string  
  year: string
  engine?: string
}

export interface SearchFilters {
  priceRange: [number, number]
  brands: string[]
  inStockOnly: boolean
  minRating: number
  categories: string[]
}

interface SearchStore {
  isOpen: boolean
  vehicleInfo: VehicleInfo | null
  filters: SearchFilters
  compatibilityMode: boolean
  recentSearches: string[]
  
  // Actions
  open: () => void
  close: () => void
  toggle: () => void
  setVehicleInfo: (vehicle: VehicleInfo | null) => void
  updateFilters: (filters: Partial<SearchFilters>) => void
  toggleCompatibilityMode: () => void
  addRecentSearch: (query: string) => void
  clearRecentSearches: () => void
}

const defaultFilters: SearchFilters = {
  priceRange: [0, 2000],
  brands: [],
  inStockOnly: false,
  minRating: 0,
  categories: []
}

export const useSearchStore = create<SearchStore>()(
  persist(
    (set, get) => ({
      isOpen: false,
      vehicleInfo: null,
      filters: defaultFilters,
      compatibilityMode: false,
      recentSearches: [],
      
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
      
      setVehicleInfo: (vehicle) => set({ vehicleInfo: vehicle }),
      
      updateFilters: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters }
      })),
      
      toggleCompatibilityMode: () => set((state) => ({
        compatibilityMode: !state.compatibilityMode
      })),
      
      addRecentSearch: (query) => {
        const trimmed = query.trim()
        if (!trimmed) return
        
        set((state) => ({
          recentSearches: [
            trimmed,
            ...state.recentSearches.filter(s => s !== trimmed)
          ].slice(0, 10)
        }))
      },
      
      clearRecentSearches: () => set({ recentSearches: [] })
    }),
    {
      name: 'search-store',
      version: 1,
    }
  )
) 