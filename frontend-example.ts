// Frontend example for calling the Discord webhook API
// This shows how to properly call the /api/request endpoint

interface RequestData {
  full_name: string
  phone: string
  car_details: string
  message: string
}

interface ApiResponse {
  success: boolean
  message?: string
  id?: string
  discord_sent?: boolean
  error?: string
}

// Example 1: Basic fetch call
async function submitRequestBasic(data: RequestData): Promise<ApiResponse> {
  try {
    const response = await fetch('/api/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Request failed:', error)
    return {
      success: false,
      error: 'Network error'
    }
  }
}

// Example 2: Advanced fetch call with better error handling
async function submitRequestAdvanced(data: RequestData): Promise<ApiResponse> {
  try {
    console.log('Submitting request:', { 
      full_name: data.full_name ? '***' : 'missing',
      phone: data.phone ? '***' : 'missing',
      car_details: data.car_details ? '***' : 'missing',
      message: data.message ? '***' : 'missing'
    })

    const response = await fetch('/api/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('API error:', errorData)
      return {
        success: false,
        error: errorData.error || `HTTP ${response.status}`
      }
    }

    const result = await response.json()
    console.log('Request successful:', result)
    return result

  } catch (error) {
    console.error('Request failed:', error)
    return {
      success: false,
      error: 'Network error - please check your connection'
    }
  }
}

// Example 3: React hook for form submission
import { useState } from 'react'

export function useRequestSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const submitRequest = async (data: RequestData) => {
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const result = await submitRequestAdvanced(data)
      
      if (result.success) {
        setSuccess(true)
        console.log('Request submitted successfully:', result)
      } else {
        setError(result.error || 'Unknown error occurred')
        console.error('Request failed:', result.error)
      }
    } catch (err) {
      setError('Network error - please try again')
      console.error('Submission error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    submitRequest,
    isSubmitting,
    error,
    success
  }
}

// Example 4: Form component usage
export function RequestForm() {
  const { submitRequest, isSubmitting, error, success } = useRequestSubmission()
  const [formData, setFormData] = useState<RequestData>({
    full_name: '',
    phone: '',
    car_details: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await submitRequest(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-green-800 font-semibold">Request Submitted Successfully!</h3>
        <p className="text-green-700">We'll get back to you soon.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="full_name" className="block text-sm font-medium">
          Full Name *
        </label>
        <input
          type="text"
          id="full_name"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium">
          Phone Number *
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div>
        <label htmlFor="car_details" className="block text-sm font-medium">
          Car Details *
        </label>
        <input
          type="text"
          id="car_details"
          name="car_details"
          value={formData.car_details}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-md"
          placeholder="e.g., BMW 320i 2018"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Describe the part you need..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Request'}
      </button>
    </form>
  )
}

// Example 5: Direct API call without React
export async function testApiCall() {
  const testData: RequestData = {
    full_name: 'John Doe',
    phone: '+1234567890',
    car_details: 'BMW 320i 2018',
    message: 'I need brake pads for my BMW'
  }

  console.log('Testing API call...')
  const result = await submitRequestAdvanced(testData)
  console.log('API result:', result)
  
  if (result.success) {
    console.log('✅ Request submitted successfully')
    console.log('Request ID:', result.id)
    console.log('Discord notification sent:', result.discord_sent)
  } else {
    console.log('❌ Request failed:', result.error)
  }
} 