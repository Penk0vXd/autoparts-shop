'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCartStore } from '@/store/cartStore'
import { useCheckoutStore, type ShippingDetails, type BillingDetails } from '@/store/checkoutStore'

const shippingSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Phone number is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().min(4, 'Postal code is required')
})

const billingSchema = z.object({
  companyName: z.string().optional(),
  vatNumber: z.string().optional()
})

export default function CheckoutPage() {
  const t = useTranslations('checkout')
  const router = useRouter()
  const { items, getTotal } = useCartStore()
  const { form, setShippingDetails, setBillingDetails } = useCheckoutStore()

  const shippingForm = useForm<ShippingDetails>({
    resolver: zodResolver(shippingSchema),
    defaultValues: form.shipping
  })

  const billingForm = useForm<BillingDetails>({
    resolver: zodResolver(billingSchema),
    defaultValues: form.billing
  })

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [items, router])

  const onShippingSubmit = (data: ShippingDetails) => {
    setShippingDetails(data)
  }

  const onBillingSubmit = (data: BillingDetails) => {
    setBillingDetails(data)
    router.push('/checkout/review')
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">{t('title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="shipping" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="shipping">{t('shippingTab')}</TabsTrigger>
              <TabsTrigger value="billing">{t('billingTab')}</TabsTrigger>
            </TabsList>

            <TabsContent value="shipping">
              <Card className="p-6">
                <form onSubmit={shippingForm.handleSubmit(onShippingSubmit)}>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">{t('firstName')}</Label>
                      <Input
                        id="firstName"
                        {...shippingForm.register('firstName')}
                        error={shippingForm.formState.errors.firstName?.message}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">{t('lastName')}</Label>
                      <Input
                        id="lastName"
                        {...shippingForm.register('lastName')}
                        error={shippingForm.formState.errors.lastName?.message}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <Label htmlFor="email">{t('email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      {...shippingForm.register('email')}
                      error={shippingForm.formState.errors.email?.message}
                    />
                  </div>

                  <div className="space-y-2 mb-4">
                    <Label htmlFor="phone">{t('phone')}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...shippingForm.register('phone')}
                      error={shippingForm.formState.errors.phone?.message}
                    />
                  </div>

                  <div className="space-y-2 mb-4">
                    <Label htmlFor="address">{t('address')}</Label>
                    <Input
                      id="address"
                      {...shippingForm.register('address')}
                      error={shippingForm.formState.errors.address?.message}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="city">{t('city')}</Label>
                      <Input
                        id="city"
                        {...shippingForm.register('city')}
                        error={shippingForm.formState.errors.city?.message}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="postalCode">{t('postalCode')}</Label>
                      <Input
                        id="postalCode"
                        {...shippingForm.register('postalCode')}
                        error={shippingForm.formState.errors.postalCode?.message}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    {t('continueToBilling')}
                  </Button>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="billing">
              <Card className="p-6">
                <form onSubmit={billingForm.handleSubmit(onBillingSubmit)}>
                  <div className="space-y-2 mb-4">
                    <Label htmlFor="companyName">{t('companyName')}</Label>
                    <Input
                      id="companyName"
                      {...billingForm.register('companyName')}
                      error={billingForm.formState.errors.companyName?.message}
                    />
                  </div>

                  <div className="space-y-2 mb-6">
                    <Label htmlFor="vatNumber">{t('vatNumber')}</Label>
                    <Input
                      id="vatNumber"
                      {...billingForm.register('vatNumber')}
                      error={billingForm.formState.errors.vatNumber?.message}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    {t('reviewOrder')}
                  </Button>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">{t('orderSummary')}</h2>
            
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
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
} 