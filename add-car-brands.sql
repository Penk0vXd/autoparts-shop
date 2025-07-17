-- 🚗 ADD CAR BRANDS (MANUFACTURERS) TO SUPABASE DATABASE
-- Copy and paste this entire script into Supabase SQL Editor and run it

-- 1. Create car_makes table for vehicle manufacturers
CREATE TABLE IF NOT EXISTS car_makes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    country TEXT,
    website_url TEXT,
    founded_year INTEGER,
    is_active BOOLEAN DEFAULT true,
    popularity INTEGER DEFAULT 5 CHECK (popularity >= 1 AND popularity <= 10),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_car_makes_active ON car_makes(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_car_makes_popularity ON car_makes(popularity DESC, name) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_car_makes_country ON car_makes(country) WHERE is_active = true;

-- 3. Insert popular car brands in Bulgarian market
INSERT INTO car_makes (name, slug, logo_url, country, website_url, founded_year, popularity) VALUES
-- German brands (очень популярни в България)
('BMW', 'bmw', '/logos/bmw.png', 'Germany', 'https://www.bmw.com', 1916, 10),
('Mercedes-Benz', 'mercedes-benz', '/logos/mercedes-benz.png', 'Germany', 'https://www.mercedes-benz.com', 1926, 10),
('Audi', 'audi', '/logos/audi.png', 'Germany', 'https://www.audi.com', 1909, 9),
('Volkswagen', 'volkswagen', '/logos/volkswagen.png', 'Germany', 'https://www.volkswagen.com', 1937, 10),
('Opel', 'opel', '/logos/opel.png', 'Germany', 'https://www.opel.com', 1862, 9),
('Porsche', 'porsche', '/logos/porsche.png', 'Germany', 'https://www.porsche.com', 1931, 8),

-- French brands (популярни в България)
('Renault', 'renault', '/logos/renault.png', 'France', 'https://www.renault.com', 1899, 9),
('Peugeot', 'peugeot', '/logos/peugeot.png', 'France', 'https://www.peugeot.com', 1810, 8),
('Citroën', 'citroen', '/logos/citroen.png', 'France', 'https://www.citroen.com', 1919, 7),
('Dacia', 'dacia', '/logos/dacia.png', 'Romania', 'https://www.dacia.com', 1966, 10),

-- Italian brands
('Fiat', 'fiat', '/logos/fiat.png', 'Italy', 'https://www.fiat.com', 1899, 8),
('Alfa Romeo', 'alfa-romeo', '/logos/alfa-romeo.png', 'Italy', 'https://www.alfaromeo.com', 1910, 6),
('Ferrari', 'ferrari', '/logos/ferrari.png', 'Italy', 'https://www.ferrari.com', 1947, 7),
('Lamborghini', 'lamborghini', '/logos/lamborghini.png', 'Italy', 'https://www.lamborghini.com', 1963, 6),
('Maserati', 'maserati', '/logos/maserati.png', 'Italy', 'https://www.maserati.com', 1914, 5),

-- Japanese brands
('Toyota', 'toyota', '/logos/toyota.png', 'Japan', 'https://www.toyota.com', 1937, 9),
('Honda', 'honda', '/logos/honda.png', 'Japan', 'https://www.honda.com', 1948, 8),
('Nissan', 'nissan', '/logos/nissan.png', 'Japan', 'https://www.nissan.com', 1933, 8),
('Mazda', 'mazda', '/logos/mazda.png', 'Japan', 'https://www.mazda.com', 1920, 7),
('Mitsubishi', 'mitsubishi', '/logos/mitsubishi.png', 'Japan', 'https://www.mitsubishi-motors.com', 1970, 7),
('Subaru', 'subaru', '/logos/subaru.png', 'Japan', 'https://www.subaru.com', 1953, 6),
('Lexus', 'lexus', '/logos/lexus.png', 'Japan', 'https://www.lexus.com', 1989, 7),
('Infiniti', 'infiniti', '/logos/infiniti.png', 'Japan', 'https://www.infiniti.com', 1989, 6),
('Acura', 'acura', '/logos/acura.png', 'Japan', 'https://www.acura.com', 1986, 5),

-- Korean brands
('Hyundai', 'hyundai', '/logos/hyundai.png', 'South Korea', 'https://www.hyundai.com', 1967, 8),
('KIA', 'kia', '/logos/kia.png', 'South Korea', 'https://www.kia.com', 1944, 8),
('Genesis', 'genesis', '/logos/genesis.png', 'South Korea', 'https://www.genesis.com', 2015, 6),

-- American brands
('Ford', 'ford', '/logos/ford.png', 'USA', 'https://www.ford.com', 1903, 7),
('Chevrolet', 'chevrolet', '/logos/chevrolet.png', 'USA', 'https://www.chevrolet.com', 1911, 6),
('Cadillac', 'cadillac', '/logos/cadillac.png', 'USA', 'https://www.cadillac.com', 1902, 6),
('Buick', 'buick', '/logos/buick.png', 'USA', 'https://www.buick.com', 1903, 5),
('GMC', 'gmc', '/logos/gmc.png', 'USA', 'https://www.gmc.com', 1912, 5),
('Chrysler', 'chrysler', '/logos/chrysler.png', 'USA', 'https://www.chrysler.com', 1925, 5),
('Dodge', 'dodge', '/logos/dodge.png', 'USA', 'https://www.dodge.com', 1900, 6),
('Jeep', 'jeep', '/logos/jeep.png', 'USA', 'https://www.jeep.com', 1941, 7),
('Tesla', 'tesla', '/logos/tesla.png', 'USA', 'https://www.tesla.com', 2003, 8),
('Lincoln', 'lincoln', '/logos/lincoln.png', 'USA', 'https://www.lincoln.com', 1917, 5),

-- British brands
('Rolls-Royce', 'rolls-royce', '/logos/rolls-royce.png', 'UK', 'https://www.rolls-roycemotorcars.com', 1904, 6),
('Bentley', 'bentley', '/logos/bentley.png', 'UK', 'https://www.bentley.com', 1919, 6),
('Aston Martin', 'aston-martin', '/logos/aston-martin.png', 'UK', 'https://www.astonmartin.com', 1913, 6),
('Jaguar', 'jaguar', '/logos/jaguar.png', 'UK', 'https://www.jaguar.com', 1935, 6),
('Mini', 'mini', '/logos/mini.png', 'UK', 'https://www.mini.com', 1959, 7),
('McLaren', 'mclaren', '/logos/mclaren.png', 'UK', 'https://www.mclaren.com', 1963, 5),

-- Swedish brands
('Volvo', 'volvo', '/logos/volvo.png', 'Sweden', 'https://www.volvo.com', 1927, 8),
('Saab', 'saab', '/logos/saab.png', 'Sweden', 'https://www.saab.com', 1945, 5),

-- Czech brands
('Škoda', 'skoda', '/logos/skoda.png', 'Czech Republic', 'https://www.skoda.com', 1895, 9),

-- Spanish brands
('SEAT', 'seat', '/logos/seat.png', 'Spain', 'https://www.seat.com', 1950, 7),

-- Chinese brands (нарастваща популярност)
('BYD', 'byd', '/logos/byd.png', 'China', 'https://www.byd.com', 1995, 6),
('Geely', 'geely', '/logos/geely.svg', 'China', 'https://www.geely.com', 1986, 5),
('Chery', 'chery', '/logos/chery.png', 'China', 'https://www.chery.com', 1997, 5),

-- Russian brands
('Lada', 'lada', '/logos/lada.png', 'Russia', 'https://www.lada.com', 1966, 7),

-- Luxury brands
('DS', 'ds', '/logos/ds.png', 'France', 'https://www.ds.com', 2009, 5);

-- 4. Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_car_makes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER car_makes_updated_at_trigger
    BEFORE UPDATE ON car_makes
    FOR EACH ROW
    EXECUTE FUNCTION update_car_makes_updated_at();

-- 5. Create a view for popular car makes
CREATE OR REPLACE VIEW popular_car_makes AS
SELECT 
    id,
    name,
    slug,
    logo_url,
    country,
    popularity,
    founded_year
FROM car_makes
WHERE is_active = true
ORDER BY popularity DESC, name ASC;

-- 6. Show inserted car brands
SELECT 'Car Brands Added Successfully!' as result;
SELECT 
    name,
    country,
    popularity || '/10' as popularity_rating,
    founded_year,
    CASE 
        WHEN logo_url IS NOT NULL THEN '✅ Has Logo'
        ELSE '❌ No Logo'
    END as logo_status
FROM car_makes
WHERE is_active = true
ORDER BY popularity DESC, name ASC;

-- 7. Show statistics by country
SELECT 'Car Brands by Country:' as info;
SELECT 
    country,
    COUNT(*) as brand_count,
    ROUND(AVG(popularity), 1) as avg_popularity,
    STRING_AGG(name, ', ' ORDER BY name) as brands
FROM car_makes
WHERE is_active = true
GROUP BY country
ORDER BY brand_count DESC, avg_popularity DESC;

-- 🎉 CAR BRANDS ADDED SUCCESSFULLY!
-- 
-- 📊 WHAT WAS CREATED:
-- ✅ car_makes table with 50+ popular car brands
-- ✅ Performance indexes for fast queries
-- ✅ Auto-update timestamp trigger
-- ✅ Popular car makes view
-- ✅ Logos linked to /logos/ directory
-- ✅ Popularity ratings (1-10) for Bulgarian market
-- ✅ Country information for each brand
-- ✅ Website URLs and founding years
--
-- 📝 USAGE EXAMPLES:
-- 
-- Get all German brands:
-- SELECT * FROM car_makes WHERE country = 'Germany' AND is_active = true;
-- 
-- Get most popular brands:
-- SELECT * FROM popular_car_makes LIMIT 10;
-- 
-- Add new car brand:
-- INSERT INTO car_makes (name, slug, country, popularity) 
-- VALUES ('New Brand', 'new-brand', 'Country', 8);
-- 
-- Update brand popularity:
-- UPDATE car_makes SET popularity = 9 WHERE slug = 'tesla';
-- 
-- 🔗 INTEGRATE WITH PRODUCTS:
-- You can now reference car_makes.id in your products compatibility data
-- or create a separate car_models table that references car_makes.id 