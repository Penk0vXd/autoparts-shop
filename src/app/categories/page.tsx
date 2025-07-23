import { Metadata } from 'next'
import { isFeatureEnabled, FEATURE_CONFIG } from '@/config/features'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Категории | Авточасти',
  description: 'Разгледайте всички категории авточасти, които предлагаме.',
}

export default function CategoriesPage() {
  // Feature guard - redirect to inquiry flow when product categories are disabled
  if (!isFeatureEnabled('productCategories')) {
    const inquiryConfig = FEATURE_CONFIG.inquiry
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-lg mx-auto text-center p-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Категориите в момента не са налични
          </h1>
          
          <p className="text-gray-600 mb-8">
            В момента работим върху подобряването на нашата категоризация. 
            Моля, използвайте формата за запитване или разгледайте нашите марки.
          </p>
          
          <div className="space-y-4">
            <Link
              href="/inquiry"
              className="inline-block w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              {inquiryConfig.ctaText}
            </Link>
            
            <Link
              href="/brands"
              className="inline-block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Разгледайте марки
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

  // Original categories functionality when enabled
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Категории</h1>
        {/* Original categories implementation would be restored here */}
        <p className="text-gray-600">Категориите са активни и функционални.</p>
      </div>
    </div>
  )
} 