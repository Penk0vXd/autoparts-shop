'use client'

import Link from 'next/link'
import { useState } from 'react'

interface Step {
  id: string
  number: number
  title: string
  description: string
  icon: string
  details: string[]
}

interface HowItWorksSectionProps {
  className?: string
}

/**
 * HowItWorksSection Component
 * 
 * Displays a step-by-step guide for how the auto parts service works
 * TODO: Add animations, progress indicators, and interactive elements
 */
export default function HowItWorksSection({ className = '' }: HowItWorksSectionProps) {
  const [activeStep, setActiveStep] = useState<number>(1)

  // TODO: Move to external data file or API
  const steps: Step[] = [
    {
      id: 'step-1',
      number: 1,
      title: 'Изпратете заявка',
      description: 'Попълнете формата с детайлите за вашия автомобил',
      icon: '📝',
      details: [
        'Укажете марка, модел и година',
        'Опишете нужната част',
        'Прикачете снимка (по желание)'
      ]
    },
    {
      id: 'step-2',
      number: 2,
      title: 'Получете оферта',
      description: 'Нашите експерти ще намерят най-добрите варианти',
      icon: '🎯',
      details: [
        'Анализ на съвместимостта',
        'Сравнение на цените',
        'Проверка на качеството'
      ]
    },
    {
      id: 'step-3',
      number: 3,
      title: 'Потвърдете поръчка',
      description: 'Изберете предпочитания вариант и потвърдете',
      icon: '✅',
      details: [
        'Избор между няколко опции',
        'Детайлна информация за доставка',
        'Плащане по предпочитание'
      ]
    }
  ]

  return (
    <section className={`bg-white py-16 ${className}`}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Как работи нашата услуга?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Прост и бърз процес за намиране на точната част за вашия автомобил
          </p>
        </div>

        {/* Steps Container */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 transform -translate-y-1/2 z-0" />

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="relative z-10"
              >
                {/* Step Card */}
                <div
                  className={`
                    bg-white rounded-lg p-8 shadow-lg border-2 transition-all duration-300
                    hover:shadow-xl cursor-pointer text-center
                    ${activeStep === step.number 
                      ? 'border-red-500 shadow-red-100' 
                      : 'border-gray-200 hover:border-red-300'
                    }
                  `}
                  onClick={() => setActiveStep(step.number)}
                >
                  {/* Step Number */}
                  <div className={`
                    w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6
                    transition-all duration-300
                    ${activeStep === step.number
                      ? 'bg-red-500 text-white scale-110'
                      : 'bg-gray-100 text-gray-600'
                    }
                  `}>
                    <span className="text-2xl font-bold">{step.number}</span>
                  </div>

                  {/* Icon */}
                  <div className="text-5xl mb-4">
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Details List */}
                  <ul className="text-left space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-red-500 mt-1">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Step Indicator */}
                <div className="mt-4 text-center">
                  <span className={`
                    inline-block px-3 py-1 rounded-full text-xs font-medium
                    ${activeStep === step.number
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-600'
                    }
                  `}>
                    Стъпка {step.number}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* TODO: Add interactive elements like:
              - Progress bar
              - Animated transitions between steps
              - Video demonstrations
              - Interactive tooltips
              - Mobile-friendly swipe gestures
          */}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Готови да започнете?
          </p>
          <Link href="/request">
            <button className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200">
              Изпратете заявка сега
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
} 