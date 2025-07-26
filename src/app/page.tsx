'use client'

import { Hero } from '@/components/Hero/Hero'
import { ProductCardBG } from '@/components/ProductCard/ProductCardBG'
import { StatsCards } from '@/components/StatsCards/StatsCards'
import { MVPVehicleSelector } from '@/components/MVPVehicleSelector'
import { isFeatureEnabled, FEATURE_CONFIG } from '@/config/features'
import { useHydration } from '@/hooks/useHydration'
import { useTranslations } from 'next-intl'
import useSWR from 'swr'
import { fetchProducts, getProductsKey } from '@/services/products'
import { getBrands } from '@/services/brandService'
import type { Brand } from '@/types/db'
import { VehicleProvider } from '@/contexts/VehicleContext'
import { useState, useEffect } from 'react'
import React from 'react'
import { ProductCardBG as ProductCardBGType } from '@/types/product-card-bg'
import { bulgarianProductExamples } from '@/data/product-examples-bg'
import Link from 'next/link'
import { SafeImage } from '@/components/ui/SafeImage'

// Internal vehicle data types - no external dependencies!
type CarMake = {
  id: string
  name: string
  originalId: number
}

type CarModel = {
  id: string
  name: string
  makeId: string
  originalId: number
}

type CarSelection = {
  make?: CarMake
  model?: CarModel
}

// Internal vehicle data - no more external NHTSA API dependency!
const internalCarMakes: CarMake[] = [
  { id: '1', name: 'BMW', originalId: 1 },
  { id: '2', name: 'Mercedes-Benz', originalId: 2 },
  { id: '3', name: 'Audi', originalId: 3 },
  { id: '4', name: 'Volkswagen', originalId: 4 },
  { id: '5', name: 'Toyota', originalId: 5 },
  { id: '6', name: 'Ford', originalId: 6 },
  { id: '7', name: 'Honda', originalId: 7 },
  { id: '8', name: 'Nissan', originalId: 8 },
]

const internalCarModels: { [key: string]: CarModel[] } = {
  'BMW': [
    { id: '1', name: '3 Series', makeId: '1', originalId: 1 },
    { id: '2', name: '5 Series', makeId: '1', originalId: 2 },
    { id: '3', name: 'X3', makeId: '1', originalId: 3 },
    { id: '4', name: 'X5', makeId: '1', originalId: 4 },
  ],
  'Mercedes-Benz': [
    { id: '5', name: 'C-Class', makeId: '2', originalId: 5 },
    { id: '6', name: 'E-Class', makeId: '2', originalId: 6 },
    { id: '7', name: 'GLC', makeId: '2', originalId: 7 },
  ],
  'Audi': [
    { id: '8', name: 'A4', makeId: '3', originalId: 8 },
    { id: '9', name: 'A6', makeId: '3', originalId: 9 },
    { id: '10', name: 'Q5', makeId: '3', originalId: 10 },
  ],
  'Toyota': [
    { id: '11', name: 'Camry', makeId: '5', originalId: 11 },
    { id: '12', name: 'Corolla', makeId: '5', originalId: 12 },
    { id: '13', name: 'RAV4', makeId: '5', originalId: 13 },
  ],
}

/**
 * Transform existing product data to ProductCardBG format
 */
function transformToProductCardBG(product: any): ProductCardBGType {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    brand: product.brand ? {
      name: product.brand.name,
      logo: product.brand.logo_url || undefined
    } : undefined,
    image: product.images && product.images.length > 0 ? {
      url: product.images[0].url,
      alt: product.images[0].alt || product.name,
      placeholder: product.images[0].placeholder
    } : undefined,
    price: {
      amount: product.price || null,
      currency: 'BGN' as const,
      isOnSale: product.is_on_sale || false,
      originalAmount: product.original_price || null,
      discountPercent: product.discount_percent || undefined
    },
    stock: {
      isInStock: product.stock_quantity > 0,
      quantity: product.stock_quantity || 0,
      status: product.stock_quantity > 10 ? 'in_stock' : 
              product.stock_quantity > 0 ? 'low_stock' : 'out_of_stock',
      deliveryText: 'Доставка до 24 часа'
    },
    warranty: {
      included: true,
      duration: '24 месеца'
    },
    category: product.category || product.brand?.category,
    partNumber: product.part_number || product.sku,
    isNew: product.is_new || false,
    isFeatured: product.is_featured || false
  }
}

/**
 * Homepage component - MVP mode focuses on inquiry flow and brands
 */
