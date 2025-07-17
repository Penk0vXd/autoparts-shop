import { Metadata } from 'next'
import { Truck, CreditCard, Shield, Clock, MapPin, Phone, CheckCircle, AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Доставка и плащане | Авточасти',
  description: 'Информация за доставка и плащане на авточасти. Наложен платеж, доставка в София и цяла България.',
  keywords: 'доставка авточасти, наложен платеж, speedy доставка, econt доставка, софия доставка',
}

/**
 * Delivery & Payment Info Page - Transparency page for MVP
 * Reduces purchase anxiety by providing clear information about delivery and payment
 */
export default function DeliveryPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Доставка и плащане
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Прозрачна информация за всички начини на доставка и плащане. 
              Без скрити такси - всички цени са ясно посочени.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Payment Methods */}
          <section className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <CreditCard className="w-8 h-8 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Начини на плащане</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Cash on Delivery */}
              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Truck className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-900">Наложен платеж</h3>
                    <p className="text-sm text-green-700">Препоръчан начин</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <span className="text-green-800">Плащате при получаване на пакета</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <span className="text-green-800">Преглеждате продукта преди плащане</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <span className="text-green-800">Максимална сигурност за купувача</span>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg mt-4">
                    <p className="text-sm font-medium text-green-800">
                      💡 Моля, подгответе точната сума или монетка за ресто
                    </p>
                  </div>
                </div>
              </div>

              {/* Bank Transfer */}
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">Банков превод</h3>
                    <p className="text-sm text-blue-700">За фирмени клиенти</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <span className="text-blue-800">Издаваме фактура</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <span className="text-blue-800">Отстъпка 3% при предплащане</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <span className="text-blue-800">Доставка след потвърждение на плащането</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Delivery Options */}
          <section className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Truck className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Начини на доставка</h2>
            </div>
            
            <div className="space-y-6">
              {/* Sofia Same-Day Delivery */}
              <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-6 h-6 text-red-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-red-900">София - същия ден</h3>
                      <p className="text-sm text-red-700">В рамките на града</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600">БЕЗПЛАТНО</div>
                    <div className="text-sm text-red-700">при поръчка над 50 лв</div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-800">Поръчка до 14:00 ч → доставка същия ден</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-800">Поръчка след 14:00 ч → доставка следващия ден</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-800">Покриваме цялата столица</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-800">Обаждаме се 30 мин преди доставка</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Courier Services */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Speedy */}
                <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <Truck className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-orange-900">Speedy</h3>
                        <p className="text-sm text-orange-700">Цяла България</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-orange-600">8 лв</div>
                      <div className="text-sm text-orange-700">до офис/адрес</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <span className="text-sm text-orange-800">1-2 работни дни</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-orange-600" />
                      <span className="text-sm text-orange-800">Над 1200 офиса в страната</span>
                    </div>
                  </div>
                </div>

                {/* Econt */}
                <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <Truck className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-purple-900">Econt</h3>
                        <p className="text-sm text-purple-700">Цяла България</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-purple-600">8 лв</div>
                      <div className="text-sm text-purple-700">до офис/адрес</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-purple-800">1-2 работни дни</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-purple-800">Над 1000 офиса в страната</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Important Information */}
          <section className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <AlertCircle className="w-8 h-8 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">Важна информация</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Обработка на поръчки</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Потвърждаваме всяка поръчка по телефона</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Обработваме поръчки от 9:00 до 18:00 ч</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Изпращаме SMS с проследяване на пратката</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Връщане и обмяна</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>14 дни право на връщане</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Безплатна обмяна при грешка от нас</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Пълно възстановяване на сумата</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Warranty & Support */}
          <section className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8">
            <div className="text-center max-w-2xl mx-auto">
              <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Гаранция и поддръжка
              </h2>
              <p className="text-gray-700 mb-6">
                Всички наши продукти са с 3 години гаранция. При всякакви проблеми или въпроси 
                сме на разположение на телефон 0888 123 456.
              </p>
              <div className="bg-white rounded-lg p-4 inline-block">
                <div className="flex items-center space-x-2">
                  <Phone className="w-5 h-5 text-red-600" />
                  <span className="font-semibold">0888 123 456</span>
                  <span className="text-gray-500">|</span>
                  <span className="text-gray-600">Пон-Пет: 9:00-18:00</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
} 