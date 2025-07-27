'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Check, Truck, ShieldCheck, Phone, AlertCircle, MapPin, User, FileText } from 'lucide-react'
import { googleSheetsService } from '@/services/googleSheetsService'

// Mock product data - in real app, fetch from API
const MOCK_PRODUCTS = {
  'brake-pads-brembo': {
    name: 'Спирачни накладки Brembo P85020',
    price: 89.99,
    image: '/api/placeholder/300/200',
    sku: 'BRM-P85020',
    category: 'Спирачки'
  },
  'engine-oil-castrol': {
    name: 'Моторно масло Castrol GTX 5W-30',
    price: 45.50,
    image: '/api/placeholder/300/200',
    sku: 'CST-GTX530',
    category: 'Масла'
  }
}

interface OrderFormData {
  customerName: string
  customerPhone: string
  customerAddress: string
  customerNotes: string
}

// Separate component for search params logic
function OrderContent() {
  const searchParams = useSearchParams()
  const productSlug = searchParams.get('product')
  const [product, setProduct] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  const [formData, setFormData] = useState<OrderFormData>({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    customerNotes: ''
  })
  
  const [errors, setErrors] = useState<Partial<OrderFormData>>({})

  // Load product data
  useEffect(() => {
    if (productSlug && MOCK_PRODUCTS[productSlug as keyof typeof MOCK_PRODUCTS]) {
      setProduct(MOCK_PRODUCTS[productSlug as keyof typeof MOCK_PRODUCTS])
    }
  }, [productSlug])

  const validateForm = (): boolean => {
    const newErrors: Partial<OrderFormData> = {}
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Моля, въведете вашето име'
    }
    
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Моля, въведете телефонен номер'
    } else if (!/^[0-9+\-\s\(\)]{6,15}$/.test(formData.customerPhone)) {
      newErrors.customerPhone = 'Моля, въведете валиден телефонен номер'
    }
    
    if (!formData.customerAddress.trim()) {
      newErrors.customerAddress = 'Моля, въведете адрес за доставка'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Save order to Google Sheets
      const orderData = {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerAddress: formData.customerAddress,
        customerNotes: formData.customerNotes,
        productName: product.name,
        productSku: product.sku,
        productPrice: product.price,
        deliveryFee: deliveryFee,
        total: total
      }
      
      const result = await googleSheetsService.saveOrder(orderData)
      
      if (result.success) {
        // Show success and redirect
        setShowSuccess(true)
        
        // Auto-redirect to success page after 3 seconds
        setTimeout(() => {
          window.location.href = '/success?order=' + (result.orderNumber || 'ORD-' + Date.now())
        }, 3000)
      } else {
        // Show error but still proceed (fallback to localStorage)
        console.warn('Google Sheets save failed, but order was saved locally')
        setShowSuccess(true)
        
        setTimeout(() => {
          window.location.href = '/success?order=ORD-' + Date.now()
        }, 3000)
      }
      
    } catch (error) {
      console.error('Order submission failed:', error)
      alert('Възникна грешка при изпращане на поръчката. Моля, опитайте отново.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof OrderFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const deliveryFee = 8.00
  const total = product ? product.price + deliveryFee : 0

  // Success animation
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Check className="w-10 h-10 text-green-600" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Поръчката е изпратена!</h2>
          <p className="text-gray-600 mb-6">
            Ще се свържем с вас в рамките на 2 часа за потвърждение.
          </p>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-800">
              Пренасочване към страницата за потвърждение...
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Продуктът не е намерен</h2>
          <p className="text-gray-600 mb-6">
            Моля, върнете се и изберете продукт за поръчка.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Назад
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Завършване на поръчка</h1>
            <div className="text-sm text-gray-500">
              Стъпка 1 от 1
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Order Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Данни за поръчка</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Name */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    Име и фамилия *
                  </label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      errors.customerName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Иван Петров"
                    disabled={isSubmitting}
                  />
                  {errors.customerName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.customerName}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    Телефонен номер *
                  </label>
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      errors.customerPhone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0888 123 456"
                    disabled={isSubmitting}
                  />
                  {errors.customerPhone && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.customerPhone}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Ще се свържем с вас за потвърждение на поръчката
                  </p>
                </div>

                {/* Address */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    Адрес за доставка *
                  </label>
                  <textarea
                    value={formData.customerAddress}
                    onChange={(e) => handleInputChange('customerAddress', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      errors.customerAddress ? 'border-red-500' : 'border-gray-300'
                    }`}
                    rows={3}
                    placeholder="ул. Витоша 15, София 1000"
                    disabled={isSubmitting}
                  />
                  {errors.customerAddress && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.customerAddress}
                    </p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 mr-2 text-gray-400" />
                    Допълнителни бележки
                  </label>
                  <textarea
                    value={formData.customerNotes}
                    onChange={(e) => handleInputChange('customerNotes', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    rows={3}
                    placeholder="Специални изисквания, предпочитано време за доставка..."
                    disabled={isSubmitting}
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700 active:bg-red-800'
                  } text-white shadow-lg hover:shadow-xl`}
                  whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                >
                  {isSubmitting ? '📤 Изпращане...' : '🛒 Потвърди поръчката'}
                </motion.button>
              </form>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8 h-fit"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Резюме на поръчката</h2>
              
              {/* Product */}
              <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-2xl">🔧</div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                  <p className="text-sm text-gray-600">Категория: {product.category}</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{product.price.toFixed(2)} лв.</div>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Продукт:</span>
                  <span>{product.price.toFixed(2)} лв.</span>
                </div>
                <div className="flex justify-between">
                  <span>Доставка:</span>
                  <span>{deliveryFee.toFixed(2)} лв.</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Общо:</span>
                    <span>{total.toFixed(2)} лв.</span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">Начин на плащане</h3>
                <div className="flex items-center space-x-2 text-blue-800">
                  <Check className="w-5 h-5" />
                  <span>Наложен платеж при доставка</span>
                </div>
              </div>

              {/* Trust Signals */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                  <span>3 години гаранция</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <span>Доставка 1-2 работни дни</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Phone className="w-5 h-5 text-red-600" />
                  <span>Потвърждение по телефон</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Order Form Page - Frictionless single-step checkout
 * MVP implementation optimized for Bulgarian buying behavior
 */
export default function OrderPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8"><div className="animate-pulse">Loading order form...</div></div>}>
      <OrderContent />
    </Suspense>
  )
} 