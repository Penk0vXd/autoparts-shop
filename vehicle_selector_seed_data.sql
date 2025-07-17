-- ============================================================================
-- VEHICLE SELECTOR SEED DATA - THE GARDEN OF AUTOMOTIVE EDEN
-- ============================================================================

-- Clear existing data (in correct order due to foreign keys)
DELETE FROM vehicle_engines;
DELETE FROM vehicle_years;
DELETE FROM vehicle_models;
DELETE FROM vehicle_brands;

-- ============================================================================
-- 1. BRANDS - The Titans of the Automotive World
-- ============================================================================
INSERT INTO vehicle_brands (name, slug, logo_url, country, is_active) VALUES
('BMW', 'bmw', '/logos/bmw.png', 'Germany', true),
('Mercedes-Benz', 'mercedes-benz', '/logos/mercedes-benz.png', 'Germany', true),
('Audi', 'audi', '/logos/audi.png', 'Germany', true),
('Volkswagen', 'volkswagen', '/logos/volkswagen.png', 'Germany', true),
('Toyota', 'toyota', '/logos/toyota.png', 'Japan', true),
('Honda', 'honda', '/logos/honda.png', 'Japan', true),
('Nissan', 'nissan', '/logos/nissan.png', 'Japan', true),
('Hyundai', 'hyundai', '/logos/hyundai.png', 'South Korea', true),
('Kia', 'kia', '/logos/kia.png', 'South Korea', true),
('Ford', 'ford', '/logos/ford.png', 'USA', true),
('Opel', 'opel', '/logos/opel.png', 'Germany', true),
('Peugeot', 'peugeot', '/logos/peugeot.png', 'France', true),
('Renault', 'renault', '/logos/renault.png', 'France', true),
('Skoda', 'skoda', '/logos/skoda.png', 'Czech Republic', true),
('Fiat', 'fiat', '/logos/fiat.png', 'Italy', true);

-- ============================================================================
-- 2. MODELS - The Essence of Each Brand
-- ============================================================================

-- BMW Models
INSERT INTO vehicle_models (name, slug, brand_id, body_type, is_active) VALUES
('1 Series', '1-series', (SELECT id FROM vehicle_brands WHERE slug = 'bmw'), 'Hatchback', true),
('3 Series', '3-series', (SELECT id FROM vehicle_brands WHERE slug = 'bmw'), 'Sedan', true),
('5 Series', '5-series', (SELECT id FROM vehicle_brands WHERE slug = 'bmw'), 'Sedan', true),
('X1', 'x1', (SELECT id FROM vehicle_brands WHERE slug = 'bmw'), 'SUV', true),
('X3', 'x3', (SELECT id FROM vehicle_brands WHERE slug = 'bmw'), 'SUV', true),
('X5', 'x5', (SELECT id FROM vehicle_brands WHERE slug = 'bmw'), 'SUV', true);

-- Mercedes-Benz Models
INSERT INTO vehicle_models (name, slug, brand_id, body_type, is_active) VALUES
('A-Class', 'a-class', (SELECT id FROM vehicle_brands WHERE slug = 'mercedes-benz'), 'Hatchback', true),
('C-Class', 'c-class', (SELECT id FROM vehicle_brands WHERE slug = 'mercedes-benz'), 'Sedan', true),
('E-Class', 'e-class', (SELECT id FROM vehicle_brands WHERE slug = 'mercedes-benz'), 'Sedan', true),
('GLA', 'gla', (SELECT id FROM vehicle_brands WHERE slug = 'mercedes-benz'), 'SUV', true),
('GLC', 'glc', (SELECT id FROM vehicle_brands WHERE slug = 'mercedes-benz'), 'SUV', true),
('GLE', 'gle', (SELECT id FROM vehicle_brands WHERE slug = 'mercedes-benz'), 'SUV', true);

-- Audi Models
INSERT INTO vehicle_models (name, slug, brand_id, body_type, is_active) VALUES
('A1', 'a1', (SELECT id FROM vehicle_brands WHERE slug = 'audi'), 'Hatchback', true),
('A3', 'a3', (SELECT id FROM vehicle_brands WHERE slug = 'audi'), 'Sedan', true),
('A4', 'a4', (SELECT id FROM vehicle_brands WHERE slug = 'audi'), 'Sedan', true),
('A6', 'a6', (SELECT id FROM vehicle_brands WHERE slug = 'audi'), 'Sedan', true),
('Q3', 'q3', (SELECT id FROM vehicle_brands WHERE slug = 'audi'), 'SUV', true),
('Q5', 'q5', (SELECT id FROM vehicle_brands WHERE slug = 'audi'), 'SUV', true);

