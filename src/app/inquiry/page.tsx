import { Metadata } from 'next'
import { FEATURE_CONFIG } from '@/config/features'
import { InquiryForm } from '@/components/InquiryForm/InquiryForm'

export const metadata: Metadata = {
  title: 'Заявка за част | Авточасти',
  description: 'Не намирате нужната част? Изпратете ни запитване и ще ви помогнем да намерим точно това, което търсите.',
  keywords: 'заявка за авточасти, запитване, консултация, поръчка части',
}

export default function InquiryPage() {
  const config = FEATURE_CONFIG.inquiry

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {config.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            {config.description}
          </p>
          
          {/* Benefits Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Бърз отговор</h3>
              <p className="text-sm text-gray-600">Ще получите отговор до 2 часа в работни дни</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Експертна консултация</h3>
              <p className="text-sm text-gray-600">Нашите специалисти ще ви помогнат с избора</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Най-добра цена</h3>
              <p className="text-sm text-gray-600">Гарантираме конкурентни цени за всички части</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Inquiry Form */}
          <div className="lg:col-span-2">
            <InquiryForm />
          </div>
          
          {/* Sidebar Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm border sticky top-6">
              <h3 className="font-semibold text-gray-900 mb-4">Какво трябва да знаете</h3>
              
              <div className="space-y-4 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong className="text-gray-900">VIN номер:</strong>
                    <p className="text-gray-600 mt-1">Най-точният начин за намиране на правилната част</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong className="text-gray-900">Номер на част:</strong>
                    <p className="text-gray-600 mt-1">Ако имате стария номер, това ще ускори процеса</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong className="text-gray-900">Снимки:</strong>
                    <p className="text-gray-600 mt-1">Качете снимки на старата част за по-лесна идентификация</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong className="text-gray-900">Детайли за автомобила:</strong>
                    <p className="text-gray-600 mt-1">Марка, модел, година, двигател - всяка информация помага</p>
                  </div>
                </div>
              </div>
              
              {/* Contact Info */}
              <div className="mt-8 pt-6 border-t">
                <h4 className="font-semibold text-gray-900 mb-4">Спешни случаи?</h4>
                <div className="space-y-2">
                  <a
                    href="tel:+359888123456"
                    className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>+359 888 123 456</span>
                  </a>
                  
                  <a
                    href="mailto:info@autoparts.bg"
                    className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>info@autoparts.bg</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 