import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * Loading spinner component with Bulgarian text
 */
export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={cn('flex items-center justify-center space-x-2', className)}>
      <div className={cn(
        'animate-spin rounded-full border-2 border-gray-300 border-t-red-600',
        sizeClasses[size]
      )} />
      <span className="text-sm text-gray-600">Зареждане...</span>
    </div>
  )
}

/**
 * Category card skeleton for loading state
 */
export function CategoryCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="h-48 bg-gray-200" />
      
      {/* Content skeleton */}
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded mb-2" />
        <div className="h-4 bg-gray-200 rounded mb-4" />
        <div className="h-3 bg-gray-200 rounded w-24 mb-4" />
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded w-32" />
          <div className="w-4 h-4 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  )
}

/**
 * Grid of category card skeletons
 */
export function CategoryGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <CategoryCardSkeleton key={index} />
      ))}
    </div>
  )
} 