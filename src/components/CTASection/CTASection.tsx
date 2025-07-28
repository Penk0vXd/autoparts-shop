'use client'

import Link from 'next/link'
import { useState } from 'react'

interface CTASectionProps {
  className?: string
}

/**
 * CTASection Component
 * 
 * Displays compelling call-to-action with multiple options
 * TODO: Add A/B testing, conversion tracking, and dynamic CTAs
 */
export default function CTASection({ className = '' }: CTASectionProps) {
  const [isHovered, setIsHovered] = useState<boolean>(false)

  return (
    <section className={`bg-gradient-to-r from-red-600 to-red-700 py-16 ${className}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center">
          {/* Main CTA Content */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Готови да намерим вашата част?
            </h2>
            <p className="text-red-100 text-lg max-w-2xl mx-auto mb-8">
              Изпратете заявка сега и получете експертна консултация безплатно
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            {/* Primary CTA */}
            <Link
              href="/request"
              className={`
                inline-flex items-center justify-center gap-3 px-8 py-4 
                bg-white text-red-600 font-bold text-lg rounded-lg 
                shadow-lg hover:shadow-xl transform transition-all duration-300
                hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50
                ${isHovered ? 'animate-pulse' : ''}
              `}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <span className="text-2xl">🚀</span>
              <span>Изпратете заявка сега</span>
            </Link>

            {/* Secondary CTA */}
            <a
              href="tel:+359888123456"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent text-white font-semibold text-lg border-2 border-white rounded-lg hover:bg-white hover:text-red-600 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50"
            >
              <span className="text-2xl">📞</span>
              <span>Позвънете сега</span>
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-white/90 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Безплатна консултация</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Отговор до 2 часа</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Гарантирано качество</span>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold text-white mb-4">
              Защо да изберете нас?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white/90">
              <div className="text-center">
                <div className="text-3xl mb-2">⚡</div>
                <h4 className="font-semibold mb-2">Бърз отговор</h4>
                <p className="text-sm">Ще получите отговор до 2 часа в работни дни</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🎯</div>
                <h4 className="font-semibold mb-2">Точна част</h4>
                <p className="text-sm">100% съвместимост за вашия автомобил</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">💰</div>
                <h4 className="font-semibold mb-2">Най-добра цена</h4>
                <p className="text-sm">Конкурентни цени за всички части</p>
              </div>
            </div>
          </div>
        </div>

        {/* TODO: Add interactive elements like:
            - Countdown timer for urgency
            - Social proof notifications
            - Exit intent popup
            - Progressive disclosure
            - Mobile-specific CTAs
        */}
      </div>
    </section>
  )
} 