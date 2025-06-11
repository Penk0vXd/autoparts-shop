import { supabaseAdmin } from './src/lib/db'

const brands = [
  {
    name: 'Bosch',
    slug: 'bosch',
    category: 'car',
    description: 'Водещ световен производител на автомобилни части и системи',
    logo_url: 'https://example.com/logos/bosch.png'
  },
  {
    name: 'Febi Bilstein',
    slug: 'febi-bilstein',
    category: 'car',
    description: 'Германско качество за всички марки автомобили от 1844 година',
    logo_url: 'https://example.com/logos/febi.png'
  },
  {
    name: 'Sachs',
    slug: 'sachs',
    category: 'car',
    description: 'Специалист в окачването, съединителите и амортисьорите',
    logo_url: 'https://example.com/logos/sachs.png'
  },
  {
    name: 'Brembo',
    slug: 'brembo',
    category: 'car',
    description: 'Премиум спирачни системи за високи експлоатационни нужди',
    logo_url: 'https://example.com/logos/brembo.png'
  },
  {
    name: 'Thule',
    slug: 'thule',
    category: 'accessory',
    description: 'Водещ производител на багажници и транспортни решения',
    logo_url: 'https://example.com/logos/thule.png'
  },
  {
    name: 'Hella',
    slug: 'hella',
    category: 'accessory',
    description: 'Премиум осветление и електронни аксесоари',
    logo_url: 'https://example.com/logos/hella.png'
  },
  {
    name: 'Castrol',
    slug: 'castrol',
    category: 'parts',
    description: 'Водещ производител на моторни масла и течности',
    logo_url: 'https://example.com/logos/castrol.png'
  },
  {
    name: 'Mann Filter',
    slug: 'mann-filter',
    category: 'parts',
    description: 'Специалист във филтрите за автомобили',
    logo_url: 'https://example.com/logos/mann.png'
  }
]

const categories = [
  {
    name: 'Двигател',
    slug: 'dvigatel',
    description: 'Части за автомобилни двигатели - филтри, масла, свещи',
    image_url: 'https://example.com/categories/engine.jpg'
  },
  {
    name: 'Спирачки',
    slug: 'spirachki',
    description: 'Спирачни дискове, накладки, челюсти и системи',
    image_url: 'https://example.com/categories/brakes.jpg'
  },
  {
    name: 'Окачване',
    slug: 'okachvane',
    description: 'Амортисьори, пружини и елементи на окачването',
    image_url: 'https://example.com/categories/suspension.jpg'
  },
  {
    name: 'Електрика',
    slug: 'elektrika',
    description: 'Електрически части, кабели и аксесоари',
    image_url: 'https://example.com/categories/electrical.jpg'
  }
]

