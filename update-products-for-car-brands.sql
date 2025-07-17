-- Update Products for Car Manufacturer Brands
-- This script updates existing products to be linked to car manufacturers

-- First, let's check current products
SELECT id, name, brand_id FROM products ORDER BY name;

-- Update products to be linked to car manufacturers
-- Since these are auto parts, we'll distribute them across different car manufacturers

-- BMW products (German precision)
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE name = 'BMW')
WHERE name LIKE '%Маслен филтър%' OR name LIKE '%Oil Filter%';

-- Mercedes-Benz products (German luxury)
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE name = 'Mercedes-Benz')
WHERE name LIKE '%Амортисьор%' OR name LIKE '%Shock Absorber%';

-- Audi products (German engineering)  
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE name = 'Audi')
WHERE name LIKE '%LED%' OR name LIKE '%Крушка%';

-- Ferrari products (Italian performance)
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE name = 'Ferrari')
WHERE name LIKE '%Спирачен диск%' OR name LIKE '%Brake Disc%';

-- Porsche products (German sports)
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE name = 'Porsche')
WHERE name LIKE '%Спирачни накладки%' OR name LIKE '%Brake Pads%';

-- Tesla products (Electric/Modern)
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE name = 'Tesla')
WHERE name LIKE '%Моторно масло%' OR name LIKE '%Motor Oil%';

-- If any products remain unassigned, assign them to popular brands
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE name = 'BMW')
WHERE brand_id IS NULL;

-- Verify the updates
SELECT 
    p.id,
    p.name as product_name,
    b.name as brand_name,
    b.country,
    p.price
FROM products p
JOIN brands b ON p.brand_id = b.id
ORDER BY b.name, p.name;

-- Show brand distribution
SELECT 
    b.name as brand_name,
    COUNT(p.id) as product_count
FROM brands b
LEFT JOIN products p ON b.id = p.brand_id
GROUP BY b.id, b.name
ORDER BY product_count DESC, b.name; 