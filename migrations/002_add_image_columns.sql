-- Add/update image_url columns and add validation checks.
-- This migration assumes the columns might already exist from a previous schema.
-- It ensures the type is `text` and adds a URL format check constraint.

-- Products
ALTER TABLE products
  ALTER COLUMN image_url TYPE text;
ALTER TABLE products
  ADD CONSTRAINT products_image_url_chk CHECK (image_url IS NULL OR image_url ~* '^https?://');

-- Brands
ALTER TABLE brands
  ALTER COLUMN logo_url TYPE text;
ALTER TABLE brands
  ADD CONSTRAINT brands_logo_url_chk CHECK (logo_url IS NULL OR logo_url ~* '^https?://');

-- Categories
ALTER TABLE categories
  ALTER COLUMN image_url TYPE text;
ALTER TABLE categories
  ADD CONSTRAINT categories_image_url_chk CHECK (image_url IS NULL OR image_url ~* '^https?://'); 