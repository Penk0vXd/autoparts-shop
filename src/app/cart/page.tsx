'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Trash2 } from 'lucide-react'
import Image from 'next/image'

type StockResponse = {
  [key: string]: number
}

export default function CartPage() {
  const t = useTranslations('cart')
  const router = useRouter()
  const { items, removeItem, updateQty, getTotal } = useCartStore()
  const [stockData, setStockData] = useState<StockResponse>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await fetch('/api/products/bulk-stock?' + 
          new URLSearchParams({
            ids: items.map(i => i.id).join(',')
          })
        )
        
        if (!response.ok) throw new Error('Failed to fetch stock')
        
        const data = await response.json()
        setStockData(data)
      } catch (err) {
        setError('Failed to validate stock')
      } finally {
        setIsLoading(false)
      }
    }

    if (items.length > 0) {
      fetchStock()
    } else {
      setIsLoading(false)
    }
  }, [items])

  const hasStockError = items.some(item => 
    item.qty > (stockData[item.id] || 0)
  )

  const handleCheckout = () => {
    router.push('/checkout')
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

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('empty')}</h1>
          <Button onClick={() => router.push('/catalog')}>
            {t('continueShopping')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">{t('title')}</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {items.map(item => {
            const currentStock = stockData[item.id] || 0
            const hasError = item.qty > currentStock

            return (
              <Card key={item.id} className="p-4 mb-4">
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-muted-foreground">
                      {new Intl.NumberFormat('bg-BG', {
                        style: 'currency',
                        currency: 'BGN'
                      }).format(item.price)}
                    </p>
                    
                    {hasError && (
                      <p className="text-red-600 text-sm mt-1">
                        {t('stockError', { stock: currentStock })}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      min="1"
                      max={currentStock}
                      value={item.qty}
                      onChange={(e) => updateQty(item.id, parseInt(e.target.value) || 1)}
                      className="w-20"
                    />
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        <div>
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">{t('summary')}</h2>
            
            <div className="space-y-2 mb-4">
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
            </div>
            
            <Button
              className="w-full"
              disabled={hasStockError}
              onClick={handleCheckout}
            >
              {t('checkout')}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
} 