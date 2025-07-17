'use client'

import { useState, useEffect } from 'react'
import { CarSelection } from '@/components/CarSelection'
import { CarSelection as CarSelectionType } from '@/types/nhtsa'

export default function DebugPage() {
  const [selection, setSelection] = useState<CarSelectionType>({})
  const [apiTest, setApiTest] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testNHTSAAPI = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/test-nhtsa')
      const data = await response.json()
      setApiTest(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const testMakesAPI = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/nhtsa/makes')
      const data = await response.json()
      console.log('Makes API Response:', data)
      setApiTest(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Auto-test on page load
    testNHTSAAPI()
  }, [])

  const handleSelectionChange = (newSelection: CarSelectionType) => {
    setSelection(newSelection)
    console.log('Selection changed:', newSelection)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          CarSelection Debug Page
        </h1>
        <p className="text-gray-600">
          Simple testing for the NHTSA API and CarSelection component
        </p>
      </div>

      {/* API Test Buttons */}
      <div className="bg-white rounded-lg shadow-md p-6 border">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">API Tests</h2>
        <div className="flex space-x-4 mb-4">
          <button
            onClick={testNHTSAAPI}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test NHTSA API'}
          </button>
          <button
            onClick={testMakesAPI}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Makes API'}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-red-800 mb-2">Error:</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* API Response Display */}
        {apiTest && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">API Response:</h3>
            <pre className="text-sm text-gray-700 overflow-auto max-h-64">
              {JSON.stringify(apiTest, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* CarSelection Component Test */}
      <div className="bg-white rounded-lg shadow-md p-6 border">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">CarSelection Component Test</h2>
        <CarSelection
          onSelectionChange={handleSelectionChange}
          showYearSelector={true}
          showClearButton={true}
          size="md"
          placeholder={{
            make: 'Select Make',
            model: 'Select Model',
            year: 'Select Year'
          }}
        />
      </div>

      {/* Selection Output */}
      {(selection.make || selection.model || selection.year) && (
        <div className="bg-gray-50 rounded-lg p-6 border">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Selection Output</h2>
          <div className="bg-white rounded-lg p-4 border">
            <pre className="text-sm text-gray-700 overflow-auto">
              {JSON.stringify(selection, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Network Status */}
      <div className="bg-white rounded-lg shadow-md p-6 border">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Network Status</h2>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-700">Page loaded successfully</span>
          </div>
          <div className="flex items-center">
            <div className={`w-3 h-3 ${navigator.onLine ? 'bg-green-500' : 'bg-red-500'} rounded-full mr-2`}></div>
            <span className="text-sm text-gray-700">
              Network status: {navigator.onLine ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* Browser Console Reminder */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-800 mb-2">Debug Instructions:</h3>
        <p className="text-yellow-700 text-sm">
          Open your browser's Developer Tools (F12) and check the Console tab for error messages and network requests.
          If you see CORS errors, the API routes should handle them automatically.
        </p>
      </div>
    </div>
  )
} 