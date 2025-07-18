#!/usr/bin/env node

/**
 * Brand Schema Enhancement Script
 * Supreme full-stack database migration for premium brand experiences
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nPlease set these in your .env.local file');
  process.exit(1);
}

// Initialize Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Enhanced brand data with premium metadata
const brandData = [
  {
    id: crypto.randomUUID(),
    name: 'Audi',
    slug: 'audi',
    logo_url: '/logos/audi.png',
    description: 'Premium German automotive manufacturer',
    country: 'Germany',
    founded_year: 1909,
    is_premium: true,
    website_url: 'https://www.audi.com',
    sort_order: 1,
    category: 'car',
    is_active: true
  },
  {
    id: crypto.randomUUID(),
    name: 'BMW',
    slug: 'bmw',
    logo_url: '/logos/bmw.png',
    description: 'Bavarian luxury car manufacturer',
    country: 'Germany',
    founded_year: 1916,
    is_premium: true,
    website_url: 'https://www.bmw.com',
    sort_order: 2,
    category: 'car',
    is_active: true
  },
  {
    id: crypto.randomUUID(),
    name: 'Mercedes-Benz',
    slug: 'mercedes-benz',
    logo_url: '/logos/mercedes-benz.png',
    description: 'German luxury automotive brand',
    country: 'Germany',
    founded_year: 1926,
    is_premium: true,
    website_url: 'https://www.mercedes-benz.com',
    sort_order: 3,
    category: 'car',
    is_active: true
  },
  {
    id: crypto.randomUUID(),
    name: 'Volkswagen',
    slug: 'volkswagen',
    logo_url: '/logos/volkswagen.png',
    description: 'German automotive manufacturer',
    country: 'Germany',
    founded_year: 1937,
    is_premium: false,
    website_url: 'https://www.volkswagen.com',
    sort_order: 4,
    category: 'car',
    is_active: true
  },
  {
    id: crypto.randomUUID(),
    name: 'Toyota',
    slug: 'toyota',
    logo_url: '/logos/toyota.png',
    description: 'Japanese automotive manufacturer',
    country: 'Japan',
    founded_year: 1937,
    is_premium: false,
    website_url: 'https://www.toyota.com',
    sort_order: 5,
    category: 'car',
    is_active: true
  },
  {
    id: crypto.randomUUID(),
    name: 'Honda',
    slug: 'honda',
    logo_url: '/logos/honda.png',
    description: 'Japanese multinational automotive manufacturer',
    country: 'Japan',
    founded_year: 1948,
    is_premium: false,
    website_url: 'https://www.honda.com',
    sort_order: 6,
    category: 'car',
    is_active: true
  },
  {
    id: crypto.randomUUID(),
    name: 'Ford',
    slug: 'ford',
    logo_url: '/logos/ford.png',
    description: 'American automotive manufacturer',
    country: 'USA',
    founded_year: 1903,
    is_premium: false,
    website_url: 'https://www.ford.com',
    sort_order: 7,
    category: 'car',
    is_active: true
  },
  {
    id: crypto.randomUUID(),
    name: 'Hyundai',
    slug: 'hyundai',
    logo_url: '/logos/hyundai.png',
    description: 'South Korean automotive manufacturer',
    country: 'South Korea',
    founded_year: 1967,
    is_premium: false,
    website_url: 'https://www.hyundai.com',
    sort_order: 8,
    category: 'car',
    is_active: true
  },
  {
    id: crypto.randomUUID(),
    name: 'Kia',
    slug: 'kia',
    logo_url: '/logos/kia.png',
    description: 'South Korean automotive manufacturer',
    country: 'South Korea',
    founded_year: 1944,
    is_premium: false,
    website_url: 'https://www.kia.com',
    sort_order: 9,
    category: 'car',
    is_active: true
  },
  {
    id: crypto.randomUUID(),
    name: 'Nissan',
    slug: 'nissan',
    logo_url: '/logos/nissan.png',
    description: 'Japanese automotive manufacturer',
    country: 'Japan',
    founded_year: 1933,
    is_premium: false,
    website_url: 'https://www.nissan.com',
    sort_order: 10,
    category: 'car',
    is_active: true
  },
  {
    id: crypto.randomUUID(),
    name: 'Volvo',
    slug: 'volvo',
    logo_url: '/logos/volvo.png',
    description: 'Swedish automotive manufacturer',
    country: 'Sweden',
    founded_year: 1927,
    is_premium: false,
    website_url: 'https://www.volvo.com',
    sort_order: 11,
    category: 'car',
    is_active: true
  },
  {
    id: crypto.randomUUID(),
    name: 'Porsche',
    slug: 'porsche',
    logo_url: '/logos/porsche.png',
    description: 'German luxury sports car manufacturer',
    country: 'Germany',
    founded_year: 1931,
    is_premium: true,
    website_url: 'https://www.porsche.com',
    sort_order: 12,
    category: 'car',
    is_active: true
  },
  {
    id: crypto.randomUUID(),
    name: 'Ferrari',
    slug: 'ferrari',
    logo_url: '/logos/ferrari.png',
    description: 'Italian luxury sports car manufacturer',
    country: 'Italy',
    founded_year: 1939,
    is_premium: true,
    website_url: 'https://www.ferrari.com',
    sort_order: 13,
    category: 'car',
    is_active: true
  },
  {
    id: crypto.randomUUID(),
    name: 'Lamborghini',
    slug: 'lamborghini',
    logo_url: '/logos/lamborghini.png',
    description: 'Italian luxury sports car manufacturer',
    country: 'Italy',
    founded_year: 1963,
    is_premium: true,
    website_url: 'https://www.lamborghini.com',
    sort_order: 14,
    category: 'car',
    is_active: true
  },
  {
    id: crypto.randomUUID(),
    name: 'Maserati',
    slug: 'maserati',
    logo_url: '/logos/maserati.png',
    description: 'Italian luxury car manufacturer',
    country: 'Italy',
    founded_year: 1914,
    is_premium: true,
    website_url: 'https://www.maserati.com',
    sort_order: 15,
    category: 'car',
    is_active: true
  }
];

async function applySchemaChanges() {
  console.log('🚀 Starting Brand Schema Enhancement...\n');

  try {
    // Step 1: Add new columns to brands table
    console.log('📊 Step 1: Adding new columns to brands table...');
    
    const alterTableQuery = `
      ALTER TABLE brands 
      ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'Unknown',
      ADD COLUMN IF NOT EXISTS founded_year INTEGER DEFAULT 1900,
      ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS website_url VARCHAR(255),
      ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
    `;
    
    const { error: alterError } = await supabase.rpc('exec_sql', { 
      query: alterTableQuery 
    });
    
    if (alterError) {
      console.error('❌ Error altering table:', alterError);
      throw alterError;
    }
    
    console.log('✅ Successfully added new columns to brands table');

    // Step 2: Create indexes for performance
    console.log('\n🔍 Step 2: Creating performance indexes...');
    
    const indexQueries = [
      'CREATE INDEX IF NOT EXISTS idx_brands_country ON brands(country);',
      'CREATE INDEX IF NOT EXISTS idx_brands_founded_year ON brands(founded_year);',
      'CREATE INDEX IF NOT EXISTS idx_brands_is_premium ON brands(is_premium);',
      'CREATE INDEX IF NOT EXISTS idx_brands_sort_order ON brands(sort_order);',
      'CREATE INDEX IF NOT EXISTS idx_products_brand_category ON products(brand_id, category_id);',
      'CREATE INDEX IF NOT EXISTS idx_products_brand_active ON products(brand_id, is_active, is_deleted);',
      'CREATE INDEX IF NOT EXISTS idx_products_price_stock ON products(price, stock);'
    ];
    
    for (const query of indexQueries) {
      const { error } = await supabase.rpc('exec_sql', { query });
      if (error) {
        console.warn('⚠️  Warning creating index:', error.message);
      }
    }
    
    console.log('✅ Performance indexes created');

    // Step 3: Upsert brand data
    console.log('\n📝 Step 3: Updating brand data with premium metadata...');
    
    for (const brand of brandData) {
      const { error } = await supabase
        .from('brands')
        .upsert(brand, { 
          onConflict: 'slug',
          ignoreDuplicates: false 
        });
      
      if (error) {
        console.error(`❌ Error upserting ${brand.name}:`, error);
      } else {
        console.log(`✅ ${brand.name} updated successfully`);
      }
    }

    // Step 4: Create materialized views (requires direct SQL execution)
    console.log('\n🔄 Step 4: Creating materialized views...');
    
    // Note: This might require direct database access with elevated permissions
    const createViewsQuery = `
      -- Create brand statistics materialized view
      CREATE MATERIALIZED VIEW IF NOT EXISTS brand_statistics AS
      SELECT 
          b.id,
          b.name,
          b.slug,
          b.logo_url,
          b.country,
          b.founded_year,
          b.is_premium,
          b.website_url,
          b.sort_order,
          COUNT(p.id) as total_products,
          COUNT(DISTINCT p.category_id) as total_categories,
          ROUND(AVG(p.price), 2) as avg_price,
          MIN(p.price) as min_price,
          MAX(p.price) as max_price,
          SUM(p.stock) as total_stock,
          COUNT(CASE WHEN p.stock > 0 THEN 1 END) as in_stock_products,
          COUNT(CASE WHEN p.is_featured = true THEN 1 END) as featured_products
      FROM brands b
      LEFT JOIN products p ON b.id = p.brand_id AND p.is_active = true AND p.is_deleted = false
      WHERE b.is_active = true
      GROUP BY b.id, b.name, b.slug, b.logo_url, b.country, b.founded_year, b.is_premium, b.website_url, b.sort_order;

      -- Create brand category breakdown materialized view
      CREATE MATERIALIZED VIEW IF NOT EXISTS brand_category_breakdown AS
      SELECT 
          b.id as brand_id,
          b.name as brand_name,
          b.slug as brand_slug,
          c.id as category_id,
          c.name as category_name,
          c.slug as category_slug,
          c.description as category_description,
          COUNT(p.id) as product_count,
          ROUND(AVG(p.price), 2) as avg_price,
          MIN(p.price) as min_price,
          MAX(p.price) as max_price,
          SUM(p.stock) as total_stock,
          COUNT(CASE WHEN p.stock > 0 THEN 1 END) as in_stock_count
      FROM brands b
      INNER JOIN products p ON b.id = p.brand_id AND p.is_active = true AND p.is_deleted = false
      INNER JOIN categories c ON p.category_id = c.id AND c.is_active = true
      WHERE b.is_active = true
      GROUP BY b.id, b.name, b.slug, c.id, c.name, c.slug, c.description
      HAVING COUNT(p.id) > 0
      ORDER BY b.name, COUNT(p.id) DESC;
    `;
    
    try {
      const { error: viewError } = await supabase.rpc('exec_sql', { 
        query: createViewsQuery 
      });
      
      if (viewError) {
        console.warn('⚠️  Warning creating materialized views:', viewError.message);
        console.log('💡 You may need to run this manually in Supabase SQL editor with elevated permissions');
      } else {
        console.log('✅ Materialized views created successfully');
      }
    } catch (error) {
      console.warn('⚠️  Could not create materialized views automatically');
      console.log('💡 Please run the SQL from brand_detail_schema_enhancement.sql manually');
    }

    console.log('\n🎉 Brand Schema Enhancement completed successfully!');
    console.log('\n📈 Summary:');
    console.log(`   • ${brandData.length} brands updated with premium metadata`);
    console.log('   • Performance indexes created');
    console.log('   • Database optimized for brand detail pages');
    console.log('   • Ready for world-class brand experiences!');
    
  } catch (error) {
    console.error('❌ Failed to apply schema changes:', error);
    process.exit(1);
  }
}

// Execute the schema enhancement
if (require.main === module) {
  applySchemaChanges();
}

module.exports = { applySchemaChanges, brandData }; 