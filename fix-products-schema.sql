-- 🔧 FIX PRODUCTS SCHEMA - Ensure Products Show on Website
-- Copy and paste this entire script into Supabase SQL Editor and run it

-- This script fixes common issues that prevent products from showing on your website

-- 1. First, check if we have the basic tables
DO $$
BEGIN
    -- Create brands table if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'brands' AND table_schema = 'public') THEN
        CREATE TABLE brands (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL UNIQUE,
            slug TEXT NOT NULL UNIQUE,
            logo_url TEXT,
            description TEXT,
            website_url TEXT,
            is_active BOOLEAN DEFAULT true,
            sort_order INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE 'Created brands table';
    END IF;
    
    -- Create categories table if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'categories' AND table_schema = 'public') THEN
        CREATE TABLE categories (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL UNIQUE,
            slug TEXT NOT NULL UNIQUE,
            description TEXT,
            icon_url TEXT,
            parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
            is_active BOOLEAN DEFAULT true,
            sort_order INTEGER DEFAULT 0,
            seo_title TEXT,
            seo_description TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE 'Created categories table';
    END IF;
    
    -- Create products table if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'products' AND table_schema = 'public') THEN
        CREATE TABLE products (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            sku TEXT NOT NULL UNIQUE,
            name TEXT NOT NULL,
            slug TEXT NOT NULL UNIQUE,
            description TEXT,
            short_description TEXT,
            price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
            compare_price NUMERIC(10,2) CHECK (compare_price >= 0),
            cost_price NUMERIC(10,2) CHECK (cost_price >= 0),
            stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
            min_stock_level INTEGER DEFAULT 0,
            track_inventory BOOLEAN DEFAULT true,
            allow_backorder BOOLEAN DEFAULT false,
            weight NUMERIC(8,3),
            dimensions JSONB,
            images TEXT[],
            specifications JSONB,
            compatibility JSONB,
            brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
            category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
            is_active BOOLEAN DEFAULT true,
            is_featured BOOLEAN DEFAULT false,
            requires_compatibility_check BOOLEAN DEFAULT false,
            meta_title TEXT,
            meta_description TEXT,
            meta_keywords TEXT[],
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE 'Created products table';
    END IF;
END $$;

-- 2. Add missing columns that the frontend expects
DO $$
BEGIN
    -- Add is_deleted column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' 
                   AND column_name = 'is_deleted' 
                   AND table_schema = 'public') THEN
        ALTER TABLE products ADD COLUMN is_deleted BOOLEAN DEFAULT false;
        UPDATE products SET is_deleted = false WHERE is_deleted IS NULL;
        RAISE NOTICE 'Added is_deleted column to products table';
    END IF;
    
    -- Add stock_quantity column if it doesn't exist (some frontend components expect this)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' 
                   AND column_name = 'stock_quantity' 
                   AND table_schema = 'public') THEN
        ALTER TABLE products ADD COLUMN stock_quantity INTEGER DEFAULT 0;
        UPDATE products SET stock_quantity = stock WHERE stock_quantity = 0;
        RAISE NOTICE 'Added stock_quantity column to products table';
    END IF;
    
    -- Add image_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' 
                   AND column_name = 'image_url' 
                   AND table_schema = 'public') THEN
        ALTER TABLE products ADD COLUMN image_url TEXT;
        UPDATE products SET image_url = images[1] WHERE images IS NOT NULL AND array_length(images, 1) > 0;
        RAISE NOTICE 'Added image_url column to products table';
    END IF;
    
    -- Add fields that some components might expect
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' 
                   AND column_name = 'is_on_sale' 
                   AND table_schema = 'public') THEN
        ALTER TABLE products ADD COLUMN is_on_sale BOOLEAN DEFAULT false;
        UPDATE products SET is_on_sale = (compare_price > price) WHERE compare_price IS NOT NULL;
        RAISE NOTICE 'Added is_on_sale column to products table';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' 
                   AND column_name = 'original_price' 
                   AND table_schema = 'public') THEN
        ALTER TABLE products ADD COLUMN original_price NUMERIC(10,2);
        UPDATE products SET original_price = compare_price WHERE compare_price IS NOT NULL;
        RAISE NOTICE 'Added original_price column to products table';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' 
                   AND column_name = 'part_number' 
                   AND table_schema = 'public') THEN
        ALTER TABLE products ADD COLUMN part_number TEXT;
        UPDATE products SET part_number = sku WHERE part_number IS NULL;
        RAISE NOTICE 'Added part_number column to products table';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' 
                   AND column_name = 'is_new' 
                   AND table_schema = 'public') THEN
        ALTER TABLE products ADD COLUMN is_new BOOLEAN DEFAULT false;
        RAISE NOTICE 'Added is_new column to products table';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' 
                   AND column_name = 'discount_percent' 
                   AND table_schema = 'public') THEN
        ALTER TABLE products ADD COLUMN discount_percent INTEGER;
        UPDATE products SET discount_percent = ROUND(((compare_price - price) / compare_price * 100)::numeric) 
        WHERE compare_price IS NOT NULL AND compare_price > price;
        RAISE NOTICE 'Added discount_percent column to products table';
    END IF;
