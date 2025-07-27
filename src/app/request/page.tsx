'use client'

import { useState } from 'react'
import Link from 'next/link'

interface FormData {
  full_name: string
  phone: string
  car_details: string
  message: string
}

export default function RequestPage() {
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    phone: '',
    car_details: '',
    message: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setIsSuccess(true)
        setFormData({
          full_name: '',
          phone: '',
          car_details: '',
          message: ''
        })
      } else {
        setError(result.error || 'Something went wrong. Please try again.')
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-blue-600 text-white py-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Link href="/" className="text-2xl font-bold hover:underline">
              AutoParts Store
            </Link>
          </div>
        </header>

        {/* Success Message */}
        <main className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-green-800 mb-4">
              Request Submitted Successfully!
            </h1>
            <p className="text-lg text-green-700 mb-6">
              Thank you for your inquiry. Our team will review your request and contact you within 2 business hours.
            </p>
            <div className="space-y-4">
              <Link
                href="/request"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mr-4"
                onClick={() => setIsSuccess(false)}
              >
                Submit Another Request
              </Link>
              <Link
                href="/"
                className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Link href="/" className="text-2xl font-bold hover:underline">
            AutoParts Store
          </Link>
          <p className="text-lg mt-2">Submit Parts Request</p>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Parts Request Form</h1>
          <p className="text-gray-600 mb-8">
            Fill out the form below and our experts will help you find the right part for your vehicle.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Car Details */}
            <div>
              <label htmlFor="car_details" className="block text-sm font-medium text-gray-700 mb-2">
                Car Details *
              </label>
              <input
                type="text"
                id="car_details"
                name="car_details"
                value={formData.car_details}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., BMW 320i 2018, Mercedes C200 2020"
              />
              <p className="text-sm text-gray-500 mt-1">
                Include make, model, year, and engine size if known
              </p>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Part Description / Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                placeholder="Describe the part you need, any part numbers you have, or additional details that might help us find the right part for you..."
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>

            <div className="text-center pt-4">
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                ← Back to Home
              </Link>
            </div>
          </form>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
          <ul className="text-blue-800 space-y-1 text-sm">
            <li>• Our experts will review your request</li>
            <li>• We'll search our network of suppliers</li>
            <li>• You'll receive a response within 2 business hours</li>
            <li>• Get pricing and availability information</li>
          </ul>
        </div>
      </main>
    </div>
  )
} 