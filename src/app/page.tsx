'use client'

import { Hero } from '@/components/Hero/Hero'
import { ProductCardBG } from '@/components/ProductCard/ProductCardBG'
import { StatsCards } from '@/components/StatsCards/StatsCards'
import { MVPVehicleSelector } from '@/components/MVPVehicleSelector'
import { useTranslations } from 'next-intl'
import useSWR from 'swr'
import { fetchProducts, getProductsKey } from '@/services/products'
import { VehicleProvider } from '@/contexts/VehicleContext'
import { useState, useEffect } from 'react'
import { ProductCardBG as ProductCardBGType } from '@/types/product-card-bg'
import { bulgarianProductExamples } from '@/data/product-examples-bg'

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
 * Homepage component displaying hero section and featured products
 */
export default function HomePage() {
  const t = useTranslations('products')
  const [vehicleSelection, setVehicleSelection] = useState<CarSelection>({})
  const [makes, setMakes] = useState(internalCarMakes)
  const [models, setModels] = useState<CarModel[]>([])
  
  // Fetch featured products
  const { data: featuredProducts } = useSWR(
    getProductsKey({ limit: 8 }),
    () => fetchProducts({ limit: 8 })
  )

  // Load makes on component mount
  useEffect(() => {
    const loadMakes = async () => {
      try {
        // No external NHTSA makes to load
      } catch (error) {
        console.error('Error loading makes:', error)
      }
    }
    loadMakes()
  }, [])

  // Load models when make changes
  useEffect(() => {
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
  }, [vehicleSelection.make])

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
      
      <MVPVehicleSelector />
      
      {/* Stats Section */}
      <div className="container mx-auto px-4">
        <StatsCards />
      </div>
      
      {/* Featured Products Section */}
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

      {/* Features Section */}
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