-- Volkswagen Models
INSERT INTO vehicle_models (name, slug, brand_id, body_type, is_active) VALUES
('Golf', 'golf', (SELECT id FROM vehicle_brands WHERE slug = 'volkswagen'), 'Hatchback', true),
('Passat', 'passat', (SELECT id FROM vehicle_brands WHERE slug = 'volkswagen'), 'Sedan', true),
('Tiguan', 'tiguan', (SELECT id FROM vehicle_brands WHERE slug = 'volkswagen'), 'SUV', true),
('Touareg', 'touareg', (SELECT id FROM vehicle_brands WHERE slug = 'volkswagen'), 'SUV', true);

-- Toyota Models
INSERT INTO vehicle_models (name, slug, brand_id, body_type, is_active) VALUES
('Corolla', 'corolla', (SELECT id FROM vehicle_brands WHERE slug = 'toyota'), 'Sedan', true),
('Camry', 'camry', (SELECT id FROM vehicle_brands WHERE slug = 'toyota'), 'Sedan', true),
('RAV4', 'rav4', (SELECT id FROM vehicle_brands WHERE slug = 'toyota'), 'SUV', true),
('Highlander', 'highlander', (SELECT id FROM vehicle_brands WHERE slug = 'toyota'), 'SUV', true);

-- ============================================================================
-- 3. YEARS - The Timeline of Evolution
-- ============================================================================

-- BMW 3 Series Years
INSERT INTO vehicle_years (year, model_id, generation, is_active) VALUES
(2012, (SELECT id FROM vehicle_models WHERE slug = '3-series'), 'F30', true),
(2013, (SELECT id FROM vehicle_models WHERE slug = '3-series'), 'F30', true),
(2014, (SELECT id FROM vehicle_models WHERE slug = '3-series'), 'F30', true),
(2015, (SELECT id FROM vehicle_models WHERE slug = '3-series'), 'F30', true),
(2016, (SELECT id FROM vehicle_models WHERE slug = '3-series'), 'F30', true),
(2019, (SELECT id FROM vehicle_models WHERE slug = '3-series'), 'G20', true),
(2020, (SELECT id FROM vehicle_models WHERE slug = '3-series'), 'G20', true),
(2021, (SELECT id FROM vehicle_models WHERE slug = '3-series'), 'G20', true),
(2022, (SELECT id FROM vehicle_models WHERE slug = '3-series'), 'G20', true),
(2023, (SELECT id FROM vehicle_models WHERE slug = '3-series'), 'G20', true);

-- Mercedes C-Class Years
INSERT INTO vehicle_years (year, model_id, generation, is_active) VALUES
(2014, (SELECT id FROM vehicle_models WHERE slug = 'c-class'), 'W205', true),
(2015, (SELECT id FROM vehicle_models WHERE slug = 'c-class'), 'W205', true),
(2016, (SELECT id FROM vehicle_models WHERE slug = 'c-class'), 'W205', true),
(2017, (SELECT id FROM vehicle_models WHERE slug = 'c-class'), 'W205', true),
(2018, (SELECT id FROM vehicle_models WHERE slug = 'c-class'), 'W205', true),
(2021, (SELECT id FROM vehicle_models WHERE slug = 'c-class'), 'W206', true),
(2022, (SELECT id FROM vehicle_models WHERE slug = 'c-class'), 'W206', true),
(2023, (SELECT id FROM vehicle_models WHERE slug = 'c-class'), 'W206', true);

-- Audi A4 Years
INSERT INTO vehicle_years (year, model_id, generation, is_active) VALUES
(2016, (SELECT id FROM vehicle_models WHERE slug = 'a4'), 'B9', true),
(2017, (SELECT id FROM vehicle_models WHERE slug = 'a4'), 'B9', true),
(2018, (SELECT id FROM vehicle_models WHERE slug = 'a4'), 'B9', true),
(2019, (SELECT id FROM vehicle_models WHERE slug = 'a4'), 'B9', true),
(2020, (SELECT id FROM vehicle_models WHERE slug = 'a4'), 'B9', true),
(2021, (SELECT id FROM vehicle_models WHERE slug = 'a4'), 'B9', true),
(2022, (SELECT id FROM vehicle_models WHERE slug = 'a4'), 'B9', true),
(2023, (SELECT id FROM vehicle_models WHERE slug = 'a4'), 'B9', true);

