'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import { useSearchStore } from '@/store/searchStore'
import type { SearchProduct } from '@/services/searchService'

interface ResultsListProps {
  query: string
}

/**
 * Search results list with debounced API calls
 */
export function ResultsList({ query }: ResultsListProps) {
  const [results, setResults] = useState<SearchProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()
  const { close } = useSearchStore()

  // Debounced search effect
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    const debounceTimer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        setResults(data.data || [])
        setSelectedIndex(0)
      } catch (error) {
        console.error('Search failed:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 250)

    return () => clearTimeout(debounceTimer)
  }, [query])

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

  const navigateToProduct = (product: SearchProduct) => {
    router.push(`/products/${product.slug}`)
    close()
  }

  const formatPrice = (price: number, comparePrice?: number) => {
    if (comparePrice && comparePrice > price) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-red-600 font-semibold">{price.toFixed(2)} лв</span>
          <span className="text-gray-400 line-through text-sm">{comparePrice.toFixed(2)} лв</span>
        </div>
      )
    }
    return <span className="font-semibold">{price.toFixed(2)} лв</span>
  }

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text
    
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
      <div className="flex items-center justify-center px-5 py-6">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Търсене...</span>
      </div>
    )
  }

  if (!query.trim()) {
    return (
      <div className="px-5 py-6 text-center text-sm text-muted-foreground">
        Започнете да пишете за търсене на продукти
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="px-5 py-6 text-center text-sm text-muted-foreground">
        Няма продукти, започващи с "{query}"
      </div>
    )
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      <div className="px-2 py-1 text-xs text-muted-foreground border-b">
        {results.length} резултат{results.length !== 1 ? 'а' : ''}
      </div>
      
      <ul className="py-2">
        {results.map((product, index) => (
          <li key={product.id}>
            <button
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors ${
                index === selectedIndex ? 'bg-muted' : ''
              }`}
              onClick={() => navigateToProduct(product)}
            >
              <div className="relative w-12 h-12 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xs text-gray-400">No img</span>
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">
                  {highlightMatch(product.name, query)}
                </div>
                {product.brand && (
                  <div className="text-xs text-muted-foreground">
                    {product.brand.name}
                  </div>
                )}
                <div className="text-sm mt-1">
                  {formatPrice(product.price, product.compare_price)}
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
} 