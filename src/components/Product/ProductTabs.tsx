'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, User, Calendar, Wrench, AlertTriangle, CheckCircle, Clock, Video, Download, ExternalLink } from 'lucide-react'
import type { ProductWithRelations } from '@/types/supabase'

interface ProductTabsProps {
  product: ProductWithRelations
}

type TabType = 'description' | 'specs' | 'installation' | 'compatibility' | 'reviews'

interface Review {
  id: string
  author: string
  rating: number
  comment: string
  date: string
  verified: boolean
}

interface InstallationStep {
  step: number
  title: string
  description: string
  warning?: string
  tip?: string
  imageUrl?: string
  videoUrl?: string
}

// Mock installation guide data
const getInstallationGuide = (productName: string): InstallationStep[] => {
  if (productName.toLowerCase().includes('спирачки') || productName.toLowerCase().includes('дискове')) {
    return [
      {
        step: 1,
        title: 'Подготовка и безопасност',
        description: 'Поставете автомобила на равна повърхност и включете ръчната спирачка. Поставете клинове зад задните колела.',
        warning: 'Никога не работете под автомобил без подходящи подпори!'
      },
      {
        step: 2,
        title: 'Вдигане на автомобила',
        description: 'Използвайте домкрат за вдигане на съответния ъгъл. Поставете сигурна подпора под автомобила.',
        tip: 'Проверете дали домкратът е стабилен преди да започнете работа.'
      },
      {
        step: 3,
        title: 'Демонтаж на колелото',
        description: 'Отвинтете болтовете на колелото и внимателно го свалете.',
        videoUrl: '#demo-video'
      },
      {
        step: 4,
        title: 'Демонтаж на спирачния апарат',
        description: 'Отвинтете болтовете на спирачния апарат и го свалете внимателно, без да опъвате маркуча.',
        warning: 'Внимавайте да не повредите спирачните маркучи!'
      },
      {
        step: 5,
        title: 'Смяна на спирачните накладки',
        description: 'Сменете старите накладки с новите, като следите за правилната ориентация.',
        tip: 'Проверете дебелината на диска преди монтаж.'
      },
      {
        step: 6,
        title: 'Обратен монтаж',
        description: 'Монтирайте всичко в обратен ред. Затегнете болтовете с предписания момент.',
        warning: 'Задължително използвайте динамометричен ключ!'
      },
      {
        step: 7,
        title: 'Тест и финализация',
        description: 'Направете тест на спирачките на ниска скорост преди нормално шофиране.',
        tip: 'Първите 200 км шофирайте внимателно за приработване.'
      }
    ]
  } else if (productName.toLowerCase().includes('масло')) {
    return [
      {
        step: 1,
        title: 'Подготовка',
        description: 'Загрейте двигателя до работна температура, след което го изключете и изчакайте 5-10 минути.',
        tip: 'Топлото масло се източва по-лесно и пълно.'
      },
      {
        step: 2,
        title: 'Източване на старото масло',
        description: 'Отвинтете сливната пробка и оставете маслото да се източи напълно в подходящ съд.'
      },
      {
        step: 3,
        title: 'Смяна на маслен филтър',
        description: 'Сменете масления филтър с нов. Намажете уплътнението на новия филтър с малко масло.'
      },
      {
        step: 4,
        title: 'Затваряне и доливане',
        description: 'Поставете новата сливна пробка с ново уплътнение. Долейте новото масло през горната част.'
      },
      {
        step: 5,
        title: 'Проверка на нивото',
        description: 'Стартирайте двигателя за няколко минути, след което проверете нивото с мерника.'
      }
    ]
  } else {
    return [
      {
        step: 1,
        title: 'Подготовка',
        description: 'Подгответе всички необходими инструменти и прочетете инструкциите внимателно.'
      },
      {
        step: 2,
        title: 'Демонтаж на старата част',
        description: 'Внимателно демонтирайте старата част, като отбележите позицията й.'
      },
      {
        step: 3,
        title: 'Монтаж на новата част',
        description: 'Монтирайте новата част в точно същата позиция като старата.'
      },
      {
        step: 4,
        title: 'Проверка и тест',
        description: 'Проверете дали всичко е правилно монтирано и направете тест.'
      }
    ]
  }
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
 * Enhanced ProductTabs component with installation guide
 * Features description, specifications, installation guide, compatibility, and reviews
 */
export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('description')
  
  const installationGuide = getInstallationGuide(product.name)

  const tabs = [
    { id: 'description', label: 'Описание', count: null },
    { id: 'installation', label: 'Монтаж', count: installationGuide.length },
    { id: 'specs', label: 'Спецификации', count: null },
    { id: 'compatibility', label: 'Съвместимост', count: null },
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

      case 'installation':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Installation Guide Header */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Wrench className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Ръководство за монтаж</h3>
                  <p className="text-sm text-blue-700 mb-3">
                    Следвайте стъпките внимателно. При съмнение се обърнете към професионалист.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="flex items-center space-x-1 bg-white text-blue-800 text-xs px-2 py-1 rounded border">
                      <Clock className="w-3 h-3" />
                      <span>~{installationGuide.length === 7 ? '2-3 часа' : installationGuide.length === 5 ? '30-60 мин' : '15-30 мин'}</span>
                    </span>
                    <button className="flex items-center space-x-1 bg-blue-600 text-white text-xs px-2 py-1 rounded hover:bg-blue-700">
                      <Video className="w-3 h-3" />
                      <span>Видео ръководство</span>
                    </button>
                    <button className="flex items-center space-x-1 bg-white text-blue-800 text-xs px-2 py-1 rounded border hover:bg-blue-50">
                      <Download className="w-3 h-3" />
                      <span>PDF версия</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Installation Steps */}
            <div className="space-y-4">
              {installationGuide.map((step, index) => (
                <div key={step.step} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    {/* Step Number */}
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      {step.step}
                    </div>
                    
                    {/* Step Content */}
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-2">{step.title}</h4>
                      <p className="text-muted-foreground mb-3">{step.description}</p>
                      
                      {/* Warning */}
                      {step.warning && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                          <div className="flex items-start space-x-2">
                            <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                            <div>
                              <p className="font-medium text-red-800 text-sm">Внимание!</p>
                              <p className="text-red-700 text-sm">{step.warning}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Tip */}
                      {step.tip && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                          <div className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                            <div>
                              <p className="font-medium text-green-800 text-sm">Съвет</p>
                              <p className="text-green-700 text-sm">{step.tip}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Media Links */}
                      {(step.videoUrl || step.imageUrl) && (
                        <div className="flex gap-2 mt-3">
                          {step.videoUrl && (
                            <button className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700">
                              <Video className="w-4 h-4" />
                              <span>Видео демонстрация</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          )}
                          {step.imageUrl && (
                            <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-700">
                              <span>📷</span>
                              <span>Снимки</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Professional Help CTA */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-purple-900 mb-1">Нужна ли ви професионална помощ?</h4>
                  <p className="text-sm text-purple-700">
                    Свържете се с нашите експерти за консултация или препоръка за автосервиз.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="bg-purple-600 text-white text-sm py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap">
                    📞 Консултация
                  </button>
                  <button className="bg-white text-purple-600 border border-purple-200 text-sm py-2 px-4 rounded-lg hover:bg-purple-50 transition-colors whitespace-nowrap">
                    🔧 Намери сервиз
                  </button>
                </div>
              </div>
            </div>
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
                ].map((item, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-2">{item.brand}</h4>
                    <div className="space-y-1">
                      {item.models.map((model, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{model}</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2 pt-2 border-t border-gray-100">
                      {item.years}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  <strong>Забележка:</strong> Винаги проверявайте каталожните номера и спецификациите преди покупка. 
                  При съмнение се свържете с нашите експерти за консултация.
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
            className="space-y-6"
          >
            {/* Reviews Header */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-foreground">Отзиви от клиенти</h3>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm hover:bg-primary/90">
                Напиши отзив
              </button>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {mockReviews.map((review) => (
                <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
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
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(review.date).toLocaleDateString('bg-BG')}</span>
                        </div>
                      </div>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
              }`}
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
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  )
} 