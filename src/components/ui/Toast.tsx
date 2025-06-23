'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, ShoppingCart } from 'lucide-react'

export interface ToastData {
  id: string
  type: 'success' | 'error' | 'info'
  title: string
  description?: string
  duration?: number
}

interface ToastProps {
  toast: ToastData
  onRemove: (id: string) => void
}

export function Toast({ toast, onRemove }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id)
    }, toast.duration || 4000)

    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onRemove])

  const icons = {
    success: <Check className="w-5 h-5 text-green-600" />,
    error: <X className="w-5 h-5 text-red-600" />,
    info: <ShoppingCart className="w-5 h-5 text-blue-600" />
  }

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200'
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`
        relative flex w-full max-w-sm rounded-lg border p-4 shadow-lg
        ${bgColors[toast.type]}
      `}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          {icons[toast.type]}
        </div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-medium text-gray-900">
            {toast.title}
          </p>
          {toast.description && (
            <p className="mt-1 text-sm text-gray-500">
              {toast.description}
            </p>
          )}
        </div>
        <div className="ml-4 flex flex-shrink-0">
          <button
            className="inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={() => onRemove(toast.id)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// Toast container and context
let toastCounter = 0
const toastCallbacks = new Set<(toasts: ToastData[]) => void>()
let toasts: ToastData[] = []

function emitChange() {
  toastCallbacks.forEach((callback) => callback(toasts))
}

export function addToast(toast: Omit<ToastData, 'id'>): string {
  const id = (++toastCounter).toString()
  const newToast = { ...toast, id }
  toasts = [newToast, ...toasts]
  emitChange()
  return id
}

export function removeToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id)
  emitChange()
}

export function useToasts() {
  const [toastList, setToastList] = useState<ToastData[]>(toasts)

  useEffect(() => {
    const callback = (newToasts: ToastData[]) => setToastList(newToasts)
    toastCallbacks.add(callback)
    return () => {
      toastCallbacks.delete(callback)
    }
  }, [])

  return toastList
}

export function ToastContainer() {
  const toastList = useToasts()

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-4">
      <AnimatePresence>
        {toastList.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  )
} 