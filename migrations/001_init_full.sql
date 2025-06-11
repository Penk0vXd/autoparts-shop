-- Auto Parts Store - Complete Database Migration
-- Compatible with Supabase PostgreSQL 15+
-- This file contains the entire database schema, functions, indexes, and seed data

-- ================================================
-- EXTENSIONS
-- ================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

-- ================================================
-- CUSTOM TYPES
-- ================================================

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending', 'paid', 'shipped', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ================================================
-- CORE TABLES
-- ================================================

-- Brands table
CREATE TABLE IF NOT EXISTS brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) UNIQUE NOT NULL,
    logo_url VARCHAR(500),
    description TEXT,
    category text NOT NULL DEFAULT 'car' CHECK (category IN ('car', 'accessory', 'parts')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table  
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    compare_price NUMERIC(10,2) CHECK (compare_price >= 0),
    cost_price NUMERIC(10,2) CHECK (cost_price >= 0),
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    min_stock_level INTEGER DEFAULT 0 CHECK (min_stock_level >= 0),
    weight NUMERIC(8,2),
    dimensions JSONB,
    image_url VARCHAR(500),
    images JSONB,
    specifications JSONB,
    compatibility JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    meta_title VARCHAR(200),
    meta_description VARCHAR(500),
    search_tsv tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('simple', coalesce(name, '')), 'A') ||
        setweight(to_tsvector('simple', coalesce(description, '')), 'B')
    ) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table (extends auth.users)
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status order_status DEFAULT 'pending',
    payment_status payment_status DEFAULT 'pending',
    payment_method VARCHAR(50),
    stripe_payment_id VARCHAR(100),
    subtotal NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
    tax_amount NUMERIC(10,2) DEFAULT 0 CHECK (tax_amount >= 0),
    shipping_amount NUMERIC(10,2) DEFAULT 0 CHECK (shipping_amount >= 0),
    discount_amount NUMERIC(10,2) DEFAULT 0 CHECK (discount_amount >= 0),
    total NUMERIC(10,2) NOT NULL CHECK (total >= 0),
    currency VARCHAR(3) DEFAULT 'BGN',
    billing_address JSONB,
    shipping_address JSONB,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(200) NOT NULL,
    product_sku VARCHAR(50) NOT NULL,
    qty INTEGER NOT NULL CHECK (qty > 0),
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    total_price NUMERIC(10,2) NOT NULL CHECK (total_price >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- INDEXES
-- ================================================

-- Brand indexes
CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug);
CREATE INDEX IF NOT EXISTS idx_brands_active ON brands(is_active);
CREATE INDEX IF NOT EXISTS idx_brands_category ON brands(category);

-- Category indexes
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);

-- Product indexes
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock) WHERE stock > 0;
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_deleted ON products(is_deleted) WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS idx_products_search_tsv ON products USING gin(search_tsv);

-- Order indexes
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);

-- Order items indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);

-- ================================================
-- FUNCTIONS AND TRIGGERS
-- ================================================

-- Updated timestamp trigger function
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply timestamp triggers
CREATE TRIGGER set_timestamp_brands BEFORE UPDATE ON brands FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_categories BEFORE UPDATE ON categories FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_products BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_orders BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- Product search functions
CREATE OR REPLACE FUNCTION search_products(query text, lim int DEFAULT 8)
RETURNS SETOF products AS $$
SELECT *
FROM products
WHERE search_tsv @@ plainto_tsquery('simple', query)
ORDER BY ts_rank(search_tsv, plainto_tsquery('simple', query)) DESC
LIMIT lim;
$$ LANGUAGE sql STABLE;

-- Prefix search function for products
CREATE OR REPLACE FUNCTION search_products_prefix(query text, lim int DEFAULT 8)
RETURNS SETOF products AS $$
DECLARE
  ts_query tsquery;
  clean_tokens text[];
  token text;
