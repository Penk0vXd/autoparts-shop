'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cartStore'
import { useCheckoutStore } from '@/store/checkoutStore'
import { Download } from 'lucide-react'

type Order = {
  id: string
  status: string
  total: number
  created_at: string
  shipping_details: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
  }
  billing_details: {
    companyName?: string
    vatNumber?: string
  }
}

export default function SuccessPage() {
  const t = useTranslations('checkout')
  const router = useRouter()
  const searchParams = useSearchParams()
  const { clearCart } = useCartStore()
  const { clearForm } = useCheckoutStore()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    
    if (!sessionId) {
      router.push('/cart')
      return
    }

    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/by-session/${sessionId}`)
        
        if (!response.ok) throw new Error('Failed to fetch order')
        
        const data = await response.json()
        setOrder(data)
        
        // Clear cart and form data
        clearCart()
        clearForm()
      } catch (err) {
        setError('Failed to load order details')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [searchParams, router, clearCart, clearForm])

  const handleDownloadInvoice = async () => {
    if (!order) return

    try {
      const response = await fetch(`/api/orders/${order.id}/invoice`)
      
      if (!response.ok) throw new Error('Failed to generate invoice')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice-${order.id}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Invoice download error:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('error')}</h1>
          <Button onClick={() => router.push('/cart')}>
            {t('backToCart')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">{t('successTitle')}</h1>
          <p className="text-muted-foreground">{t('successMessage')}</p>
        </div>

        <Card className="p-6 mb-8">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">{t('orderNumber')}</span>
              <span>{order.id}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">{t('orderDate')}</span>
              <span>
                {new Date(order.created_at).toLocaleDateString('bg-BG')}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">{t('orderTotal')}</span>
              <span>
                {new Intl.NumberFormat('bg-BG', {
                  style: 'currency',
                  currency: 'BGN'
                }).format(order.total)}
              </span>
            </div>
          </div>
        </Card>

        <div className="text-center">
          <Button onClick={handleDownloadInvoice}>
            <Download className="h-4 w-4 mr-2" />
            {t('downloadInvoice')}
          </Button>
        </div>
      </div>
    </div>
  )
} 