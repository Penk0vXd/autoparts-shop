'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Loader2, CheckCircle, AlertCircle, Star, Truck } from 'lucide-react'
import { useSearchStore } from '@/store/searchStore'
import type { SearchProduct } from '@/services/searchService'

interface ResultsListProps {
  query: string
}

interface EnhancedSearchProduct extends SearchProduct {
  isCompatible?: boolean
  compatibilityNote?: string
  rating?: number
  reviewCount?: number
  inStock?: boolean
  deliveryTime?: string
}

/**
 * Enhanced search results list with compatibility and detailed product info
 */
export function ResultsList({ query }: ResultsListProps) {
  const [results, setResults] = useState<EnhancedSearchProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()
  const { close, vehicleInfo, compatibilityMode, filters } = useSearchStore()

  // Debounced search effect
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    const debounceTimer = setTimeout(async () => {
      try {
        // Build search parameters
        const searchParams = new URLSearchParams({
          q: query,
          ...(vehicleInfo?.make && { make: vehicleInfo.make }),
          ...(vehicleInfo?.model && { model: vehicleInfo.model }),
          ...(vehicleInfo?.year && { year: vehicleInfo.year }),
          ...(compatibilityMode && { compatibleOnly: 'true' }),
          ...(filters.inStockOnly && { inStock: 'true' }),
          ...(filters.priceRange[1] < 2000 && { maxPrice: filters.priceRange[1].toString() }),
        })

        const response = await fetch(`/api/search?${searchParams}`)
        const data = await response.json()
        
        // Enhance results with mock compatibility data
        const enhancedResults = (data.data || []).map((product: SearchProduct) => ({
          ...product,
          isCompatible: vehicleInfo ? Math.random() > 0.3 : undefined,
          compatibilityNote: vehicleInfo ? getCompatibilityNote() : undefined,
          rating: 3.5 + Math.random() * 1.5,
          reviewCount: Math.floor(Math.random() * 100) + 5,
          inStock: Math.random() > 0.2,
          deliveryTime: getDeliveryTime()
        }))
        
        setResults(enhancedResults)
        setSelectedIndex(0)
      } catch (error) {
        console.error('Search failed:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 250)

    return () => clearTimeout(debounceTimer)
  }, [query, vehicleInfo, compatibilityMode, filters])

  // Mock compatibility notes
  const getCompatibilityNote = () => {
    const notes = [
      'Директно съвместим',
      'Съвместим с модификация',
      'Проверете VIN номера',
      'За всички двигатели',
      'Само за дизелови двигатели'
    ]
    return notes[Math.floor(Math.random() * notes.length)]
  }

  // Mock delivery times
  const getDeliveryTime = () => {
    const times = ['До 2 часа', 'До 4 часа', 'Утре', '2-3 дни', 'На поръчка']
    return times[Math.floor(Math.random() * times.length)]
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % results.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length)
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault()
        navigateToProduct(results[selectedIndex])
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [results, selectedIndex])

  const navigateToProduct = (product: EnhancedSearchProduct) => {
    router.push(`/products/${product.slug}`)
    close()
  }

  const formatPrice = (price: number, comparePrice?: number) => {
    if (comparePrice && comparePrice > price) {
      const discount = Math.round(((comparePrice - price) / comparePrice) * 100)
      return (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-red-600 font-semibold text-lg">{price.toFixed(2)} лв</span>
          <span className="text-gray-400 line-through text-sm">{comparePrice.toFixed(2)} лв</span>
          <span className="bg-red-100 text-red-800 px-1.5 py-0.5 rounded text-xs font-medium">
            -{discount}%
          </span>
        </div>
      )
    }
    return <span className="font-semibold text-lg">{price.toFixed(2)} лв</span>
  }

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) {
      return text
    }
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900 px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center px-5 py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Търсене...</span>
      </div>
    )
  }

  if (!query.trim()) {
    return (
      <div className="px-5 py-8 text-center">
        <div className="text-sm text-muted-foreground mb-4">
          Започнете да пишете за търсене на авточасти
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-muted/50 rounded">
            <div className="font-medium">Популярни търсения:</div>
            <div className="text-muted-foreground">спирачки, масло, филтри</div>
          </div>
          <div className="p-2 bg-muted/50 rounded">
            <div className="font-medium">Търсете по номер:</div>
            <div className="text-muted-foreground">OEM, артикул, VIN</div>
          </div>
        </div>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="px-5 py-8 text-center">
        <div className="text-sm text-muted-foreground mb-4">
          Няма продукти за &quot;{query}&quot;
        </div>
        <div className="text-xs text-muted-foreground">
          Опитайте с по-общи думи или проверете правописа
        </div>
      </div>
    )
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      <div className="px-4 py-2 text-xs text-muted-foreground border-b bg-muted/30 flex items-center justify-between">
        <span>{results.length} резултат{results.length !== 1 ? 'а' : ''}</span>
        {vehicleInfo && (
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-600" />
            {vehicleInfo.make} {vehicleInfo.model}
          </span>
        )}
      </div>
      
      <ul className="py-2">
        {results.map((product, index) => (
          <li key={product.id}>
            <button
              className={`w-full flex items-start gap-4 px-4 py-4 text-left hover:bg-muted/50 transition-colors border-b border-border/30 ${
                index === selectedIndex ? 'bg-muted/50' : ''
              }`}
              onClick={() => navigateToProduct(product)}
            >
              {/* Product Image */}
              <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xs text-gray-400">No img</span>
                  </div>
                )}
                
                {/* Compatibility badge */}
                {vehicleInfo && product.isCompatible !== undefined && (
                  <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${
                    product.isCompatible ? 'bg-green-500' : 'bg-orange-500'
                  }`}>
                    {product.isCompatible ? (
                      <CheckCircle className="w-3 h-3 text-white" />
                    ) : (
                      <AlertCircle className="w-3 h-3 text-white" />
                    )}
                  </div>
                )}
              </div>
              
              {/* Product Details */}
              <div className="flex-1 min-w-0 space-y-1">
                {/* Product Name */}
                <div className="font-medium text-sm leading-tight">
                  {highlightMatch(product.name, query)}
                </div>
                
                {/* Brand */}
                {product.brand && (
                  <div className="text-xs text-muted-foreground">
                    {product.brand.name}
                  </div>
                )}
                
                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${
                            star <= product.rating!
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({product.reviewCount})
                    </span>
                  </div>
                )}
                
                {/* Compatibility info */}
                {vehicleInfo && product.compatibilityNote && (
                  <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                    product.isCompatible 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {product.compatibilityNote}
                  </div>
                )}
                
                {/* Stock and delivery info */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className={`flex items-center gap-1 ${
                    product.inStock ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      product.inStock ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    {product.inStock ? 'В наличност' : 'Няма наличност'}
                  </span>
                  {product.inStock && product.deliveryTime && (
                    <span className="flex items-center gap-1">
                      <Truck className="w-3 h-3" />
                      {product.deliveryTime}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Price */}
              <div className="text-right flex-shrink-0">
                {formatPrice(product.price, product.compare_price)}
              </div>
            </button>
          </li>
        ))}
      </ul>
      
      {/* Show more results button */}
      {results.length >= 8 && (
        <div className="p-4 text-center border-t">
          <button className="text-sm text-primary hover:underline">
            Вижте всички резултати в каталога
          </button>
        </div>
      )}
    </div>
  )
} 