'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, ArrowRight } from 'lucide-react'
import { useSearchStore } from '@/store/searchStore'
import { isFeatureEnabled } from '@/config/features'
import { useHydration } from '@/hooks/useHydration'
import useSWR from 'swr'
import { searchProducts } from '@/services/searchService'
import { debounce } from '@/lib/utils'
import { ResultsList } from './ResultsList'

interface SearchResult {
  id: string
  name: string
  slug: string
  price: number | null
  image?: string
  brand?: {
    name: string
  }
  category?: {
    name: string
  }
}

/**
 * Search Dialog Component - Only shown when product search is enabled
 * Features advanced search with real-time results and keyboard navigation
 */
export function SearchDialog() {
  const { isOpen, close } = useSearchStore()
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const hydrated = useHydration()
  
  // Don't render search dialog if product search is disabled or not hydrated
  if (!hydrated || !isFeatureEnabled('productSearch')) {
    return null
  }

  // Debounce search query
  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedQuery(query)
    }, 300)
    
    handler()
    return () => {
      handler.cancel?.()
    }
  }, [query])

  // Fetch search results
  const { data: results, isLoading } = useSWR(
    debouncedQuery.length >= 2 ? ['search', debouncedQuery] : null,
    () => searchProducts(debouncedQuery)
  )

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
        setQuery('')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, close])

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      close()
      setQuery('')
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="fixed inset-x-0 top-0 z-50">
        <div className="container mx-auto px-4 pt-16">
          <div className="max-w-2xl mx-auto">
            {/* Search Input */}
            <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="flex items-center px-4 py-4 border-b border-gray-100">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Търсете авточасти..."
                  className="flex-1 text-lg outline-none placeholder:text-gray-400"
                />
                <button
                  onClick={() => {
                    close()
                    setQuery('')
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Затвори търсачката"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search Results */}
              <div className="max-h-96 overflow-y-auto">
                {query.length < 2 ? (
                  <div className="p-6 text-center text-gray-500">
                    <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p>Въведете поне 2 символа за търсене</p>
                  </div>
                ) : isLoading ? (
                  <div className="p-6 text-center">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <p className="mt-2 text-gray-600">Търсене...</p>
                  </div>
                ) : results && results.length > 0 ? (
                  <ResultsList 
                    results={results} 
                    query={debouncedQuery}
                    onItemClick={() => {
                      close()
                      setQuery('')
                    }}
                  />
                ) : results && results.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Search className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="font-medium">Няма намерени резултати</p>
                    <p className="text-sm mt-1">Опитайте с други ключови думи</p>
                  </div>
                ) : null}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">ESC</kbd>
                      <span>затвори</span>
                    </div>
                  </div>
                  <div className="text-right">
                    Търсене в реalno време
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 