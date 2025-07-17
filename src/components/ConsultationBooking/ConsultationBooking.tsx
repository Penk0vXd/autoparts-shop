'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, MessageCircle, Calendar, Clock, User, Mail, Car, Wrench, X, CheckCircle } from 'lucide-react'

interface ConsultationBookingProps {
  isOpen: boolean
  onClose: () => void
  productName?: string
}

interface BookingForm {
  name: string
  email: string
  phone: string
  vehicleMake: string
  vehicleModel: string
  vehicleYear: string
  consultationType: 'phone' | 'chat' | 'video'
  preferredTime: string
  question: string
}

/**
 * Professional consultation booking component
 * Allows customers to book expert consultations for installation help and parts advice
 */
export function ConsultationBooking({ isOpen, onClose, productName }: ConsultationBookingProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [form, setForm] = useState<BookingForm>({
    name: '',
    email: '',
    phone: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    consultationType: 'phone',
    preferredTime: '',
    question: ''
  })

  const timeSlots = [
    '09:00 - 10:00',
    '10:00 - 11:00', 
    '11:00 - 12:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSubmitted(true)
  }

  const updateForm = (field: keyof BookingForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Wrench className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Професионална консултация</h2>
              <p className="text-sm text-gray-600">Безплатна експертна помощ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Success State */}
        {isSubmitted ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Заявката е изпратена!</h3>
            <p className="text-gray-600 mb-6">
              Нашият експерт ще се свърже с вас в рамките на 30 минути в работно време.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-blue-900 mb-2">Детайли на консултацията:</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <p><strong>Тип:</strong> {form.consultationType === 'phone' ? 'Телефонна' : form.consultationType === 'chat' ? 'Чат' : 'Видео'}</p>
                <p><strong>Време:</strong> {form.preferredTime}</p>
                {productName && <p><strong>Продукт:</strong> {productName}</p>}
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Затвори
            </button>
          </div>
        ) : (
          <>
            {/* Progress Indicator */}
            <div className="px-6 py-4 bg-gray-50">
              <div className="flex items-center space-x-4">
                {[1, 2, 3].map(step => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step}
                    </div>
                    {step < 3 && (
                      <div className={`w-12 h-1 mx-2 rounded ${
                        currentStep > step ? 'bg-purple-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-600">
                <span>Тип консултация</span>
                <span>Лични данни</span>
                <span>Детайли</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {/* Step 1: Consultation Type */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Изберете тип консултация</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { type: 'phone', icon: Phone, title: 'Телефонна', desc: 'Директно обаждане', time: '15-30 мин' },
                        { type: 'chat', icon: MessageCircle, title: 'Чат', desc: 'Текстови съобщения', time: '20-40 мин' },
                        { type: 'video', icon: Calendar, title: 'Видео', desc: 'Видео разговор', time: '30-45 мин' }
                      ].map(({ type, icon: Icon, title, desc, time }) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => updateForm('consultationType', type as any)}
                          className={`p-4 border-2 rounded-xl text-center transition-all ${
                            form.consultationType === type
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Icon className={`w-8 h-8 mx-auto mb-2 ${
                            form.consultationType === type ? 'text-purple-600' : 'text-gray-400'
                          }`} />
                          <h4 className="font-medium text-gray-900">{title}</h4>
                          <p className="text-sm text-gray-600">{desc}</p>
                          <p className="text-xs text-gray-500 mt-1">{time}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {productName && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-1">Консултация за продукт:</h4>
                      <p className="text-blue-700">{productName}</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 2: Personal Info */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900">Лична информация</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Име и фамилия *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          required
                          type="text"
                          value={form.name}
                          onChange={(e) => updateForm('name', e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Вашето име"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email адрес *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          required
                          type="email"
                          value={form.email}
                          onChange={(e) => updateForm('email', e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="email@example.com"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Телефонен номер *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          required
                          type="tel"
                          value={form.phone}
                          onChange={(e) => updateForm('phone', e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="+359 88 123 4567"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Информация за автомобила (по желание)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Марка</label>
                        <div className="relative">
                          <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={form.vehicleMake}
                            onChange={(e) => updateForm('vehicleMake', e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="BMW"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Модел</label>
                        <input
                          type="text"
                          value={form.vehicleModel}
                          onChange={(e) => updateForm('vehicleModel', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Series 3"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Година</label>
                        <input
                          type="text"
                          value={form.vehicleYear}
                          onChange={(e) => updateForm('vehicleYear', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="2018"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Details */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900">Детайли за консултацията</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Предпочитано време *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {timeSlots.map(slot => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => updateForm('preferredTime', slot)}
                          className={`p-2 text-sm border rounded-lg transition-colors ${
                            form.preferredTime === slot
                              ? 'border-purple-500 bg-purple-50 text-purple-700'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <Clock className="w-4 h-4 inline mr-1" />
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Вашият въпрос или проблем
                    </label>
                    <textarea
                      value={form.question}
                      onChange={(e) => updateForm('question', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Опишете накратко какво ви интересува или с какво можем да ви помогнем..."
                    />
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">Това, което ще получите:</h4>
                    <ul className="space-y-1 text-sm text-green-700">
                      <li>• Безплатна консултация с експерт</li>
                      <li>• Професионални съвети за монтаж</li>
                      <li>• Проверка на съвместимостта</li>
                      <li>• Препоръки за инструменти</li>
                      <li>• Контакти на сервизи при нужда</li>
                    </ul>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onClose()}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  {currentStep > 1 ? 'Назад' : 'Отказ'}
                </button>

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={currentStep === 1 && !form.consultationType}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Напред
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!form.name || !form.email || !form.phone || !form.preferredTime}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Изпрати заявка
                  </button>
                )}
              </div>
            </form>
          </>
        )}
      </motion.div>
    </div>
  )
} 