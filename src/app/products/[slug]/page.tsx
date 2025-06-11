import { getProductBySlug, getRelatedProducts } from '@/services/productService'
import { ProductHero } from '@/components/Product/ProductHero'
import { ProductTabs } from '@/components/Product/ProductTabs'
import { RelatedProducts } from '@/components/RelatedProducts/RelatedProducts'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)
  
  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  const price = new Intl.NumberFormat('bg-BG', {
    style: 'currency',
    currency: 'BGN',
  }).format(product.price)

  return {
    title: `${product.name} – ${product.brand?.name || 'Авточасти'}`,
    description: product.short_description || product.description || `Купете ${product.name} на най-добра цена ${price}. Качествени авточасти с гаранция и бърза доставка.`,
    keywords: `${product.name}, ${product.brand?.name}, авточасти, ${product.category?.name}, резервни части`,
    openGraph: {
      title: `${product.name} – ${product.brand?.name || 'Авточасти'}`,
      description: product.short_description || `Качествен ${product.name} на цена ${price}`,
      images: product.images?.length ? [product.images[0].url] : [],
      type: 'website',
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(
    product.id, 
    product.category_id, 
    product.brand_id
  )

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand?.name || 'Авточасти',
    },
    category: product.category?.name,
    image: product.images?.map(img => img.url) || [],
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'BGN',
      availability: product.stock > 0 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Авточасти',
      },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Product Hero Section */}
          <ProductHero product={product} />
          
          {/* Product Tabs */}
          <ProductTabs product={product} />
          
          {/* Related Products */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-8">Подобни продукти</h2>
            <RelatedProducts 
              productId={product.id} 
              categoryId={product.category_id} 
              brandId={product.brand_id} 
            />
          </section>
        </div>
      </main>
    </>
  )
} 