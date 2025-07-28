'use client'

import { useState } from 'react'

interface ContactFormData {
  name: string
  email: string
  phone: string
  message: string
}

interface ContactFormSectionProps {
  className?: string
}

/**
 * ContactFormSection Component
 * 
 * Displays a contact form for general inquiries
 * TODO: Add form validation, submission handling, and success/error states
 */
export default function ContactFormSection({ className = '' }: ContactFormSectionProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // TODO: Implement actual form submission
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      setSubmitStatus('success')
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className={`bg-white py-16 ${className}`}>
      <div className="max-w-4xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Свържете се с нас
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Имате въпроси? Изпратете ни съобщение и ще се свържем с вас бързо
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Информация за контакт
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📞</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Телефон</h4>
                  <p className="text-gray-600">+359 888 123 456</p>
                  <p className="text-sm text-gray-500">Понеделник - Петък: 9:00 - 18:00</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📧</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Имейл</h4>
                  <p className="text-gray-600">info@autoparts.bg</p>
                  <p className="text-sm text-gray-500">Отговор до 2 часа</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📍</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Адрес</h4>
                  <p className="text-gray-600">ул. "Примерна" 123</p>
                  <p className="text-gray-600">София 1000, България</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">⏰</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Работно време</h4>
                  <p className="text-gray-600">Понеделник - Петък: 9:00 - 18:00</p>
                  <p className="text-gray-600">Събота: 9:00 - 14:00</p>
                  <p className="text-sm text-gray-500">Неделя: Затворено</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Изпратете съобщение
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Име и фамилия *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Вашето име"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Имейл *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="your@email.com"
                />
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Телефон
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="+359 888 123 456"
                />
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Съобщение *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                  placeholder="Опишете вашия въпрос или заявка..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isSubmitting ? 'Изпращане...' : 'Изпрати съобщение'}
              </button>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm">
                    ✅ Съобщението е изпратено успешно! Ще се свържем с вас скоро.
                  </p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">
                    ❌ Възникна грешка при изпращането. Моля опитайте отново.
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* TODO: Add interactive elements like:
            - Form validation with real-time feedback
            - File upload capability
            - Chat widget integration
            - Social media links
            - Map integration
        */}
      </div>
    </section>
  )
} 