'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Minus, Plus, X, ShoppingBag, ArrowLeft } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/button'
import { OrderDrawer } from '@/components/OrderDrawer/OrderDrawer'

export default function CartPage() {
  const [mounted, setMounted] = useState(false)
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice, isDrawerOpen, openDrawer, closeDrawer } = useCartStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen pt-16 bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Зареждане...</div>
        </div>
      </div>
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('bg-BG', {
      style: 'currency',
      currency: 'BGN',
    }).format(price)
  }

  const totalPrice = getTotalPrice()
  const shipping = totalPrice > 100 ? 0 : 10
  const finalTotal = totalPrice + shipping

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-16 bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-4">Количката е празна</h1>
            <p className="text-muted-foreground mb-8">
              Още не сте добавили нищо в количката си. Разгледайте нашия каталог и намерете перфектните авточасти за вашия автомобил.
            </p>
            <Link href="/catalog">
              <Button size="lg" className="px-8">
                Разгледай каталога
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16 bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/catalog">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Продължи пазаруването
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Количка</h1>
              <p className="text-muted-foreground">{items.length} артикула</p>
            </div>
          </div>
          
          {items.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCart}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              Изпразни количката
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-surface rounded-2xl p-6 shadow-sm border border-border"
              >
                <div className="flex items-start gap-4">
                  {/* Product Image */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={item.image || '/images/placeholder-product.svg'}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-grow">
                    <Link 
                      href={`/products/${item.slug}`}
                      className="text-lg font-semibold text-foreground hover:text-primary transition-colors line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    {item.sku && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Артикул: {item.sku}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-sm text-muted-foreground">
                            {formatPrice(item.price)} × {item.quantity}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stock Warning */}
                    {item.quantity === item.stock && (
                      <p className="text-sm text-orange-600 mt-2">
                        Достигнахте максималното количество в наличност
                      </p>
                    )}
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="text-muted-foreground hover:text-destructive h-8 w-8 p-0 flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-surface rounded-2xl p-6 shadow-sm border border-border sticky top-24"
            >
              <h2 className="text-xl font-bold mb-6">Обобщение на поръчката</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Междинна сума:</span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Доставка:</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Безплатна' : formatPrice(shipping)}
                  </span>
                </div>
                
                {totalPrice < 100 && (
                  <div className="text-sm text-muted-foreground border-t pt-4">
                    Добавете още {formatPrice(100 - totalPrice)} за безплатна доставка
                  </div>
                )}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Общо:</span>
                    <span className="text-primary">{formatPrice(finalTotal)}</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={openDrawer}
                className="w-full py-4 text-lg font-semibold" 
                size="lg"
              >
                Продължи към поръчката
              </Button>
              
              <p className="text-sm text-muted-foreground text-center mt-4">
                Безплатно връщане в рамките на 14 дни
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Order Drawer */}
      <OrderDrawer
        open={isDrawerOpen}
        onOpenChange={(open) => open ? openDrawer() : closeDrawer()}
      />
    </div>
  )
} 