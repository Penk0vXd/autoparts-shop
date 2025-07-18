import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { getCategoryBySlug } from '@/services/categoryService'
import { getProductsByCategory } from '@/services/productService'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ProductCard } from '@/components/ProductCard/ProductCard'
import { SafeImage } from '@/components/ui/SafeImage'
import { Database } from '@/types/supabase'

type Product = Database['public']['Tables']['products']['Row']

/**
 * Dynamic Category Page Props
 */
interface CategoryPageProps {
  params: {
    slug: string
  }
  searchParams: {
    page?: string
    sort?: string
    brand?: string
  }
}

/**
 * Simple Products Grid Component
 */
function ProductsGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Няма продукти в тази категория
        </h3>
        <p className="text-gray-600">
          Моментално няма налични продукти в тази категория.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => {
        // Safely handle images field
        const images = product.images 
          ? Array.isArray(product.images) 
            ? product.images as string[]
            : []
          : []

        return (
          <div key={product.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <Link href={`/products/${product.slug}`}>
              <div className="aspect-square bg-gray-100 relative">
                {images.length > 0 && typeof images[0] === 'string' ? (
                  <SafeImage
                    src={images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                
                {product.short_description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.short_description}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-red-600">
                    {product.price ? `${product.price.toFixed(2)} лв.` : 'Цена при запитване'}
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    {product.stock > 0 ? `${product.stock} бр.` : 'Изчерпан'}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )
      })}
    </div>
  )
}

/**
 * Individual Category Page Content
 */
async function CategoryContent({ params, searchParams }: CategoryPageProps) {
  const { slug } = params
  const page = parseInt(searchParams.page || '1')
  const sort = searchParams.sort || 'name'
  const brand = searchParams.brand

  try {
    // Fetch category data
    const category = await getCategoryBySlug(slug)
    
    if (!category) {
      notFound()
    }

    // Fetch products for this category
    const products = await getProductsByCategory(category.id, {
      page,
      limit: 24,
      sort,
      brand
    })

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
              <Link href="/categories" className="hover:text-red-600 transition-colors">
                Категории
              </Link>
              <ChevronRightIcon className="w-4 h-4 mx-2 text-gray-400" aria-hidden="true" />
              <span className="text-gray-900 font-medium">{category.name}</span>
            </nav>
          </div>
        </div>

        {/* Category Header */}
        <section className="py-12 bg-gradient-to-br from-red-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-8 items-center">
                {/* Category Image */}
                {category.image_url && (
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 lg:w-48 lg:h-48 rounded-xl overflow-hidden bg-gray-100">
                      <SafeImage
                        src={category.image_url}
                        alt={category.name}
                        width={192}
                        height={192}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Category Info */}
                <div className="flex-1 text-center lg:text-left">
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {category.name}
              </h1>
              
              {category.description && (
                    <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  {category.description}
                </p>
              )}

                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span className="font-medium">{category.productCount}</span>
                      <span>налични продукта</span>
            </div>
            
                    <div className="h-4 w-px bg-gray-300 hidden sm:block" />
                    
                    <div className="text-sm text-gray-500">
                      Всички части с гаранция и бърза доставка
                    </div>
              </div>
              </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="space-y-8">
              {/* Products Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Продукти в категория &quot;{category.name}&quot;
                  </h2>
                
                {/* Sort Options */}
                <div className="flex items-center space-x-2">
                  <label htmlFor="sort" className="text-sm text-gray-600">
                    Сортирай по:
                  </label>
                  <select
                    id="sort"
                    value={sort}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="name">Име</option>
                    <option value="price_asc">Цена (ниска към висока)</option>
                    <option value="price_desc">Цена (висока към ниска)</option>
                    <option value="newest">Най-нови</option>
                  </select>
                </div>
              </div>

              {/* Products Grid */}
              <ProductsGrid products={products} />

              {/* Pagination */}
              {products.length === 24 && (
                <div className="flex justify-center mt-12">
                  <div className="flex space-x-2">
                    <Link
                      href={`/categories/${slug}?page=${page + 1}`}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Следваща страница
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Related Categories */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Разгледайте други категории
              </h2>
              <p className="text-gray-600 mb-8">
                Открийте още качествени авточасти в нашите други категории
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/categories"
                  className="inline-flex items-center justify-center px-8 py-3 border border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-600 hover:text-white transition-colors duration-200"
                >
                  Всички категории
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
    console.error('Error loading category:', error)
    
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
              Възникна проблем при зареждането на категорията. Моля, опитайте отново.
            </p>
            <Link 
              href="/categories"
              className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Към категориите
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

/**
 * Main Category Page with loading state
 */
export default function CategoryPage({ params, searchParams }: CategoryPageProps) {
  return (
    <Suspense fallback={<CategoryLoadingPage />}>
      <CategoryContent params={params} searchParams={searchParams} />
    </Suspense>
  )
}

/**
 * Loading state for category page
 */
function CategoryLoadingPage() {
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
            <Link href="/categories" className="hover:text-red-600 transition-colors">
              Категории
            </Link>
            <ChevronRightIcon className="w-4 h-4 mx-2 text-gray-400" />
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          </nav>
        </div>
      </div>

      {/* Category Header Loading */}
      <section className="py-12 bg-gradient-to-br from-red-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 lg:w-48 lg:h-48 rounded-xl bg-gray-200 animate-pulse" />
              </div>
              <div className="flex-1 text-center lg:text-left">
                <div className="h-12 bg-gray-200 rounded mb-4 animate-pulse" />
                <div className="h-6 bg-gray-200 rounded mb-6 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Loading */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </section>
    </div>
  )
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const category = await getCategoryBySlug(params.slug)
  
  if (!category) {
    return {
      title: 'Категория не е намерена | AutoParts Bulgaria',
      description: 'Търсената категория не беше намерена.'
    }
  }

  return {
    title: `${category.name} - Авточасти | AutoParts Bulgaria`,
    description: category.description || `Качествени ${category.name.toLowerCase()} за всички марки автомобили. ${category.productCount} налични продукта с гаранция и бърза доставка.`,
    keywords: `${category.name}, авточасти, автомобилни части, ${category.slug}, България`,
    openGraph: {
      title: `${category.name} - Авточасти | AutoParts Bulgaria`,
      description: category.description || `Качествени ${category.name.toLowerCase()} за всички марки автомобили`,
      type: 'website',
      locale: 'bg_BG',
      images: category.image_url ? [{ url: category.image_url }] : [],
    },
  }
}

 