BEGIN
  -- Handle empty query
  IF query IS NULL OR trim(query) = '' THEN
    RETURN;
  END IF;

  -- Split query into tokens and clean them
  SELECT array_agg(clean_token || ':*')
  INTO clean_tokens
  FROM (
    SELECT regexp_replace(lower(trim(token)), '[^a-zA-Zа-яё0-9]', '', 'g') as clean_token
    FROM regexp_split_to_table(query, '\s+') AS token
    WHERE length(trim(token)) > 0
      AND regexp_replace(lower(trim(token)), '[^a-zA-Zа-яё0-9]', '', 'g') != ''
  ) t
  WHERE length(clean_token) > 0;

  -- If no valid tokens, return empty
  IF clean_tokens IS NULL OR array_length(clean_tokens, 1) = 0 THEN
    RETURN;
  END IF;

  BEGIN
    -- Build tsquery with prefix matching
    ts_query := to_tsquery('simple', array_to_string(clean_tokens, ' & '));
    
    -- Return matching products ordered by relevance
    RETURN QUERY
    SELECT *
    FROM products
    WHERE is_active = true
      AND search_tsv @@ ts_query
    ORDER BY ts_rank_cd(search_tsv, ts_query) DESC
    LIMIT lim;
    
  EXCEPTION WHEN OTHERS THEN
    -- If tsquery fails, return empty result
    RETURN;
  END;
END;
$$ LANGUAGE plpgsql STABLE;

-- ================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================

ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;  
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Public read access for brands, categories, products
CREATE POLICY "Allow public read access on brands" ON brands FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access on categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access on products" ON products FOR SELECT USING (is_active = true AND is_deleted = false);

-- Admin full access
CREATE POLICY "Allow admin full access on brands" ON brands FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Allow admin full access on categories" ON categories FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Allow admin full access on products" ON products FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Allow admin full access on orders" ON orders FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Allow admin full access on order_items" ON order_items FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- User access to their own orders
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own order items" ON order_items FOR SELECT USING (EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
));
CREATE POLICY "Users can create order items" ON order_items FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
));

-- ================================================
-- SEED DATA
-- ================================================

-- Insert auto parts brands
INSERT INTO brands (name, slug, description, category) VALUES
('Bosch', 'bosch', 'Водещ немски производител на автомобилни части и системи', 'car'),
('Febi Bilstein', 'febi-bilstein', 'Немски производител на оригинални резервни части', 'car'),
('Sachs', 'sachs', 'Специалист в амортисьори и съединители', 'car'),
('Brembo', 'brembo', 'Премиум спирачни системи за високи експлоатационни нужди', 'car'),
('Mann-Filter', 'mann-filter', 'Водещ производител на филтри за автомобили', 'parts'),
('NGK', 'ngk', 'Японски производител на свещи и лямбда сонди', 'parts'),
('Valeo', 'valeo', 'Френски производител на автомобилни компоненти', 'car'),
('Continental', 'continental', 'Немски производител на гуми и електроника', 'car'),
('SKF', 'skf', 'Шведски производител на лагери и уплътнения', 'parts'),
('LuK', 'luk', 'Немски специалист в съединители и двумасови маховици', 'parts'),
('Mahle', 'mahle', 'Немски производител на филтри и охлаждащи системи', 'parts'),
('TRW', 'trw', 'Американски производител на спирачни системи', 'car'),
('Lemförder', 'lemforder', 'Немски производител на окачване и каросерийни части', 'car'),
('Hella', 'hella', 'Немски производител на осветление и електроника', 'accessory'),
('Pierburg', 'pierburg', 'Немски производител на помпи и горивни системи', 'parts'),
('Meyle', 'meyle', 'Немски производител на HD части за търговски превозни средства', 'parts'),
('Thule', 'thule', 'Водещ производител на багажници и транспортни решения', 'accessory'),
('Castrol', 'castrol', 'Водещ производител на моторни масла и течности', 'parts')
ON CONFLICT (name) DO NOTHING;