-- VW Golf Years
INSERT INTO vehicle_years (year, model_id, generation, is_active) VALUES
(2013, (SELECT id FROM vehicle_models WHERE slug = 'golf'), 'Mk7', true),
(2014, (SELECT id FROM vehicle_models WHERE slug = 'golf'), 'Mk7', true),
(2015, (SELECT id FROM vehicle_models WHERE slug = 'golf'), 'Mk7', true),
(2016, (SELECT id FROM vehicle_models WHERE slug = 'golf'), 'Mk7', true),
(2017, (SELECT id FROM vehicle_models WHERE slug = 'golf'), 'Mk7', true),
(2020, (SELECT id FROM vehicle_models WHERE slug = 'golf'), 'Mk8', true),
(2021, (SELECT id FROM vehicle_models WHERE slug = 'golf'), 'Mk8', true),
(2022, (SELECT id FROM vehicle_models WHERE slug = 'golf'), 'Mk8', true),
(2023, (SELECT id FROM vehicle_models WHERE slug = 'golf'), 'Mk8', true);

-- Toyota Corolla Years
INSERT INTO vehicle_years (year, model_id, generation, is_active) VALUES
(2014, (SELECT id FROM vehicle_models WHERE slug = 'corolla'), 'E170', true),
(2015, (SELECT id FROM vehicle_models WHERE slug = 'corolla'), 'E170', true),
(2016, (SELECT id FROM vehicle_models WHERE slug = 'corolla'), 'E170', true),
(2017, (SELECT id FROM vehicle_models WHERE slug = 'corolla'), 'E170', true),
(2019, (SELECT id FROM vehicle_models WHERE slug = 'corolla'), 'E210', true),
(2020, (SELECT id FROM vehicle_models WHERE slug = 'corolla'), 'E210', true),
(2021, (SELECT id FROM vehicle_models WHERE slug = 'corolla'), 'E210', true),
(2022, (SELECT id FROM vehicle_models WHERE slug = 'corolla'), 'E210', true),
(2023, (SELECT id FROM vehicle_models WHERE slug = 'corolla'), 'E210', true);

-- ============================================================================
-- 4. ENGINES - The Heart of Performance
-- ============================================================================

-- BMW 3 Series Engines (2012-2016 F30)
INSERT INTO vehicle_engines (engine_code, name, type, displacement, horsepower, torque, year_id, is_active) VALUES
('N47D20', '2.0 дизел', 'Diesel', 2.0, 163, 380, (SELECT id FROM vehicle_years WHERE year = 2012 AND model_id = (SELECT id FROM vehicle_models WHERE slug = '3-series')), true),
('N20B20', '2.0 бензин', 'Petrol', 2.0, 184, 270, (SELECT id FROM vehicle_years WHERE year = 2012 AND model_id = (SELECT id FROM vehicle_models WHERE slug = '3-series')), true),
('N47D20', '2.0 дизел', 'Diesel', 2.0, 163, 380, (SELECT id FROM vehicle_years WHERE year = 2013 AND model_id = (SELECT id FROM vehicle_models WHERE slug = '3-series')), true),
('N20B20', '2.0 бензин', 'Petrol', 2.0, 184, 270, (SELECT id FROM vehicle_years WHERE year = 2013 AND model_id = (SELECT id FROM vehicle_models WHERE slug = '3-series')), true),
('B47D20', '2.0 дизел', 'Diesel', 2.0, 190, 400, (SELECT id FROM vehicle_years WHERE year = 2015 AND model_id = (SELECT id FROM vehicle_models WHERE slug = '3-series')), true),
('B48B20', '2.0 бензин', 'Petrol', 2.0, 197, 280, (SELECT id FROM vehicle_years WHERE year = 2015 AND model_id = (SELECT id FROM vehicle_models WHERE slug = '3-series')), true);

-- BMW 3 Series Engines (2019-2023 G20)
INSERT INTO vehicle_engines (engine_code, name, type, displacement, horsepower, torque, year_id, is_active) VALUES
('B47D20', '2.0 дизел', 'Diesel', 2.0, 190, 400, (SELECT id FROM vehicle_years WHERE year = 2019 AND model_id = (SELECT id FROM vehicle_models WHERE slug = '3-series')), true),
('B48B20', '2.0 бензин', 'Petrol', 2.0, 197, 280, (SELECT id FROM vehicle_years WHERE year = 2019 AND model_id = (SELECT id FROM vehicle_models WHERE slug = '3-series')), true),
('B58B30', '3.0 бензин', 'Petrol', 3.0, 374, 500, (SELECT id FROM vehicle_years WHERE year = 2019 AND model_id = (SELECT id FROM vehicle_models WHERE slug = '3-series')), true),
('B47D20', '2.0 дизел', 'Diesel', 2.0, 190, 400, (SELECT id FROM vehicle_years WHERE year = 2020 AND model_id = (SELECT id FROM vehicle_models WHERE slug = '3-series')), true),
('B48B20', '2.0 бензин', 'Petrol', 2.0, 197, 280, (SELECT id FROM vehicle_years WHERE year = 2020 AND model_id = (SELECT id FROM vehicle_models WHERE slug = '3-series')), true),
('B58B30', '3.0 бензин', 'Petrol', 3.0, 374, 500, (SELECT id FROM vehicle_years WHERE year = 2020 AND model_id = (SELECT id FROM vehicle_models WHERE slug = '3-series')), true);

