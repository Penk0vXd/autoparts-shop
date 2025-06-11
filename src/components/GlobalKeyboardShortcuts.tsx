'use client'

import { useEffect } from 'react'
import { useSearchStore } from '@/store/searchStore'

/**
 * Global keyboard shortcuts handler
 * Handles Ctrl+K / Cmd+K for opening search dialog
 */
export function GlobalKeyboardShortcuts() {
  const { toggle } = useSearchStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        toggle()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggle])

  return null
} 