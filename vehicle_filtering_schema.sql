-- 🚗 Dynamic Vehicle Filtering System Database Schema
-- Supreme full-stack architecture for automotive parts e-commerce
-- 4-Level Hierarchy: Brand → Model → Year → Engine

-- =======================
-- 1. VEHICLE BRANDS TABLE
-- =======================

CREATE TABLE IF NOT EXISTS vehicle_brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    logo_url VARCHAR(255),
    country VARCHAR(100) DEFAULT 'Unknown',
    founded_year INTEGER DEFAULT 1900,
    is_premium BOOLEAN DEFAULT false,
    website_url VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =======================
-- 2. VEHICLE MODELS TABLE
-- =======================

CREATE TABLE IF NOT EXISTS vehicle_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES vehicle_brands(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    generation VARCHAR(50),
    body_type VARCHAR(50),
    year_start INTEGER NOT NULL,
    year_end INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(brand_id, slug)
);

-- =======================
-- 3. VEHICLE YEARS TABLE
-- =======================

CREATE TABLE IF NOT EXISTS vehicle_years (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id UUID NOT NULL REFERENCES vehicle_models(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    facelift_type VARCHAR(50), -- 'pre-facelift', 'facelift', 'mid-cycle'
    production_start_date DATE,
    production_end_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(model_id, year)
);

-- =======================
-- 4. VEHICLE ENGINES TABLE
-- =======================

CREATE TABLE IF NOT EXISTS vehicle_engines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year_id UUID NOT NULL REFERENCES vehicle_years(id) ON DELETE CASCADE,
    engine_name VARCHAR(100) NOT NULL,
    engine_code VARCHAR(50),
    displacement_liters DECIMAL(3,1),
    displacement_cc INTEGER,
    fuel_type VARCHAR(20) NOT NULL CHECK (fuel_type IN ('petrol', 'diesel', 'hybrid', 'electric', 'lpg', 'cng')),
    horsepower INTEGER NOT NULL,
    torque_nm INTEGER,
    cylinder_count INTEGER,
    valve_count INTEGER,
    aspiration VARCHAR(20) CHECK (aspiration IN ('naturally_aspirated', 'turbo', 'supercharged', 'twin_turbo')),
    transmission_type VARCHAR(20) CHECK (transmission_type IN ('manual', 'automatic', 'cvt', 'dual_clutch')),
    drivetrain VARCHAR(20) CHECK (drivetrain IN ('fwd', 'rwd', 'awd', '4wd')),
    euro_emission_standard VARCHAR(10),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(year_id, engine_name, horsepower)
);

-- ============================
-- 5. PERFORMANCE OPTIMIZATION
-- ============================

-- Indexes for brands
CREATE INDEX IF NOT EXISTS idx_vehicle_brands_slug ON vehicle_brands(slug);
CREATE INDEX IF NOT EXISTS idx_vehicle_brands_country ON vehicle_brands(country);
CREATE INDEX IF NOT EXISTS idx_vehicle_brands_is_premium ON vehicle_brands(is_premium);
CREATE INDEX IF NOT EXISTS idx_vehicle_brands_sort_order ON vehicle_brands(sort_order);
CREATE INDEX IF NOT EXISTS idx_vehicle_brands_active ON vehicle_brands(is_active);

