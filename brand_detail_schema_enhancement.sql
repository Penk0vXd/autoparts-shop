-- Brand Detail Schema Enhancement
-- Supreme full-stack architecture for automotive e-commerce

-- 1. Enhance brands table with premium metadata
ALTER TABLE brands 
ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'Unknown',
ADD COLUMN IF NOT EXISTS founded_year INTEGER DEFAULT 1900,
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS website_url VARCHAR(255),
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- 2. Create performance-optimized materialized view for brand statistics
CREATE MATERIALIZED VIEW IF NOT EXISTS brand_statistics AS
SELECT 
    b.id,
    b.name,
    b.slug,
    b.logo_url,
    b.country,
    b.founded_year,
    b.is_premium,
    b.website_url,
    b.sort_order,
    COUNT(p.id) as total_products,
    COUNT(DISTINCT p.category_id) as total_categories,
    ROUND(AVG(p.price), 2) as avg_price,
    MIN(p.price) as min_price,
    MAX(p.price) as max_price,
    SUM(p.stock) as total_stock,
    COUNT(CASE WHEN p.stock > 0 THEN 1 END) as in_stock_products,
    COUNT(CASE WHEN p.is_featured = true THEN 1 END) as featured_products
FROM brands b
LEFT JOIN products p ON b.id = p.brand_id AND p.is_active = true AND p.is_deleted = false
WHERE b.is_active = true
GROUP BY b.id, b.name, b.slug, b.logo_url, b.country, b.founded_year, b.is_premium, b.website_url, b.sort_order;

-- 3. Create category breakdown view for brands
CREATE MATERIALIZED VIEW IF NOT EXISTS brand_category_breakdown AS
SELECT 
    b.id as brand_id,
    b.name as brand_name,
    b.slug as brand_slug,
    c.id as category_id,
    c.name as category_name,
    c.slug as category_slug,
    c.description as category_description,
    COUNT(p.id) as product_count,
    ROUND(AVG(p.price), 2) as avg_price,
    MIN(p.price) as min_price,
    MAX(p.price) as max_price,
    SUM(p.stock) as total_stock,
    COUNT(CASE WHEN p.stock > 0 THEN 1 END) as in_stock_count
FROM brands b
INNER JOIN products p ON b.id = p.brand_id AND p.is_active = true AND p.is_deleted = false
INNER JOIN categories c ON p.category_id = c.id AND c.is_active = true
WHERE b.is_active = true
GROUP BY b.id, b.name, b.slug, c.id, c.name, c.slug, c.description
HAVING COUNT(p.id) > 0
ORDER BY b.name, COUNT(p.id) DESC;

