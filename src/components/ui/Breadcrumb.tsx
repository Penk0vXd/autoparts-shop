'use client'

import Link from 'next/link'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

/**
 * Bulgarian Breadcrumb Navigation Component
 * Accessible, mobile-friendly, and SEO-optimized
 */
export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav 
      className={`flex items-center space-x-2 text-sm ${className}`}
      aria-label="Breadcrumb navigation"
    >
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const isFirst = index === 0
          
          return (
            <li key={item.href} className="flex items-center">
              {/* Separator */}
              {index > 0 && (
                <ChevronRightIcon 
                  className="h-4 w-4 text-gray-400 mx-2" 
                  aria-hidden="true"
                />
              )}
              
              {/* Breadcrumb item */}
              {isLast ? (
                <span 
                  className="text-gray-900 font-medium"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-gray-500 hover:text-red-600 transition-colors duration-200 flex items-center"
                  aria-label={`Navigate to ${item.label}`}
                >
                  {isFirst && (
                    <HomeIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                  )}
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/**
 * Structured data for breadcrumbs (SEO)
 */
export function BreadcrumbStructuredData({ items }: { items: BreadcrumbItem[] }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": typeof window !== 'undefined' ? `${window.location.origin}${item.href}` : item.href
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

/**
 * Compact mobile breadcrumb for smaller screens
 */
export function MobileBreadcrumb({ items, className = '' }: BreadcrumbProps) {
  if (items.length < 2) return null

  const currentItem = items[items.length - 1]
  const parentItem = items[items.length - 2]

  return (
    <nav 
      className={`md:hidden flex items-center space-x-2 text-sm ${className}`}
      aria-label="Breadcrumb navigation"
    >
      <Link
        href={parentItem.href}
        className="text-red-600 hover:text-red-700 transition-colors duration-200 flex items-center"
        aria-label={`Back to ${parentItem.label}`}
      >
        <svg 
          className="h-4 w-4 mr-1" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {parentItem.label}
      </Link>
      
      <ChevronRightIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
      
      <span className="text-gray-900 font-medium">
        {currentItem.label}
      </span>
    </nav>
  )
} 