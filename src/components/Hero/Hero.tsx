'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'

type HeroProps = {
  className?: string
}

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  color: string
}

/**
 * World-Class Hero Section - The Ultimate Auto Parts Experience
 * With spectacular effects and cutting-edge animations
 */
export function Hero({ className = '' }: HeroProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState<Particle[]>([])
  const [typedText, setTypedText] = useState('')
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const words = ['автомобил', 'кола', 'превозно средство', 'машина']
  const fullText = 'за вашия '

  useEffect(() => {
    setIsLoaded(true)
    initParticles()
    
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Initialize particle system
  const initParticles = () => {
    const newParticles: Particle[] = []
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        opacity: Math.random() * 0.3 + 0.1,
        color: `rgba(${Math.random() > 0.5 ? '211, 47, 47' : '156, 163, 175'}, ${Math.random() * 0.3 + 0.1})`
      })
    }
    setParticles(newParticles)
  }

  // Animate particles
  useEffect(() => {
    const animateParticles = () => {
      setParticles(prevParticles => 
        prevParticles.map(particle => {
          let newX = particle.x + particle.speedX
          let newY = particle.y + particle.speedY
          
          // Handle boundary wrapping
          if (newX > window.innerWidth) {
            newX = 0
          }
          if (newX < 0) {
            newX = window.innerWidth
          }
          if (newY > window.innerHeight) {
            newY = 0
          }
          if (newY < 0) {
            newY = window.innerHeight
          }
          
          return {
            ...particle,
            x: newX,
            y: newY
          }
        })
      )
    }

    const interval = setInterval(animateParticles, 50)
    return () => clearInterval(interval)
  }, [])

  // Typing animation effect
  useEffect(() => {
    const currentWord = words[currentWordIndex]
    let currentIndex = 0
    
    const typeWriter = () => {
      if (currentIndex < currentWord.length) {
        setTypedText(fullText + currentWord.slice(0, currentIndex + 1))
        currentIndex++
        setTimeout(typeWriter, 150)
      } else {
        setTimeout(() => {
          const deleteTimer = () => {
            if (currentIndex > 0) {
              setTypedText(fullText + currentWord.slice(0, currentIndex - 1))
              currentIndex--
              setTimeout(deleteTimer, 100)
            } else {
              setCurrentWordIndex((prev) => (prev + 1) % words.length)
            }
          }
          setTimeout(deleteTimer, 2000)
        }, 1000)
      }
    }

    const timer = setTimeout(typeWriter, 1000)
    return () => clearTimeout(timer)
  }, [currentWordIndex])

  // Scroll to vehicle selection section when primary CTA is clicked
  const handleVehicleSelectionClick = () => {
    const vehicleSection = document.getElementById('vehicle-selection')
    if (vehicleSection) {
      vehicleSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className={`relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-red-50/30 to-white ${className}`}>
      {/* Particle System Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'transparent',
          zIndex: 1
        }}
      />
      
      {/* Animated Particles */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        {particles.map((particle, index) => (
          <div
            key={index}
            className="absolute rounded-full animate-pulse"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              opacity: particle.opacity,
              transform: `translate(-50%, -50%) scale(${1 + Math.sin(Date.now() * 0.001 + index) * 0.2})`
            }}
          />
        ))}
      </div>

      {/* Animated Background Elements with Parallax */}
      <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 3 }}>
        {/* Dynamic Gradient Orbs with 3D Transform */}
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-red-100/40 to-red-200/40 rounded-full blur-3xl animate-pulse"
          style={{
            left: mousePosition.x * 0.02 + '%',
            top: mousePosition.y * 0.02 + '%',
            transform: `translate(-50%, -50%) translateZ(${scrollY * 0.5}px) rotateX(${mousePosition.y * 0.01}deg) rotateY(${mousePosition.x * 0.01}deg)`,
            animation: 'float 20s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute w-80 h-80 bg-gradient-to-r from-red-200/30 to-red-300/30 rounded-full blur-2xl animate-pulse"
          style={{
            right: mousePosition.x * 0.015 + '%',
            bottom: mousePosition.y * 0.015 + '%',
            transform: `translate(50%, 50%) translateZ(${scrollY * 0.3}px) rotateX(${-mousePosition.y * 0.008}deg) rotateY(${-mousePosition.x * 0.008}deg)`,
            animation: 'float 25s ease-in-out infinite reverse'
          }}
        />

        {/* Morphing Shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-red-400/20 to-red-600/20 rounded-full blur-xl animate-morph" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-xl animate-morph-reverse" />
        
        {/* Geometric Shapes */}
        <div className="absolute top-1/3 left-10 w-4 h-4 bg-red-500/30 rotate-45 animate-spin-slow" />
        <div className="absolute bottom-1/3 right-10 w-6 h-6 bg-blue-500/30 rounded-full animate-bounce-slow" />
        
        {/* Subtle Grid Pattern with Parallax */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(211, 47, 47, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(211, 47, 47, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            transform: `translateY(${scrollY * 0.2}px)`
          }}
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Premium Badge with 3D Effect */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-full text-sm font-medium text-red-700 mb-8 shadow-lg transform transition-all duration-1000 hover:scale-105 hover:shadow-xl ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span>Над 100,000 доволни клиенти в България</span>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </div>

          {/* Hero Headline with Gradient Effect and 3D Transform */}
          <h1 className={`text-4xl md:text-7xl font-black leading-tight mb-6 transform transition-all duration-1000 delay-300 hover:scale-105 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <span className="bg-gradient-to-r from-gray-900 via-red-800 to-gray-900 bg-clip-text text-transparent">
              Намерете точната част
            </span>
            <br/>
            <span className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 bg-clip-text text-transparent animate-pulse">
              {typedText}
            </span>
            <span className="animate-blink">|</span>
          </h1>
          
          {/* Subheadline with Wave Effect */}
          <div className={`text-xl md:text-2xl text-gray-600 mb-4 max-w-4xl mx-auto transform transition-all duration-1000 delay-500 hover:text-red-600 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            Изберете марка, модел и година за <span className="text-red-600 font-semibold animate-pulse">100% съвместимост</span>
          </div>

          {/* Trust Line with Floating Effect */}
          <div className={`text-lg text-gray-500 mb-12 transform transition-all duration-1000 delay-700 animate-float-subtle ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            Експресна доставка • Гарантирано качество • Българска поддръжка
          </div>
          
          {/* CTA Buttons with Advanced Effects */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-16 transform transition-all duration-1000 delay-900 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {/* Primary CTA - Masterpiece Button with Glow */}
            <button
              onClick={handleVehicleSelectionClick}
              className="group relative w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-10 py-5 text-lg rounded-full shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-red-500/50 focus:outline-none focus:ring-4 focus:ring-red-500/50 active:scale-95 overflow-hidden animate-glow"
              style={{
                boxShadow: '0 20px 40px rgba(211, 47, 47, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset, 0 0 20px rgba(211, 47, 47, 0.5)'
              }}
              aria-label="Изберете вашия автомобил за намиране на точните части"
            >
              {/* Button Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:animate-shine" />
              
              {/* Animated Border */}
              <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-spin-slow" />
              
              {/* Icon with Rotation */}
              <div className="flex items-center justify-center gap-3 relative z-10">
                <svg className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Изберете вашия автомобил</span>
              </div>
              
              {/* Ripple Effect */}
              <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-active:scale-100 transition-transform duration-300" />
            </button>
            
            {/* Secondary CTA - Glass Morphism with Distortion */}
            <Link 
              href="/catalog"
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 text-lg font-semibold text-red-600 bg-white/80 backdrop-blur-sm border-2 border-red-200 rounded-full shadow-xl hover:bg-white hover:border-red-300 hover:shadow-2xl transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500/50 active:scale-95 overflow-hidden"
              style={{
                boxShadow: '0 8px 32px rgba(211, 47, 47, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2) inset'
              }}
              aria-label="Разгледайте пълния каталог с авточасти"
            >
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-50/50 to-red-100/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="relative z-10">Виж каталога</span>
            </Link>
          </div>
          
          {/* Trust Indicators with 3D Hover Effects */}
          <div className={`flex flex-col sm:flex-row gap-8 justify-center items-center text-gray-600 transform transition-all duration-1000 delay-1100 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex items-center gap-3 group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-red-500/50 transition-all duration-300 animate-pulse-slow">
                <svg className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors duration-300">Надеждна доставка</div>
                <div className="text-sm text-gray-500">До 24 часа в София</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-green-500/50 transition-all duration-300 animate-pulse-slow">
                <svg className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors duration-300">Проверено качество</div>
                <div className="text-sm text-gray-500">Гарантия за всички части</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300 animate-pulse-slow">
                <svg className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">Поддръжка 24/7</div>
                <div className="text-sm text-gray-500">На български език</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator with Enhanced Animation */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="flex flex-col items-center gap-2 text-gray-400 cursor-pointer group hover:text-red-600 transition-colors duration-300">
          <span className="text-sm font-medium animate-pulse">Продължете</span>
          <div className="relative">
            <svg className="w-6 h-6 animate-bounce group-hover:animate-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <div className="absolute inset-0 bg-red-500 rounded-full opacity-0 group-hover:opacity-20 animate-ping" />
          </div>
        </div>
      </div>
    </section>
  )
} 