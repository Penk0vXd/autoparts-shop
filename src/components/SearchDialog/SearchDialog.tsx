'use client'

import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Dialog, DialogContent, DialogOverlay, DialogClose, DialogPortal } from '@/components/ui/dialog'
import { useSearchStore } from '@/store/searchStore'
import { ResultsList } from './ResultsList'
import { cn } from '@/lib/utils'

/**
 * Main search dialog component with improved accessibility and contrast
 */
export function SearchDialog() {
  const [query, setQuery] = useState('')
  const { isOpen, close } = useSearchStore()

  // Clear query when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setQuery('')
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogPortal>
        {/* Custom overlay with improved contrast */}
        <DialogOverlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        
        {/* Custom content with improved background opacity */}
        <div className="fixed left-[50%] top-[50%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <div className="relative mx-4 mt-24 rounded-2xl bg-background/95 ring-1 ring-border shadow-xl backdrop-blur-md">
            {/* Close button */}
            <DialogClose 
              aria-label="Затвори търсачката"
              className="absolute right-4 top-4 z-10 rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-5 w-5" />
            </DialogClose>

            {/* Search Input */}
            <div className="flex items-center border-b border-border/50 px-5 py-4">
              <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Търси продукти..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full border-0 bg-transparent px-4 py-0 text-lg leading-tight text-foreground placeholder:text-muted-foreground focus:outline-none"
                aria-label="Търсене на продукти"
              />
            </div>

            {/* Results */}
            <ResultsList query={query} />

            {/* Footer */}
            <div className="border-t border-border/50 px-5 py-3">
              <div className="flex items-center justify-center">
                <span className="text-xs text-muted-foreground">
                  Използвайте ↑↓ за навигация, Enter за избор, ESC за затваряне
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogPortal>
    </Dialog>
  )
} 