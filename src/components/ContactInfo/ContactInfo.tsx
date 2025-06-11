import { MapPin, Phone, Mail, Clock } from 'lucide-react'

/**
 * ContactInfo component displaying business contact information
 * Used on the contact page to show location, phone, and email details
 */
export function ContactInfo() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Информация за контакт
      </h2>
      
      <div className="space-y-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <MapPin className="w-6 h-6 text-primary-600 mt-1" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Адрес</h3>
            <p className="text-gray-600">
              ул. Пример 123<br />
              1000 София, България
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <Phone className="w-6 h-6 text-primary-600 mt-1" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Телефон</h3>
            <p className="text-gray-600">
              <a href="tel:+359881234567" className="hover:text-primary-600 transition-colors">
                +359 88 123 4567
              </a>
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <Mail className="w-6 h-6 text-primary-600 mt-1" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
            <p className="text-gray-600">
              <a href="mailto:support@example.com" className="hover:text-primary-600 transition-colors">
                support@example.com
              </a>
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <Clock className="w-6 h-6 text-primary-600 mt-1" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Работно време</h3>
            <div className="text-gray-600 space-y-1">
              <p>Понеделник - Петък: 9:00 - 18:00</p>
              <p>Събота: 9:00 - 14:00</p>
              <p>Неделя: Почивен ден</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 