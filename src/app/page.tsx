import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AutoParts Store - Find Your Car Parts',
  description: 'Professional auto parts inquiry service. Submit a request and we will find exactly what you need.',
  keywords: 'auto parts, car parts, parts inquiry, automotive',
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-blue-600 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-2">AutoParts Store</h1>
          <p className="text-xl">Professional Auto Parts Inquiry Service</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Can't Find the Right Part?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Don't worry! Our experts will help you find exactly what you need. 
            Simply fill out our inquiry form with your car details and the part you're looking for.
          </p>
          
          <Link 
            href="/request"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Submit Parts Request
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="text-3xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Expert Search</h3>
            <p className="text-gray-600">Our team will search through thousands of suppliers to find your part</p>
          </div>
          
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Fast Response</h3>
            <p className="text-gray-600">Get a response within 2 hours during business days</p>
          </div>
          
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="text-3xl mb-4">✅</div>
            <h3 className="text-xl font-semibold mb-2">Quality Guaranteed</h3>
            <p className="text-gray-600">All parts come with warranty and quality assurance</p>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-blue-50 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-center mb-6">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3 font-bold">1</div>
              <p className="font-semibold">Submit Request</p>
              <p className="text-sm text-gray-600">Fill out the form with your car details</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3 font-bold">2</div>
              <p className="font-semibold">We Search</p>
              <p className="text-sm text-gray-600">Our experts find the right part</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3 font-bold">3</div>
              <p className="font-semibold">Get Quote</p>
              <p className="text-sm text-gray-600">Receive price and availability</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3 font-bold">4</div>
              <p className="font-semibold">Fast Delivery</p>
              <p className="text-sm text-gray-600">Get your part delivered quickly</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p>&copy; 2024 AutoParts Store. Professional auto parts inquiry service.</p>
          <p className="mt-2 text-gray-400">Contact: info@autoparts-store.com | Phone: +1-555-0123</p>
        </div>
      </footer>
    </div>
  )
}  