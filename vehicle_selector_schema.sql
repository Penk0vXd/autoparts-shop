-- ============================================================================
-- VEHICLE SELECTOR SCHEMA - THE DIVINE ARCHITECTURE
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. BRANDS TABLE - The Foundation of Automotive Excellence
-- ============================================================================
CREATE TABLE IF NOT EXISTS vehicle_brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    logo_url TEXT,
    country VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 2. MODELS TABLE - The Essence of Each Brand
-- ============================================================================
CREATE TABLE IF NOT EXISTS vehicle_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    brand_id UUID NOT NULL REFERENCES vehicle_brands(id) ON DELETE CASCADE,
    body_type VARCHAR(50), -- SUV, Sedan, Hatchback, Coupe, etc.
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(brand_id, slug)
);

-- ============================================================================
-- 3. YEARS TABLE - The Timeline of Evolution
-- ============================================================================
CREATE TABLE IF NOT EXISTS vehicle_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year INTEGER NOT NULL,
    model_id UUID NOT NULL REFERENCES vehicle_models(id) ON DELETE CASCADE,
    generation VARCHAR(50), -- E.g., "F30", "W204", "Mk7"
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(model_id, year)
);

-- ============================================================================
-- 4. ENGINES TABLE - The Heart of Performance
-- ============================================================================
CREATE TABLE IF NOT EXISTS vehicle_engines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    engine_code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL, -- Display name: "2.0 TDI", "3.0 V6 BiTurbo"
    type VARCHAR(20) NOT NULL, -- Petrol, Diesel, Hybrid, Electric
    displacement DECIMAL(3,1), -- 2.0, 3.0, 1.6
    horsepower INTEGER NOT NULL,
    torque INTEGER, -- Nm
    year_id UUID NOT NULL REFERENCES vehicle_years(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(year_id, engine_code)
);

-- ============================================================================
-- PERFORMANCE INDEXES - Speed of Light Queries
-- ============================================================================

-- Primary foreign key indexes
CREATE INDEX IF NOT EXISTS idx_vehicle_models_brand_id ON vehicle_models(brand_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_years_model_id ON vehicle_years(model_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_engines_year_id ON vehicle_engines(year_id);

-- Active records filtering
CREATE INDEX IF NOT EXISTS idx_vehicle_brands_active ON vehicle_brands(is_active);
CREATE INDEX IF NOT EXISTS idx_vehicle_models_active ON vehicle_models(is_active);
CREATE INDEX IF NOT EXISTS idx_vehicle_years_active ON vehicle_years(is_active);
CREATE INDEX IF NOT EXISTS idx_vehicle_engines_active ON vehicle_engines(is_active);

-- Search optimization
CREATE INDEX IF NOT EXISTS idx_vehicle_brands_slug ON vehicle_brands(slug);
CREATE INDEX IF NOT EXISTS idx_vehicle_models_slug ON vehicle_models(slug);
CREATE INDEX IF NOT EXISTS idx_vehicle_years_year ON vehicle_years(year);
CREATE INDEX IF NOT EXISTS idx_vehicle_engines_type ON vehicle_engines(type);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_models_brand_active ON vehicle_models(brand_id, is_active);
CREATE INDEX IF NOT EXISTS idx_years_model_active ON vehicle_years(model_id, is_active);
CREATE INDEX IF NOT EXISTS idx_engines_year_active ON vehicle_engines(year_id, is_active);

-- ============================================================================
-- AUTO-UPDATE TRIGGERS - Self-Maintaining Excellence
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vehicle_brands_updated_at BEFORE UPDATE ON vehicle_brands
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicle_models_updated_at BEFORE UPDATE ON vehicle_models
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicle_years_updated_at BEFORE UPDATE ON vehicle_years
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicle_engines_updated_at BEFORE UPDATE ON vehicle_engines
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ANALYTICS VIEWS - Business Intelligence
-- ============================================================================
CREATE OR REPLACE VIEW vehicle_selection_analytics AS
SELECT 
    vb.name as brand_name,
    vm.name as model_name,
    vy.year,
    ve.name as engine_name,
    ve.type as engine_type,
    ve.horsepower,
    ve.torque,
    COUNT(*) OVER (PARTITION BY vb.id) as brand_model_count,
    COUNT(*) OVER (PARTITION BY vm.id) as model_year_count,
    COUNT(*) OVER (PARTITION BY vy.id) as year_engine_count
FROM vehicle_brands vb
JOIN vehicle_models vm ON vb.id = vm.brand_id
JOIN vehicle_years vy ON vm.id = vy.model_id
JOIN vehicle_engines ve ON vy.id = ve.year_id
WHERE vb.is_active = true 
  AND vm.is_active = true 
  AND vy.is_active = true 
  AND ve.is_active = true;

-- ============================================================================
-- ROW LEVEL SECURITY - Fort Knox Level Protection
-- ============================================================================
ALTER TABLE vehicle_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_engines ENABLE ROW LEVEL SECURITY;

-- Public read access for active records
CREATE POLICY "Public read access for active brands" ON vehicle_brands
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public read access for active models" ON vehicle_models
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public read access for active years" ON vehicle_years
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public read access for active engines" ON vehicle_engines
    FOR SELECT USING (is_active = true);

-- ============================================================================
-- VERIFICATION QUERIES - Proof of Divine Architecture
-- ============================================================================

-- Check table structure
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE tablename LIKE 'vehicle_%'
ORDER BY tablename;

-- Check indexes
SELECT 
    indexname,
    tablename,
    indexdef
FROM pg_indexes 
WHERE tablename LIKE 'vehicle_%'
ORDER BY tablename, indexname;

-- Success message
SELECT 'VEHICLE SELECTOR SCHEMA CREATED SUCCESSFULLY! 🚗⚡' as status; 