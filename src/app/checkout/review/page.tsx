'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cartStore'
import { useCheckoutStore } from '@/store/checkoutStore'
import { createCheckoutSession } from '@/app/actions/createCheckoutSession'

export default function ReviewPage() {
  const t = useTranslations('checkout')
  const router = useRouter()
  const { items, getTotal } = useCartStore()
  const { form } = useCheckoutStore()

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [items, router])

  const handlePayment = async () => {
    try {
      const url = await createCheckoutSession({
        items,
        ...form
      })
      
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Payment error:', error)
    }
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">{t('reviewTitle')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Details */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">{t('shippingDetails')}</h2>
            <div className="space-y-2">
              <p>{form.shipping.firstName} {form.shipping.lastName}</p>
              <p>{form.shipping.email}</p>
              <p>{form.shipping.phone}</p>
              <p>{form.shipping.address}</p>
              <p>{form.shipping.city}, {form.shipping.postalCode}</p>
            </div>
          </Card>

          {/* Billing Details */}
          {form.billing.companyName && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">{t('billingDetails')}</h2>
              <div className="space-y-2">
                <p>{form.billing.companyName}</p>
                {form.billing.vatNumber && (
                  <p>{t('vat')}: {form.billing.vatNumber}</p>
                )}
              </div>
            </Card>
          )}

          {/* Order Items */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">{t('orderItems')}</h2>
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.name} × {item.qty}
                  </span>
                  <span>
                    {new Intl.NumberFormat('bg-BG', {
                      style: 'currency',
                      currency: 'BGN'
                    }).format(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">{t('orderSummary')}</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>{t('subtotal')}</span>
                <span>
                  {new Intl.NumberFormat('bg-BG', {
                    style: 'currency',
                    currency: 'BGN'
                  }).format(getTotal())}
                </span>
              </div>

              <div className="flex justify-between">
                <span>{t('shipping')}</span>
                <span>{t('calculated')}</span>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold">
                  <span>{t('total')}</span>
                  <span>
                    {new Intl.NumberFormat('bg-BG', {
                      style: 'currency',
                      currency: 'BGN'
                    }).format(getTotal())}
                  </span>
                </div>
              </div>

              <Button 
                className="w-full mt-6"
                onClick={handlePayment}
              >
                {t('payNow')}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
} 