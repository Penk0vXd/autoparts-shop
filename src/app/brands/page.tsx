'use client'

import { useEffect, useState, useMemo, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon, 
  Squares2X2Icon, 
  ListBulletIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MapPinIcon,
  StarIcon
} from '@heroicons/react/24/outline'
// SafeImage import removed - using regular img for brand logos

// Enhanced brand interface
interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  description?: string;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

type BrandsResponse = {
  data: Brand[]
  total: number
  page: number
  totalPages: number
}

type BrandCategory = 'car' | 'accessory' | 'parts' | 'all'
type ViewType = 'grid' | 'list'
type SortType = 'name' | 'country' | 'founded' | 'popularity'

const LIMIT = 24

// Enhanced brand data with additional info
const enhancedBrandData: Record<string, any> = {
  'bmw': { country: '🇩🇪 Germany', founded: 1916, isPremium: true, popularity: 95 },
  'mercedes-benz': { country: '🇩🇪 Germany', founded: 1926, isPremium: true, popularity: 98 },
  'audi': { country: '🇩🇪 Germany', founded: 1909, isPremium: true, popularity: 92 },
  'volkswagen': { country: '🇩🇪 Germany', founded: 1937, isPremium: false, popularity: 88 },
  'toyota': { country: '🇯🇵 Japan', founded: 1937, isPremium: false, popularity: 96 },
  'honda': { country: '🇯🇵 Japan', founded: 1948, isPremium: false, popularity: 85 },
  'ford': { country: '🇺🇸 USA', founded: 1903, isPremium: false, popularity: 82 },
  'chevrolet': { country: '🇺🇸 USA', founded: 1911, isPremium: false, popularity: 80 },
  'nissan': { country: '🇯🇵 Japan', founded: 1933, isPremium: false, popularity: 78 },
  'hyundai': { country: '🇰🇷 S.Korea', founded: 1967, isPremium: false, popularity: 75 },
  'kia': { country: '🇰🇷 S.Korea', founded: 1944, isPremium: false, popularity: 72 },
  'volvo': { country: '🇸🇪 Sweden', founded: 1927, isPremium: true, popularity: 76 },
  'peugeot': { country: '🇫🇷 France', founded: 1882, isPremium: false, popularity: 70 },
  'renault': { country: '🇫🇷 France', founded: 1899, isPremium: false, popularity: 68 },
  'fiat': { country: '🇮🇹 Italy', founded: 1899, isPremium: false, popularity: 65 },
  'ferrari': { country: '🇮🇹 Italy', founded: 1939, isPremium: true, popularity: 95 },
  'lamborghini': { country: '🇮🇹 Italy', founded: 1963, isPremium: true, popularity: 92 },
  'porsche': { country: '🇩🇪 Germany', founded: 1931, isPremium: true, popularity: 94 },
  'acura': { country: '🇯🇵 Japan', founded: 1986, isPremium: true, popularity: 73 },
}

