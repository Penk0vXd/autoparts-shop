import { Metadata } from 'next'
import Link from 'next/link'
import { Hero } from '@/components/Hero/Hero'

export const metadata: Metadata = {
  title: 'Авточасти | Заявка за части',
  description: 'Професионална услуга за намиране на авточасти. Изпратете заявка и ще намерим точно това, което търсите.',
  keywords: 'авточасти, заявка за части, автомобилни части, България',
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 🎯 Beautiful Hero Section */}
      <Hero />

      {/* ✨ Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Защо да изберете нас?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Професионална услуга с години опит в автомобилната индустрия
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Бърз отговор</h3>
              <p className="text-sm text-gray-600">Ще получите отговор до 2 часа в работни дни</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Експертна консултация</h3>
              <p className="text-sm text-gray-600">Нашите специалисти ще ви помогнат с избора</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Най-добра цена</h3>
              <p className="text-sm text-gray-600">Конкурентни цени за всички автомобилни части</p>
            </div>
          </div>
        </div>
      </div>

      {/* 📞 Contact Section */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Готови да намерим вашата част?
          </h2>
          
          <div className="space-y-4 mb-8">
            <Link
              href="/request"
              className="inline-block px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-md"
            >
              Изпратете заявка сега
            </Link>
          </div>

          <div className="text-sm text-gray-500">
            За спешни случаи: 
            <a
              href="tel:+359888123456"
              className="text-red-600 hover:text-red-700 font-medium ml-1"
            >
              +359 888 123 456
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}  