'use client'

import { useTranslations } from 'next-intl'

export default function AboutPage() {
  const t = useTranslations('about')

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-8">
            {t('title')}
          </h1>

          <div className="prose prose-lg prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mt-4">
              {t('description')}
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mt-12 mb-6">
              {t('mission')}
            </h2>

            <p className="text-gray-600 leading-relaxed mt-4">
              {t('missionText')}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
} 