-- Insert car manufacturer brands  
INSERT INTO brands (name, slug, description, category) VALUES
('BMW', 'bmw', 'Немска премиум марка автомобили', 'car'),
('Mercedes-Benz', 'mercedes-benz', 'Немска луксозна марка автомобили', 'car'),
('Audi', 'audi', 'Немска премиум марка автомобили', 'car'),
('Volkswagen', 'volkswagen', 'Немска автомобилна марка', 'car'),
('Opel', 'opel', 'Немска автомобилна марка', 'car'),
('Ford', 'ford', 'Американска автомобилна марка', 'car'),
('Renault', 'renault', 'Френска автомобилна марка', 'car'),
('Peugeot', 'peugeot', 'Френска автомобилна марка', 'car'),
('Citroën', 'citroen', 'Френска автомобилна марка', 'car'),
('Fiat', 'fiat', 'Италианска автомобилна марка', 'car'),
('Toyota', 'toyota', 'Японска автомобилна марка', 'car'),
('Honda', 'honda', 'Японска автомобилна марка', 'car'),
('Nissan', 'nissan', 'Японска автомобилна марка', 'car'),
('Hyundai', 'hyundai', 'Южнокорейска автомобилна марка', 'car'),
('Kia', 'kia', 'Южнокорейска автомобилна марка', 'car'),
('Skoda', 'skoda', 'Чешка автомобилна марка', 'car'),
('Seat', 'seat', 'Испанска автомобилна марка', 'car'),
('Volvo', 'volvo', 'Шведска автомобилна марка', 'car'),
('Dacia', 'dacia', 'Румънска автомобилна марка', 'car'),
('Alfa Romeo', 'alfa-romeo', 'Иселнска автомобилна марка', 'car')
ON CONFLICT (name) DO NOTHING;

-- Insert categories
INSERT INTO categories (name, slug, description) VALUES
('Двигател', 'dvigatel', 'Части за двигателя и горивната система'),
('Спирачки', 'spirachki', 'Спирачни дискове, накладки и системи'),
('Окачване', 'okachvane', 'Амортисьори, пружини и части за окачването'),
('Електрика', 'elektrika', 'Електрически части и компоненти'),
('Филтри', 'filtri', 'Въздушни, маслени и горивни филтри'),
('Каросерия', 'karoseriya', 'Външни части и аксесоари за каросерията'),
('Интериор', 'interior', 'Части за вътрешността на автомобила'),
('Климатик', 'klimatik', 'Части за климатичната система'),
('Изпускателна система', 'izpuskatelna-sistema', 'Ауспуси и катализатори'),
('Съединител', 'saedinitel', 'Съединители и трансмисия')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (sku, name, slug, description, short_description, category_id, brand_id, price, compare_price, stock, is_featured, specifications, compatibility) VALUES
(
    'BOX-OF-001',
    'Маслен филтър Bosch',
    'maslen-filter-bosch',
    'Оригинален маслен филтър за всички популярни модели. Високо качество и дълготрайност.',
    'Оригинален маслен филтър за всички популярни модели',
    (SELECT id FROM categories WHERE slug = 'filtri'),
    (SELECT id FROM brands WHERE slug = 'bosch'),
    25.99,
    32.99,
    150,
    true,
    '{"material": "Хартия", "diameter": "76mm", "height": "85mm"}',
    '{"makes": ["BMW", "Mercedes", "Audi"], "years": ["2010-2024"]}'
),
(
    'BOX-SP-002',
    'Спирачни накладки Brembo',
    'spirachni-nakladki-brembo',
    'Високоефективни спирачни накладки за спортно шофиране.',
    'Високоефективни спирачни накладки',
    (SELECT id FROM categories WHERE slug = 'spirachki'),
    (SELECT id FROM brands WHERE slug = 'brembo'),
    89.99,
    110.00,
    75,
    true,
    '{"material": "Керамика", "thickness": "17mm"}',
    '{"makes": ["BMW", "Audi"], "years": ["2015-2024"]}'
),
(
    'SAC-AM-003',
    'Амортисьор Sachs',
    'amortisor-sachs',
    'Надежден амортисьор за комфортно и безопасно движение.',
    'Надежден амортисьор за комфортно движение',
    (SELECT id FROM categories WHERE slug = 'okachvane'),
    (SELECT id FROM brands WHERE slug = 'sachs'),
    125.50,
    155.00,
    45,
    false,
    '{"type": "Gas", "length": "350mm"}',
    '{"makes": ["Volkswagen", "Skoda"], "years": ["2012-2022"]}'
)
ON CONFLICT (sku) DO NOTHING;

-- Comments for functions
COMMENT ON FUNCTION search_products(text, int) IS 'Full-text search for products using PostgreSQL tsvector';
COMMENT ON FUNCTION search_products_prefix(text, int) IS 'Prefix-only search for products using PostgreSQL full-text search. Only matches tokens that start with the query terms.';

-- Migration complete
SELECT 'Migration 001_init_full.sql completed successfully' as status; 