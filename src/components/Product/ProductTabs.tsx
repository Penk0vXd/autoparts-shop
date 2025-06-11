'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, User, Calendar } from 'lucide-react'
import type { ProductWithRelations } from '@/types/supabase'

interface ProductTabsProps {
  product: ProductWithRelations
}

type TabType = 'description' | 'specs' | 'compatibility' | 'reviews'

interface Review {
  id: string
  author: string
  rating: number
  comment: string
  date: string
  verified: boolean
}

// Mock reviews data - replace with real data
const mockReviews: Review[] = [
  {
    id: '1',
    author: 'Иван П.',
    rating: 5,
    comment: 'Отличен продукт! Качеството е много добро, доставката беше бърза. Препоръчвам!',
    date: '2024-01-15',
    verified: true,
  },
  {
    id: '2',
    author: 'Мария С.',
    rating: 4,
    comment: 'Добра цена-качество. Монтажът беше лесен, работи перфектно.',
    date: '2024-01-10',
    verified: true,
  },
  {
    id: '3',
    author: 'Петър К.',
    rating: 5,
    comment: 'Точно това, което търсех. Бърза доставка и професионално обслужване.',
    date: '2024-01-05',
    verified: false,
  },
]

/**
 * ProductTabs component - Tabbed content for product details
 * Features description, specifications, compatibility, and reviews
 */
export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('description')

  const tabs = [
    { id: 'description', label: 'Описание', count: null },
    { id: 'specs', label: 'Спецификации', count: null },
    { id: 'compatibility', label: 'Съвместими модели', count: null },
    { id: 'reviews', label: 'Отзиви', count: mockReviews.length },
  ] as const

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="prose prose-gray max-w-none"
          >
            <div className="text-foreground leading-relaxed">
              {product.description || 'Няма налично описание за този продукт.'}
            </div>
            
            {/* Additional product specifications */}
            {product.specifications && typeof product.specifications === 'object' && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-foreground mb-4">Ключови характеристики:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications as Record<string, any>).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-muted-foreground">{key}</span>
                      <span className="text-foreground">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )

      case 'specs':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Основни спецификации</h3>
                <div className="space-y-3">
                  {product.sku && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-muted-foreground">Каталожен номер</span>
                      <span className="text-foreground">{product.sku}</span>
                    </div>
                  )}
                  {product.brand && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-muted-foreground">Марка</span>
                      <span className="text-foreground">{product.brand.name}</span>
                    </div>
                  )}
                  {product.category && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-muted-foreground">Категория</span>
                      <span className="text-foreground">{product.category.name}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-muted-foreground">Тегло</span>
                    <span className="text-foreground">2.3 кг</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-muted-foreground">Гаранция</span>
                    <span className="text-foreground">3 години</span>
                  </div>
                </div>
              </div>

              {/* Technical specs */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Технически данни</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-muted-foreground">Материал</span>
                    <span className="text-foreground">Метал/Каучук</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-muted-foreground">Температурен диапазон</span>
                    <span className="text-foreground">-40°C до +120°C</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-muted-foreground">Сертификати</span>
                    <span className="text-foreground">ISO 9001, ECE</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-muted-foreground">Произход</span>
                    <span className="text-foreground">Германия</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )

      case 'compatibility':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Съвместими модели</h3>
                <p className="text-muted-foreground mb-6">
                  Този продукт е съвместим със следните автомобилни модели:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Mock compatibility data */}
                {[
                  { brand: 'BMW', models: ['E46', 'E90', 'F30'], years: '2001-2019' },
                  { brand: 'Audi', models: ['A4 B6', 'A4 B7', 'A4 B8'], years: '2000-2016' },
                  { brand: 'Mercedes', models: ['W203', 'W204', 'W205'], years: '2000-2020' },
                  { brand: 'Volkswagen', models: ['Golf V', 'Golf VI', 'Passat B6'], years: '2003-2014' },
                ].map((compatibility, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                  >
                    <h4 className="font-semibold text-foreground mb-2">{compatibility.brand}</h4>
                    <div className="space-y-1 text-sm">
                      {compatibility.models.map((model, modelIndex) => (
                        <div key={modelIndex} className="text-muted-foreground">
                          {model}
                        </div>
                      ))}
                      <div className="text-xs text-muted-foreground mt-2 pt-2 border-t border-gray-200">
                        {compatibility.years}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
                <p className="text-sm text-blue-800">
                  <strong>Забележка:</strong> Препоръчваме да проверите каталожния номер на вашата част преди поръчка. 
                  При съмнения се свържете с нас за консултация.
                </p>
              </div>
            </div>
          </motion.div>
        )

      case 'reviews':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-6">
              {/* Reviews Summary */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Оценки и отзиви</h3>
                  <div className="flex items-center space-x-2">
                    {renderStars(4.7)}
                    <span className="text-lg font-bold text-foreground">4.7</span>
                    <span className="text-sm text-muted-foreground">({mockReviews.length} отзива)</span>
                  </div>
                </div>

                {/* Rating breakdown */}
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = mockReviews.filter(r => r.rating === rating).length
                    const percentage = mockReviews.length > 0 ? (count / mockReviews.length) * 100 : 0
                    
                    return (
                      <div key={rating} className="flex items-center space-x-3">
                        <span className="text-sm w-8">{rating} ⭐</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-8">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="space-y-4">
                {mockReviews.map((review) => (
                  <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-foreground">{review.author}</span>
                            {review.verified && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                Потвърден
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            {renderStars(review.rating)}
                            <span className="text-sm text-muted-foreground flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(review.date).toLocaleDateString('bg-BG')}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-foreground leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>

              {/* Write Review CTA */}
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 text-center">
                <h4 className="font-semibold text-foreground mb-2">Имате опит с този продукт?</h4>
                <p className="text-muted-foreground mb-4">Споделете вашето мнение и помогнете на други клиенти</p>
                <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Напишете отзив
                </button>
              </div>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <section className="mt-16">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors relative ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
              }`}
              role="tab"
              aria-selected={activeTab === tab.id}
            >
              {tab.label}
              {tab.count !== null && (
                <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]" role="tabpanel">
        {renderTabContent()}
      </div>
    </section>
  )
} 