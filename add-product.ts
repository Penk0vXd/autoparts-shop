#!/usr/bin/env tsx

import { supabaseAdmin } from './src/lib/db'
import { readFileSync } from 'fs'
import { join } from 'path'

// Generate a unique SKU
async function generateSKU(): Promise<string> {
  const prefix = 'AP'
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `${prefix}-${timestamp}-${random}`
}

// Get all brands
async function getBrands() {
  const { data, error } = await supabaseAdmin
    .from('brands')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (error) {
    console.error('Error fetching brands:', error)
    return []
  }

  return data || []
}

// Get all categories
async function getCategories() {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data || []
}

// Create a slug from name
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9а-я]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// Main function to add product
async function addProduct() {
  console.log('🛍️  Adding New Product to Database\n')

  try {
    // Fetch brands and categories
    const brands = await getBrands()
    const categories = await getCategories()

    if (brands.length === 0 || categories.length === 0) {
      console.log('⚠️  No brands or categories found. Please run the seed script first.')
      return
    }

    // Display available brands
    console.log('📦 Available Brands:')
    brands.forEach((brand, index) => {
      console.log(`  ${index + 1}. ${brand.name} (${brand.slug})`)
    })

    // Display available categories
    console.log('\n📂 Available Categories:')
    categories.forEach((category, index) => {
      console.log(`  ${index + 1}. ${category.name} (${category.slug})`)
    })

    // Here's an example product - you can modify these values
    const productData = {
      name: 'Спирачни накладки Bosch Premium',
      description: 'Високококачествени спирачни накладки от Bosch с отлична спирачна сила и дълготрайност. Подходящи за интензивно градско каране.',
      short_description: 'Спирачни накладки Bosch Premium - надежни и дълготрайни',
      price: 65.99,
      compare_price: 79.99,
      cost_price: 39.99,
      stock: 25,
      weight: 1.2,
      brand_name: 'Bosch', // Will be converted to brand_id
      category_slug: 'spirachki' // Will be converted to category_id
    }

    // Find brand and category IDs
    const brand = brands.find(b => b.name === productData.brand_name)
    const category = categories.find(c => c.slug === productData.category_slug)

    if (!brand || !category) {
      console.error('❌ Brand or category not found!')
      return
    }

    // Generate SKU and slug
    const sku = await generateSKU()
    const slug = createSlug(productData.name)

    // Prepare product for insertion
    const product = {
      sku,
      name: productData.name,
      slug,
      description: productData.description,
      short_description: productData.short_description,
      price: productData.price,
      compare_price: productData.compare_price,
      cost_price: productData.cost_price,
      stock: productData.stock,
      min_stock_level: 5,
      weight: productData.weight,
      brand_id: brand.id,
      category_id: category.id,
      images: [
        `https://example.com/products/${sku.toLowerCase()}-1.jpg`,
        `https://example.com/products/${sku.toLowerCase()}-2.jpg`
      ],
      specifications: {
        material: 'Керамика',
        warranty: '24 месеца',
        origin: 'Германия',
        fitting_position: 'Предна ос'
      },
      compatibility: {
        makes: ['BMW', 'Mercedes', 'Audi', 'Volkswagen'],
        years: ['2015-2024'],
        models: ['3 Series', 'C-Class', 'A4', 'Golf']
      },
      is_active: true,
      is_featured: false,
      meta_title: `${productData.name} - Авточасти`,
      meta_description: `${productData.name} на най-добра цена. Бърза доставка и гаранция.`,
      meta_keywords: ['спирачни накладки', 'bosch', 'авточасти', 'спирачки']
    }

    // Insert the product
    const { data, error } = await supabaseAdmin
      .from('products')
      .insert([product])
      .select()

    if (error) {
      console.error('❌ Error adding product:', error)
      return
    }

    console.log('\n✅ Product added successfully!')
    console.log(`🆔 Product ID: ${data?.[0]?.id}`)
    console.log(`📦 SKU: ${sku}`)
    console.log(`🏷️  Name: ${productData.name}`)
    console.log(`💰 Price: ${productData.price} лв.`)
    console.log(`🏪 Stock: ${productData.stock} бр.`)
    console.log(`🔗 Brand: ${brand.name}`)
    console.log(`📂 Category: ${category.name}`)

    // Show how to customize for your own products
    console.log('\n📝 To add your own product:')
    console.log('1. Edit the productData object in this script')
    console.log('2. Change name, description, price, brand_name, category_slug')
    console.log('3. Run the script again: npx tsx add-product.ts')

  } catch (error) {
    console.error('❌ Failed to add product:', error)
  }
}

// Run the script
if (require.main === module) {
  addProduct()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Fatal error:', error)
      process.exit(1)
    })
} 