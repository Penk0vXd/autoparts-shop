-- 🚀 SAFE MIGRATION SCRIPT FOR BULGARIAN AUTO PARTS STORE
-- This script safely handles existing tables by dropping and recreating them

-- ⚠️ WARNING: This will delete all existing data in these tables!
-- If you have important data, please backup first using:
-- pg_dump or Supabase Dashboard → Database → Backups

-- 🔥 STEP 1: Drop existing tables in correct order (foreign keys first)
DROP TABLE IF EXISTS product_collection_items CASCADE;
DROP TABLE IF EXISTS product_collections CASCADE;
DROP TABLE IF EXISTS vehicle_compatibility CASCADE;
DROP TABLE IF EXISTS product_variants CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS brands CASCADE;

-- 🔥 STEP 2: Drop existing views and materialized views
DROP MATERIALIZED VIEW IF EXISTS category_stats CASCADE;
DROP MATERIALIZED VIEW IF EXISTS brand_stats CASCADE;
DROP VIEW IF EXISTS products_with_details CASCADE;
DROP VIEW IF EXISTS searchable_products CASCADE;

-- 🔥 STEP 3: Drop existing functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS generate_slug_from_name() CASCADE;
DROP FUNCTION IF EXISTS refresh_stats() CASCADE;

-- 🔥 STEP 4: Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 🧱 STEP 5: Create all tables fresh
-- 1. BRANDS TABLE - Марки на части
CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    description TEXT,
    website_url TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CATEGORIES TABLE - Категории
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon_url TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. PRODUCTS TABLE - The Divine Core
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    short_description TEXT,
    
    -- Pricing
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    compare_price NUMERIC(10,2) CHECK (compare_price >= 0),
    cost_price NUMERIC(10,2) CHECK (cost_price >= 0),
    
    -- Inventory
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    min_stock_level INTEGER DEFAULT 0,
    track_inventory BOOLEAN DEFAULT true,
    allow_backorder BOOLEAN DEFAULT false,
    
    -- Physical attributes
    weight NUMERIC(8,3), -- in kg
    dimensions JSONB, -- {length, width, height} in cm
    
    -- Content
    images TEXT[], -- Array of image URLs
    specifications JSONB, -- Technical specs
    compatibility JSONB, -- Vehicle compatibility data
    
    -- Categorization
    brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    
    -- Status flags
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    requires_compatibility_check BOOLEAN DEFAULT false,
    
    -- SEO
    meta_title TEXT,
    meta_description TEXT,
    meta_keywords TEXT[],
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. PRODUCT_VARIANTS TABLE - За различни варианти
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sku TEXT NOT NULL UNIQUE,
    price NUMERIC(10,2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    attributes JSONB, -- {color, size, etc}
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. VEHICLE_COMPATIBILITY TABLE - Съвместимост с автомобили
CREATE TABLE vehicle_compatibility (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    make TEXT NOT NULL, -- BMW, Mercedes, etc.
    model TEXT NOT NULL, -- 3 Series, C-Class, etc.
    year_from INTEGER,
    year_to INTEGER,
    engine_type TEXT, -- Diesel, Petrol, Hybrid
    engine_capacity TEXT, -- 2.0L, 3.0L, etc.
    additional_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. PRODUCT_COLLECTIONS TABLE - Колекции/Групи продукти
CREATE TABLE product_collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. PRODUCT_COLLECTION_ITEMS TABLE - Връзка продукти-колекции
CREATE TABLE product_collection_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    collection_id UUID NOT NULL REFERENCES product_collections(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(collection_id, product_id)
);

-- ⚡ STEP 6: Create all indexes
-- Products indexes
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = true;
CREATE INDEX idx_products_category_active ON products(category_id, is_active) WHERE is_active = true;
CREATE INDEX idx_products_brand_active ON products(brand_id, is_active) WHERE is_active = true;
CREATE INDEX idx_products_price ON products(price) WHERE is_active = true;
CREATE INDEX idx_products_stock ON products(stock) WHERE is_active = true;
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_sku ON products(sku);

-- Category indexes
CREATE INDEX idx_categories_active ON categories(is_active) WHERE is_active = true;
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);

-- Brand indexes
CREATE INDEX idx_brands_active ON brands(is_active) WHERE is_active = true;
CREATE INDEX idx_brands_slug ON brands(slug);

-- Vehicle compatibility indexes
CREATE INDEX idx_vehicle_compat_product ON vehicle_compatibility(product_id);
CREATE INDEX idx_vehicle_compat_make_model ON vehicle_compatibility(make, model);
CREATE INDEX idx_vehicle_compat_year ON vehicle_compatibility(year_from, year_to);

-- Search indexes
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('simple', name || ' ' || COALESCE(description, '')));
CREATE INDEX idx_products_name_search ON products USING gin(to_tsvector('simple', name));
CREATE INDEX idx_products_sku_search ON products(sku) WHERE is_active = true;

