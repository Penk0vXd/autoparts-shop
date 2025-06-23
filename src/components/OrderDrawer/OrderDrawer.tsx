'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import { Minus, Plus, X, ShoppingBag, MapPin, CreditCard, Tag, Loader2 } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/button'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetClose 
} from '@/components/ui/sheet'
import { useHydration } from '@/hooks/useHydration'
import { createCheckoutSession } from '@/app/actions/createCheckoutSession'

interface OrderDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderDrawer({ open, onOpenChange }: OrderDrawerProps) {
  const hydrated = useHydration()
  const router = useRouter()
  const pathname = usePathname()
  const [isProcessing, setIsProcessing] = useState(false)
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({})
  
  const isCartPage = pathname === '/cart'

  // Keep drawer open on cart page
  useEffect(() => {
    if (isCartPage && !open) {
      onOpenChange(true)
    }
  }, [isCartPage, open, onOpenChange])
  
  const {
    items,
    deliveryInfo,
    paymentInfo,
    couponCode,
    getOrderSummary,
    updateQuantity,
    removeItem,
    setDeliveryInfo,
    setPaymentInfo,
    setCouponCode,
    applyCoupon
  } = useCartStore()

  const summary = getOrderSummary()
  const hasStockIssues = items.some(item => item.quantity > item.stock)
  const isEmptyCart = items.length === 0

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('bg-BG', {
      style: 'currency',
      currency: 'BGN',
    }).format(price)
  }

  const validateAddress = () => {
    const errors: Record<string, string> = {}
    
    if (deliveryInfo.method === 'address' && deliveryInfo.address) {
      if (!deliveryInfo.address.street?.trim()) {
        errors.street = 'Полето е задължително'
      }
      if (!deliveryInfo.address.city?.trim()) {
        errors.city = 'Полето е задължително'
      }
      if (!deliveryInfo.address.postalCode?.trim()) {
        errors.postalCode = 'Полето е задължително'
      }
      if (!deliveryInfo.address.phone?.trim()) {
        errors.phone = 'Полето е задължително'
      }
    }
    
    if (deliveryInfo.method === 'office' && deliveryInfo.office) {
      if (!deliveryInfo.office.city?.trim()) {
        errors.officeCity = 'Полето е задължително'
      }
      if (!deliveryInfo.office.office?.trim()) {
        errors.office = 'Полето е задължително'
      }
      if (!deliveryInfo.office.phone?.trim()) {
        errors.officePhone = 'Полето е задължително'
      }
    }
    
    setAddressErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleApplyCoupon = async () => {
    if (couponCode.toLowerCase() === 'welcome10') {
      applyCoupon(summary.subtotal * 0.1)
    } else if (couponCode.toLowerCase() === 'save20') {
      applyCoupon(20)
    } else {
      applyCoupon(0)
    }
  }

  const handleCheckout = async () => {
    if (isEmptyCart || hasStockIssues || !validateAddress()) {
      return
    }

    setIsProcessing(true)
    
    try {
      const session = await createCheckoutSession({
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        deliveryInfo,
        paymentInfo,
        summary
      })

      if (session.url) {
        router.push(session.url)
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!hydrated) {
    return null
  }

  const handleClose = () => {
    if (isCartPage) {
      router.push('/catalog')
    } else {
      onOpenChange(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={isCartPage ? undefined : onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-lg bg-[#f7f7f7] p-0 overflow-y-auto"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="px-6 py-4 border-b border-border bg-background">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-foreground font-semibold text-lg">
                Вашата поръчка
              </SheetTitle>
              <button 
                onClick={handleClose}
                className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">
                  {isCartPage ? 'Назад към каталога' : 'Затвори'}
                </span>
              </button>
            </div>
          </SheetHeader>

          <div className="flex-1 px-6 py-4 space-y-6">
            {/* Empty Cart State */}
            {isEmptyCart && (
              <div className="text-center py-12">
                <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Количката е празна
                </h3>
                <p className="text-muted-foreground text-sm">
                  Добавете продукти, за да продължите
                </p>
              </div>
            )}

            {/* Items List */}
            {!isEmptyCart && (
              <div className="space-y-4">
                <h3 className="text-foreground font-semibold">Продукти</h3>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="bg-background rounded-lg p-4 border border-border">
                      <div className="flex items-start gap-3">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <Image
                            src={item.image || '/placeholder-product.jpg'}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-foreground line-clamp-2 mb-1">
                            {item.name}
                          </h4>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="h-7 w-7 p-0"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              
                              <span className="text-sm font-medium w-6 text-center">
                                {item.quantity}
                              </span>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.stock}
                                className="h-7 w-7 p-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            <div className="text-right">
                              <div className="font-semibold text-sm text-primary">
                                {formatPrice(item.price * item.quantity)}
                              </div>
                            </div>
                          </div>

                          {item.quantity > item.stock && (
                            <p className="text-xs text-red-600 mt-1">
                              Надвишава наличността ({item.stock} бр.)
                            </p>
                          )}
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive h-7 w-7 p-0 flex-shrink-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery Options */}
            {!isEmptyCart && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-foreground font-semibold">Доставка</h3>
                </div>
                
                <div className="space-y-3" role="radiogroup" aria-labelledby="delivery-options">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="delivery"
                      value="address"
                      checked={deliveryInfo.method === 'address'}
                      onChange={() => setDeliveryInfo({ method: 'address', address: deliveryInfo.address })}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">До адрес</div>
                      <div className="text-xs text-muted-foreground">Доставка до вашия адрес</div>
                      
                      {deliveryInfo.method === 'address' && (
                        <div className="mt-3 space-y-2">
                          <input
                            type="text"
                            placeholder="Улица и номер"
                            value={deliveryInfo.address?.street || ''}
                            onChange={(e) => setDeliveryInfo({
                              method: 'address',
                              address: { 
                                street: e.target.value,
                                city: deliveryInfo.address?.city || '',
                                postalCode: deliveryInfo.address?.postalCode || '',
                                phone: deliveryInfo.address?.phone || ''
                              }
                            })}
                            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
                          />
                          {addressErrors.street && (
                            <p className="text-xs text-red-600">{addressErrors.street}</p>
                          )}
                          
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="Град"
                              value={deliveryInfo.address?.city || ''}
                              onChange={(e) => setDeliveryInfo({
                                method: 'address',
                                address: { 
                                  street: deliveryInfo.address?.street || '',
                                  city: e.target.value,
                                  postalCode: deliveryInfo.address?.postalCode || '',
                                  phone: deliveryInfo.address?.phone || ''
                                }
                              })}
                              className="px-3 py-2 text-sm border border-border rounded-md bg-background"
                            />
                            <input
                              type="text"
                              placeholder="Пощенски код"
                              value={deliveryInfo.address?.postalCode || ''}
                              onChange={(e) => setDeliveryInfo({
                                method: 'address',
                                address: { 
                                  street: deliveryInfo.address?.street || '',
                                  city: deliveryInfo.address?.city || '',
                                  postalCode: e.target.value,
                                  phone: deliveryInfo.address?.phone || ''
                                }
                              })}
                              className="px-3 py-2 text-sm border border-border rounded-md bg-background"
                            />
                          </div>
                          {(addressErrors.city || addressErrors.postalCode) && (
                            <p className="text-xs text-red-600">
                              {addressErrors.city || addressErrors.postalCode}
                            </p>
                          )}
                          
                          <input
                            type="tel"
                            placeholder="Телефон"
                            value={deliveryInfo.address?.phone || ''}
                            onChange={(e) => setDeliveryInfo({
                              method: 'address',
                              address: { 
                                street: deliveryInfo.address?.street || '',
                                city: deliveryInfo.address?.city || '',
                                postalCode: deliveryInfo.address?.postalCode || '',
                                phone: e.target.value
                              }
                            })}
                            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
                          />
                          {addressErrors.phone && (
                            <p className="text-xs text-red-600">{addressErrors.phone}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="delivery"
                      value="office"
                      checked={deliveryInfo.method === 'office'}
                      onChange={() => setDeliveryInfo({ method: 'office', office: deliveryInfo.office })}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">До офис</div>
                      <div className="text-xs text-muted-foreground">Вземане от офис на куриер</div>
                      
                      {deliveryInfo.method === 'office' && (
                        <div className="mt-3 space-y-2">
                          <input
                            type="text"
                            placeholder="Град"
                            value={deliveryInfo.office?.city || ''}
                            onChange={(e) => setDeliveryInfo({
                              method: 'office',
                              office: { 
                                city: e.target.value,
                                office: deliveryInfo.office?.office || '',
                                phone: deliveryInfo.office?.phone || ''
                              }
                            })}
                            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
                          />
                          {addressErrors.officeCity && (
                            <p className="text-xs text-red-600">{addressErrors.officeCity}</p>
                          )}
                          
                          <input
                            type="text"
                            placeholder="Офис"
                            value={deliveryInfo.office?.office || ''}
                            onChange={(e) => setDeliveryInfo({
                              method: 'office',
                              office: { 
                                city: deliveryInfo.office?.city || '',
                                office: e.target.value,
                                phone: deliveryInfo.office?.phone || ''
                              }
                            })}
                            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
                          />
                          {addressErrors.office && (
                            <p className="text-xs text-red-600">{addressErrors.office}</p>
                          )}
                          
                          <input
                            type="tel"
                            placeholder="Телефон"
                            value={deliveryInfo.office?.phone || ''}
                            onChange={(e) => setDeliveryInfo({
                              method: 'office',
                              office: { 
                                city: deliveryInfo.office?.city || '',
                                office: deliveryInfo.office?.office || '',
                                phone: e.target.value
                              }
                            })}
                            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
                          />
                          {addressErrors.officePhone && (
                            <p className="text-xs text-red-600">{addressErrors.officePhone}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="delivery"
                      value="pickup"
                      checked={deliveryInfo.method === 'pickup'}
                      onChange={() => setDeliveryInfo({ method: 'pickup' })}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">Вземане на място</div>
                      <div className="text-xs text-muted-foreground">От нашия офис безплатно</div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Payment Options */}
            {!isEmptyCart && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-foreground font-semibold">Плащане</h3>
                </div>
                
                <div className="space-y-3" role="radiogroup" aria-labelledby="payment-options">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentInfo.method === 'card'}
                      onChange={() => setPaymentInfo({ method: 'card' })}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">Карта</div>
                      <div className="text-xs text-muted-foreground">Онлайн плащане с карта</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="cash"
                      checked={paymentInfo.method === 'cash'}
                      onChange={() => setPaymentInfo({ method: 'cash' })}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">Наложен платеж</div>
                      <div className="text-xs text-muted-foreground">Плащане при доставка</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="digital"
                      checked={paymentInfo.method === 'digital'}
                      onChange={() => setPaymentInfo({ method: 'digital' })}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">Apple/Google Pay</div>
                      <div className="text-xs text-muted-foreground">Бързо дигитално плащане</div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Coupon Code */}
            {!isEmptyCart && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-foreground font-semibold">Промо код</h3>
                </div>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Въведете промо код"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-border rounded-md bg-background"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleApplyCoupon}
                    disabled={!couponCode.trim()}
                  >
                    Приложи
                  </Button>
                </div>
              </div>
            )}

            {/* Order Summary */}
            {!isEmptyCart && (
              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="text-foreground font-semibold">Обобщение</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Продукти:</span>
                    <span>{formatPrice(summary.subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Доставка:</span>
                    <span>{summary.deliveryFee === 0 ? 'Безплатно' : formatPrice(summary.deliveryFee)}</span>
                  </div>
                  
                  {summary.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Отстъпка:</span>
                      <span>-{formatPrice(summary.discount)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between font-semibold text-base pt-2 border-t border-border">
                    <span>Общо:</span>
                    <span className="text-primary">{formatPrice(summary.total)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CTA Button */}
          <div className="px-6 py-4 border-t border-border bg-background">
            <Button
              onClick={handleCheckout}
              disabled={isEmptyCart || hasStockIssues || isProcessing}
              className="w-full bg-primary hover:bg-primary/90 active:scale-[0.98] transition-transform"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Обработка...
                </>
              ) : (
                'Завърши поръчката'
              )}
            </Button>
            
            {hasStockIssues && (
              <p className="text-xs text-red-600 mt-2 text-center">
                Моля, коригирайте количествата преди да продължите
              </p>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
} 