async function generateSKU(): Promise<string> {
  const prefix = 'AP'
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `${prefix}-${timestamp}-${random}`
}

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...')

    // Clear existing data
    console.log('🧹 Clearing existing data...')
    await supabaseAdmin.from('order_items').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabaseAdmin.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabaseAdmin.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabaseAdmin.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabaseAdmin.from('brands').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    // Insert brands
    console.log('📦 Inserting brands...')
    const { data: insertedBrands, error: brandsError } = await supabaseAdmin
      .from('brands')
      .insert(brands)
      .select()

    if (brandsError) {
      throw new Error(`Failed to insert brands: ${brandsError.message}`)
    }

    console.log(`✅ Inserted ${insertedBrands?.length} brands`)

    // Insert categories
    console.log('📂 Inserting categories...')
    const { data: insertedCategories, error: categoriesError } = await supabaseAdmin
      .from('categories')
      .insert(categories)
      .select()

    if (categoriesError) {
      throw new Error(`Failed to insert categories: ${categoriesError.message}`)
    }

    console.log(`✅ Inserted ${insertedCategories?.length} categories`)

    // Generate products
    const products = []
    const productTemplates = [
      // Engine products
      { name: 'Маслен филтър', category: 'dvigatel', prices: [15.99, 18.50, 22.99] },
      { name: 'Въздушен филтър', category: 'dvigatel', prices: [25.99, 32.00, 28.50] },
      { name: 'Горивен филтър', category: 'dvigatel', prices: [35.99, 42.00, 38.50] },
      
      // Brake products
      { name: 'Спирачни накладки', category: 'spirachki', prices: [45.99, 55.00, 65.99] },
      { name: 'Спирачни дискове', category: 'spirachki', prices: [89.99, 125.00, 155.99] },
      { name: 'Спирачна течност', category: 'spirachki', prices: [12.99, 15.50, 18.99] },
      
      // Suspension products
      { name: 'Амортисьор преден', category: 'okachvane', prices: [125.99, 165.00, 195.99] },
      { name: 'Амортисьор заден', category: 'okachvane', prices: [115.99, 145.00, 175.99] },
      { name: 'Стабилизираща щанга', category: 'okachvane', prices: [35.99, 45.00, 55.99] },
      
      // Electrical products
      { name: 'Акумулатор', category: 'elektrika', prices: [125.99, 155.00, 185.99] },
      { name: 'Алтернатор', category: 'elektrika', prices: [245.99, 285.00, 325.99] },
      { name: 'Стартер', category: 'elektrika', prices: [195.99, 225.00, 265.99] }
    ]

    for (const template of productTemplates) {
      for (let i = 0; i < insertedBrands!.length; i++) {
        const brand = insertedBrands![i]
        const category = insertedCategories!.find(c => c.slug === template.category)!
        const sku = await generateSKU()
        
        products.push({
          sku,
          name: `${template.name} ${brand.name}`,
          slug: `${template.name.toLowerCase().replace(/\s+/g, '-')}-${brand.slug}`,
          description: `Качествен ${template.name.toLowerCase()} от ${brand.name} - надежден и дълготраен продукт за вашия автомобил.`,
          short_description: `${template.name} ${brand.name} с отлично качество`,
          category_id: category.id,
          brand_id: brand.id,
          price: template.prices[i] || template.prices[0],
          compare_price: (template.prices[i] || template.prices[0]) * 1.2,
          cost_price: (template.prices[i] || template.prices[0]) * 0.6,
          stock: Math.floor(Math.random() * 100) + 10,
          min_stock_level: 5,
          weight: Math.round((Math.random() * 5 + 0.5) * 100) / 100,
          image_url: `https://example.com/products/${sku.toLowerCase()}.jpg`,
          images: [
            `https://example.com/products/${sku.toLowerCase()}-1.jpg`,
            `https://example.com/products/${sku.toLowerCase()}-2.jpg`
          ],
          specifications: {
            material: brand.name === 'Bosch' ? 'Алуминий' : 'Стомана',
            warranty: brand.name === 'Brembo' ? '24 месеца' : '12 месеца',
            origin: brand.name === 'Febi Bilstein' ? 'Германия' : 'ЕС'
          },
          compatibility: {
            makes: ['BMW', 'Mercedes', 'Audi', 'Volkswagen', 'Opel'],
            years: ['2010-2024']
          },
          is_active: true,
          is_featured: Math.random() > 0.7,
          meta_title: `${template.name} ${brand.name} - Авточасти`,
          meta_description: `Купете ${template.name.toLowerCase()} ${brand.name} на най-добра цена. Бърза доставка и гаранция.`
        })
      }
    }

    // Insert products in batches
    console.log('🛍️ Inserting products...')
    const batchSize = 10
    let insertedProductsCount = 0

    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize)
      const { error: productsError } = await supabaseAdmin
        .from('products')
        .insert(batch)

      if (productsError) {
        throw new Error(`Failed to insert products batch: ${productsError.message}`)
      }

      insertedProductsCount += batch.length
      console.log(`✅ Inserted ${insertedProductsCount}/${products.length} products`)
    }

    console.log('\n🎉 Database seeding completed successfully!')
    console.log(`📊 Summary:`)
    console.log(`   • ${insertedBrands?.length} brands`)
    console.log(`   • ${insertedCategories?.length} categories`)
    console.log(`   • ${products.length} products`)

  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

export default seedDatabase 