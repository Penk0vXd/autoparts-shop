-- Migration: Add multi-image support for products
-- This allows products to have multiple images for galleries and carousels

-- Create product_images table
CREATE TABLE IF NOT EXISTS product_images (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url        text NOT NULL CHECK (url ~* '^https?://'),
  alt_text   text,
  sort_order int  NOT NULL DEFAULT 0,
  is_primary boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS product_images_product_id_idx ON product_images(product_id);
CREATE INDEX IF NOT EXISTS product_images_sort_order_idx ON product_images(product_id, sort_order);
CREATE INDEX IF NOT EXISTS product_images_primary_idx ON product_images(product_id, is_primary) WHERE is_primary = true;

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language plpgsql;

-- Create trigger for product_images
CREATE TRIGGER update_product_images_updated_at 
  BEFORE UPDATE ON product_images 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) policies
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated and anonymous users
CREATE POLICY "Product images are viewable by everyone" 
  ON product_images FOR SELECT 
  USING (true);

-- Allow insert/update/delete for authenticated users (admin functionality)
CREATE POLICY "Product images are editable by authenticated users" 
  ON product_images FOR ALL 
  USING (auth.role() = 'authenticated');

-- Insert sample product images for existing products
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT 
  p.id as product_id,
  CASE 
    WHEN p.image_url IS NOT NULL THEN p.image_url
    ELSE 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop'
  END as url,
  p.name || ' - основно изображение' as alt_text,
  0 as sort_order,
  true as is_primary
FROM products p
WHERE p.is_active = true
ON CONFLICT DO NOTHING;

-- Add additional sample images for demo purposes
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT 
  p.id as product_id,
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop' as url,
  p.name || ' - допълнително изображение 1' as alt_text,
  1 as sort_order,
  false as is_primary
FROM products p
WHERE p.is_active = true
LIMIT 10
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT 
  p.id as product_id,
  'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop' as url,
  p.name || ' - допълнително изображение 2' as alt_text,
  2 as sort_order,
  false as is_primary
FROM products p
WHERE p.is_active = true
LIMIT 8
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT 
  p.id as product_id,
  'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop' as url,
  p.name || ' - допълнително изображение 3' as alt_text,
  3 as sort_order,
  false as is_primary
FROM products p
WHERE p.is_active = true
LIMIT 6
ON CONFLICT DO NOTHING; 