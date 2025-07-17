-- Check current car brands data
-- This script checks what car brands are available in the database

-- Check popular_car_makes table
SELECT * FROM popular_car_makes LIMIT 10;

-- Check brands table current content
SELECT * FROM brands ORDER BY name;

-- Check if there are any car manufacturer brands
SELECT * FROM brands WHERE name ILIKE '%BMW%' OR name ILIKE '%Mercedes%' OR name ILIKE '%Audi%';

-- Check total count of popular car makes
SELECT COUNT(*) as total_car_makes FROM popular_car_makes; 