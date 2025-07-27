'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { validateRequestForm, type RequestFormData } from '@/lib/validation'

interface FormData {
  full_name: string
  phone: string
  car_details: string
  message: string
}

interface FormErrors {
  [key: string]: string
}

export default function RequestPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    phone: '',
    car_details: '',
    message: ''
  })

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setSelectedFile(file || null)
    
    // Clear file error when user selects a file
    if (errors.file) {
      setErrors(prev => ({
        ...prev,
        file: ''
      }))
    }
  }

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    // Prepare data for validation
    const dataToValidate = {
      ...formData,
      file: selectedFile
    }

    // Client-side validation
    const validation = validateRequestForm(dataToValidate)
    
    if (!validation.success) {
      const fieldErrors: FormErrors = {}
      validation.errors?.forEach(error => {
        const fieldName = error.path[0] as string
        fieldErrors[fieldName] = error.message
      })
      setErrors(fieldErrors)
      setIsSubmitting(false)
      return
    }

    try {
      // Prepare form data for submission
      const submitData = {
        ...formData,
        file: selectedFile
      }

      const response = await fetch('/api/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      })

      const result = await response.json()

      if (!response.ok) {
        console.error('Submission error:', result.error || 'Unknown error')
        setErrors({ general: result.error || 'Възникна грешка при изпращането' })
        return
      }

      if (result.success) {
        // Redirect to thank you page
        router.push('/thank-you')
      } else {
        if (result.details) {
          const fieldErrors: FormErrors = {}
          result.details.forEach((error: any) => {
            fieldErrors[error.path[0]] = error.message
          })
          setErrors(fieldErrors)
        } else {
          setErrors({ general: result.error || 'Възникна грешка' })
        }
      }
    } catch (error) {
      console.error('Submission error:', error)
      setErrors({ general: 'Грешка в мрежата. Моля опитайте отново.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            Заявка за авточасти
          </h1>
          <p className="text-gray-600 text-center mt-2">
            Попълнете формата по-долу и ще се свържем с вас
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                Пълно име *
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.full_name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Въведете вашето пълно име"
              />
              {errors.full_name && (
                <p className="text-red-600 text-sm mt-1">{errors.full_name}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Телефонен номер *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="+359 888 123 456"
              />
              {errors.phone && (
                <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Car Details */}
            <div>
              <label htmlFor="car_details" className="block text-sm font-medium text-gray-700 mb-2">
                Детайли за автомобила *
              </label>
              <input
                type="text"
                id="car_details"
                name="car_details"
                value={formData.car_details}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.car_details ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="например: BMW 320i 2018, Mercedes C200 2020"
              />
              <p className="text-sm text-gray-500 mt-1">
                Включете марка, модел, година и двигател, ако знаете
              </p>
              {errors.car_details && (
                <p className="text-red-600 text-sm mt-1">{errors.car_details}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Описание на частта / Съобщение *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={5}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${
                  errors.message ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Опишете частта, която търсите, номера на частите, които имате, или допълнителни детайли, които могат да помогнат за намирането на правилната част..."
              />
              {errors.message && (
                <p className="text-red-600 text-sm mt-1">{errors.message}</p>
              )}
            </div>

            {/* File Upload */}
            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                Прикачи файл (по желание)
              </label>
              <input
                type="file"
                id="file"
                name="file"
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.file ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              <p className="text-sm text-gray-500 mt-1">
                Разрешени са JPG, PNG и PDF файлове до 5MB
              </p>
              {errors.file && (
                <p className="text-red-600 text-sm mt-1">{errors.file}</p>
              )}
              {selectedFile && (
                <p className="text-green-600 text-sm mt-1">
                  Избран файл: {selectedFile.name}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Изпращане...' : 'Изпрати заявка'}
              </button>
            </div>

            <div className="text-center pt-4">
              <a
                href="/"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                ← Назад към началната страница
              </a>
            </div>
          </form>

          {/* Info Section */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Какво следва?</h3>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>• Нашите експерти ще разгледат вашата заявка</li>
              <li>• Ще потърсим в мрежата на доставчици</li>
              <li>• Ще получите отговор до 2 работни часа</li>
              <li>• Ще получите информация за цена и наличност</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}   