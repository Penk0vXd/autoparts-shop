'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Check } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useHydration } from '@/hooks/useHydration'

interface CartIconProps {
  className?: string
  showBadge?: boolean
}

export function CartIcon({ className = '', showBadge = true }: CartIconProps) {
  const [showSuccess, setShowSuccess] = useState(false)
  const hydrated = useHydration()
  const { getTotalItems } = useCartStore()
  const cartItemsCount = hydrated ? getTotalItems() : 0

  // Listen for cart changes to show success animation
  useEffect(() => {
    if (cartItemsCount > 0) {
      setShowSuccess(true)
      const timer = setTimeout(() => setShowSuccess(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [cartItemsCount])

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence mode="wait">
        {showSuccess ? (
          <motion.div
            key="success"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-5 h-5 text-green-600"
          >
            <Check className="w-5 h-5" />
          </motion.div>
        ) : (
          <motion.div
            key="cart"
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -180 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <ShoppingCart className="w-5 h-5" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {showBadge && cartItemsCount > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-medium"
        >
          {cartItemsCount > 99 ? '99+' : cartItemsCount}
        </motion.span>
      )}
    </div>
  )
} 