'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Check, ShieldCheck, Truck, RefreshCw, Wrench, AlertTriangle, Clock, Phone, Video, Tool } from 'lucide-react'
import type { ProductWithRelations } from '@/types/supabase'
import { useCartStore } from '@/store/cartStore'
import { ConsultationBooking } from '@/components/ConsultationBooking/ConsultationBooking'

interface ProductInfoProps {
  product: ProductWithRelations
}

// Mock installation data - in real app, this would come from database
interface InstallationInfo {
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedTime: string
  requiredTools: string[]
  professionalRecommended: boolean
  videoGuideUrl?: string
}

const getInstallationInfo = (productName: string): InstallationInfo => {
  // Mock data based on product type - in real app, store this in database
  if (productName.toLowerCase().includes('масло') || productName.toLowerCase().includes('течност')) {
    return {
      difficulty: 'easy',
      estimatedTime: '15-30 мин',
      requiredTools: ['Гаечен ключ', 'Фуния', 'Ръкавици'],
      professionalRecommended: false
    }
  } else if (productName.toLowerCase().includes('спирачки') || productName.toLowerCase().includes('дискове')) {
    return {
      difficulty: 'hard',
      estimatedTime: '2-3 часа',
      requiredTools: ['Домкрат', 'Комплект ключове', 'Специален инструмент за спирачки', 'Динамометричен ключ'],
      professionalRecommended: true,
      videoGuideUrl: '#'
    }
  } else {
    return {
      difficulty: 'medium',
      estimatedTime: '30-60 мин',
      requiredTools: ['Основен инструментариум', 'Гаечни ключове', 'Отвертки'],
      professionalRecommended: false
    }
  }
}

/**
 * ProductInfo component - Product details with installation support and psychology-driven design
 * Features pricing, trust signals, stock status, installation guidance, and CTA
 */
