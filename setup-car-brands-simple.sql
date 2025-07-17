-- Setup Car Manufacturer Brands (SIMPLE VERSION)
-- This script works with the existing brands table structure

-- Clear existing brands
DELETE FROM brands;

-- Add car manufacturer brands (without country column)
INSERT INTO brands (name, slug, logo_url, is_active, created_at, updated_at) VALUES
('BMW', 'bmw', '/logos/bmw.png', true, NOW(), NOW()),
('Mercedes-Benz', 'mercedes-benz', '/logos/mercedes-benz.png', true, NOW(), NOW()),
('Audi', 'audi', '/logos/audi.png', true, NOW(), NOW()),
('Chevrolet', 'chevrolet', '/logos/chevrolet.png', true, NOW(), NOW()),
('Hyundai', 'hyundai', '/logos/hyundai.png', true, NOW(), NOW()),
('Kia', 'kia', '/logos/kia.png', true, NOW(), NOW()),
('Peugeot', 'peugeot', '/logos/peugeot.png', true, NOW(), NOW()),
('Renault', 'renault', '/logos/renault.png', true, NOW(), NOW()),
('Fiat', 'fiat', '/logos/fiat.png', true, NOW(), NOW()),
('Volvo', 'volvo', '/logos/volvo.png', true, NOW(), NOW()),
('Mazda', 'mazda', '/logos/mazda.png', true, NOW(), NOW()),
('Subaru', 'subaru', '/logos/subaru.png', true, NOW(), NOW()),
('Mitsubishi', 'mitsubishi', '/logos/mitsubishi.png', true, NOW(), NOW()),
('Lexus', 'lexus', '/logos/lexus.png', true, NOW(), NOW()),
('Porsche', 'porsche', '/logos/porsche.png', true, NOW(), NOW()),
('Jaguar', 'jaguar', '/logos/jaguar.png', true, NOW(), NOW()),
('Tesla', 'tesla', '/logos/tesla.png', true, NOW(), NOW()),
('Mini', 'mini', '/logos/mini.png', true, NOW(), NOW()),
('Opel', 'opel', '/logos/opel.png', true, NOW(), NOW()),
('Ferrari', 'ferrari', '/logos/ferrari.png', true, NOW(), NOW()),
('Lamborghini', 'lamborghini', '/logos/lamborghini.png', true, NOW(), NOW()),
('Maserati', 'maserati', '/logos/maserati.png', true, NOW(), NOW()),
('Bentley', 'bentley', '/logos/bentley.png', true, NOW(), NOW()),
('Rolls-Royce', 'rolls-royce', '/logos/rolls-royce.png', true, NOW(), NOW()),
('Aston Martin', 'aston-martin', '/logos/aston-martin.png', true, NOW(), NOW()),
('McLaren', 'mclaren', '/logos/mclaren.png', true, NOW(), NOW()),
('Jeep', 'jeep', '/logos/jeep.png', true, NOW(), NOW()),
('Cadillac', 'cadillac', '/logos/cadillac.png', true, NOW(), NOW()),
('Buick', 'buick', '/logos/buick.png', true, NOW(), NOW()),
('GMC', 'gmc', '/logos/gmc.png', true, NOW(), NOW()),
('Dodge', 'dodge', '/logos/dodge.png', true, NOW(), NOW()),
('Chrysler', 'chrysler', '/logos/chrysler.png', true, NOW(), NOW()),
('Lincoln', 'lincoln', '/logos/lincoln.png', true, NOW(), NOW()),
('Infiniti', 'infiniti', '/logos/infiniti.png', true, NOW(), NOW()),
('Acura', 'acura', '/logos/acura.png', true, NOW(), NOW()),
('Genesis', 'genesis', '/logos/genesis.png', true, NOW(), NOW()),
('Citroën', 'citroen', '/logos/citroen.png', true, NOW(), NOW()),
('DS', 'ds', '/logos/ds.png', true, NOW(), NOW()),
('Dacia', 'dacia', '/logos/dacia.png', true, NOW(), NOW()),
('SEAT', 'seat', '/logos/seat.png', true, NOW(), NOW()),
('Alfa Romeo', 'alfa-romeo', '/logos/alfa-romeo.png', true, NOW(), NOW()),
('Lada', 'lada', '/logos/lada.png', true, NOW(), NOW()),
('Saab', 'saab', '/logos/saab.png', true, NOW(), NOW()),
('BYD', 'byd', '/logos/byd.png', true, NOW(), NOW()),
('Chery', 'chery', '/logos/chery.png', true, NOW(), NOW());

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

-- Show results
SELECT COUNT(*) as total_car_brands FROM brands;

-- Show products with their new brands
SELECT 
    p.id,
    p.name as product_name,
    b.name as brand_name
FROM products p
JOIN brands b ON p.brand_id = b.id
ORDER BY b.name, p.name; 