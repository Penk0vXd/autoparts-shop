'use client'

import React from 'react'
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

/**
 * Production-Grade Error Boundary
 * 
 * Catches JavaScript errors in component tree and displays fallback UI
 * Essential for Vercel production deployment stability
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Възникна грешка
          </h2>
          <p className="text-gray-600 text-center mb-4">
            Нещо се обърка при зареждането на този компонент.
          </p>
          <button
            onClick={this.handleRetry}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowPathIcon className="h-4 w-4" />
            <span>Опитай отново</span>
          </button>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 text-sm text-gray-500">
              <summary className="cursor-pointer">Техническа информация</summary>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                {this.state.error?.toString()}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Hook-based Error Boundary for functional components
 */
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return setError
}

/**
 * HOC for wrapping components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}

/**
 * Simple error fallback components
 */
export const SimpleErrorFallback = ({ message = "Възникна грешка" }: { message?: string }) => (
  <div className="flex items-center justify-center p-4 text-gray-500 text-center">
    <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
    {message}
  </div>
)

export const ProductErrorFallback = () => (
  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
    <div className="text-center text-gray-500">
      <ExclamationTriangleIcon className="h-8 w-8 mx-auto mb-2" />
      <p className="text-sm">Грешка при зареждането</p>
    </div>
  </div>
) 