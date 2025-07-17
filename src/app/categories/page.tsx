import { Suspense } from 'react'
import Link from 'next/link'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { getCategoriesWithProductCounts, formatProductCount } from '@/services/categoryService'
import { LoadingSpinner, CategoryGridSkeleton } from '@/components/ui/LoadingSpinner'
import { SafeImage } from '@/components/ui/SafeImage'

/**
 * Dynamic Category Overview Page
 * Fetches real-time data from Supabase with product counts
 */

async function CategoriesContent() {
  try {
    const { categories, totalProducts, totalCategories } = await getCategoriesWithProductCounts()

    return (
      <div className="min-h-screen bg-white">
        {/* Breadcrumb Navigation */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center text-sm text-gray-600" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-red-600 transition-colors">
                Начало
              </Link>
              <ChevronRightIcon className="w-4 h-4 mx-2 text-gray-400" aria-hidden="true" />
              <span className="text-gray-900 font-medium">Категории</span>
            </nav>
          </div>
        </div>

        {/* Page Header */}
        <section className="py-12 bg-gradient-to-br from-red-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Категории авточасти
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Разгледайте нашите категории авточасти, подбрани специално за българския пазар. 
                Качествени части за всички популярни марки автомобили.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center text-sm text-gray-500">
                <span>Общо {totalProducts.toLocaleString()} налични продукта</span>
                <span className="hidden sm:inline">•</span>
                <span>{totalCategories} активни категории</span>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {categories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {categories.map((category) => (
                  <Link 
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="group"
                    aria-label={`Разгледай ${category.name} - ${formatProductCount(category.productCount)}`}
                  >
                    <article className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group-hover:border-red-200 group-hover:scale-105">
                      {/* Category Image */}
                      <div className="relative h-48 bg-gray-100 overflow-hidden">
                        {category.image_url ? (
                          <SafeImage
                            src={category.image_url}
                            alt={category.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <svg 
                              className="w-16 h-16 text-gray-400 group-hover:text-red-500 transition-colors duration-300" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={1.5} 
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
                              />
                            </svg>
                          </div>
                        )}
                        
                        {/* Red overlay on hover */}
                        <div className="absolute inset-0 bg-red-600 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                        
                        {/* Product count badge */}
                        <div className="absolute top-3 right-3">
                          <span className="bg-white bg-opacity-90 text-gray-700 text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm">
                            {formatProductCount(category.productCount)}
                          </span>
                        </div>
                      </div>

                      {/* Category Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                          {category.description || `Качествени части за ${category.name.toLowerCase()}`}
                        </p>
                        
                        {/* Call to Action */}
                        <div className="flex items-center justify-between">
                          <span className="text-red-600 font-medium text-sm group-hover:text-red-700">
                            Разгледай части
                          </span>
                          <ChevronRightIcon className="w-4 h-4 text-gray-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Няма налични категории</h3>
                <p className="text-gray-600">Моментално няма активни категории в системата.</p>
              </div>
            )}
          </div>
        </section>

        {/* Bottom CTA Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Не намирате това, което търсите?
              </h2>
              <p className="text-gray-600 mb-8">
                Свържете се с нас за специфични части или консултация. Нашият екип ще ви помогне да намерите точно това, от което се нуждаете.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-3 border border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-600 hover:text-white transition-colors duration-200"
                >
                  Свържете се с нас
                </Link>
                <Link 
                  href="/catalog"
                  className="inline-flex items-center justify-center px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Всички продукти
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  } catch (error) {
    console.error('Error loading categories:', error)
    
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Възникна грешка</h2>
            <p className="text-gray-600 mb-8">
              Възникна проблем при зареждането на категориите. Моля, опитайте отново.
            </p>
            <Link 
              href="/catalog"
              className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Към каталога
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

/**
 * Main Categories Page with loading state
 */
export default function CategoriesPage() {
  return (
    <Suspense fallback={<CategoriesLoadingPage />}>
      <CategoriesContent />
    </Suspense>
  )
}

/**
 * Loading state for categories page
 */
function CategoriesLoadingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-red-600 transition-colors">
              Начало
            </Link>
            <ChevronRightIcon className="w-4 h-4 mx-2 text-gray-400" />
            <span className="text-gray-900 font-medium">Категории</span>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <section className="py-12 bg-gradient-to-br from-red-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Категории авточасти
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Разгледайте нашите категории авточасти, подбрани специално за българския пазар. 
              Качествени части за всички популярни марки автомобили.
            </p>
            <div className="mt-6">
              <LoadingSpinner />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid Loading */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <CategoryGridSkeleton count={8} />
        </div>
      </section>
    </div>
  )
}

// Add metadata for SEO
export const metadata = {
  title: 'Категории авточасти | AutoParts Bulgaria',
  description: 'Разгледайте нашите категории авточасти - спирачки, двигател, окачване, електрика и още. Качествени части за всички марки автомобили.',
  keywords: 'авточасти, категории, спирачки, двигател, окачване, електрика, автомобилни части, България',
  openGraph: {
    title: 'Категории авточасти | AutoParts Bulgaria',
    description: 'Разгледайте нашите категории авточасти - спирачки, двигател, окачване, електрика и още.',
    type: 'website',
    locale: 'bg_BG',
  },
} 