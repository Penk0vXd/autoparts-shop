'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

// 🤖 Dynamic import for hCaptcha to avoid SSR issues (install: npm install @hcaptcha/react-hcaptcha)
const HCaptcha = dynamic(() => import('@hcaptcha/react-hcaptcha').catch(() => ({ 
  default: () => <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
    <p className="text-yellow-700">hCaptcha not available. Install @hcaptcha/react-hcaptcha package.</p>
  </div>
})), { 
  ssr: false,
  loading: () => <div className="h-20 flex items-center justify-center">Loading captcha...</div>
})

export default function RequestPage() {
  const router = useRouter()
  const captchaRef = useRef<{ resetCaptcha: () => void } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [captchaToken, setCaptchaToken] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // 📋 Form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    const formData = new FormData(e.currentTarget)
    
    // Add captcha token
    if (captchaToken) {
      formData.append('h-captcha-response', captchaToken)
    }

    // Add file if selected
    if (selectedFile) {
      formData.append('attachment', selectedFile)
    }

    try {
      const response = await fetch('/api/request', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        router.push('/thank-you')
      } else {
        if (result.details) {
          // Handle Zod validation errors
          const fieldErrors: Record<string, string> = {}
          result.details.forEach((error: any) => {
            fieldErrors[error.path[0]] = error.message
          })
          setErrors(fieldErrors)
        } else {
          setErrors({ general: result.error || 'Възникна грешка' })
        }
        
        // Reset captcha on error
        if (captchaRef.current) {
          captchaRef.current.resetCaptcha()
          setCaptchaToken('')
        }
      }
    } catch (error) {
      console.error('Submission error:', error)
      setErrors({ general: 'Грешка в мрежата. Моля опитайте отново.' })
      
      // Reset captcha on error
      if (captchaRef.current) {
        captchaRef.current.resetCaptcha()
        setCaptchaToken('')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // 📎 File selection handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Client-side validation
      const maxSize = 5 * 1024 * 1024 // 5MB
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
      
      if (file.size > maxSize) {
        setErrors({ file: 'Файлът трябва да е под 5MB' })
        e.target.value = '' // Clear input
        return
      }
      
      if (!allowedTypes.includes(file.type)) {
        setErrors({ file: 'Разрешени са само JPG, PNG и PDF файлове' })
        e.target.value = '' // Clear input
        return
      }
      
      setSelectedFile(file)
      setErrors({ ...errors, file: '' })
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 🏆 Hero Section */}
      <div className="bg-white pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Заявка за <span className="text-red-600">авточасти</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Попълнете формата и нашите специалисти ще намерят точно това, което търсите
          </p>
        </div>
      </div>

      {/* 📝 Form Section */}
      <div className="max-w-2xl mx-auto px-4 pb-20">
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 🍯 Honeypot (hidden anti-spam field) */}
            <input
              type="text"
              name="honeypot"
              tabIndex={-1}
              autoComplete="off"
              className="absolute left-[-9999px] opacity-0"
              aria-hidden="true"
            />

            {/* General Error */}
            {errors.general && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

            {/* 👤 Personal Information */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Лични данни
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Име и фамилия *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                      errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Вашето име"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                      errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="+359 888 123 456"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Имейл (по желание)
                  </label>
                  <input
                    type="email"
                    name="email"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                      errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* 🚗 Vehicle Information */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Информация за автомобила
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Марка
                  </label>
                  <input
                    type="text"
                    name="brand"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="BMW, Mercedes, Audi..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Модел
                  </label>
                  <input
                    type="text"
                    name="model"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="320i, C200, A4..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Година
                  </label>
                  <input
                    type="text"
                    name="year"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="2020"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Двигател
                  </label>
                  <input
                    type="text"
                    name="engine"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="2.0 TDI, 1.8 TSI..."
                  />
                </div>
              </div>
            </div>

            {/* 🔧 Part Description */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Коя част търсите?
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Описание на частта *
                </label>
                <textarea
                  name="part_text"
                  required
                  rows={6}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none ${
                    errors.part_text ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Опишете подробно какво търсите... Например: 'Спирачни накладки за предна ос BMW X3 2018г. Оригинални или качествени заместители. Колата се използва за ежедневно шофиране в градска среда.'"
                />
                {errors.part_text && (
                  <p className="text-red-500 text-sm mt-1">{errors.part_text}</p>
                )}
              </div>
            </div>

            {/* 📎 File Upload */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Прикачете снимка (по желание)
              </h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="mt-4">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Изберете файл
                      </span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="mt-1 text-xs text-gray-500">
                      JPG, PNG или PDF, максимум 5MB
                    </p>
                  </div>
                </div>
                
                {selectedFile && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-green-600">
                      ✓ Избран файл: {selectedFile.name}
                    </p>
                  </div>
                )}
                
                {errors.file && (
                  <p className="text-red-500 text-sm mt-2 text-center">{errors.file}</p>
                )}
              </div>
            </div>

            {/* 🤖 hCaptcha */}
            <div>
              <div className="flex justify-center">
                <HCaptcha
                  ref={captchaRef}
                  sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
                  onVerify={(token) => setCaptchaToken(token)}
                  onExpire={() => setCaptchaToken('')}
                  onError={() => setCaptchaToken('')}
                />
              </div>
              {errors['h-captcha-response'] && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  {errors['h-captcha-response']}
                </p>
              )}
            </div>

            {/* 🚀 Submit Button */}
            <div className="text-center pt-6">
              <button
                type="submit"
                disabled={isSubmitting || !captchaToken}
                className="w-full md:w-auto px-12 py-4 bg-red-600 text-white text-xl font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-3">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Изпращане...</span>
                  </div>
                ) : (
                  'Изпрати заявка'
                )}
              </button>
              
              <p className="text-sm text-gray-500 mt-4">
                Ще получите отговор до 2 часа в работни дни
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 