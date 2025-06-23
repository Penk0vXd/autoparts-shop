'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cartStore'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [mounted, setMounted] = useState(false)
  const { clearCart } = useCartStore()

  useEffect(() => {
    setMounted(true)
    // Clear cart on successful checkout
    if (sessionId) {
      clearCart()
    }
  }, [sessionId, clearCart])

  if (!mounted) {
    return <div className="min-h-screen pt-16 bg-background" />
  }

  return (
    <div className="min-h-screen pt-16 bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <CheckCircle className="mx-auto h-24 w-24 text-green-600 mb-6" />
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Поръчката е успешна!
          </h1>
          <p className="text-muted-foreground mb-8">
            Благодарим ви за поръчката! Ще получите имейл с потвърждение и детайли за доставката.
          </p>
          
          {sessionId && (
            <div className="bg-surface rounded-lg p-4 mb-8">
              <p className="text-sm text-muted-foreground">
                Номер на сесията: <span className="font-mono">{sessionId.slice(-8)}</span>
              </p>
            </div>
          )}

          <div className="space-y-4">
            <Link href="/catalog">
              <Button size="lg" className="w-full sm:w-auto">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Продължи пазаруването
              </Button>
            </Link>
            
            <Link href="/">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Към началната страница
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 