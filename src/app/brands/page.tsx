'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

// Simplified brand interface
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

type BrandCategory = 'car' | 'accessory' | 'parts'

const LIMIT = 24

const fetcher = (url: string) => fetch(url).then(res => res.json())

// Simplified brand card component
function SimpleBrandCard({ brand }: { brand: Brand }) {
  const countryFlags: Record<string, string> = {
    'bmw': '🇩🇪',
    'mercedes-benz': '🇩🇪', 
    'audi': '🇩🇪',
    'volkswagen': '🇩🇪',
    'toyota': '🇯🇵',
    'honda': '🇯🇵',
    'ford': '🇺🇸',
    'chevrolet': '🇺🇸',
    'nissan': '🇯🇵',
    'hyundai': '🇰🇷',
    'kia': '🇰🇷',
    'volvo': '🇸🇪',
    'peugeot': '🇫🇷',
    'renault': '🇫🇷',
    'fiat': '🇮🇹',
    'ferrari': '🇮🇹',
    'lamborghini': '🇮🇹',
    'porsche': '🇩🇪',
  };

  const logoUrl = brand.logo_url || `/logos/${brand.slug}.png`;
  const flag = countryFlags[brand.slug] || '🌍';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 p-6"
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          <img
            src={logoUrl}
            alt={`${brand.name} logo`}
            className="w-8 h-8 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{brand.name}</h3>
          <p className="text-sm text-gray-600">{flag}</p>
        </div>
      </div>
      
      {brand.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {brand.description}
        </p>
      )}
      
      <Link
        href={`/brands/${brand.slug}`}
        className="block w-full bg-blue-600 text-white text-center py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        View Parts
      </Link>
    </motion.div>
  );
}

// Category filter component
function CategoryFilter({ 
  activeCategory, 
  onCategoryChange 
}: { 
  activeCategory: BrandCategory;
  onCategoryChange: (category: BrandCategory) => void;
}) {
  const categories = [
    { key: 'car' as BrandCategory, label: 'Car Brands', icon: '🚗' },
    { key: 'accessory' as BrandCategory, label: 'Accessories', icon: '🔧' },
    { key: 'parts' as BrandCategory, label: 'Parts', icon: '⚙️' },
  ];

  return (
    <div className="flex space-x-2 mb-6">
      {categories.map((category) => (
        <button
          key={category.key}
          onClick={() => onCategoryChange(category.key)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
            activeCategory === category.key
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          <span>{category.icon}</span>
          <span>{category.label}</span>
        </button>
      ))}
    </div>
  );
}

export default function BrandsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  
  // Get category from URL or default to 'car'
  const [activeCategory, setActiveCategory] = useState<BrandCategory>(
    (searchParams.get('category') as BrandCategory) || 'car'
  )

  // Fetch brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(
          `/api/brands?page=${page}&limit=${LIMIT}&category=${activeCategory}`
        )
        
        if (!response.ok) {
          throw new Error('Failed to fetch brands')
        }
        
        const data: BrandsResponse = await response.json()
        
        setBrands(data.data || [])
        setTotal(data.total || 0)
        setTotalPages(data.totalPages || 0)
      } catch (err) {
        console.error('Error fetching brands:', err)
        setError('Failed to load brands')
      } finally {
        setLoading(false)
      }
    }

    fetchBrands()
  }, [page, activeCategory])

  const handleCategoryChange = (category: BrandCategory) => {
    setActiveCategory(category)
    setPage(1)
    
    // Update URL
    const params = new URLSearchParams(searchParams.toString())
    params.set('category', category)
    router.push(`/brands?${params.toString()}`)
  }

  if (loading) {
    return (
      <main className="py-16">
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
      <main className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Марки автомобили
        </h1>
        
        <CategoryFilter 
          activeCategory={activeCategory} 
          onCategoryChange={handleCategoryChange} 
        />
        
        <p className="text-gray-600 mb-8">
          Показани {brands.length} от {total} марки
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <SimpleBrandCard key={brand.id} brand={brand} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="flex space-x-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              
              <span className="px-4 py-2 bg-blue-600 text-white rounded-md">
                {page} / {totalPages}
              </span>
              
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
} 