export default function HomePage() {
  const t = useTranslations('products')
  const hydrated = useHydration()
  const [vehicleSelection, setVehicleSelection] = useState<CarSelection>({})
  const [makes, setMakes] = useState(internalCarMakes)
  const [models, setModels] = useState<CarModel[]>([])
  
  const homepageConfig = FEATURE_CONFIG.homepage
  const inquiryConfig = FEATURE_CONFIG.inquiry
  
  // Fetch featured products (only if products feature is enabled)
  const { data: featuredProducts } = useSWR(
    hydrated && isFeatureEnabled('products') ? getProductsKey({ limit: 8 }) : null,
    () => fetchProducts({ limit: 8 })
  )
  
  // Fetch featured brands from database
  const { data: brandsData } = useSWR(
    hydrated ? 'brands-featured' : null,
    () => getBrands(1, 50) // Get more brands to filter from
  )

  // Featured brand slugs in preferred order
  const featuredBrandSlugs = ['bmw', 'volkswagen', 'audi', 'ford', 'porsche', 'mercedes-benz', 'alfa-romeo', 'opel']
  
  // Filter and sort featured brands
  const featuredBrands = React.useMemo((): Brand[] => {
    if (!brandsData?.data) return []
    
    const brandMap = new Map(brandsData.data.map(brand => [brand.slug.toLowerCase(), brand]))
    const orderedBrands: Brand[] = []
    
    // Add brands in preferred order
    featuredBrandSlugs.forEach(slug => {
      const brand = brandMap.get(slug) || brandMap.get(slug.replace('-', ''))
      if (brand) orderedBrands.push(brand)
    })
    
    return orderedBrands
  }, [brandsData])

  // Load makes on component mount (only if vehicle selector is enabled)
  useEffect(() => {
    if (!hydrated || !isFeatureEnabled('vehicleSelector')) return
    
    const loadMakes = async () => {
      try {
        // No external NHTSA makes to load
      } catch (error) {
        console.error('Error loading makes:', error)
      }
    }
    loadMakes()
  }, [hydrated])

  // Load models when make changes (only if vehicle selector is enabled)
  useEffect(() => {
    if (!hydrated || !isFeatureEnabled('vehicleSelector')) return
    
    const loadModels = async () => {
      if (vehicleSelection.make) {
        try {
          const modelsData = internalCarModels[vehicleSelection.make.name] || []
          setModels(modelsData)
        } catch (error) {
          console.error('Error loading models:', error)
        }
      } else {
        setModels([])
      }
    }
    loadModels()
  }, [vehicleSelection.make, hydrated])

  const handleVehicleSelection = (selection: CarSelection) => {
    setVehicleSelection(selection)
    // You can add logic here to filter products or navigate to filtered results
    if (selection.make && selection.model) {
      console.log('Vehicle selected:', selection)
      // Future: Navigate to filtered products or update product list
    }
  }

  return (
    <>
      <Hero />
      
      {/* Vehicle Selector - Hidden in MVP mode */}
      {hydrated && isFeatureEnabled('vehicleSelector') && <MVPVehicleSelector />}
      
      {/* MVP Inquiry CTA Section - Enhanced with modern background */}
      {hydrated && !isFeatureEnabled('products') && (
        <section className="relative py-20 overflow-hidden bg-gradient-to-br from-white via-red-50/30 to-white">
          {/* Matching Hero section subtle accents */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(239,_68,_68,_0.08),_transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(220,_38,_38,_0.05),_transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,_rgba(248,_113,_113,_0.04),_transparent_50%)]"></div>
          
          <div className="relative container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              {/* Enhanced hero text */}
              <div className="mb-8">
                <span className="inline-block px-4 py-2 bg-red-500/10 backdrop-blur-sm rounded-full text-red-700 text-sm font-medium mb-4">
                  🚀 Професионални Авточасти
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {homepageConfig.heroTitle}
                </h2>
                <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed">
                  {homepageConfig.heroSubtitle}
                </p>
              </div>
              
              {/* Enhanced main CTA - Sacred Request Button */}
              <div className="mb-16">
                <Link
                  href="/inquiry"
                  className="group inline-flex items-center bg-gradient-to-r from-red-600 to-red-700 text-white px-12 py-6 rounded-2xl font-bold text-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-2xl hover:shadow-red-500/25 hover:-translate-y-2 border-4 border-white/20"
                >
                  🚀 Изпрати заявка сега
                  <svg className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                
                {/* Secondary CTA */}
                <div className="mt-6 text-white/90">
                  <span className="text-lg">или позвънете директно: </span>
                  <a 
                    href="tel:+359888123456" 
                    className="text-white font-bold text-xl hover:text-red-200 transition-colors"
                  >
                    📞 0888 123 456
                  </a>
                </div>
              </div>
              
              {/* Enhanced Benefits Grid - White/Red Theme */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Benefit 1 - Fast Response */}
                <div className="group relative bg-white/90 backdrop-blur-md rounded-2xl p-8 border border-red-100 hover:border-red-300 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 group-hover:shadow-red-500/50">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-3">
                        <h3 className="text-2xl font-bold text-gray-900">Бърза Реакция</h3>
                        <div className="ml-3 px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full border border-red-200">
                          ≤ 2ч
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        Отговаряме на всички запитвания <span className="text-red-600 font-semibold">до 2 часа</span> в работни дни. 
                        Спешни случаи - до 30 минути.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Benefit 2 - Expert Consultations */}
                <div className="group relative bg-white/90 backdrop-blur-md rounded-2xl p-8 border border-red-100 hover:border-red-300 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 group-hover:shadow-red-500/50">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-3">
                        <h3 className="text-2xl font-bold text-gray-900">Експертни Консултации</h3>
                        <div className="ml-3 px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full border border-red-200">
                          15+ год.
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        Нашите специалисти с <span className="text-red-600 font-semibold">15+ години опит</span> ще ви помогнат 
                        да изберете точно правилната част за вашия автомобил.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Benefit 3 - Best Prices & Warranty */}
                <div className="group relative bg-white/90 backdrop-blur-md rounded-2xl p-8 border border-red-100 hover:border-red-300 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 group-hover:shadow-red-500/50">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-3">
                        <h3 className="text-2xl font-bold text-gray-900">Най-добри Цени</h3>
                        <div className="ml-3 px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full border border-red-200">
                          Гаранция
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        <span className="text-red-600 font-semibold">Гарантираме най-добрите цени</span> на пазара. 
                        Намерихте по-евтино? Ще ви предложим по-добра цена + гаранция.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* MVP Stats Cards - Premium Design */}
              <div className="mt-20 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Stat 1 - Happy Customers */}
                  <div className="group relative bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-red-100 hover:border-red-200">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      {/* Icon */}
                      <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 group-hover:shadow-red-500/50">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      {/* Content */}
                      <div className="text-center">
                        <div className="text-4xl font-black text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                          <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">8,500+</span>
                        </div>
                        <div className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Доволни клиенти</div>
                        <div className="text-xs text-gray-500 mt-2">От цяла България</div>
                      </div>
                    </div>
                    {/* Animated border */}
                    <div className="absolute inset-0 rounded-3xl border-2 border-red-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                  </div>

                  {/* Stat 2 - Fast Delivery */}
                  <div className="group relative bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-red-100 hover:border-red-200">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      {/* Icon */}
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 group-hover:shadow-blue-500/50">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      {/* Content */}
                      <div className="text-center">
                        <div className="text-4xl font-black text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">24</span>
                          <span className="text-2xl">ч</span>
                        </div>
                        <div className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Експресна доставка</div>
                        <div className="text-xs text-gray-500 mt-2">София и околност</div>
                      </div>
                    </div>
                    {/* Animated border */}
                    <div className="absolute inset-0 rounded-3xl border-2 border-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                  </div>

                  {/* Stat 3 - Warranty */}
                  <div className="group relative bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-red-100 hover:border-red-200">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      {/* Icon */}
                      <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 group-hover:shadow-emerald-500/50">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                      {/* Content */}
                      <div className="text-center">
                        <div className="text-4xl font-black text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                          <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">24</span>
                          <span className="text-2xl">м</span>
                        </div>
                        <div className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Пълна гаранция</div>
                        <div className="text-xs text-gray-500 mt-2">Всички части</div>
                      </div>
                    </div>
                    {/* Animated border */}
                    <div className="absolute inset-0 rounded-3xl border-2 border-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                  </div>

                  {/* Stat 4 - Experience */}
                  <div className="group relative bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-red-100 hover:border-red-200">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      {/* Icon */}
                      <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 group-hover:shadow-amber-500/50">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      {/* Content */}
                      <div className="text-center">
                        <div className="text-4xl font-black text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                          <span className="bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">15+</span>
                        </div>
                        <div className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Години опит</div>
                        <div className="text-xs text-gray-500 mt-2">В автобранша</div>
                      </div>
                    </div>
                    {/* Animated border */}
                    <div className="absolute inset-0 rounded-3xl border-2 border-amber-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                  </div>
                </div>

                {/* Bottom trust line */}
                <div className="text-center mt-12">
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-red-100 shadow-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-gray-700">Над 50,000 успешни поръчки от 2008 година</span>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Featured Products Section - Only shown if products feature is enabled */}
      {hydrated && isFeatureEnabled('products') && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Препоръчани продукти
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Открийте най-популярните авточасти, избрани специално за вас
              </p>
            </div>
          
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts && featuredProducts.data.length > 0 ? (
                featuredProducts.data.map((product) => (
                  <ProductCardBG 
                    key={product.id} 
                    product={transformToProductCardBG(product)}
                    onViewDetails={(product) => window.location.href = `/products/${product.slug}`}
                    onAddToCart={(product) => console.log('Add to cart:', product)}
                  />
                ))
              ) : (
                // Show example products as fallback
                bulgarianProductExamples.slice(0, 8).map((product) => (
                  <ProductCardBG 
                    key={product.id} 
                    product={product}
                    onViewDetails={(product) => window.location.href = `/products/${product.slug}`}
                    onAddToCart={(product) => console.log('Add to cart:', product)}
                  />
                ))
              )}
            </div>

            <div className="text-center mt-12">
              <a
                href="/catalog"
                className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Вижте всички продукти
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Premium Featured Brands Section - Database-driven */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-semibold mb-6">
              Партньори за качество
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Водещи марки в автомобилния свят
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Предлагаме оригинални части от най-доверените производители 
              на автомобили и авточасти в света
            </p>
          </div>
          
          <div className="max-w-7xl mx-auto">
            {hydrated && featuredBrands && featuredBrands.length > 0 ? (
              <>
                {/* Featured Car Brands Grid */}
                <div className="mb-16">
                  <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Премиум автомобилни марки</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8">
                    {featuredBrands
                      .map((brand) => (
                      <Link
                        key={brand.id}
                        href={`/brands/${brand.slug}`}
                        className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 hover:border-red-200"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-blue-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10 flex flex-col items-center">
                          {/* Brand Logo */}
                          <div className="w-16 h-16 mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            {brand.logo_url ? (
                              <SafeImage
                                src={brand.logo_url}
                                alt={`${brand.name} logo`}
                                width={64}
                                height={64}
                                className="w-full h-full object-contain filter group-hover:brightness-110 transition-all duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-gray-600 text-xs font-bold">
                                {brand.name.substring(0, 3).toUpperCase()}
                              </div>
                            )}
                          </div>
                          {/* Brand Name */}
                          <h4 className="text-sm font-bold text-gray-900 text-center group-hover:text-red-600 transition-colors duration-300">
                            {brand.name}
                          </h4>
                          {/* Description */}
                          <p className="text-xs text-gray-500 text-center mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {brand.description || 'Качествени части'}
                          </p>
                        </div>
                        {/* Animated border */}
                        <div className="absolute inset-0 rounded-2xl border-2 border-red-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                      </Link>
                                          ))}
                    </div>
                  </div>
                </>
                            ) : (
                // Fallback loading state
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="bg-gray-100 rounded-2xl p-8 animate-pulse">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg mx-auto mb-6"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
                    </div>
                  ))}
                </div>
              )}
          </div>

          {/* Enhanced CTA */}
          <div className="text-center mt-16">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4">
                              <Link
                  href="/brands"
                  className="group inline-flex items-center bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-2xl hover:shadow-red-500/25 hover:-translate-y-1"
                >
                  <svg className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Всички марки ({brandsData?.total || '50+'})
                </Link>
              <span className="text-gray-500">или</span>
              <Link
                href="/inquiry"
                className="group inline-flex items-center text-red-600 hover:text-red-700 font-semibold text-lg"
              >
                Изпратете запитване
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Updated for MVP */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h1.586a1 1 0 01.707.293l1.414 1.414a1 1 0 00.707.293H15a2 2 0 012 2v0M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Качествени части</h3>
              <p className="text-muted-foreground">
                Работим само с проверени производители и гарантираме качеството на всички продукти
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Бърза доставка</h3>
              <p className="text-muted-foreground">
                Доставяме до 24 часа в София и до 48 часа в цялата страна
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Професионална поддръжка</h3>
              <p className="text-muted-foreground">
                Нашият екип от експерти е готов да ви помогне с избора на правилните части
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 