-- Mercedes C-Class Engines (2014-2018 W205)
INSERT INTO vehicle_engines (engine_code, name, type, displacement, horsepower, torque, year_id, is_active) VALUES
('OM651', '2.1 дизел', 'Diesel', 2.1, 170, 400, (SELECT id FROM vehicle_years WHERE year = 2014 AND model_id = (SELECT id FROM vehicle_models WHERE slug = 'c-class')), true),
('M274', '2.0 бензин', 'Petrol', 2.0, 184, 300, (SELECT id FROM vehicle_years WHERE year = 2014 AND model_id = (SELECT id FROM vehicle_models WHERE slug = 'c-class')), true),
('OM651', '2.1 дизел', 'Diesel', 2.1, 170, 400, (SELECT id FROM vehicle_years WHERE year = 2015 AND model_id = (SELECT id FROM vehicle_models WHERE slug = 'c-class')), true),
('M274', '2.0 бензин', 'Petrol', 2.0, 184, 300, (SELECT id FROM vehicle_years WHERE year = 2015 AND model_id = (SELECT id FROM vehicle_models WHERE slug = 'c-class')), true),
('OM654', '2.0 дизел', 'Diesel', 2.0, 194, 400, (SELECT id FROM vehicle_years WHERE year = 2018 AND model_id = (SELECT id FROM vehicle_models WHERE slug = 'c-class')), true),
('M264', '2.0 бензин', 'Petrol', 2.0, 197, 320, (SELECT id FROM vehicle_years WHERE year = 2018 AND model_id = (SELECT id FROM vehicle_models WHERE slug = 'c-class')), true);

-- Audi A4 Engines (2016-2023 B9)
INSERT INTO vehicle_engines (engine_code, name, type, displacement, horsepower, torque, year_id, is_active) VALUES
('CJEB', '2.0 TDI', 'Diesel', 2.0, 190, 400, (SELECT id FROM vehicle_years WHERE year = 2016 AND model_id = (SELECT id FROM vehicle_models WHERE slug = 'a4')), true),
('CVKB', '2.0 TFSI', 'Petrol', 2.0, 190, 320, (SELECT id FROM vehicle_years WHERE year = 2016 AND model_id = (SELECT id FROM vehicle_models WHERE slug = 'a4')), true),
('CJEB', '2.0 TDI', 'Diesel', 2.0, 190, 400, (SELECT id FROM vehicle_years WHERE year = 2017 AND model_id = (SELECT id FROM vehicle_models WHERE slug = 'a4')), true),
('CVKB', '2.0 TFSI', 'Petrol', 2.0, 190, 320, (SELECT id FROM vehicle_years WHERE year = 2017 AND model_id = (SELECT id FROM vehicle_models WHERE slug = 'a4')), true),
('DEUS', '2.0 TDI', 'Diesel', 2.0, 204, 400, (SELECT id FROM vehicle_years WHERE year = 2019 AND model_id = (SELECT id FROM vehicle_models WHERE slug = 'a4')), true),
('DKNA', '2.0 TFSI', 'Petrol', 2.0, 197, 320, (SELECT id FROM vehicle_years WHERE year = 2019 AND model_id = (SELECT id FROM vehicle_models WHERE slug = 'a4')), true);