export function ProductInfo({ product }: ProductInfoProps) {
  const { addItem } = useCartStore()
  const [showConsultationBooking, setShowConsultationBooking] = useState(false)
  
  // Get installation info
  const installationInfo = getInstallationInfo(product.name)
  
  // Price formatting
  const currentPrice = new Intl.NumberFormat('bg-BG', {
    style: 'currency',
    currency: 'BGN',
  }).format(product.price)

  const oldPrice = product.compare_price ? new Intl.NumberFormat('bg-BG', {
    style: 'currency',
    currency: 'BGN',
  }).format(product.compare_price) : null

  const discountPercent = product.compare_price 
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null

  // Stock status
  const isInStock = product.stock > 0
  const isLowStock = product.stock > 0 && product.stock <= 5

  // Rating (placeholder - you might want to implement reviews)
  const rating = 4.5
  const reviewCount = 23

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images?.[0]?.url || product.image_url || '',
      stock: product.stock,
      sku: product.sku
    })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-50 border-green-200'
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'hard': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return <Check className="w-4 h-4" />
      case 'medium': return <Clock className="w-4 h-4" />
      case 'hard': return <AlertTriangle className="w-4 h-4" />
      default: return <Wrench className="w-4 h-4" />
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Лесен монтаж'
      case 'medium': return 'Средна сложност'
      case 'hard': return 'Сложен монтаж'
      default: return 'Неопределен'
    }
  }

  return (
    <>
      <div className="space-y-6">
        {/* Brand Logo/Name */}
        {product.brand && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-xs font-bold text-gray-600">
                {product.brand.name.charAt(0)}
              </span>
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {product.brand.name}
            </span>
          </div>
        )}

        {/* Product Name */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            {product.name}
          </h1>
          
          {/* Short tagline/description */}
          {product.short_description && (
            <p className="text-lg text-muted-foreground mt-2">
              {product.short_description}
            </p>
          )}
        </div>

        {/* Rating & Reviews */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= rating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-sm font-medium text-foreground ml-2">
              {rating}
            </span>
          </div>
          <span className="text-sm text-muted-foreground">
            ({reviewCount} отзива)
          </span>
        </div>

        {/* Installation Difficulty & Info */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Wrench className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Информация за монтаж</h3>
            </div>
            {installationInfo.videoGuideUrl && (
              <button className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700">
                <Video className="w-3 h-3" />
                <span>Видео</span>
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${getDifficultyColor(installationInfo.difficulty)}`}>
              {getDifficultyIcon(installationInfo.difficulty)}
              <span className="text-sm font-medium">
                {getDifficultyText(installationInfo.difficulty)}
              </span>
            </div>
            
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white border border-gray-200">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {installationInfo.estimatedTime}
              </span>
            </div>
          </div>

          {/* Required Tools */}
          <div className="mb-3">
            <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center space-x-1">
              <Tool className="w-4 h-4" />
              <span>Необходими инструменти:</span>
            </h4>
            <div className="flex flex-wrap gap-1">
              {installationInfo.requiredTools.map((tool, index) => (
                <span key={index} className="bg-white text-blue-800 text-xs px-2 py-1 rounded border">
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Professional Recommendation */}
          {installationInfo.professionalRecommended && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800 mb-1">Препоръчваме професионален монтаж</p>
                  <p className="text-yellow-700">
                    За безопасност и гаранция препоръчваме монтажа да се извърши от квалифициран техник.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Professional Consultation */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
          <div className="flex items-center space-x-2 mb-3">
            <Phone className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-purple-900">Професионална консултация</h3>
          </div>
          <p className="text-sm text-purple-700 mb-3">
            Не сте сигурни дали това е правилната част? Нашите експерти ще ви помогнат безплатно!
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <button 
              onClick={() => setShowConsultationBooking(true)}
              className="flex-1 bg-purple-600 text-white text-sm py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              📞 Обади се сега
            </button>
            <button 
              onClick={() => setShowConsultationBooking(true)}
              className="flex-1 bg-white text-purple-600 border border-purple-200 text-sm py-2 px-4 rounded-lg hover:bg-purple-50 transition-colors"
            >
              💬 Чат поддръжка
            </button>
          </div>
        </div>

        {/* Price Block */}
        <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-2xl border border-red-100">
          <div className="flex items-end space-x-4">
            <div className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              {currentPrice}
            </div>
            
            {oldPrice && (
              <div className="flex flex-col items-start">
                <div className="text-lg text-muted-foreground line-through">
                  {oldPrice}
                </div>
                {discountPercent && (
                  <div className="bg-primary text-white text-sm font-bold px-2 py-1 rounded-lg">
                    -{discountPercent}%
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Savings highlight */}
          {oldPrice && discountPercent && (
            <div className="mt-2 text-sm font-medium text-green-600">
              ✨ Спестявате {new Intl.NumberFormat('bg-BG', {
                style: 'currency',
                currency: 'BGN',
              }).format(product.compare_price! - product.price)}
            </div>
          )}
        </div>

        {/* Stock Status */}
        <div className="flex items-center space-x-3">
          {isInStock ? (
            <>
              <div className="flex items-center space-x-2 text-green-600">
                <Check className="w-5 h-5" />
                <span className="font-medium">В наличност</span>
              </div>
              {isLowStock && (
                <span className="bg-orange-100 text-orange-800 text-sm font-medium px-2 py-1 rounded-lg">
                  Остават {product.stock} бр.
                </span>
              )}
            </>
          ) : (
            <div className="flex items-center space-x-2 text-red-600">
              <span className="w-5 h-5 flex items-center justify-center">✕</span>
              <span className="font-medium">Няма наличност</span>
            </div>
          )}
        </div>

        {/* Vehicle Compatibility - MVP Key Feature */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl border border-green-200">
          <div className="flex items-center space-x-2 mb-3">
            <Check className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-green-900">Съвместимост</h3>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-green-800">
              <strong>Подходящ за:</strong>
            </div>
            <div className="flex flex-wrap gap-2">
              {/* Mock compatibility data - in real app, this would come from database */}
              <span className="bg-white text-green-800 text-xs px-3 py-1 rounded-full border border-green-200">
                BMW 3 Series (2015-2020)
              </span>
              <span className="bg-white text-green-800 text-xs px-3 py-1 rounded-full border border-green-200">
                BMW 5 Series (2017-2022)
              </span>
              <span className="bg-white text-green-800 text-xs px-3 py-1 rounded-full border border-green-200">
                Mercedes C-Class (2014-2019)
              </span>
            </div>
            <div className="text-xs text-green-700 mt-2">
              💡 Не сте сигурни дали е съвместимо? Обадете се на 0888 123 456 за консултация
            </div>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="font-medium text-sm">3 години</div>
              <div className="text-xs text-muted-foreground">гаранция</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
              <Truck className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="font-medium text-sm">1-2 дни</div>
              <div className="text-xs text-muted-foreground">доставка</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="font-medium text-sm">14 дни</div>
              <div className="text-xs text-muted-foreground">връщане</div>
            </div>
          </div>
        </div>

        {/* Delivery Details - MVP Key Feature */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center space-x-2 mb-3">
            <Truck className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Доставка и плащане</h3>
          </div>
          <div className="space-y-2 text-sm text-blue-800">
            <div className="flex items-center justify-between">
              <span>🚚 София (в рамките на деня)</span>
              <span className="font-medium">Безплатно</span>
            </div>
            <div className="flex items-center justify-between">
              <span>📦 Цяла България (1-2 дни)</span>
              <span className="font-medium">8 лв.</span>
            </div>
            <div className="flex items-center justify-between">
              <span>💳 Наложен платеж</span>
              <span className="font-medium text-green-600">Поддържан</span>
            </div>
            <div className="text-xs text-blue-700 mt-2 p-2 bg-blue-100 rounded">
              🕐 Поръчайте до 14:00 ч за доставка същия ден в София
            </div>
          </div>
        </div>

        {/* MVP Primary CTA Button */}
        <motion.button
          onClick={handleAddToCart}
          disabled={!isInStock}
          className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-200 ${
            isInStock
              ? 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-lg hover:shadow-xl'
              : 'bg-border text-foreground/30 cursor-not-allowed'
          }`}
          whileHover={isInStock ? { scale: 1.02 } : {}}
          whileTap={isInStock ? { scale: 0.98 } : {}}
        >
          {isInStock ? '🛒 Поръчай сега' : 'Няма наличност'}
        </motion.button>

        {/* Secondary CTA for Direct Order */}
        {isInStock && (
          <motion.button
            onClick={() => {
              // In real app, this would redirect to order form
              window.location.href = '/order?product=' + product.slug
            }}
            className="w-full py-4 px-6 rounded-2xl font-bold text-lg bg-white border-2 border-red-600 text-red-600 hover:bg-red-50 transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            📞 Поръчай по телефон
          </motion.button>
        )}

        {/* Additional CTA Options */}
        {isInStock && (
          <div className="grid grid-cols-2 gap-3">
            <button className="py-3 px-4 border border-border rounded-xl font-medium text-foreground hover:bg-muted transition-colors flex items-center justify-center space-x-2">
              <span>💙</span>
              <span>Запази за по-късно</span>
            </button>
            <button className="py-3 px-4 border border-border rounded-xl font-medium text-foreground hover:bg-muted transition-colors flex items-center justify-center space-x-2">
              <span>📢</span>
              <span>Сподели</span>
            </button>
          </div>
        )}
      </div>

      {/* Consultation Booking Modal */}
      <ConsultationBooking
        isOpen={showConsultationBooking}
        onClose={() => setShowConsultationBooking(false)}
        productName={product.name}
      />
    </>
  )
} 