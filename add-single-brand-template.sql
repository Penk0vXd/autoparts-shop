-- Simple SQL Template for Adding Individual Brands
-- Copy, modify values, and run in Supabase SQL Editor

-- Template Structure:
-- INSERT INTO brands (name, slug, logo_url, description, is_active) 
-- VALUES ('Brand Name', 'brand-slug', '/logos/brand-logo.png', 'Brand description in Bulgarian', true)
-- ON CONFLICT DO NOTHING;

-- Example 1: Premium Car Brand
INSERT INTO brands (name, slug, logo_url, description, is_active) 
VALUES ('Tesla', 'tesla', '/logos/tesla.png', 'Електрически автомобили от бъдещето', true)
ON CONFLICT DO NOTHING;

-- Example 2: Japanese Brand
INSERT INTO brands (name, slug, logo_url, description, is_active) 
VALUES ('Mazda', 'mazda', '/logos/mazda.png', 'Японска иновация и дизайн', true)
ON CONFLICT DO NOTHING;

-- Example 3: Luxury Brand
INSERT INTO brands (name, slug, logo_url, description, is_active) 
VALUES ('Ferrari', 'ferrari', '/logos/ferrari.png', 'Италиански суперспортни автомобили', true)
ON CONFLICT DO NOTHING;

-- Template to Copy and Modify:
-- INSERT INTO brands (name, slug, logo_url, description, is_active) 
-- VALUES ('YOUR_BRAND_NAME', 'your-brand-slug', '/logos/your-logo.png', 'Your description in Bulgarian', true)
-- ON CONFLICT DO NOTHING;

/*
INSTRUCTIONS:
1. Replace 'YOUR_BRAND_NAME' with the actual brand name (e.g., 'Porsche')
2. Replace 'your-brand-slug' with lowercase, dash-separated version (e.g., 'porsche')
3. Replace '/logos/your-logo.png' with actual logo path (check /public/logos/ folder)
4. Replace description with Bulgarian text describing the brand
5. Keep 'true' for is_active (makes brand visible on site)
6. ON CONFLICT DO NOTHING prevents errors if brand already exists

SLUG RULES:
- All lowercase
- Replace spaces with dashes
- No special characters
- Examples: 'Mercedes-Benz' → 'mercedes-benz', 'Alfa Romeo' → 'alfa-romeo'

LOGO PATHS:
Check available logos in /public/logos/ folder:
- /logos/bmw.png
- /logos/mercedes-benz.png  
- /logos/tesla.png
- etc.
*/ 