END $$;

-- 3. Add basic seed data if tables are empty
DO $$
BEGIN
    -- Insert brands if table is empty
    IF (SELECT COUNT(*) FROM brands) = 0 THEN
        INSERT INTO brands (name, slug, description, is_active) VALUES
        ('Bosch', 'bosch', 'Водещ световен производител на автомобилни части и системи', true),
        ('Febi Bilstein', 'febi-bilstein', 'Германско качество за всички марки автомобили от 1844 година', true),
        ('Sachs', 'sachs', 'Специалист в окачването, съединителите и амортисьорите', true),
        ('Brembo', 'brembo', 'Премиум спирачни системи за високи експлоатационни нужди', true),
        ('Thule', 'thule', 'Водещ производител на багажници и транспортни решения', true),
        ('Hella', 'hella', 'Премиум осветление и електронни аксесоари', true),
        ('Castrol', 'castrol', 'Водещ производител на моторни масла и течности', true),
        ('Mann Filter', 'mann-filter', 'Специалист във филтрите за автомобили', true);
        RAISE NOTICE 'Inserted seed brands';
    END IF;
    
    -- Insert categories if table is empty
    IF (SELECT COUNT(*) FROM categories) = 0 THEN
        INSERT INTO categories (name, slug, description, is_active) VALUES
        ('Двигател', 'dvigatel', 'Части за автомобилни двигатели - филтри, масла, свещи', true),
        ('Спирачки', 'spirachki', 'Спирачни дискове, накладки, челюсти и системи', true),
        ('Окачване', 'okachvane', 'Амортисьори, пружини и елементи на окачването', true),
        ('Електрика', 'elektrika', 'Електрически части, кабели и аксесоари', true);
        RAISE NOTICE 'Inserted seed categories';
    END IF;
END $$;

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_products_not_deleted ON products(is_deleted) WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS idx_products_brand_active ON products(brand_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_products_category_active ON products(category_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);

-- 5. Fix existing data to ensure it's compatible
UPDATE products SET 
    is_deleted = false,
    stock_quantity = stock,
    is_on_sale = (compare_price > price),
    original_price = compare_price,
    part_number = sku,
    is_new = false,
    discount_percent = CASE 
        WHEN compare_price IS NOT NULL AND compare_price > price 
        THEN ROUND(((compare_price - price) / compare_price * 100)::numeric)
        ELSE NULL
    END,
    image_url = CASE 
        WHEN images IS NOT NULL AND array_length(images, 1) > 0 
        THEN images[1] 
        ELSE NULL 
    END
WHERE is_deleted IS NULL OR stock_quantity IS NULL OR is_on_sale IS NULL;

-- 6. Show final status
SELECT 'Final Status:' as info;
SELECT 
    'Products' as type,
    COUNT(*) as total,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active,
    COUNT(CASE WHEN is_deleted = false OR is_deleted IS NULL THEN 1 END) as not_deleted
FROM products

UNION ALL

SELECT 
    'Brands' as type,
    COUNT(*) as total,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active,
    0 as not_deleted
FROM brands

UNION ALL

SELECT 
    'Categories' as type,
    COUNT(*) as total,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active,
    0 as not_deleted
FROM categories;

-- 7. Test the exact query your frontend will use
SELECT 'Frontend Query Test:' as info;
SELECT 
    p.id,
    p.sku,
    p.name,
    p.slug,
    p.price,
    p.compare_price,
    p.stock,
    p.stock_quantity,
    p.images,
    p.image_url,
    p.is_active,
    p.is_featured,
    p.is_deleted,
    p.is_on_sale,
    p.is_new,
    b.name as brand_name,
    c.name as category_name,
    p.created_at
FROM products p
LEFT JOIN brands b ON p.brand_id = b.id
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.is_active = true 
  AND (p.is_deleted = false OR p.is_deleted IS NULL)
ORDER BY p.created_at DESC
LIMIT 5;

-- 🎉 SCHEMA FIXED!
-- 
-- ✅ What was done:
-- 1. Created missing tables (brands, categories, products)
-- 2. Added missing columns expected by frontend
-- 3. Added basic seed data (brands and categories)
-- 4. Created performance indexes
-- 5. Fixed existing data to be compatible
-- 6. Tested the frontend query
-- 
-- 🔧 Next steps:
-- 1. If you see products above, your schema is working!
-- 2. If you see 0 products, run add-product.sql to add sample products
-- 3. Check your .env.local file has correct Supabase credentials
-- 4. Restart your dev server: npm run dev
-- 5. Visit your website and check for products
-- 
-- 🌟 Your products should now show on your website! 