// Enhanced brand card component
function EnhancedBrandCard({ brand, viewType }: { brand: Brand; viewType: ViewType }) {
  const enhancedData = enhancedBrandData[brand.slug] || { 
    country: '🌍 International', 
    founded: 2000, 
    isPremium: false, 
    popularity: 50 
  }
  
  const logoUrl = brand.logo_url || `/logos/${brand.slug}.png`

  if (viewType === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.01 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 p-6 flex items-center space-x-6"
      >
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center shadow-sm">
            <img
              src={logoUrl}
              alt={`${brand.name} logo`}
              className="w-10 h-10 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src !== '/images/default-brand-logo.png') {
                  target.src = '/images/default-brand-logo.png';
                }
              }}
            />
          </div>
          {enhancedData.isPremium && (
            <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1">
              <StarIcon className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{brand.name}</h3>
              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                <span className="flex items-center space-x-1">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{enhancedData.country}</span>
                </span>
                <span>Est. {enhancedData.founded}</span>
                <div className="flex items-center space-x-1">
                  <span className="text-blue-600 font-medium">{enhancedData.popularity}%</span>
                  <span className="text-gray-400">popularity</span>
                </div>
              </div>
              {brand.description && (
                <p className="text-gray-600 text-sm mt-2 line-clamp-1 max-w-md">
                  {brand.description}
                </p>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              {enhancedData.isPremium && (
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Premium
                </span>
              )}
              <Link
                href={`/brands/${brand.slug}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
              >
                View Parts
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="relative p-6">
        {/* Premium badge */}
        {enhancedData.isPremium && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
            <StarIcon className="w-3 h-3" />
            <span>Premium</span>
          </div>
        )}
        
        {/* Logo section */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <img
                src={logoUrl}
                alt={`${brand.name} logo`}
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== '/images/default-brand-logo.png') {
                    target.src = '/images/default-brand-logo.png';
                  }
                }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-2xl"></div>
          </div>
        </div>
        
        {/* Brand info */}
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{brand.name}</h3>
          <div className="flex items-center justify-center space-x-3 text-sm text-gray-600 mb-3">
            <span className="flex items-center space-x-1">
              <MapPinIcon className="w-4 h-4" />
              <span>{enhancedData.country}</span>
            </span>
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            <span>Est. {enhancedData.founded}</span>
          </div>
          
          {/* Popularity indicator */}
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="flex items-center space-x-1">
              <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                  style={{ width: `${enhancedData.popularity}%` }}
                ></div>
              </div>
              <span className="text-xs text-blue-600 font-medium">{enhancedData.popularity}%</span>
            </div>
          </div>
          
          {brand.description && (
            <p className="text-gray-600 text-sm line-clamp-2 mb-4">
              {brand.description}
            </p>
          )}
        </div>
        
        {/* Action button */}
        <Link
          href={`/brands/${brand.slug}`}
          className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-center py-3 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
        >
          View Parts
        </Link>
      </div>
    </motion.div>
  )
}

// Enhanced filter component
function AdvancedFilters({ 
  searchQuery, 
  setSearchQuery, 
  activeCategory, 
  setActiveCategory,
  sortBy,
  setSortBy,
  viewType,
  setViewType 
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: BrandCategory;
  setActiveCategory: (category: BrandCategory) => void;
  sortBy: SortType;
  setSortBy: (sort: SortType) => void;
  viewType: ViewType;
  setViewType: (view: ViewType) => void;
}) {
  const [showFilters, setShowFilters] = useState(false)

  const categories = [
    { key: 'all' as BrandCategory, label: 'All Brands', icon: '🌍', color: 'bg-gray-100 text-gray-800' },
    { key: 'car' as BrandCategory, label: 'Car Brands', icon: '🚗', color: 'bg-blue-100 text-blue-800' },
    { key: 'accessory' as BrandCategory, label: 'Accessories', icon: '🔧', color: 'bg-green-100 text-green-800' },
    { key: 'parts' as BrandCategory, label: 'Parts', icon: '⚙️', color: 'bg-purple-100 text-purple-800' },
  ]

  const sortOptions = [
    { key: 'name' as SortType, label: 'Name A-Z' },
    { key: 'popularity' as SortType, label: 'Popularity' },
    { key: 'country' as SortType, label: 'Country' },
    { key: 'founded' as SortType, label: 'Founded Year' },
  ]

  return (
    <div className="mb-8">
      {/* Search and main controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        
        {/* Controls */}
        <div className="flex items-center space-x-4">
          {/* View toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewType('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewType === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
              }`}
            >
              <Squares2X2Icon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewType('list')}
              className={`p-2 rounded-md transition-colors ${
                viewType === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
              }`}
            >
              <ListBulletIcon className="w-5 h-5" />
            </button>
          </div>
          
          {/* Filters toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <AdjustmentsHorizontalIcon className="w-5 h-5" />
            <span>Filters</span>
            <ChevronDownIcon className={`w-4 h-4 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Expandable filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border border-gray-200 rounded-xl p-6 mb-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Categories */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.key}
                      onClick={() => setActiveCategory(category.key)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                        activeCategory === category.key
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : `${category.color} border-transparent hover:shadow-sm`
                      }`}
                    >
                      <span>{category.icon}</span>
                      <span className="text-sm font-medium">{category.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortType)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {sortOptions.map((option) => (
                    <option key={option.key} value={option.key}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Quick category pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.key}
            onClick={() => setActiveCategory(category.key)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === category.key
                ? 'bg-blue-600 text-white shadow-sm'
                : `${category.color} hover:shadow-sm`
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// Separate component for search params logic
function BrandsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [allBrands, setAllBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<BrandCategory>('all')
  const [sortBy, setSortBy] = useState<SortType>('name')
  const [viewType, setViewType] = useState<ViewType>('grid')

  // Fetch all brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/brands?page=1&limit=1000`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch brands')
        }
        
        const data: BrandsResponse = await response.json()
        setAllBrands(data.data || [])
        setTotal(data.total || 0)
      } catch (err) {
        console.error('Error fetching brands:', err)
        setError('Failed to load brands')
      } finally {
        setLoading(false)
      }
    }

    fetchBrands()
  }, [])

  // Filter and sort brands
  const filteredBrands = useMemo(() => {
    let filtered = allBrands.filter(brand => {
      const matchesSearch = brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           brand.description?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = activeCategory === 'all' || brand.category === activeCategory
      return matchesSearch && matchesCategory
    })

    // Sort brands
    filtered.sort((a, b) => {
      const enhancedA = enhancedBrandData[a.slug] || { country: '', founded: 2000, popularity: 50 }
      const enhancedB = enhancedBrandData[b.slug] || { country: '', founded: 2000, popularity: 50 }
      
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'country':
          return enhancedA.country.localeCompare(enhancedB.country)
        case 'founded':
          return enhancedA.founded - enhancedB.founded
        case 'popularity':
          return enhancedB.popularity - enhancedA.popularity
        default:
          return 0
      }
    })

    return filtered
  }, [allBrands, searchQuery, activeCategory, sortBy])

  // Paginate filtered brands
  const paginatedBrands = useMemo(() => {
    const startIndex = (page - 1) * LIMIT
    const endIndex = startIndex + LIMIT
    return filteredBrands.slice(startIndex, endIndex)
  }, [filteredBrands, page])

  const filteredTotalPages = Math.ceil(filteredBrands.length / LIMIT)

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [searchQuery, activeCategory, sortBy])

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12">
        <div className="container mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <p className="text-red-800 text-lg font-medium">{error}</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4"
          >
            Автомобилни марки
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Открийте качествени авточасти от над {total} водещи световни марки
          </motion.p>
        </div>
        
        {/* Advanced filters */}
        <AdvancedFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          viewType={viewType}
          setViewType={setViewType}
        />
        
        {/* Results info */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-gray-600">
            Показани <span className="font-semibold text-gray-900">{paginatedBrands.length}</span> от{' '}
            <span className="font-semibold text-gray-900">{filteredBrands.length}</span> марки
            {searchQuery && (
              <span className="ml-2">
                за "<span className="font-medium text-blue-600">{searchQuery}</span>"
              </span>
            )}
          </p>
          
          {/* View type indicator */}
          <div className="text-sm text-gray-500">
            {viewType === 'grid' ? 'Grid View' : 'List View'}
          </div>
        </div>

        {/* Brands grid/list */}
        <div className={`
          ${viewType === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
            : 'space-y-4'
          }
        `}>
          <AnimatePresence>
            {paginatedBrands.map((brand, index) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <EnhancedBrandCard brand={brand} viewType={viewType} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* No results */}
        {filteredBrands.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Не са намерени марки
            </h3>
            <p className="text-gray-600 mb-6">
              Опитайте с различни ключови думи или филтри
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setActiveCategory('all')
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Изчисти филтрите
            </button>
          </div>
        )}

        {/* Enhanced pagination */}
        {filteredTotalPages > 1 && (
          <div className="mt-16 flex justify-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, filteredTotalPages) }, (_, i) => {
                const pageNumber = i + Math.max(1, Math.min(page - 2, filteredTotalPages - 4))
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      page === pageNumber
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                )
              })}
              
              <button
                onClick={() => setPage(Math.min(filteredTotalPages, page + 1))}
                disabled={page === filteredTotalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default function BrandsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8"><div className="animate-pulse">Loading brands...</div></div>}>
      <BrandsContent />
    </Suspense>
  )
} 