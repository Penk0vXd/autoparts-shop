'use client'

import { useState, useEffect } from 'react'

interface Testimonial {
  id: string
  name: string
  location: string
  rating: number
  comment: string
  car: string
  avatar?: string
  date: string
}

interface TestimonialsSectionProps {
  className?: string
}

/**
 * TestimonialsSection Component
 * 
 * Displays client testimonials and success stories
 * TODO: Add carousel functionality, real testimonials, and rating system
 */
export default function TestimonialsSection({ className = '' }: TestimonialsSectionProps) {
  const [currentTestimonial, setCurrentTestimonial] = useState<number>(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true)

  // TODO: Move to external data file or API
  const testimonials: Testimonial[] = [
    {
      id: 'testimonial-1',
      name: 'Иван Петров',
      location: 'София',
      rating: 5,
      comment: 'Отлично обслужване! Намериха ми точната част за BMW X3 за по-малко от 2 часа. Цената беше по-добра от всички други места.',
      car: 'BMW X3 2018',
      date: '2024-01-15'
    },
    {
      id: 'testimonial-2',
      name: 'Мария Георгиева',
      location: 'Пловдив',
      rating: 5,
      comment: 'Професионално отношение и бърза доставка. Частта беше с пълна гаранция и работи перфектно.',
      car: 'Mercedes C200 2020',
      date: '2024-01-10'
    },
    {
      id: 'testimonial-3',
      name: 'Стефан Димитров',
      location: 'Варна',
      rating: 5,
      comment: 'Експертите им са наистина компетентни. Помогнаха ми да избера най-добрата опция за моята кола.',
      car: 'Audi A4 2019',
      date: '2024-01-08'
    },
    {
      id: 'testimonial-4',
      name: 'Елена Василева',
      location: 'Бургас',
      rating: 5,
      comment: 'Бързо и качествено обслужване. Цените са конкурентни, а доставката беше в срок.',
      car: 'Volkswagen Golf 2021',
      date: '2024-01-05'
    }
  ]

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, testimonials.length])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-xl ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bg-BG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <section className={`bg-gray-50 py-16 ${className}`}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Какво казват нашите клиенти?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Реални отзиви от доволни клиенти в цяла България
          </p>
        </div>

        {/* Testimonials Container */}
        <div className="relative">
          {/* Main Testimonial */}
          <div className="bg-white rounded-lg p-8 md:p-12 shadow-lg max-w-4xl mx-auto">
            <div className="text-center">
              {/* Rating */}
              <div className="flex justify-center mb-4">
                {renderStars(testimonials[currentTestimonial].rating)}
              </div>

              {/* Quote */}
              <blockquote className="text-xl md:text-2xl text-gray-700 mb-8 italic">
                "{testimonials[currentTestimonial].comment}"
              </blockquote>

              {/* Author Info */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">
                    {testimonials[currentTestimonial].name.charAt(0)}
                  </span>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900">
                    {testimonials[currentTestimonial].name}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {testimonials[currentTestimonial].location}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {testimonials[currentTestimonial].car}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    {formatDate(testimonials[currentTestimonial].date)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentTestimonial(index)
                  setIsAutoPlaying(false)
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial
                    ? 'bg-red-500 scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => {
              setCurrentTestimonial((prev) => 
                prev === 0 ? testimonials.length - 1 : prev - 1
              )
              setIsAutoPlaying(false)
            }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={() => {
              setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
              setIsAutoPlaying(false)
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">1000+</div>
            <div className="text-gray-600">Доволни клиенти</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">4.9/5</div>
            <div className="text-gray-600">Средна оценка</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">24ч</div>
            <div className="text-gray-600">Средно време за отговор</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">98%</div>
            <div className="text-gray-600">Успешни поръчки</div>
          </div>
        </div>

        {/* TODO: Add interactive elements like:
            - Video testimonials
            - Social proof badges
            - Review submission form
            - Filter by car brand
            - Share testimonial functionality
        */}
      </div>
    </section>
  )
} 