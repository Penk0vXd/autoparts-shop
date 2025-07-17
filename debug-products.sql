-- 🔍 DEBUG SCRIPT - Check Why Products Don't Show on Website
-- Copy and paste this entire script into Supabase SQL Editor and run it

-- 1. First, let's see what tables actually exist
SELECT 'Tables in database:' as info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. Check if products table exists and its structure
SELECT 'Products table structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'products' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Check if we have any products at all
SELECT 'Total products count:' as info;
SELECT COUNT(*) as total_products FROM products;

-- 4. Check if we have active products
SELECT 'Active products count:' as info;
SELECT COUNT(*) as active_products FROM products WHERE is_active = true;

-- 5. Show all products with their details
SELECT 'All products in database:' as info;
SELECT 
    p.id,
    p.name,
    p.price,
    p.stock,
    p.is_active,
    b.name as brand_name,
    c.name as category_name,
    p.created_at
FROM products p
LEFT JOIN brands b ON p.brand_id = b.id
LEFT JOIN categories c ON p.category_id = c.id
ORDER BY p.created_at DESC;

-- 6. Check brands table
SELECT 'Brands in database:' as info;
SELECT name, slug, is_active FROM brands ORDER BY name;

-- 7. Check categories table
SELECT 'Categories in database:' as info;
SELECT name, slug, is_active FROM categories ORDER BY name;

-- 8. Check if there are any issues with the query the frontend uses
SELECT 'Frontend-style query test:' as info;
SELECT 
    p.*,
    b.name as brand_name,
    b.slug as brand_slug,
    c.name as category_name,
    c.slug as category_slug
FROM products p
LEFT JOIN brands b ON p.brand_id = b.id
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.is_active = true
LIMIT 5;

-- 9. Check if the issue is with the images column
SELECT 'Products with images:' as info;
SELECT 
    p.name,
    p.images,
    array_length(p.images, 1) as image_count
FROM products p
WHERE p.is_active = true
LIMIT 5;

-- 10. Look for any missing fields the frontend might expect
SELECT 'Check for missing fields - Add them if needed:' as info;

-- Check if we need to add missing columns
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
    
    -- Add stock_quantity column if it doesn't exist (frontend might expect this)
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
END $$;

-- 11. Final check - show what the frontend query should return
SELECT 'Final frontend-compatible query:' as info;
SELECT 
    p.id,
    p.sku,
    p.name,
    p.slug,
    p.description,
    p.short_description,
    p.price,
    p.compare_price,
    p.cost_price,
    p.stock,
    p.stock_quantity,
    p.images,
    p.image_url,
    p.specifications,
    p.compatibility,
    p.is_active,
    p.is_featured,
    p.is_deleted,
    p.meta_title,
    p.meta_description,
    p.created_at,
    p.updated_at,
    b.name as brand_name,
    b.slug as brand_slug,
    b.logo_url as brand_logo,
    c.name as category_name,
    c.slug as category_slug
FROM products p
LEFT JOIN brands b ON p.brand_id = b.id
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.is_active = true
  AND (p.is_deleted = false OR p.is_deleted IS NULL)
ORDER BY p.created_at DESC;

-- 12. Test the API query format
SELECT 'API-style query with joins:' as info;
SELECT 
    p.*,
    jsonb_build_object(
        'name', b.name,
        'slug', b.slug,
        'logo_url', b.logo_url
    ) as brand,
    jsonb_build_object(
        'name', c.name,
        'slug', c.slug,
        'description', c.description
    ) as category
FROM products p
LEFT JOIN brands b ON p.brand_id = b.id
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.is_active = true
  AND (p.is_deleted = false OR p.is_deleted IS NULL)
ORDER BY p.created_at DESC
LIMIT 3;

-- 🎯 TROUBLESHOOTING GUIDE:
-- 
-- If you see:
-- ❌ "No tables" → Run database_migration_safe.sql first
-- ❌ "0 products" → Run add-product.sql and add-more-products.sql
-- ❌ "Products exist but not showing" → Check your .env.local file
-- ❌ "Frontend errors" → Check browser console for API errors
-- ❌ "Database connection error" → Verify Supabase credentials
-- 
-- Next steps:
-- 1. Run this debug script
-- 2. Check the results
-- 3. If products exist, check your website's browser console for errors
-- 4. If no products, run the add-product.sql script
-- 5. If still not working, check your .env.local file 