'use client'

import React, { useState, useRef } from 'react'
import { ProductCard } from './ProductCard'
import { 
  ProductCardRef, 
  ProductCardData, 
  ProductCardColorScheme, 
  ProductCardSize,
  ProductCardBorderRadius,
  ProductCardShadowIntensity,
  ProductCardHoverEffect,
  ProductCardImageAspectRatio
} from '@/types/product-card'
import { EXAMPLE_PRODUCT_DATA } from '@/data/example-product-data'

/**
 * Product Card Demo Component
 * 
 * Interactive demonstration of the Product Card component with various
 * configurations, states, and use cases. Perfect for testing and showcasing.
 */
export function ProductCardDemo() {
  const [selectedProduct, setSelectedProduct] = useState<ProductCardData>(EXAMPLE_PRODUCT_DATA[0])
  const [lastAction, setLastAction] = useState<string>('')
  const [colorScheme, setColorScheme] = useState<ProductCardColorScheme>('default')
  const [size, setSize] = useState<ProductCardSize>('md')
  const [borderRadius, setBorderRadius] = useState<ProductCardBorderRadius>('md')
  const [shadowIntensity, setShadowIntensity] = useState<ProductCardShadowIntensity>('md')
  const [hoverEffect, setHoverEffect] = useState<ProductCardHoverEffect>('lift')
  const [imageAspectRatio, setImageAspectRatio] = useState<ProductCardImageAspectRatio>('square')
  
  // Feature toggles
  const [showQuickActions, setShowQuickActions] = useState(true)
  const [showCompatibility, setShowCompatibility] = useState(true)
  const [showRating, setShowRating] = useState(true)
  const [showBrand, setShowBrand] = useState(true)
  const [showAvailability, setShowAvailability] = useState(true)
  const [showInstallments, setShowInstallments] = useState(false)
  const [showLocalPickup, setShowLocalPickup] = useState(false)
  const [showBadges, setShowBadges] = useState(true)
  const [showQuickView, setShowQuickView] = useState(true)
  const [showAddToCart, setShowAddToCart] = useState(true)
  const [enableHover, setEnableHover] = useState(true)
  const [enableLazyLoading, setEnableLazyLoading] = useState(true)
  
  // State
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isInCart, setIsInCart] = useState(false)
  const [maxNameLines, setMaxNameLines] = useState(2)
  const [maxDescriptionLines, setMaxDescriptionLines] = useState(3)
  
  const cardRef = useRef<ProductCardRef>(null)
  
  // Event handlers
  const handleViewDetails = (product: ProductCardData) => {
    setLastAction(`View Details clicked for: ${product.name}`)
    console.log('View Details:', product)
  }
  
  const handleAddToCart = (product: ProductCardData) => {
    setLastAction(`Add to Cart clicked for: ${product.name}`)
    setIsInCart(true)
    console.log('Add to Cart:', product)
  }
  
  const handleAddToWishlist = (product: ProductCardData) => {
    setLastAction(`Add to Wishlist clicked for: ${product.name}`)
    setIsInWishlist(!isInWishlist)
    console.log('Add to Wishlist:', product)
  }
  
  const handleQuickView = (product: ProductCardData) => {
    setLastAction(`Quick View clicked for: ${product.name}`)
    console.log('Quick View:', product)
  }
  
  const handleCompatibilityCheck = (product: ProductCardData) => {
    setLastAction(`Compatibility Check clicked for: ${product.name}`)
    console.log('Compatibility Check:', product)
  }
  
  // Control functions
  const handleRefresh = () => {
    cardRef.current?.refresh()
    setLastAction('Card refreshed')
  }
  
  const handleFocus = () => {
    cardRef.current?.focus()
    setLastAction('Card focused')
  }
  
  const handleValidate = () => {
    const validation = cardRef.current?.validate()
    setLastAction(`Validation result: ${validation?.isValid ? 'Valid' : 'Invalid'}`)
  }
  
  const handleGetAnalytics = () => {
    const analytics = cardRef.current?.getAnalytics()
    setLastAction(`Analytics: ${analytics?.impressions} impressions, ${analytics?.clicks} clicks`)
  }
  
  const handleTrackEvent = () => {
    cardRef.current?.trackEvent({
      type: 'click',
      timestamp: Date.now(),
      productId: selectedProduct.id
    })
    setLastAction('Event tracked')
  }
  
  // Get available products by category
  const getProductsByCategory = (category: string) => {
    return EXAMPLE_PRODUCT_DATA.filter(p => p.category.id === category)
  }
  
  // Get products by availability
  const getProductsByAvailability = (status: string) => {
    return EXAMPLE_PRODUCT_DATA.filter(p => p.availability.status === status)
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Product Card Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Демонстрация на Product Card компонента с различни конфигурации и състояния.
          </p>
        </div>
        
        {/* Configuration Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Конфигурация
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Product Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Продукт
              </label>
              <select
                value={selectedProduct.id}
                onChange={(e) => {
                  const product = EXAMPLE_PRODUCT_DATA.find(p => p.id === e.target.value)
                  if (product) setSelectedProduct(product)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                {EXAMPLE_PRODUCT_DATA.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Color Scheme */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Цветова схема
              </label>
              <select
                value={colorScheme}
                onChange={(e) => setColorScheme(e.target.value as ProductCardColorScheme)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="default">Default</option>
                <option value="premium">Premium</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>
            
            {/* Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Размер
              </label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value as ProductCardSize)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </div>
            
            {/* Border Radius */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Радиус на ъглите
              </label>
              <select
                value={borderRadius}
                onChange={(e) => setBorderRadius(e.target.value as ProductCardBorderRadius)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
                <option value="xl">Extra Large</option>
              </select>
            </div>
            
            {/* Shadow Intensity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Интензивност на сянката
              </label>
              <select
                value={shadowIntensity}
                onChange={(e) => setShadowIntensity(e.target.value as ProductCardShadowIntensity)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </div>
            
            {/* Hover Effect */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hover ефект
              </label>
              <select
                value={hoverEffect}
                onChange={(e) => setHoverEffect(e.target.value as ProductCardHoverEffect)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="lift">Lift</option>
                <option value="zoom">Zoom</option>
                <option value="glow">Glow</option>
                <option value="none">None</option>
              </select>
            </div>
            
            {/* Image Aspect Ratio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Пропорции на изображението
              </label>
              <select
                value={imageAspectRatio}
                onChange={(e) => setImageAspectRatio(e.target.value as ProductCardImageAspectRatio)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="square">Square (1:1)</option>
                <option value="4:3">4:3</option>
                <option value="16:9">16:9</option>
                <option value="3:2">3:2</option>
              </select>
            </div>
            
            {/* Max Name Lines */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Максимални редове за име
              </label>
              <select
                value={maxNameLines}
                onChange={(e) => setMaxNameLines(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
          </div>
          
          {/* Feature Toggles */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Функции
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showQuickActions}
                  onChange={(e) => setShowQuickActions(e.target.checked)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Бързи действия</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showCompatibility}
                  onChange={(e) => setShowCompatibility(e.target.checked)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Съвместимост</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showRating}
                  onChange={(e) => setShowRating(e.target.checked)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Оценка</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showBrand}
                  onChange={(e) => setShowBrand(e.target.checked)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Марка</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showAvailability}
                  onChange={(e) => setShowAvailability(e.target.checked)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Наличност</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showInstallments}
                  onChange={(e) => setShowInstallments(e.target.checked)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Вноски</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showLocalPickup}
                  onChange={(e) => setShowLocalPickup(e.target.checked)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Вземане на място</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showBadges}
                  onChange={(e) => setShowBadges(e.target.checked)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Значки</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showQuickView}
                  onChange={(e) => setShowQuickView(e.target.checked)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Бърз преглед</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showAddToCart}
                  onChange={(e) => setShowAddToCart(e.target.checked)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Добави в количката</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={enableHover}
                  onChange={(e) => setEnableHover(e.target.checked)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Hover ефекти</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={enableLazyLoading}
                  onChange={(e) => setEnableLazyLoading(e.target.checked)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Lazy loading</span>
              </label>
            </div>
          </div>
        </div>
        
        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Контроли
          </h2>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
            >
              Обнови
            </button>
            
            <button
              onClick={handleFocus}
              className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors"
            >
              Фокусирай
            </button>
            
            <button
              onClick={handleValidate}
              className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-md transition-colors"
            >
              Валидирай
            </button>
            
            <button
              onClick={handleGetAnalytics}
              className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-md transition-colors"
            >
              Аналитика
            </button>
            
            <button
              onClick={handleTrackEvent}
              className="px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-md transition-colors"
            >
              Проследи събитие
            </button>
            
            <button
              onClick={() => setIsInWishlist(!isInWishlist)}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors"
            >
              {isInWishlist ? 'Премахни от желания' : 'Добави в желания'}
            </button>
            
            <button
              onClick={() => setIsInCart(!isInCart)}
              className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-md transition-colors"
            >
              {isInCart ? 'Премахни от количката' : 'Добави в количката'}
            </button>
          </div>
        </div>
        
        {/* Product Card Display */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Product Card
          </h2>
          
          <div className="flex justify-center">
            <div className="w-full max-w-sm">
              <ProductCard
                ref={cardRef}
                product={selectedProduct}
                onViewDetails={handleViewDetails}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                onQuickView={handleQuickView}
                onCompatibilityCheck={handleCompatibilityCheck}
                colorScheme={colorScheme}
                size={size}
                borderRadius={borderRadius}
                shadowIntensity={shadowIntensity}
                hoverEffect={hoverEffect}
                imageAspectRatio={imageAspectRatio}
                showQuickActions={showQuickActions}
                showCompatibility={showCompatibility}
                showRating={showRating}
                showBrand={showBrand}
                showAvailability={showAvailability}
                showInstallments={showInstallments}
                showLocalPickup={showLocalPickup}
                showBadges={showBadges}
                showQuickView={showQuickView}
                showAddToCart={showAddToCart}
                enableHover={enableHover}
                enableLazyLoading={enableLazyLoading}
                isInWishlist={isInWishlist}
                isInCart={isInCart}
                maxNameLines={maxNameLines}
                maxDescriptionLines={maxDescriptionLines}
                priority={true}
              />
            </div>
          </div>
        </div>
        
        {/* Status Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Състояние
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Last Action */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">
                Последно действие
              </h3>
              <div className="bg-gray-50 rounded-md p-4">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                  {lastAction || 'Няма действия'}
                </pre>
              </div>
            </div>
            
            {/* Product Info */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">
                Информация за продукта
              </h3>
              <div className="bg-gray-50 rounded-md p-4">
                <div className="space-y-2 text-sm">
                  <div><strong>Име:</strong> {selectedProduct.name}</div>
                  <div><strong>Цена:</strong> {selectedProduct.price.current} лв.</div>
                  <div><strong>Марка:</strong> {selectedProduct.brand.name}</div>
                  <div><strong>Наличност:</strong> {selectedProduct.availability?.inStockText || 'Неизвестна'}</div>
                  <div><strong>Оценка:</strong> {selectedProduct.rating?.average || 'N/A'}</div>
                  <div><strong>В желания:</strong> {isInWishlist ? 'Да' : 'Не'}</div>
                  <div><strong>В количката:</strong> {isInCart ? 'Да' : 'Не'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Grid Examples */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Примери за различни продукти
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {EXAMPLE_PRODUCT_DATA.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={handleViewDetails}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                onQuickView={handleQuickView}
                onCompatibilityCheck={handleCompatibilityCheck}
                size="md"
                showQuickActions={true}
                showCompatibility={true}
                showRating={true}
                showBrand={true}
                showAvailability={true}
                showBadges={true}
                showQuickView={true}
                enableHover={true}
                enableLazyLoading={true}
              />
            ))}
          </div>
        </div>
        
        {/* Usage Examples */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Примери за употреба
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Основна употреба
              </h3>
              <pre className="bg-gray-50 rounded-md p-4 text-sm overflow-x-auto">
{`import { ProductCard } from '@/components/ProductCard'

function ProductCatalog() {
  const handleViewDetails = (product) => {
    router.push(\`/products/\${product.slug}\`)
  }
  
  const handleAddToCart = (product) => {
    // Add to cart logic
    console.log('Added to cart:', product)
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onViewDetails={handleViewDetails}
          onAddToCart={handleAddToCart}
          showQuickActions={true}
          showCompatibility={true}
          showRating={true}
          showBrand={true}
          showAvailability={true}
        />
      ))}
    </div>
  )
}`}
              </pre>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                С референция
              </h3>
              <pre className="bg-gray-50 rounded-md p-4 text-sm overflow-x-auto">
{`import { useRef } from 'react'
import { ProductCard, ProductCardRef } from '@/components/ProductCard'

function ProductPage() {
  const cardRef = useRef<ProductCardRef>(null)
  
  const handleRefresh = () => {
    cardRef.current?.refresh()
  }
  
  const handleTrackEvent = () => {
    cardRef.current?.trackEvent({
      type: 'click',
      timestamp: Date.now(),
      productId: product.id
    })
  }
  
  return (
    <ProductCard
      ref={cardRef}
      product={product}
      onViewDetails={handleViewDetails}
      colorScheme="premium"
      size="lg"
      hoverEffect="lift"
    />
  )
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCardDemo 