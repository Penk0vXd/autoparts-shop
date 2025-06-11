'use client'

import { Hero } from '@/components/Hero/Hero'
import { ProductCard } from '@/components/ProductCard/ProductCard'
import { StatsCards } from '@/components/StatsCards/StatsCards'
import { useTranslations } from 'next-intl'
import useSWR from 'swr'
import { fetchProducts, getProductsKey } from '@/services/products'

/**
 * Homepage component displaying hero section and featured products
 */
export default function HomePage() {
  const t = useTranslations('products')
  
  // Fetch featured products
  const { data: featuredProducts } = useSWR(
    getProductsKey({ limit: 8 }),
    () => fetchProducts({ limit: 8 })
  )

  return (
    <>
      <Hero />
      
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

          {featuredProducts && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.data.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

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