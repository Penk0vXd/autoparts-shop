import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'

export const dynamic = 'force-dynamic'

// Real automotive parts image URLs from reliable sources
const REAL_PRODUCT_IMAGES = {
  'brake-pads': [
    'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1570464197285-9949814674a7?w=500&h=500&fit=crop',
  ],
  'oil-filter': [
    'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=500&h=500&fit=crop',
  ],
  'air-filter': [
    'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1544456978-6d109a46cfe1?w=500&h=500&fit=crop',
  ],
  'spark-plugs': [
    'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1544456978-6d109a46cfe1?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=500&h=500&fit=crop',
  ],
  'shock-absorber': [
    'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1544456978-6d109a46cfe1?w=500&h=500&fit=crop',
  ],
  'battery': [
    'https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1589296159633-b1e4c8c8e56c?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=500&h=500&fit=crop',
  ],
  'wiper': [
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  ],
  'clutch': [
    'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1544456978-6d109a46cfe1?w=500&h=500&fit=crop',
  ],
  'default': [
    'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1570464197285-9949814674a7?w=500&h=500&fit=crop',
  ]
}

function getProductImageUrls(productName: string): string[] {
  const name = productName.toLowerCase()
  
  if (name.includes('brake') || name.includes('спирач')) {
    return REAL_PRODUCT_IMAGES['brake-pads']
  }
  if (name.includes('oil') || name.includes('масло')) {
    return REAL_PRODUCT_IMAGES['oil-filter']
  }
  if (name.includes('air') || name.includes('въздуш')) {
    return REAL_PRODUCT_IMAGES['air-filter']
  }
  if (name.includes('spark') || name.includes('свещ')) {
    return REAL_PRODUCT_IMAGES['spark-plugs']
  }
  if (name.includes('shock') || name.includes('амортис')) {
    return REAL_PRODUCT_IMAGES['shock-absorber']
  }
  if (name.includes('battery') || name.includes('акумулатор')) {
    return REAL_PRODUCT_IMAGES['battery']
  }
  if (name.includes('wiper') || name.includes('чистачк')) {
    return REAL_PRODUCT_IMAGES['wiper']
  }
  if (name.includes('clutch') || name.includes('съединител')) {
    return REAL_PRODUCT_IMAGES['clutch']
  }
  
  return REAL_PRODUCT_IMAGES['default']
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, imageUrls } = body

    if (!productId && !imageUrls) {
      // Update all products with smart image matching
      const { data: products, error: fetchError } = await supabase
        .from('products')
        .select('id, name, slug')
        .is('image_url', null)
        .limit(50)

      if (fetchError) {
        throw fetchError
      }

      const updates = products?.map(product => {
        const imageUrls = getProductImageUrls(product.name)
        return {
          id: product.id,
          image_url: imageUrls[0], // Primary image
          images: imageUrls // Multiple images
        }
      })

      if (updates && updates.length > 0) {
        const { error: updateError } = await supabase
          .from('products')
          .upsert(updates, { onConflict: 'id' })

        if (updateError) {
          throw updateError
        }
      }

      return NextResponse.json({ 
        message: `Updated ${updates?.length || 0} products with real image URLs`,
        updated: updates?.length || 0
      })
    }

    // Update specific product
    if (productId && imageUrls) {
      const { error } = await supabase
        .from('products')
        .update({
          image_url: imageUrls[0],
          images: imageUrls
        })
        .eq('id', productId)

      if (error) {
        throw error
      }

      return NextResponse.json({ 
        message: 'Product images updated successfully',
        productId,
        imageUrls
      })
    }

    return NextResponse.json({ 
      error: 'Invalid request body' 
    }, { status: 400 })

  } catch (error) {
    console.error('Error updating product images:', error)
    return NextResponse.json({ 
      error: 'Failed to update product images',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 