'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Check, Phone, Truck, Clock, ArrowRight, Home, FileText, MessageCircle } from 'lucide-react'
import Link from 'next/link'

/**
 * Order Confirmation Page - Success page with clear next steps
 * MVP implementation with emotional satisfaction and expectation setting
 */
export default function SuccessPage() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order')
  const [currentTime, setCurrentTime] = useState<string>('')
  
  useEffect(() => {
    // Set current time in Bulgarian format
    const now = new Date()
    const bgTime = now.toLocaleString('bg-BG', {
      timeZone: 'Europe/Sofia',
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
    setCurrentTime(bgTime)
  }, [])

  // Calculate expected call time (2 hours from now)
  const getExpectedCallTime = () => {
    const now = new Date()
    const callTime = new Date(now.getTime() + 2 * 60 * 60 * 1000)
    return callTime.toLocaleString('bg-BG', {
      timeZone: 'Europe/Sofia',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Calculate delivery date (1-2 business days)
  const getDeliveryDate = () => {
    const now = new Date()
    const deliveryDate = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)
    return deliveryDate.toLocaleDateString('bg-BG', {
      timeZone: 'Europe/Sofia',
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    })
  }

  const expectedCallTime = getExpectedCallTime()
  const deliveryDate = getDeliveryDate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Success Header */}
      <div className="bg-white border-b border-green-200">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Check className="w-8 h-8 text-green-600" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900">Поръчката е приета!</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          
          {/* Main Success Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
          >
            {/* Order Details */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Благодарим за поръчката!
              </h2>
              <p className="text-gray-600 mb-6">
                Вашата поръчка е успешно получена и обработва се.
              </p>
              
              {orderNumber && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex items-center justify-center space-x-2">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Номер на поръчка:</span>
                    <span className="text-lg font-bold text-red-600">{orderNumber}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Next Steps Timeline */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 text-center mb-6">
                Следващи стъпки
              </h3>

              {/* Step 1: Phone Call */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex items-start space-x-4 p-4 bg-red-50 rounded-lg border border-red-200"
              >
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-red-900">Ще се свържем с вас</h4>
                  <p className="text-red-800 text-sm mb-2">
                    Очаквайте обаждане до <strong>{expectedCallTime} ч</strong> за потвърждение на поръчката
                  </p>
                  <div className="text-xs text-red-700 bg-red-100 p-2 rounded">
                    💡 Моля, отговорете на телефона - това е важно за потвърждение
                  </div>
                </div>
              </motion.div>

              {/* Step 2: Processing */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900">Обработка и подготовка</h4>
                  <p className="text-blue-800 text-sm">
                    След потвърждение ще подготвим вашата поръчка за доставка
                  </p>
                </div>
              </motion.div>

              {/* Step 3: Delivery */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg border border-green-200"
              >
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-green-900">Доставка</h4>
                  <p className="text-green-800 text-sm mb-2">
                    Очаквайте доставка до <strong>{deliveryDate}</strong>
                  </p>
                  <div className="text-xs text-green-700">
                    📦 Плащането е наложен платеж при доставка
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Important Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Важна информация</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Запазете номера на поръчката за справки</span>
              </div>
              <div className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Проверете телефона си за пропуснати обаждания</span>
              </div>
              <div className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Подгответе точната сума за наложен платеж</span>
              </div>
              <div className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5" />
                <span>При проблеми се свържете с нас на 0888 123 456</span>
              </div>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Нужна е помощ?</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Телефон</div>
                  <div className="text-sm text-gray-600">0888 123 456</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Работно време</div>
                  <div className="text-sm text-gray-600">Пон-Пет: 9:00 - 18:00</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              <Home className="w-5 h-5 mr-2" />
              Обратно в началото
            </Link>
            
            <Link
              href="/categories"
              className="inline-flex items-center justify-center px-8 py-3 border border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors duration-200"
            >
              Разгледай още части
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>

          {/* Order Time Stamp */}
          <div className="text-center mt-8 text-sm text-gray-500">
            Поръчката е направена на {currentTime}
          </div>
        </div>
      </div>
    </div>
  )
} 