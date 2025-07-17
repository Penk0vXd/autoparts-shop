-- 🛍️ ADD PRODUCT TO SUPABASE DATABASE
-- Copy and paste this entire script into Supabase SQL Editor and run it

-- 1. First, let's see what brands and categories are available
SELECT 'Available Brands:' as info;
SELECT name, slug, id FROM brands WHERE is_active = true ORDER BY name;

SELECT 'Available Categories:' as info;
SELECT name, slug, id FROM categories WHERE is_active = true ORDER BY name;

-- 2. Generate a unique SKU function for this session
CREATE OR REPLACE FUNCTION generate_product_sku()
RETURNS TEXT AS $$
BEGIN
    RETURN 'AP-' || EXTRACT(EPOCH FROM NOW())::text || '-' || LPAD((RANDOM() * 999)::int::text, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- 3. Create slug function
CREATE OR REPLACE FUNCTION create_product_slug(product_name TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN LOWER(
        REGEXP_REPLACE(
            REGEXP_REPLACE(product_name, '[^a-zA-Z0-9а-яА-Я\s]', '-', 'g'),
            '\s+', '-', 'g'
        )
    );
END;
$$ LANGUAGE plpgsql;

-- 4. INSERT THE PRODUCT
-- 🔧 CUSTOMIZE THIS SECTION FOR YOUR PRODUCT:
INSERT INTO products (
    sku,
    name,
    slug,
    description,
    short_description,
    price,
    compare_price,
    cost_price,
    stock,
    min_stock_level,
    weight,
    brand_id,
    category_id,
    images,
    specifications,
    compatibility,
    is_active,
    is_featured,
    meta_title,
    meta_description,
    meta_keywords
)
SELECT 
    generate_product_sku() as sku,
    'Спирачни накладки Bosch Premium' as name,
    create_product_slug('Спирачни накладки Bosch Premium') as slug,
    'Високококачествени спирачни накладки от Bosch с отлична спирачна сила и дълготрайност. Подходящи за интензивно градско каране и магистрални пътувания.' as description,
    'Спирачни накладки Bosch Premium - надежни и дълготрайни' as short_description,
    65.99 as price,
    79.99 as compare_price,
    39.99 as cost_price,
    25 as stock,
    5 as min_stock_level,
    1.2 as weight,
    (SELECT id FROM brands WHERE name = 'Bosch' LIMIT 1) as brand_id,
    (SELECT id FROM categories WHERE slug = 'spirachki' LIMIT 1) as category_id,
    ARRAY[
        'https://example.com/products/brake-pads-bosch-1.jpg',
        'https://example.com/products/brake-pads-bosch-2.jpg',
        'https://example.com/products/brake-pads-bosch-3.jpg'
    ] as images,
    jsonb_build_object(
        'material', 'Керамика',
        'warranty', '24 месеца',
        'origin', 'Германия',
        'fitting_position', 'Предна ос',
        'brake_system', 'Дискови спирачки',
        'temperature_range', '-40°C до +200°C'
    ) as specifications,
    jsonb_build_object(
        'makes', ARRAY['BMW', 'Mercedes', 'Audi', 'Volkswagen', 'Opel'],
        'years', ARRAY['2015-2024'],
        'models', ARRAY['3 Series', 'C-Class', 'A4', 'Golf', 'Astra'],
        'engines', ARRAY['2.0L Diesel', '2.0L Petrol', '1.6L Petrol']
    ) as compatibility,
    true as is_active,
    false as is_featured,
    'Спирачни накладки Bosch Premium - Авточасти' as meta_title,
    'Спирачни накладки Bosch Premium на най-добра цена. Бърза доставка и 24 месеца гаранция.' as meta_description,
    ARRAY['спирачни накладки', 'bosch', 'авточасти', 'спирачки', 'керамика'] as meta_keywords;

-- 5. Show the inserted product
SELECT 'Product Added Successfully!' as result;
SELECT 
    p.sku,
    p.name,
    p.price || ' лв.' as price,
    p.stock || ' бр.' as stock,
    b.name as brand,
    c.name as category
FROM products p
LEFT JOIN brands b ON p.brand_id = b.id
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.sku LIKE 'AP-%'
ORDER BY p.created_at DESC
LIMIT 1;

-- 6. Clean up temporary functions
DROP FUNCTION IF EXISTS generate_product_sku();
DROP FUNCTION IF EXISTS create_product_slug(TEXT);

-- 🎉 PRODUCT ADDED SUCCESSFULLY!
-- 
-- 📝 TO ADD MORE PRODUCTS:
-- 1. Change the values in the INSERT statement above
-- 2. Modify: name, description, price, brand name, category slug
-- 3. Update: specifications, compatibility, images
-- 4. Run this script again
--
-- 🔍 AVAILABLE BRANDS: Bosch, Febi Bilstein, Sachs, Brembo, Thule, Hella, Castrol, Mann Filter
-- 🔍 AVAILABLE CATEGORIES: dvigatel, spirachki, okachvane, elektrika
--
-- 💡 EXAMPLES FOR DIFFERENT PRODUCTS:
-- Engine Filter: category_slug = 'dvigatel', brand = 'Mann Filter'
-- Suspension: category_slug = 'okachvane', brand = 'Sachs'  
-- Electrical: category_slug = 'elektrika', brand = 'Hella' 