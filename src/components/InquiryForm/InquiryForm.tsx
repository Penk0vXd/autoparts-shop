'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FEATURE_CONFIG } from '@/config/features'

interface InquiryFormData {
  // Customer Info
  name: string
  email: string
  phone: string
  
  // Vehicle Info
  make: string
  model: string
  year: string
  engine: string
  vin: string
  
  // Part Info
  partName: string
  partNumber: string
  category: string
  description: string
  
  // Additional
  urgency: 'normal' | 'urgent' | 'very-urgent'
  preferredContact: 'email' | 'phone'
}

/**
 * Professional inquiry form for auto parts requests
 * Features validation, file upload, and comprehensive vehicle information
 */
export function InquiryForm() {
  const [formData, setFormData] = useState<InquiryFormData>({
    name: '',
    email: '',
    phone: '',
    make: '',
    model: '',
    year: '',
    engine: '',
    vin: '',
    partName: '',
    partNumber: '',
    category: '',
    description: '',
    urgency: 'normal',
    preferredContact: 'email'
  })
  
  const [files, setFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const config = FEATURE_CONFIG.inquiry

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) newErrors.name = 'Името е задължително'
    if (!formData.email.trim()) newErrors.email = 'Имейлът е задължителен'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Невалиден имейл'
    if (!formData.phone.trim()) newErrors.phone = 'Телефонът е задължителен'
    if (!formData.make.trim()) newErrors.make = 'Марката е задължителна'
    if (!formData.model.trim()) newErrors.model = 'Моделът е задължителен'
    if (!formData.partName.trim()) newErrors.partName = 'Името на частта е задължително'
    if (!formData.description.trim()) newErrors.description = 'Описанието е задължително'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setIsSuccess(true)
      // Reset form after success
      setFormData({
        name: '',
        email: '',
        phone: '',
        make: '',
        model: '',
        year: '',
        engine: '',
        vin: '',
        partName: '',
        partNumber: '',
        category: '',
        description: '',
        urgency: 'normal',
        preferredContact: 'email'
      })
      setFiles([])
    } catch (error) {
      console.error('Submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-white rounded-lg p-8 shadow-sm border text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{config.successMessage}</h3>
        <p className="text-gray-600 mb-6">Ще се свържем с вас в най-скоро време.</p>
        <Button onClick={() => setIsSuccess(false)} variant="outline">
          Изпрати нова заявка
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-8 shadow-sm border">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Детайли за заявката</h2>
      
      {/* Customer Information */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Лични данни</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Име и фамилия *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Вашето име"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Имейл адрес *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="your@email.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Телефон *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="+359 888 123 456"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Предпочитан начин за контакт
            </label>
            <select
              name="preferredContact"
              value={formData.preferredContact}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="email">Имейл</option>
              <option value="phone">Телефон</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vehicle Information */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Информация за автомобила</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Марка *
            </label>
            <input
              type="text"
              name="make"
              value={formData.make}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.make ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="BMW, Mercedes, Audi..."
            />
            {errors.make && <p className="text-red-500 text-sm mt-1">{errors.make}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Модел *
            </label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.model ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="320i, C200, A4..."
            />
            {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Година на производство
            </label>
            <input
              type="text"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="2020"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Двигател
            </label>
            <input
              type="text"
              name="engine"
              value={formData.engine}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="2.0 TDI, 1.8 TSI..."
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              VIN номер
            </label>
            <input
              type="text"
              name="vin"
              value={formData.vin}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="WBAFR9C50BC123456"
            />
          </div>
        </div>
      </div>

      {/* Part Information */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Информация за частта</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Име на частта *
            </label>
            <input
              type="text"
              name="partName"
              value={formData.partName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.partName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Спирачни накладки, въздушен филтър..."
            />
            {errors.partName && <p className="text-red-500 text-sm mt-1">{errors.partName}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Номер на частта
            </label>
            <input
              type="text"
              name="partNumber"
              value={formData.partNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="34116858652, 1K0129620D..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Категория
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Изберете категория</option>
              <option value="engine">Двигатели и части</option>
              <option value="brakes">Спирачна система</option>
              <option value="suspension">Окачване</option>
              <option value="transmission">Скоростна кутия</option>
              <option value="electrical">Електрика</option>
              <option value="filters">Филтри</option>
              <option value="body">Каросерия</option>
              <option value="other">Друго</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Спешност
            </label>
            <select
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="normal">Обичайна (до 2 дни)</option>
              <option value="urgent">Спешна (до 24 часа)</option>
              <option value="very-urgent">Много спешна (същия ден)</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Подробно описание *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Опишете подробно какво търсите, за какво ще се използва, има ли специфични изисквания..."
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>
      </div>

      {/* File Upload */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Снимки (по желание)</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="text-sm text-gray-600 mb-2">
            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/80">
              <span>Качете снимки</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
            <span className="pl-1">или ги плъзнете тук</span>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, GIF до 10MB всяка</p>
          
          {files.length > 0 && (
            <div className="mt-4 text-left">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Избрани файлове:</h4>
              <ul className="text-sm text-gray-600">
                {files.map((file, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span>📎</span>
                    <span>{file.name}</span>
                    <span className="text-gray-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 text-lg"
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Изпращане...</span>
            </div>
          ) : (
            config.ctaText
          )}
        </Button>
        
        <p className="text-sm text-gray-500 mt-4">
          С изпращането на тази форма се съгласявате с нашите{' '}
          <a href="/privacy" className="text-primary hover:underline">условия за поверителност</a>
        </p>
      </div>
    </form>
  )
} 