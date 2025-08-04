'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface RequestFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
  isSubmitting: boolean
  errors: Record<string, string>
  selectedFile: File | null
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

/**
 * Modern RequestForm Component
 * 
 * Enhanced UI/UX for the auto parts request form
 * Preserves all existing form logic and event handlers
 */
export default function RequestForm({
  onSubmit,
  isSubmitting,
  errors,
  selectedFile,
  onFileChange
}: RequestFormProps) {
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const getFieldClasses = (fieldName: string, hasError: boolean) => {
    const baseClasses = "w-full px-4 py-4 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-red-500 focus:border-red-500"
    const errorClasses = hasError ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
    const focusClasses = focusedField === fieldName ? "ring-2 ring-red-500 border-red-500 shadow-lg" : ""
    
    return `${baseClasses} ${errorClasses} ${focusClasses}`
  }

  const getLabelClasses = (fieldName: string) => {
    return `block text-sm font-semibold text-gray-700 mb-3 transition-colors duration-200 ${
      focusedField === fieldName ? 'text-red-600' : ''
    }`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* 🏆 Enhanced Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 pt-20 pb-16 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px'
          }} />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            Бързо и лесно
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Заявка за{' '}
            <span className="bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
              авточасти
            </span>
          </h1>
          
          <p className="text-xl text-red-100 max-w-2xl mx-auto leading-relaxed">
            Попълнете формата и нашите специалисти ще намерят точно това, което търсите
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-red-100 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-yellow-300">⚡</span>
              <span>Отговор до 2 часа</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-300">🎯</span>
              <span>100% съвместимост</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-300">💰</span>
              <span>Най-добра цена</span>
            </div>
          </div>
        </div>
      </div>

      {/* 📝 Enhanced Form Section */}
      <div className="max-w-4xl mx-auto px-4 pb-20 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🚗</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Детайли за заявката</h2>
                <p className="text-gray-600">Попълнете всички полета за по-бързо обслужване</p>
              </div>
            </div>
          </div>

          <form onSubmit={onSubmit} encType="multipart/form-data" className="p-8 space-y-8">
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
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-red-500 text-xl">⚠️</span>
                  <p className="text-red-700 font-medium">{errors.general}</p>
                </div>
              </div>
            )}

            {/* 👤 Personal Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Лични данни</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className={getLabelClasses('name')}>
                    Име и фамилия *
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    required
                    className={getFieldClasses('name', !!errors.name)}
                    placeholder="Вашето име"
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <span>⚠️</span>
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className={getLabelClasses('phone')}>
                    Телефон *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    required
                    className={getFieldClasses('phone', !!errors.phone)}
                    placeholder="+359 888 123 456"
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField(null)}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <span>⚠️</span>
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label htmlFor="email" className={getLabelClasses('email')}>
                    Имейл (по желание)
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    className={getFieldClasses('email', !!errors.email)}
                    placeholder="your@email.com"
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <span>⚠️</span>
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 🚗 Vehicle Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Информация за автомобила</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="brand" className={getLabelClasses('brand')}>
                    Марка
                  </label>
                  <input
                    id="brand"
                    type="text"
                    name="brand"
                    className={getFieldClasses('brand', false)}
                    placeholder="BMW, Mercedes, Audi..."
                    onFocus={() => setFocusedField('brand')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="model" className={getLabelClasses('model')}>
                    Модел
                  </label>
                  <input
                    id="model"
                    type="text"
                    name="model"
                    className={getFieldClasses('model', false)}
                    placeholder="320i, C200, A4..."
                    onFocus={() => setFocusedField('model')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="year" className={getLabelClasses('year')}>
                    Година
                  </label>
                  <input
                    id="year"
                    type="text"
                    name="year"
                    className={getFieldClasses('year', false)}
                    placeholder="2020"
                    onFocus={() => setFocusedField('year')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="engine" className={getLabelClasses('engine')}>
                    Двигател
                  </label>
                  <input
                    id="engine"
                    type="text"
                    name="engine"
                    className={getFieldClasses('engine', false)}
                    placeholder="2.0 TDI, 1.8 TSI..."
                    onFocus={() => setFocusedField('engine')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label htmlFor="vin" className={getLabelClasses('vin')}>
                    VIN номер (по желание)
                  </label>
                  <input
                    id="vin"
                    type="text"
                    name="vin"
                    className={getFieldClasses('vin', false)}
                    placeholder="WBA3B5C50FD123456"
                    maxLength={17}
                    onFocus={() => setFocusedField('vin')}
                    onBlur={() => setFocusedField(null)}
                  />
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <span>💡</span>
                    VIN номерът помага за по-точно определяне на частите
                  </p>
                </div>
              </div>
            </div>

            {/* 🔧 Part Description */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Коя част търсите?</h3>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="part_text" className={getLabelClasses('part_text')}>
                  Описание на частта *
                </label>
                <textarea
                  id="part_text"
                  name="part_text"
                  required
                  rows={6}
                  className={`${getFieldClasses('part_text', !!errors.part_text)} resize-none`}
                  placeholder="Опишете подробно какво търсите... Например: 'Спирачни накладки за предна ос BMW X3 2018г. Оригинални или качествени заместители. Колата се използва за ежедневно шофиране в градска среда.'"
                  onFocus={() => setFocusedField('part_text')}
                  onBlur={() => setFocusedField(null)}
                />
                {errors.part_text && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <span>⚠️</span>
                    {errors.part_text}
                  </p>
                )}
              </div>
            </div>

            {/* 📎 Enhanced File Upload */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">4</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Прикачете снимка (по желание)</h3>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-red-400 transition-colors duration-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="block text-lg font-semibold text-gray-900 hover:text-red-600 transition-colors duration-200">
                        Изберете файл
                      </span>
                      <input
                        id="file-upload"
                        name="attachment"
                        type="file"
                        className="sr-only"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={onFileChange}
                      />
                    </label>
                    <p className="text-sm text-gray-500">
                      JPG, PNG или PDF, максимум 5MB
                    </p>
                  </div>
                </div>
                
                {selectedFile && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-green-600 text-xl">✅</span>
                      <div>
                        <p className="text-green-800 font-medium">Файл избран успешно</p>
                        <p className="text-green-600 text-sm">{selectedFile.name}</p>
                        <p className="text-green-500 text-xs">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {errors.file && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-red-600 text-xl">⚠️</span>
                      <p className="text-red-700">{errors.file}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 🚀 Enhanced Submit Button */}
            <div className="text-center pt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full md:w-auto px-12 py-5 bg-gradient-to-r from-red-600 to-red-700 text-white text-xl font-bold rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500/50"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Изпращане...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl">🚀</span>
                    <span>Изпрати заявка</span>
                  </div>
                )}
              </button>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center justify-center gap-3 text-blue-700">
                  <span className="text-xl">⏰</span>
                  <p className="text-sm font-medium">Ще получите отговор до 2 часа в работни дни</p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 