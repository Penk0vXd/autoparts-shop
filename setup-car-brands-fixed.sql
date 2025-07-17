-- Setup Car Manufacturer Brands (FIXED VERSION)
-- This script replaces auto parts brands with car manufacturer brands

-- Clear existing brands
DELETE FROM brands;

-- Reset sequence (find the actual sequence name first)
-- Check what sequences exist for brands table
SELECT sequence_name 
FROM information_schema.sequences 
WHERE sequence_name LIKE '%brands%';

-- Reset the sequence using the correct name (this will work regardless of the sequence name)
SELECT setval(pg_get_serial_sequence('brands', 'id'), 1, false);

-- Add car manufacturer brands with proper logos (only using available logo files)
INSERT INTO brands (name, slug, logo_url, country, is_active, created_at, updated_at) VALUES
('BMW', 'bmw', '/logos/bmw.png', 'Germany', true, NOW(), NOW()),
('Mercedes-Benz', 'mercedes-benz', '/logos/mercedes-benz.png', 'Germany', true, NOW(), NOW()),
('Audi', 'audi', '/logos/audi.png', 'Germany', true, NOW(), NOW()),
('Chevrolet', 'chevrolet', '/logos/chevrolet.png', 'USA', true, NOW(), NOW()),
('Hyundai', 'hyundai', '/logos/hyundai.png', 'South Korea', true, NOW(), NOW()),
('Kia', 'kia', '/logos/kia.png', 'South Korea', true, NOW(), NOW()),
('Peugeot', 'peugeot', '/logos/peugeot.png', 'France', true, NOW(), NOW()),
('Renault', 'renault', '/logos/renault.png', 'France', true, NOW(), NOW()),
('Fiat', 'fiat', '/logos/fiat.png', 'Italy', true, NOW(), NOW()),
('Volvo', 'volvo', '/logos/volvo.png', 'Sweden', true, NOW(), NOW()),
('Mazda', 'mazda', '/logos/mazda.png', 'Japan', true, NOW(), NOW()),
('Subaru', 'subaru', '/logos/subaru.png', 'Japan', true, NOW(), NOW()),
('Mitsubishi', 'mitsubishi', '/logos/mitsubishi.png', 'Japan', true, NOW(), NOW()),
('Lexus', 'lexus', '/logos/lexus.png', 'Japan', true, NOW(), NOW()),
('Porsche', 'porsche', '/logos/porsche.png', 'Germany', true, NOW(), NOW()),
('Jaguar', 'jaguar', '/logos/jaguar.png', 'UK', true, NOW(), NOW()),
('Tesla', 'tesla', '/logos/tesla.png', 'USA', true, NOW(), NOW()),
('Mini', 'mini', '/logos/mini.png', 'UK', true, NOW(), NOW()),
('Opel', 'opel', '/logos/opel.png', 'Germany', true, NOW(), NOW()),
('Ferrari', 'ferrari', '/logos/ferrari.png', 'Italy', true, NOW(), NOW()),
('Lamborghini', 'lamborghini', '/logos/lamborghini.png', 'Italy', true, NOW(), NOW()),
('Maserati', 'maserati', '/logos/maserati.png', 'Italy', true, NOW(), NOW()),
('Bentley', 'bentley', '/logos/bentley.png', 'UK', true, NOW(), NOW()),
('Rolls-Royce', 'rolls-royce', '/logos/rolls-royce.png', 'UK', true, NOW(), NOW()),
('Aston Martin', 'aston-martin', '/logos/aston-martin.png', 'UK', true, NOW(), NOW()),
('McLaren', 'mclaren', '/logos/mclaren.png', 'UK', true, NOW(), NOW()),
('Jeep', 'jeep', '/logos/jeep.png', 'USA', true, NOW(), NOW()),
('Cadillac', 'cadillac', '/logos/cadillac.png', 'USA', true, NOW(), NOW()),
('Buick', 'buick', '/logos/buick.png', 'USA', true, NOW(), NOW()),
('GMC', 'gmc', '/logos/gmc.png', 'USA', true, NOW(), NOW()),
('Dodge', 'dodge', '/logos/dodge.png', 'USA', true, NOW(), NOW()),
('Chrysler', 'chrysler', '/logos/chrysler.png', 'USA', true, NOW(), NOW()),
('Lincoln', 'lincoln', '/logos/lincoln.png', 'USA', true, NOW(), NOW()),
('Infiniti', 'infiniti', '/logos/infiniti.png', 'Japan', true, NOW(), NOW()),
('Acura', 'acura', '/logos/acura.png', 'Japan', true, NOW(), NOW()),
('Genesis', 'genesis', '/logos/genesis.png', 'South Korea', true, NOW(), NOW()),
('Citroën', 'citroen', '/logos/citroen.png', 'France', true, NOW(), NOW()),
('DS', 'ds', '/logos/ds.png', 'France', true, NOW(), NOW()),
('Dacia', 'dacia', '/logos/dacia.png', 'Romania', true, NOW(), NOW()),
('SEAT', 'seat', '/logos/seat.png', 'Spain', true, NOW(), NOW()),
('Alfa Romeo', 'alfa-romeo', '/logos/alfa-romeo.png', 'Italy', true, NOW(), NOW()),
('Lada', 'lada', '/logos/lada.png', 'Russia', true, NOW(), NOW()),
('Saab', 'saab', '/logos/saab.png', 'Sweden', true, NOW(), NOW()),
('BYD', 'byd', '/logos/byd.png', 'China', true, NOW(), NOW()),
('Chery', 'chery', '/logos/chery.png', 'China', true, NOW(), NOW());

-- Update products to be linked to car manufacturers
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE name = 'BMW')
WHERE name LIKE '%Маслен филтър%' OR name LIKE '%Oil Filter%';

UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE name = 'Mercedes-Benz')
WHERE name LIKE '%Амортисьор%' OR name LIKE '%Shock Absorber%';

UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE name = 'Audi')
WHERE name LIKE '%LED%' OR name LIKE '%Крушка%';

UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE name = 'Ferrari')
WHERE name LIKE '%Спирачен диск%' OR name LIKE '%Brake Disc%';

UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE name = 'Porsche')
WHERE name LIKE '%Спирачни накладки%' OR name LIKE '%Brake Pads%';

UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE name = 'Tesla')
WHERE name LIKE '%Моторно масло%' OR name LIKE '%Motor Oil%';

-- If any products remain unassigned, assign them to BMW
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE name = 'BMW')
WHERE brand_id IS NULL;

-- Check inserted brands
SELECT id, name, slug, logo_url, country, created_at 
FROM brands 
ORDER BY name;

-- Show brands count
SELECT COUNT(*) as total_car_brands FROM brands;

-- Show products with their new brands
SELECT 
    p.id,
    p.name as product_name,
    b.name as brand_name,
    b.country
FROM products p
JOIN brands b ON p.brand_id = b.id
ORDER BY b.name, p.name; 