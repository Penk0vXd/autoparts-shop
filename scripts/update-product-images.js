#!/usr/bin/env node

/**
 * Script to update product images with real URLs
 * This script will fetch all products and update their images with appropriate URLs
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Real automotive parts image URLs from reliable sources
const REAL_PRODUCT_IMAGES = {
  'brake-pads': [
    'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1570464197285-9949814674a7?w=600&h=600&fit=crop&crop=center',
  ],
  'oil-filter': [
    'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=600&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=600&h=600&fit=crop&crop=center',
  ],
  'air-filter': [
    'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=600&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?w=600&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1544456978-6d109a46cfe1?w=600&h=600&fit=crop&crop=center',
  ],
  'spark-plugs': [
    'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1544456978-6d109a46cfe1?w=600&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=600&h=600&fit=crop&crop=center',
  ],
  'shock-absorber': [
    'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=600&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1544456978-6d109a46cfe1?w=600&h=600&fit=crop&crop=center',
  ],
  'battery': [
    'https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?w=600&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1589296159633-b1e4c8c8e56c?w=600&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=600&h=600&fit=crop&crop=center',
  ],
  'wiper': [
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&crop=center',
  ],
  'clutch': [
    'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=600&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1544456978-6d109a46cfe1?w=600&h=600&fit=crop&crop=center',
  ],
  'default': [
    'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1570464197285-9949814674a7?w=600&h=600&fit=crop&crop=center',
  ]
}

function getProductImageUrls(productName) {
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

async function updateProductImages() {
  console.log('🚀 Starting product image update...')
  
  try {
    // Fetch all products that need image updates
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, name, slug, image_url')
      .or('image_url.is.null,image_url.like.%example.com%')
      .limit(100)

    if (fetchError) {
      console.error('❌ Error fetching products:', fetchError)
      return
    }

    console.log(`📦 Found ${products.length} products to update`)

    let updated = 0
    const batchSize = 10

    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize)
      
      const updates = batch.map(product => {
        const imageUrls = getProductImageUrls(product.name)
        return {
          id: product.id,
          image_url: imageUrls[0], // Primary image
          images: imageUrls // Multiple images as JSON
        }
      })

      const { error: updateError } = await supabase
        .from('products')
        .upsert(updates, { onConflict: 'id' })

      if (updateError) {
        console.error('❌ Error updating batch:', updateError)
        continue
      }

      updated += batch.length
      console.log(`✅ Updated ${updated}/${products.length} products`)
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    console.log(`🎉 Successfully updated ${updated} products with real image URLs!`)
    
    // Show sample of updated products
    const { data: sampleProducts } = await supabase
      .from('products')
      .select('id, name, image_url')
      .not('image_url', 'is', null)
      .limit(5)

    if (sampleProducts) {
      console.log('\n📸 Sample products with new images:')
      sampleProducts.forEach(product => {
        console.log(`- ${product.name}`)
        console.log(`  Image: ${product.image_url}`)
      })
    }

  } catch (error) {
    console.error('❌ Script failed:', error)
  }
}

// Run the script
updateProductImages()
  .then(() => {
    console.log('\n✅ Script completed successfully!')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  }) 