-- Indexes for models
CREATE INDEX IF NOT EXISTS idx_vehicle_models_brand_id ON vehicle_models(brand_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_models_slug ON vehicle_models(slug);
CREATE INDEX IF NOT EXISTS idx_vehicle_models_brand_slug ON vehicle_models(brand_id, slug);
CREATE INDEX IF NOT EXISTS idx_vehicle_models_years ON vehicle_models(year_start, year_end);
CREATE INDEX IF NOT EXISTS idx_vehicle_models_active ON vehicle_models(is_active);

-- Indexes for years
CREATE INDEX IF NOT EXISTS idx_vehicle_years_model_id ON vehicle_years(model_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_years_year ON vehicle_years(year);
CREATE INDEX IF NOT EXISTS idx_vehicle_years_model_year ON vehicle_years(model_id, year);
CREATE INDEX IF NOT EXISTS idx_vehicle_years_active ON vehicle_years(is_active);

-- Indexes for engines
CREATE INDEX IF NOT EXISTS idx_vehicle_engines_year_id ON vehicle_engines(year_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_engines_fuel_type ON vehicle_engines(fuel_type);
CREATE INDEX IF NOT EXISTS idx_vehicle_engines_horsepower ON vehicle_engines(horsepower);
CREATE INDEX IF NOT EXISTS idx_vehicle_engines_displacement ON vehicle_engines(displacement_cc);
CREATE INDEX IF NOT EXISTS idx_vehicle_engines_active ON vehicle_engines(is_active);

-- ==================
-- 6. SAMPLE TEST DATA
-- ==================

-- Insert Audi brand
INSERT INTO vehicle_brands (id, name, slug, logo_url, country, founded_year, is_premium, website_url, sort_order) 
VALUES ('audi-brand-uuid', 'Audi', 'audi', '/logos/audi.png', 'Germany', 1909, true, 'https://www.audi.com', 1)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    logo_url = EXCLUDED.logo_url,
    country = EXCLUDED.country,
    founded_year = EXCLUDED.founded_year,
    is_premium = EXCLUDED.is_premium,
    website_url = EXCLUDED.website_url,
    sort_order = EXCLUDED.sort_order;

-- Insert BMW brand
INSERT INTO vehicle_brands (id, name, slug, logo_url, country, founded_year, is_premium, website_url, sort_order) 
VALUES ('bmw-brand-uuid', 'BMW', 'bmw', '/logos/bmw.png', 'Germany', 1916, true, 'https://www.bmw.com', 2)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    logo_url = EXCLUDED.logo_url,
    country = EXCLUDED.country,
    founded_year = EXCLUDED.founded_year,
    is_premium = EXCLUDED.is_premium,
    website_url = EXCLUDED.website_url,
    sort_order = EXCLUDED.sort_order;

-- Insert Mercedes-Benz brand
INSERT INTO vehicle_brands (id, name, slug, logo_url, country, founded_year, is_premium, website_url, sort_order) 
VALUES ('mercedes-brand-uuid', 'Mercedes-Benz', 'mercedes-benz', '/logos/mercedes-benz.png', 'Germany', 1926, true, 'https://www.mercedes-benz.com', 3)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    logo_url = EXCLUDED.logo_url,
    country = EXCLUDED.country,
    founded_year = EXCLUDED.founded_year,
    is_premium = EXCLUDED.is_premium,
    website_url = EXCLUDED.website_url,
    sort_order = EXCLUDED.sort_order;

-- Insert Audi A4 model
INSERT INTO vehicle_models (id, brand_id, name, slug, generation, body_type, year_start, year_end) 
VALUES ('audi-a4-model-uuid', 'audi-brand-uuid', 'A4', 'a4', 'B9', 'sedan', 2012, 2023)
ON CONFLICT (brand_id, slug) DO UPDATE SET
    name = EXCLUDED.name,
    generation = EXCLUDED.generation,
    body_type = EXCLUDED.body_type,
    year_start = EXCLUDED.year_start,
    year_end = EXCLUDED.year_end;

-- Insert BMW 3 Series model
INSERT INTO vehicle_models (id, brand_id, name, slug, generation, body_type, year_start, year_end) 
VALUES ('bmw-3series-model-uuid', 'bmw-brand-uuid', '3 Series', '3-series', 'F30', 'sedan', 2012, 2023)
ON CONFLICT (brand_id, slug) DO UPDATE SET
    name = EXCLUDED.name,
    generation = EXCLUDED.generation,
    body_type = EXCLUDED.body_type,
    year_start = EXCLUDED.year_start,
    year_end = EXCLUDED.year_end;

-- Insert Mercedes C-Class model
INSERT INTO vehicle_models (id, brand_id, name, slug, generation, body_type, year_start, year_end) 
VALUES ('mercedes-cclass-model-uuid', 'mercedes-brand-uuid', 'C-Class', 'c-class', 'W205', 'sedan', 2012, 2023)
ON CONFLICT (brand_id, slug) DO UPDATE SET
    name = EXCLUDED.name,
    generation = EXCLUDED.generation,
    body_type = EXCLUDED.body_type,
    year_start = EXCLUDED.year_start,
    year_end = EXCLUDED.year_end;

-- Insert 2015 year for Audi A4
INSERT INTO vehicle_years (id, model_id, year, facelift_type, production_start_date, production_end_date) 
VALUES ('audi-a4-2015-uuid', 'audi-a4-model-uuid', 2015, 'pre-facelift', '2014-09-01', '2015-12-31')
ON CONFLICT (model_id, year) DO UPDATE SET
    facelift_type = EXCLUDED.facelift_type,
    production_start_date = EXCLUDED.production_start_date,
    production_end_date = EXCLUDED.production_end_date;

-- Insert other years for variety
INSERT INTO vehicle_years (id, model_id, year, facelift_type) VALUES
('audi-a4-2016-uuid', 'audi-a4-model-uuid', 2016, 'facelift'),
('audi-a4-2017-uuid', 'audi-a4-model-uuid', 2017, 'facelift'),
('bmw-3series-2015-uuid', 'bmw-3series-model-uuid', 2015, 'pre-facelift'),
('bmw-3series-2016-uuid', 'bmw-3series-model-uuid', 2016, 'facelift'),
('mercedes-cclass-2015-uuid', 'mercedes-cclass-model-uuid', 2015, 'pre-facelift'),
('mercedes-cclass-2016-uuid', 'mercedes-cclass-model-uuid', 2016, 'facelift')
ON CONFLICT (model_id, year) DO NOTHING;

-- Insert 2.0 TDI 150hp engine for Audi A4 2015
INSERT INTO vehicle_engines (
    id, year_id, engine_name, engine_code, displacement_liters, displacement_cc, 
    fuel_type, horsepower, torque_nm, cylinder_count, valve_count, aspiration, 
    transmission_type, drivetrain, euro_emission_standard
) VALUES (
    'audi-a4-2015-tdi-150-uuid', 
    'audi-a4-2015-uuid', 
    '2.0 TDI', 
    'CGLC', 
    2.0, 
    1968, 
    'diesel', 
    150, 
    320, 
    4, 
    16, 
    'turbo', 
    'manual', 
    'fwd', 
    'Euro 6'
)
ON CONFLICT (year_id, engine_name, horsepower) DO UPDATE SET
    engine_code = EXCLUDED.engine_code,
    displacement_liters = EXCLUDED.displacement_liters,
    displacement_cc = EXCLUDED.displacement_cc,
    fuel_type = EXCLUDED.fuel_type,
    torque_nm = EXCLUDED.torque_nm,
    cylinder_count = EXCLUDED.cylinder_count,
    valve_count = EXCLUDED.valve_count,
    aspiration = EXCLUDED.aspiration,
    transmission_type = EXCLUDED.transmission_type,
    drivetrain = EXCLUDED.drivetrain,
    euro_emission_standard = EXCLUDED.euro_emission_standard;

-- Insert additional engines for variety
INSERT INTO vehicle_engines (
    year_id, engine_name, engine_code, displacement_liters, displacement_cc, 
    fuel_type, horsepower, torque_nm, cylinder_count, valve_count, aspiration, 
    transmission_type, drivetrain, euro_emission_standard
) VALUES
-- Audi A4 2015 additional engines
('audi-a4-2015-uuid', '2.0 TFSI', 'CJEB', 2.0, 1984, 'petrol', 190, 320, 4, 16, 'turbo', 'automatic', 'fwd', 'Euro 6'),
('audi-a4-2015-uuid', '3.0 TDI', 'CKVB', 3.0, 2967, 'diesel', 218, 450, 6, 24, 'turbo', 'automatic', 'awd', 'Euro 6'),
-- BMW 3 Series 2015 engines
('bmw-3series-2015-uuid', '2.0d', 'B47D20', 2.0, 1995, 'diesel', 150, 330, 4, 16, 'turbo', 'manual', 'rwd', 'Euro 6'),
('bmw-3series-2015-uuid', '3.0i', 'B58B30', 3.0, 2998, 'petrol', 252, 350, 6, 24, 'turbo', 'automatic', 'rwd', 'Euro 6'),
-- Mercedes C-Class 2015 engines
('mercedes-cclass-2015-uuid', 'C200 CDI', 'OM651', 2.1, 2143, 'diesel', 136, 300, 4, 16, 'turbo', 'manual', 'rwd', 'Euro 6'),
('mercedes-cclass-2015-uuid', 'C250', 'M274', 2.0, 1991, 'petrol', 211, 350, 4, 16, 'turbo', 'automatic', 'rwd', 'Euro 6')
ON CONFLICT (year_id, engine_name, horsepower) DO NOTHING;

-- =======================
-- 7. HELPFUL FUNCTIONS
-- =======================

-- Function to get complete vehicle hierarchy
CREATE OR REPLACE FUNCTION get_vehicle_hierarchy(
    brand_slug_param VARCHAR DEFAULT NULL,
    model_slug_param VARCHAR DEFAULT NULL,
    year_param INTEGER DEFAULT NULL,
    engine_id_param UUID DEFAULT NULL
) RETURNS TABLE (
    brand_id UUID,
    brand_name VARCHAR,
    brand_slug VARCHAR,
    model_id UUID,
    model_name VARCHAR,
    model_slug VARCHAR,
    year_id UUID,
    year_value INTEGER,
    engine_id UUID,
    engine_name VARCHAR,
    engine_horsepower INTEGER,
    engine_fuel_type VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        vb.id as brand_id,
        vb.name as brand_name,
        vb.slug as brand_slug,
        vm.id as model_id,
        vm.name as model_name,
        vm.slug as model_slug,
        vy.id as year_id,
        vy.year as year_value,
        ve.id as engine_id,
        ve.engine_name,
        ve.horsepower as engine_horsepower,
        ve.fuel_type as engine_fuel_type
    FROM vehicle_brands vb
    JOIN vehicle_models vm ON vb.id = vm.brand_id
    JOIN vehicle_years vy ON vm.id = vy.model_id
    JOIN vehicle_engines ve ON vy.id = ve.year_id
    WHERE 
        vb.is_active = true
        AND vm.is_active = true
        AND vy.is_active = true
        AND ve.is_active = true
        AND (brand_slug_param IS NULL OR vb.slug = brand_slug_param)
        AND (model_slug_param IS NULL OR vm.slug = model_slug_param)
        AND (year_param IS NULL OR vy.year = year_param)
        AND (engine_id_param IS NULL OR ve.id = engine_id_param)
    ORDER BY vb.sort_order, vb.name, vm.name, vy.year DESC, ve.horsepower DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get vehicle statistics
CREATE OR REPLACE FUNCTION get_vehicle_statistics()
RETURNS TABLE (
    total_brands BIGINT,
    total_models BIGINT,
    total_years BIGINT,
    total_engines BIGINT,
    avg_horsepower NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM vehicle_brands WHERE is_active = true) as total_brands,
        (SELECT COUNT(*) FROM vehicle_models WHERE is_active = true) as total_models,
        (SELECT COUNT(*) FROM vehicle_years WHERE is_active = true) as total_years,
        (SELECT COUNT(*) FROM vehicle_engines WHERE is_active = true) as total_engines,
        (SELECT ROUND(AVG(horsepower), 2) FROM vehicle_engines WHERE is_active = true) as avg_horsepower;
END;
$$ LANGUAGE plpgsql;

-- =======================
-- 8. TRIGGERS FOR TIMESTAMPS
-- =======================

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables
CREATE TRIGGER update_vehicle_brands_updated_at
    BEFORE UPDATE ON vehicle_brands
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicle_models_updated_at
    BEFORE UPDATE ON vehicle_models
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicle_years_updated_at
    BEFORE UPDATE ON vehicle_years
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicle_engines_updated_at
    BEFORE UPDATE ON vehicle_engines
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================
-- 9. VALIDATION QUERIES
-- =====================

-- Check if schema was created successfully
SELECT 
    schemaname,
    tablename,
    hasindexes,
    hasrules,
    hastriggers
FROM pg_tables 
WHERE tablename LIKE 'vehicle_%' 
ORDER BY tablename;

-- Check sample data
SELECT 
    'Brands' as table_name,
    COUNT(*) as count
FROM vehicle_brands
UNION ALL
SELECT 
    'Models' as table_name,
    COUNT(*) as count
FROM vehicle_models
UNION ALL
SELECT 
    'Years' as table_name,
    COUNT(*) as count
FROM vehicle_years
UNION ALL
SELECT 
    'Engines' as table_name,
    COUNT(*) as count
FROM vehicle_engines;

-- Test the hierarchy function
SELECT * FROM get_vehicle_hierarchy('audi', 'a4', 2015, NULL);
SELECT * FROM get_vehicle_statistics();

-- =====================
-- SCHEMA COMPLETE ✅
-- ===================== 