-- 4. Create indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_brands_country ON brands(country);
CREATE INDEX IF NOT EXISTS idx_brands_founded_year ON brands(founded_year);
CREATE INDEX IF NOT EXISTS idx_brands_is_premium ON brands(is_premium);
CREATE INDEX IF NOT EXISTS idx_brands_sort_order ON brands(sort_order);
CREATE INDEX IF NOT EXISTS idx_products_brand_category ON products(brand_id, category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand_active ON products(brand_id, is_active, is_deleted);
CREATE INDEX IF NOT EXISTS idx_products_price_stock ON products(price, stock);

-- 5. Create unique indexes for performance
CREATE UNIQUE INDEX IF NOT EXISTS idx_brand_statistics_slug ON brand_statistics(slug);
CREATE INDEX IF NOT EXISTS idx_brand_category_breakdown_brand_slug ON brand_category_breakdown(brand_slug);
CREATE INDEX IF NOT EXISTS idx_brand_category_breakdown_category_slug ON brand_category_breakdown(category_slug);

-- 6. Insert sample brand data with premium metadata
INSERT INTO brands (id, name, slug, logo_url, description, country, founded_year, is_premium, website_url, sort_order, category, is_active) VALUES
('b1', 'Audi', 'audi', '/logos/audi.png', 'Premium German automotive manufacturer', 'Germany', 1909, true, 'https://www.audi.com', 1, 'car', true),
('b2', 'BMW', 'bmw', '/logos/bmw.png', 'Bavarian luxury car manufacturer', 'Germany', 1916, true, 'https://www.bmw.com', 2, 'car', true),
('b3', 'Mercedes-Benz', 'mercedes-benz', '/logos/mercedes-benz.png', 'German luxury automotive brand', 'Germany', 1926, true, 'https://www.mercedes-benz.com', 3, 'car', true),
('b4', 'Volkswagen', 'volkswagen', '/logos/volkswagen.png', 'German automotive manufacturer', 'Germany', 1937, false, 'https://www.volkswagen.com', 4, 'car', true),
('b5', 'Toyota', 'toyota', '/logos/toyota.png', 'Japanese automotive manufacturer', 'Japan', 1937, false, 'https://www.toyota.com', 5, 'car', true),
('b6', 'Honda', 'honda', '/logos/honda.png', 'Japanese multinational automotive manufacturer', 'Japan', 1948, false, 'https://www.honda.com', 6, 'car', true),
('b7', 'Ford', 'ford', '/logos/ford.png', 'American automotive manufacturer', 'USA', 1903, false, 'https://www.ford.com', 7, 'car', true),
('b8', 'Hyundai', 'hyundai', '/logos/hyundai.png', 'South Korean automotive manufacturer', 'South Korea', 1967, false, 'https://www.hyundai.com', 8, 'car', true),
('b9', 'Kia', 'kia', '/logos/kia.png', 'South Korean automotive manufacturer', 'South Korea', 1944, false, 'https://www.kia.com', 9, 'car', true),
('b10', 'Nissan', 'nissan', '/logos/nissan.png', 'Japanese automotive manufacturer', 'Japan', 1933, false, 'https://www.nissan.com', 10, 'car', true),
('b11', 'Volvo', 'volvo', '/logos/volvo.png', 'Swedish automotive manufacturer', 'Sweden', 1927, false, 'https://www.volvo.com', 11, 'car', true),
('b12', 'Porsche', 'porsche', '/logos/porsche.png', 'German luxury sports car manufacturer', 'Germany', 1931, true, 'https://www.porsche.com', 12, 'car', true),
('b13', 'Ferrari', 'ferrari', '/logos/ferrari.png', 'Italian luxury sports car manufacturer', 'Italy', 1939, true, 'https://www.ferrari.com', 13, 'car', true),
('b14', 'Lamborghini', 'lamborghini', '/logos/lamborghini.png', 'Italian luxury sports car manufacturer', 'Italy', 1963, true, 'https://www.lamborghini.com', 14, 'car', true),
('b15', 'Maserati', 'maserati', '/logos/maserati.png', 'Italian luxury car manufacturer', 'Italy', 1914, true, 'https://www.maserati.com', 15, 'car', true)
ON CONFLICT (slug) DO UPDATE SET
    country = EXCLUDED.country,
    founded_year = EXCLUDED.founded_year,
    is_premium = EXCLUDED.is_premium,
    website_url = EXCLUDED.website_url,
    sort_order = EXCLUDED.sort_order;

-- 7. Refresh materialized views
REFRESH MATERIALIZED VIEW brand_statistics;
REFRESH MATERIALIZED VIEW brand_category_breakdown;

-- 8. Create function to automatically refresh materialized views
CREATE OR REPLACE FUNCTION refresh_brand_views()
RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW brand_statistics;
    REFRESH MATERIALIZED VIEW brand_category_breakdown;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 9. Create triggers to auto-refresh views on data changes
DROP TRIGGER IF EXISTS refresh_brand_views_on_brand_change ON brands;
CREATE TRIGGER refresh_brand_views_on_brand_change
    AFTER INSERT OR UPDATE OR DELETE ON brands
    FOR EACH STATEMENT EXECUTE FUNCTION refresh_brand_views();

DROP TRIGGER IF EXISTS refresh_brand_views_on_product_change ON products;
CREATE TRIGGER refresh_brand_views_on_product_change
    AFTER INSERT OR UPDATE OR DELETE ON products
    FOR EACH STATEMENT EXECUTE FUNCTION refresh_brand_views();

-- 10. Grant necessary permissions
-- Note: Adjust these based on your specific user roles
-- GRANT SELECT ON brand_statistics TO anon, authenticated;
-- GRANT SELECT ON brand_category_breakdown TO anon, authenticated;

-- 11. Create backup views for fallback
CREATE OR REPLACE VIEW brand_statistics_fallback AS
SELECT 
    b.id,
    b.name,
    b.slug,
    b.logo_url,
    COALESCE(b.country, 'Unknown') as country,
    COALESCE(b.founded_year, 1900) as founded_year,
    COALESCE(b.is_premium, false) as is_premium,
    b.website_url,
    COALESCE(b.sort_order, 0) as sort_order,
    0 as total_products,
    0 as total_categories,
    0.00 as avg_price,
    0 as min_price,
    0 as max_price,
    0 as total_stock,
    0 as in_stock_products,
    0 as featured_products
FROM brands b
WHERE b.is_active = true;

-- 12. Add comments for documentation
COMMENT ON MATERIALIZED VIEW brand_statistics IS 'Optimized view for brand statistics including product counts, pricing, and inventory';
COMMENT ON MATERIALIZED VIEW brand_category_breakdown IS 'Category breakdown by brand with product counts and pricing information';
COMMENT ON FUNCTION refresh_brand_views() IS 'Function to refresh all brand-related materialized views'; 