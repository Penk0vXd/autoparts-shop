'use client'

import { useState } from 'react'

interface Feature {
  id: string
  icon: string
  title: string
  description: string
  color: string
}

interface FeaturesSectionProps {
  className?: string
}

/**
 * FeaturesSection Component
 * 
 * Displays key features and benefits of the auto parts service
 * TODO: Add animations, interactive hover effects, and real data integration
 */
export default function FeaturesSection({ className = '' }: FeaturesSectionProps) {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null)

  // TODO: Move to external data file or API
  const features: Feature[] = [
    {
      id: 'fast-response',
      icon: '⚡',
      title: 'Бърз отговор',
      description: 'Ще получите отговор до 2 часа в работни дни',
      color: 'red'
    },
    {
      id: 'expert-consultation',
      icon: '🎯',
      title: 'Експертна консултация',
      description: 'Нашите специалисти ще ви помогнат с избора',
      color: 'blue'
    },
    {
      id: 'best-price',
      icon: '💰',
      title: 'Най-добра цена',
      description: 'Конкурентни цени за всички автомобилни части',
      color: 'green'
    },
    {
      id: 'quality-guarantee',
      icon: '🛡️',
      title: 'Гарантирано качество',
      description: 'Всички части са с пълна гаранция',
      color: 'purple'
    },
    {
      id: 'fast-delivery',
      icon: '🚚',
      title: 'Бърза доставка',
      description: 'Доставка в цяла България до 24 часа',
      color: 'orange'
    },
    {
      id: 'support-247',
      icon: '📞',
      title: 'Поддръжка 24/7',
      description: 'На български език, всяко време',
      color: 'indigo'
    }
  ]

  const getColorClasses = (color: string, isHovered: boolean) => {
    const colorMap = {
      red: isHovered ? 'bg-red-100 border-red-300' : 'bg-red-50 border-red-200',
      blue: isHovered ? 'bg-blue-100 border-blue-300' : 'bg-blue-50 border-blue-200',
      green: isHovered ? 'bg-green-100 border-green-300' : 'bg-green-50 border-green-200',
      purple: isHovered ? 'bg-purple-100 border-purple-300' : 'bg-purple-50 border-purple-200',
      orange: isHovered ? 'bg-orange-100 border-orange-300' : 'bg-orange-50 border-orange-200',
      indigo: isHovered ? 'bg-indigo-100 border-indigo-300' : 'bg-indigo-50 border-indigo-200'
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.red
  }

  return (
    <section className={`bg-gray-50 py-16 ${className}`}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Защо да изберете нас?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Професионална услуга с години опит в автомобилната индустрия
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`
                bg-white rounded-lg p-6 shadow-sm border transition-all duration-300 
                hover:shadow-lg hover:scale-105 cursor-pointer
                ${getColorClasses(feature.color, hoveredFeature === feature.id)}
              `}
              onMouseEnter={() => setHoveredFeature(feature.id)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              {/* Icon */}
              <div className="text-4xl mb-4 text-center">
                {feature.icon}
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* TODO: Add interactive elements like:
            - Feature comparison table
            - Animated counters
            - Customer testimonials integration
            - Call-to-action buttons per feature
        */}
      </div>
    </section>
  )
} 