-- VW Golf Engines
INSERT INTO vehicle_engines (engine_code, name, type, displacement, horsepower, torque, year_id, is_active) VALUES
('CJAA', '2.0 TDI', 'Diesel', 2.0, 150, 320, (SELECT id FROM vehicle_years WHERE year = 2013 AND model_id = (SELECT id FROM vehicle_models WHERE slug = 'golf')), true),
('CJZA', '1.4 TSI', 'Petrol', 1.4, 122, 200, (SELECT id FROM vehicle_years WHERE year = 2013 AND model_id = (SELECT id FROM vehicle_models WHERE slug = 'golf')), true),
('CJAA', '2.0 TDI', 'Diesel', 2.0, 150, 320, (SELECT id FROM vehicle_years WHERE year = 2014 AND model_id = (SELECT id FROM vehicle_models WHERE slug = 'golf')), true),
('CJZA', '1.4 TSI', 'Petrol', 1.4, 122, 200, (SELECT id FROM vehicle_years WHERE year = 2014 AND model_id = (SELECT id FROM vehicle_models WHERE slug = 'golf')), true),
('DKLA', '2.0 TDI', 'Diesel', 2.0, 150, 360, (SELECT id FROM vehicle_years WHERE year = 2020 AND model_id = (SELECT id FROM vehicle_models WHERE slug = 'golf')), true),
('DKNA', '1.5 TSI', 'Petrol', 1.5, 150, 250, (SELECT id FROM vehicle_years WHERE year = 2020 AND model_id = (SELECT id FROM vehicle_models WHERE slug = 'golf')), true);

-- Toyota Corolla Engines
INSERT INTO vehicle_engines (engine_code, name, type, displacement, horsepower, torque, year_id, is_active) VALUES
('1ZR-FE', '1.6 бензин', 'Petrol', 1.6, 132, 160, (SELECT id FROM vehicle_years WHERE year = 2014 AND model_id = (SELECT id FROM vehicle_models WHERE slug = 'corolla')), true),
('2ZR-FE', '1.8 бензин', 'Petrol', 1.8, 140, 173, (SELECT id FROM vehicle_years WHERE year = 2014 AND model_id = (SELECT id FROM vehicle_models WHERE slug = 'corolla')), true),
('1ZR-FE', '1.6 бензин', 'Petrol', 1.6, 132, 160, (SELECT id FROM vehicle_years WHERE year = 2015 AND model_id = (SELECT id FROM vehicle_models WHERE slug = 'corolla')), true),
('2ZR-FE', '1.8 бензин', 'Petrol', 1.8, 140, 173, (SELECT id FROM vehicle_years WHERE year = 2015 AND model_id = (SELECT id FROM vehicle_models WHERE slug = 'corolla')), true),
('M20A-FKS', '2.0 бензин', 'Petrol', 2.0, 172, 205, (SELECT id FROM vehicle_years WHERE year = 2019 AND model_id = (SELECT id FROM vehicle_models WHERE slug = 'corolla')), true),
('2ZR-FXE', '1.8 хибрид', 'Hybrid', 1.8, 122, 142, (SELECT id FROM vehicle_years WHERE year = 2019 AND model_id = (SELECT id FROM vehicle_models WHERE slug = 'corolla')), true),
('M20A-FKS', '2.0 бензин', 'Petrol', 2.0, 172, 205, (SELECT id FROM vehicle_years WHERE year = 2020 AND model_id = (SELECT id FROM vehicle_models WHERE slug = 'corolla')), true),
('2ZR-FXE', '1.8 хибрид', 'Hybrid', 1.8, 122, 142, (SELECT id FROM vehicle_years WHERE year = 2020 AND model_id = (SELECT id FROM vehicle_models WHERE slug = 'corolla')), true);

-- ============================================================================
-- DATA VERIFICATION - Proof of Perfection
-- ============================================================================

-- Count records per table
SELECT 
    'vehicle_brands' as table_name,
    COUNT(*) as record_count
FROM vehicle_brands
UNION ALL
SELECT 
    'vehicle_models' as table_name,
    COUNT(*) as record_count
FROM vehicle_models
UNION ALL
SELECT 
    'vehicle_years' as table_name,
    COUNT(*) as record_count
FROM vehicle_years
UNION ALL
SELECT 
    'vehicle_engines' as table_name,
    COUNT(*) as record_count
FROM vehicle_engines
ORDER BY table_name;

-- Show complete hierarchy sample
SELECT 
    vb.name as brand,
    vm.name as model,
    vy.year,
    ve.name as engine,
    ve.type,
    ve.horsepower
FROM vehicle_brands vb
JOIN vehicle_models vm ON vb.id = vm.brand_id
JOIN vehicle_years vy ON vm.id = vy.model_id
JOIN vehicle_engines ve ON vy.id = ve.year_id
WHERE vb.slug = 'bmw' AND vm.slug = '3-series' AND vy.year = 2020
ORDER BY ve.horsepower DESC;

-- Success message
SELECT 'VEHICLE SELECTOR SEED DATA PLANTED SUCCESSFULLY! 🌱🚗' as status; 