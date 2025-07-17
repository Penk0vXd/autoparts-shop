-- Update brand logos with proper URLs
-- This script adds logo URLs to the existing brands

UPDATE brands 
SET logo_url = '/logos/parts/bosch.svg'
WHERE slug = 'bosch';

UPDATE brands 
SET logo_url = '/logos/parts/brembo.svg'
WHERE slug = 'brembo';

UPDATE brands 
SET logo_url = '/logos/parts/castrol.svg'
WHERE slug = 'castrol';

UPDATE brands 
SET logo_url = '/logos/parts/febi-bilstein.svg'
WHERE slug = 'febi-bilstein';

UPDATE brands 
SET logo_url = '/logos/parts/hella.svg'
WHERE slug = 'hella';

UPDATE brands 
SET logo_url = '/logos/parts/mann-filter.svg'
WHERE slug = 'mann-filter';

UPDATE brands 
SET logo_url = '/logos/parts/sachs.svg'
WHERE slug = 'sachs';

UPDATE brands 
SET logo_url = '/logos/parts/thule.svg'
WHERE slug = 'thule';

-- Check updated brands
SELECT id, name, slug, logo_url, created_at 
FROM brands 
ORDER BY name; 