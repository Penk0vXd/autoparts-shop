import { Metadata } from 'next'
import { isFeatureEnabled, FEATURE_CONFIG } from '@/config/features'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Каталог | Авточасти',
  description: 'Разгледайте нашия пълен каталог с авточасти за всички марки автомобили.',
}

export default function CatalogPage() {
  // Feature guard - redirect to inquiry flow when products are disabled
  if (!isFeatureEnabled('products')) {
    const inquiryConfig = FEATURE_CONFIG.inquiry
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-lg mx-auto text-center p-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Каталогът в момента не е наличен
          </h1>
          
          <p className="text-gray-600 mb-8">
            В момента работим върху подобряването на нашия каталог. 
            Моля, използвайте формата за запитване, за да намерите необходимите части.
          </p>
          
          <div className="space-y-4">
            <Link
              href="/inquiry"
              className="inline-block w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              {inquiryConfig.ctaText}
            </Link>
            
            <Link
              href="/"
              className="inline-block w-full text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Върнете се към началната страница
            </Link>
          </div>
        </div>
      </div>
    )
  }
  
  // Original catalog content would go here when products feature is enabled
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Каталог</h1>
        {/* Original catalog implementation */}
        <p className="text-gray-600">Каталогът е активен и функционален.</p>
      </div>
    </div>
  )
} 