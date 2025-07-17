import { MapPin, Phone, Mail, Clock, Shield, Award, Truck, CheckCircle } from 'lucide-react'

/**
 * ContactInfo component displaying business contact information
 * MVP Enhanced with local trust signals and Bulgarian market optimization
 */
export function ContactInfo() {
  return (
    <div className="space-y-6">
      {/* Main Contact Card */}
      <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-red-600">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Информация за контакт
        </h2>
        
        <div className="space-y-6">
          {/* Prominent Phone Number */}
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Phone className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-red-900 mb-1">Телефон за поръчки</h3>
                <p className="text-2xl font-bold text-red-600 mb-1">
                  <a href="tel:+359888123456" className="hover:text-red-700 transition-colors">
                    0888 123 456
                  </a>
                </p>
                <p className="text-sm text-red-700">
                  Безплатни консултации • Бързи отговори • Професионални съвети
                </p>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <MapPin className="w-6 h-6 text-red-600 mt-1" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Адрес на офиса</h3>
              <p className="text-gray-600">
                бул. Васил Левски 47<br />
                1000 София, България
              </p>
              <p className="text-sm text-gray-500 mt-1">
                📍 В близост до НДК и метростанция
              </p>
            </div>
          </div>

          {/* Working Hours */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Clock className="w-6 h-6 text-red-600 mt-1" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Работно време</h3>
              <div className="text-gray-600 space-y-1">
                <p className="flex justify-between">
                  <span>Понеделник - Петък:</span>
                  <span className="font-medium">9:00 - 18:00</span>
                </p>
                <p className="flex justify-between">
                  <span>Събота:</span>
                  <span className="font-medium">9:00 - 14:00</span>
                </p>
                <p className="flex justify-between">
                  <span>Неделя:</span>
                  <span className="text-gray-500">Почивен ден</span>
                </p>
              </div>
              <div className="bg-blue-50 p-2 rounded mt-2">
                <p className="text-xs text-blue-800">
                  ⏰ Най-добро време за обаждане: 9:00 - 17:00 ч
                </p>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Mail className="w-6 h-6 text-red-600 mt-1" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
              <p className="text-gray-600">
                <a href="mailto:info@avtochasti.bg" className="hover:text-red-600 transition-colors">
                  info@avtochasti.bg
                </a>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                📧 Отговаряме в рамките на 2 часа
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Signals Card */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Защо да ни се доверите?
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">15+ години опит</div>
              <div className="text-sm text-gray-600">В автомобилната индустрия</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Award className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Сертифицирани части</div>
              <div className="text-sm text-gray-600">Оригинални и заместители</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Truck className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Бърза доставка</div>
              <div className="text-sm text-gray-600">София същия ден</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">3 години гаранция</div>
              <div className="text-sm text-gray-600">На всички продукти</div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-2">
          Спешни поръчки?
        </h3>
        <p className="text-red-100 mb-4">
          За спешни поръчки и консултации извън работно време:
        </p>
        <div className="flex items-center space-x-2">
          <Phone className="w-5 h-5" />
          <span className="text-xl font-bold">0888 123 456</span>
        </div>
        <p className="text-sm text-red-100 mt-2">
          Обаждаме се обратно в рамките на 30 минути
        </p>
      </div>
    </div>
  )
} 