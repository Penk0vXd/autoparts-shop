import { Metadata } from 'next'
import { getCategoryBySlug } from '@/services/categoryService'
import { notFound } from 'next/navigation'

interface CategoryLayoutProps {
  children: React.ReactNode
  params: { slug: string }
}

/**
 * Generate metadata for category pages
 */
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug)
  
  if (!category) {
    return {
      title: 'Категория не е намерена | AutoParts BG',
      description: 'Търсената категория не съществува.'
    }
  }

  const title = category.seoTitle || `${category.name} | AutoParts BG`
  const description = category.seoDescription || category.description || `Качествени ${category.name.toLowerCase()} за автомобили. Бърза доставка в цялата страна.`

  return {
    title,
    description,
    keywords: `${category.name}, авточасти, автомобили, България, доставка, ${category.name.toLowerCase()}`,
    authors: [{ name: 'AutoParts BG' }],
    creator: 'AutoParts BG',
    publisher: 'AutoParts BG',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title,
      description,
      url: `/categories/${params.slug}`,
      siteName: 'AutoParts BG',
      locale: 'bg_BG',
      type: 'website',
      images: [
        {
          url: '/api/placeholder/1200/630?text=' + encodeURIComponent(category.name),
          width: 1200,
          height: 630,
          alt: category.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/api/placeholder/1200/630?text=' + encodeURIComponent(category.name)],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'your-google-site-verification-code',
      yandex: 'your-yandex-verification-code',
    },
    alternates: {
      canonical: `/categories/${params.slug}`,
      languages: {
        'bg-BG': `/categories/${params.slug}`,
      },
    },
  }
}

/**
 * Category Layout Component
 */
export default async function CategoryLayout({ children, params }: CategoryLayoutProps) {
  // Validate category exists
  const category = await getCategoryBySlug(params.slug)
  
  if (!category) {
    notFound()
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": category.name,
            "description": category.description,
            "url": `/categories/${params.slug}`,
            "mainEntity": {
              "@type": "ItemList",
              "name": category.name,
              "description": category.description,
              "numberOfItems": category.productCount
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Начало",
                  "item": "/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Каталог",
                  "item": "/catalog"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": category.name,
                  "item": `/categories/${params.slug}`
                }
              ]
            },
            "publisher": {
              "@type": "Organization",
              "name": "AutoParts BG",
              "url": "/",
              "logo": {
                "@type": "ImageObject",
                "url": "/logo.png"
              }
            }
          })
        }}
      />
      
      {children}
    </>
  )
} 