-- 🛡️ STEP 7: Enable RLS and create policies
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_compatibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_collection_items ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can read active brands" ON brands
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read active categories" ON categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read active products" ON products
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read product variants" ON product_variants
    FOR SELECT USING (
        product_id IN (SELECT id FROM products WHERE is_active = true)
    );

CREATE POLICY "Public can read vehicle compatibility" ON vehicle_compatibility
    FOR SELECT USING (
        product_id IN (SELECT id FROM products WHERE is_active = true)
    );

CREATE POLICY "Public can read active collections" ON product_collections
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read collection items" ON product_collection_items
    FOR SELECT USING (
        collection_id IN (SELECT id FROM product_collections WHERE is_active = true)
    );

-- 🔄 STEP 8: Create triggers and functions
-- Auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate slugs
CREATE OR REPLACE FUNCTION generate_slug_from_name()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug = lower(
            regexp_replace(
                regexp_replace(NEW.name, '[^a-zA-Z0-9\u0400-\u04FF\s]+', '', 'g'),
                '\s+', '-', 'g'
            )
        );
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER generate_brand_slug BEFORE INSERT OR UPDATE ON brands
    FOR EACH ROW EXECUTE FUNCTION generate_slug_from_name();

CREATE TRIGGER generate_category_slug BEFORE INSERT OR UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION generate_slug_from_name();

CREATE TRIGGER generate_product_slug BEFORE INSERT OR UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION generate_slug_from_name();

-- 📊 STEP 9: Create materialized views
CREATE MATERIALIZED VIEW category_stats AS
SELECT 
    c.id,
    c.name,
    c.slug,
    COUNT(p.id) as total_products,
    COUNT(CASE WHEN p.stock > 0 THEN 1 END) as in_stock_products,
    AVG(p.price) as avg_price,
    MIN(p.price) as min_price,
    MAX(p.price) as max_price,
    NOW() as last_updated
FROM categories c
LEFT JOIN products p ON p.category_id = c.id AND p.is_active = true
WHERE c.is_active = true
GROUP BY c.id, c.name, c.slug;

CREATE UNIQUE INDEX ON category_stats (id);

CREATE MATERIALIZED VIEW brand_stats AS
SELECT 
    b.id,
    b.name,
    b.slug,
    COUNT(p.id) as total_products,
    COUNT(CASE WHEN p.stock > 0 THEN 1 END) as in_stock_products,
    AVG(p.price) as avg_price,
    NOW() as last_updated
FROM brands b
LEFT JOIN products p ON p.brand_id = b.id AND p.is_active = true
WHERE b.is_active = true
GROUP BY b.id, b.name, b.slug;

CREATE UNIQUE INDEX ON brand_stats (id);

-- 🔄 STEP 10: Create utility functions
CREATE OR REPLACE FUNCTION refresh_stats()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW category_stats;
    REFRESH MATERIALIZED VIEW brand_stats;
END;
$$ language 'plpgsql';

-- 🚀 STEP 11: Create helpful views
CREATE VIEW products_with_details AS
SELECT 
    p.*,
    b.name as brand_name,
    b.slug as brand_slug,
    b.logo_url as brand_logo,
    c.name as category_name,
    c.slug as category_slug,
    c.description as category_description,
    (p.stock > 0) as in_stock,
    (p.compare_price > p.price) as on_sale,
    CASE 
        WHEN p.stock <= 0 THEN 'out_of_stock'
        WHEN p.stock <= p.min_stock_level THEN 'low_stock'
        ELSE 'in_stock'
    END as stock_status
FROM products p
LEFT JOIN brands b ON b.id = p.brand_id
LEFT JOIN categories c ON c.id = p.category_id
WHERE p.is_active = true;

CREATE VIEW searchable_products AS
SELECT 
    p.id,
    p.name,
    p.slug,
    p.price,
    p.stock,
    p.images,
    p.is_featured,
    b.name as brand_name,
    c.name as category_name,
    to_tsvector('simple', p.name || ' ' || COALESCE(p.description, '') || ' ' || p.sku) as search_vector
FROM products p
LEFT JOIN brands b ON b.id = p.brand_id
LEFT JOIN categories c ON c.id = p.category_id
WHERE p.is_active = true;

-- ✅ MIGRATION COMPLETE!
-- Your database is now ready with the complete schema
-- All tables, indexes, triggers, and views have been created 