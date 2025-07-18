'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { SafeImage } from '@/components/ui/SafeImage'

interface Product {
  id: string
  name: string
  slug: string
  image_url: string | null
  images: string[] | null
  brand?: {
    name: string
  }
}

export default function ProductImagesAdmin() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [newImageUrl, setNewImageUrl] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?limit=50')
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateAllImages = async () => {
    setUpdating(true)
    setMessage('')
    
    try {
      const response = await fetch('/api/products/update-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      })
      
      const result = await response.json()
      
      if (response.ok) {
        setMessage(`✅ Success: ${result.message}`)
        fetchProducts() // Refresh the list
      } else {
        setMessage(`❌ Error: ${result.error}`)
      }
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setUpdating(false)
    }
  }

  const updateSingleProduct = async (productId: string, imageUrls: string[]) => {
    setUpdating(true)
    setMessage('')
    
    try {
      const response = await fetch('/api/products/update-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, imageUrls })
      })
      
      const result = await response.json()
      
      if (response.ok) {
        setMessage(`✅ Updated: ${result.message}`)
        fetchProducts() // Refresh the list
        setSelectedProduct(null)
        setNewImageUrl('')
      } else {
        setMessage(`❌ Error: ${result.error}`)
      }
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setUpdating(false)
    }
  }

  const handleUpdateSingle = () => {
    if (selectedProduct && newImageUrl) {
      const imageUrls = [newImageUrl]
      updateSingleProduct(selectedProduct.id, imageUrls)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Product Images Management</h1>
        
        {/* Bulk Update Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Bulk Update Images</h2>
          <p className="text-gray-600 mb-4">
            This will automatically assign real product images from Unsplash to all products based on their names.
          </p>
          
          <Button 
            onClick={updateAllImages}
            disabled={updating}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {updating ? 'Updating...' : 'Update All Product Images'}
          </Button>
          
          {message && (
            <div className="mt-4 p-3 rounded-md bg-gray-100">
              <p className="text-sm">{message}</p>
            </div>
          )}
        </div>

        {/* Manual Update Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Manual Update</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Product
              </label>
              <select 
                value={selectedProduct?.id || ''} 
                onChange={(e) => {
                  const product = products.find(p => p.id === e.target.value)
                  setSelectedProduct(product || null)
                  setNewImageUrl('')
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a product...</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} {product.brand?.name ? `(${product.brand.name})` : ''}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <Button 
            onClick={handleUpdateSingle}
            disabled={updating || !selectedProduct || !newImageUrl}
            className="bg-green-600 hover:bg-green-700"
          >
            {updating ? 'Updating...' : 'Update Product Image'}
          </Button>
          
          {selectedProduct && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <h3 className="font-medium mb-2">Current Image:</h3>
              <div className="flex items-center space-x-4">
                <SafeImage
                  src={selectedProduct.image_url || '/images/placeholder-product.svg'}
                  alt={selectedProduct.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div>
                  <p className="font-medium">{selectedProduct.name}</p>
                  <p className="text-sm text-gray-600">
                    {selectedProduct.image_url ? 'Has image' : 'No image'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Products List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Products ({products.length})</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.slice(0, 30).map(product => (
              <div key={product.id} className="border rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <SafeImage
                    src={product.image_url || '/images/placeholder-product.svg'}
                    alt={product.name}
                    width={60}
                    height={60}
                    className="w-15 h-15 object-cover rounded-md"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{product.name}</p>
                    <p className="text-xs text-gray-600 truncate">
                      {product.brand?.name || 'No brand'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {product.image_url ? '✅ Has image' : '❌ No image'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {products.length > 30 && (
            <p className="text-sm text-gray-500 mt-4 text-center">
              Showing first 30 products. Use bulk update to process all products.
            </p>
          )}
        </div>
      </div>
    </div>
  )
} 