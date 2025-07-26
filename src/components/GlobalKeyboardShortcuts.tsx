'use client'

import { useEffect } from 'react'
// import { useSearchStore } from '@/store/searchStore' // ⛔ disabled for request-only MVP

/**
 * Global keyboard shortcuts handler
 * Handles Ctrl+K / Cmd+K for opening search dialog
 * Currently disabled for request-only MVP
 */
export function GlobalKeyboardShortcuts() {
  // const { toggle } = useSearchStore() // ⛔ disabled
  const toggle = () => {} // no-operation placeholder

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to open search (currently disabled)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        // toggle() // ⛔ disabled for request-only MVP
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggle])

  return null
} 