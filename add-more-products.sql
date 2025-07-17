-- 🛍️ ADD MORE PRODUCTS - DIFFERENT CATEGORIES
-- Copy and paste each section individually into Supabase SQL Editor

-- 🔧 PRODUCT 1: ENGINE FILTER (Mann Filter)
INSERT INTO products (
    sku, name, slug, description, short_description, price, compare_price, cost_price,
    stock, min_stock_level, weight, brand_id, category_id, images, specifications, compatibility,
    is_active, is_featured, meta_title, meta_description, meta_keywords
)
SELECT 
    'AP-' || EXTRACT(EPOCH FROM NOW())::text || '-' || LPAD((RANDOM() * 999)::int::text, 3, '0') as sku,
    'Маслен филтър Mann Filter HU7008z' as name,
    'maslen-filter-mann-filter-hu7008z' as slug,
    'Оригинален маслен филтър Mann Filter HU7008z за BMW и Mercedes двигатели. Осигурява максимална защита на двигателя и дълъг експлоатационен живот.' as description,
    'Маслен филтър Mann Filter HU7008z - оригинално немско качество' as short_description,
    18.99 as price,
    24.99 as compare_price,
    11.99 as cost_price,
    50 as stock,
    10 as min_stock_level,
    0.3 as weight,
    (SELECT id FROM brands WHERE name = 'Mann Filter' LIMIT 1) as brand_id,
    (SELECT id FROM categories WHERE slug = 'dvigatel' LIMIT 1) as category_id,
    ARRAY[
        'https://example.com/products/mann-filter-hu7008z-1.jpg',
        'https://example.com/products/mann-filter-hu7008z-2.jpg'
    ] as images,
    jsonb_build_object(
        'type', 'Маслен филтър',
        'material', 'Специална филтърна хартия',
        'warranty', '12 месеца',
        'origin', 'Германия',
        'oem_number', 'HU7008z',
        'thread_size', 'M18x1.5'
    ) as specifications,
    jsonb_build_object(
        'makes', ARRAY['BMW', 'Mercedes'],
        'years', ARRAY['2010-2024'],
        'models', ARRAY['3 Series', 'C-Class', 'E-Class', 'X3'],
        'engines', ARRAY['2.0L Diesel', '3.0L Diesel']
    ) as compatibility,
    true as is_active,
    false as is_featured,
    'Маслен филтър Mann Filter HU7008z - Авточасти' as meta_title,
    'Маслен филтър Mann Filter HU7008z за BMW и Mercedes. Оригинално немско качество.' as meta_description,
    ARRAY['маслен филтър', 'mann filter', 'bmw', 'mercedes', 'двигател'] as meta_keywords;

-- 🔧 PRODUCT 2: SUSPENSION (Sachs)
INSERT INTO products (
    sku, name, slug, description, short_description, price, compare_price, cost_price,
    stock, min_stock_level, weight, brand_id, category_id, images, specifications, compatibility,
    is_active, is_featured, meta_title, meta_description, meta_keywords
)
SELECT 
    'AP-' || EXTRACT(EPOCH FROM NOW())::text || '-' || LPAD((RANDOM() * 999)::int::text, 3, '0') as sku,
    'Амортисьор Sachs 312054' as name,
    'amortisor-sachs-312054' as slug,
    'Преден амортисьор Sachs 312054 за VW Golf и Audi A3. Осигурява отлично сцепление и комфорт при шофиране.' as description,
    'Амортисьор Sachs 312054 - немско качество за VW и Audi' as short_description,
    165.99 as price,
    199.99 as compare_price,
    99.99 as cost_price,
    15 as stock,
    3 as min_stock_level,
    2.8 as weight,
    (SELECT id FROM brands WHERE name = 'Sachs' LIMIT 1) as brand_id,
    (SELECT id FROM categories WHERE slug = 'okachvane' LIMIT 1) as category_id,
    ARRAY[
        'https://example.com/products/sachs-312054-1.jpg',
        'https://example.com/products/sachs-312054-2.jpg',
        'https://example.com/products/sachs-312054-3.jpg'
    ] as images,
    jsonb_build_object(
        'type', 'Амортисьор',
        'position', 'Предна ос',
        'material', 'Стомана/Алуминий',
        'warranty', '24 месеца',
        'origin', 'Германия',
        'oem_number', '312054',
        'mounting_type', 'Стандартно окачване'
    ) as specifications,
    jsonb_build_object(
        'makes', ARRAY['Volkswagen', 'Audi', 'Seat', 'Skoda'],
        'years', ARRAY['2012-2024'],
        'models', ARRAY['Golf VII', 'A3', 'Leon', 'Octavia'],
        'engines', ARRAY['1.4L TSI', '1.6L TDI', '2.0L TDI']
    ) as compatibility,
    true as is_active,
    true as is_featured,
    'Амортисьор Sachs 312054 - Авточасти' as meta_title,
    'Амортисьор Sachs 312054 за VW Golf и Audi A3. Немско качество и надежност.' as meta_description,
    ARRAY['амортисьор', 'sachs', 'volkswagen', 'audi', 'окачване'] as meta_keywords;

-- 🔧 PRODUCT 3: ELECTRICAL (Hella)
INSERT INTO products (
    sku, name, slug, description, short_description, price, compare_price, cost_price,
    stock, min_stock_level, weight, brand_id, category_id, images, specifications, compatibility,
    is_active, is_featured, meta_title, meta_description, meta_keywords
)
SELECT 
    'AP-' || EXTRACT(EPOCH FROM NOW())::text || '-' || LPAD((RANDOM() * 999)::int::text, 3, '0') as sku,
    'LED Крушка Hella H7 6000K' as name,
    'led-krushka-hella-h7-6000k' as slug,
    'LED крушка Hella H7 6000K с бяла светлина и дълъг експлоатационен живот. Подходяща за фарове и мъглени светлини.' as description,
    'LED крушка Hella H7 6000K - ярка бяла светлина' as short_description,
    45.99 as price,
    59.99 as compare_price,
    28.99 as cost_price,
    30 as stock,
    5 as min_stock_level,
    0.1 as weight,
    (SELECT id FROM brands WHERE name = 'Hella' LIMIT 1) as brand_id,
    (SELECT id FROM categories WHERE slug = 'elektrika' LIMIT 1) as category_id,
    ARRAY[
        'https://example.com/products/hella-h7-led-1.jpg',
        'https://example.com/products/hella-h7-led-2.jpg'
    ] as images,
    jsonb_build_object(
        'type', 'LED крушка',
        'fitting', 'H7',
        'power', '20W',
        'color_temperature', '6000K',
        'warranty', '36 месеца',
        'origin', 'Германия',
        'lifespan', '50000 часа',
        'voltage', '12V'
    ) as specifications,
    jsonb_build_object(
        'makes', ARRAY['BMW', 'Mercedes', 'Audi', 'Volkswagen', 'Opel', 'Ford'],
        'years', ARRAY['2000-2024'],
        'models', ARRAY['Универсално приложение'],
        'application', ARRAY['Фарове', 'Мъглени светлини']
    ) as compatibility,
    true as is_active,
    false as is_featured,
    'LED крушка Hella H7 6000K - Авточасти' as meta_title,
    'LED крушка Hella H7 6000K с бяла светлина. Дълъг експлоатационен живот.' as meta_description,
    ARRAY['led крушка', 'hella', 'h7', 'осветление', 'електрика'] as meta_keywords;

-- 🔧 PRODUCT 4: LUBRICANTS (Castrol)
INSERT INTO products (
    sku, name, slug, description, short_description, price, compare_price, cost_price,
    stock, min_stock_level, weight, brand_id, category_id, images, specifications, compatibility,
    is_active, is_featured, meta_title, meta_description, meta_keywords
)
SELECT 
    'AP-' || EXTRACT(EPOCH FROM NOW())::text || '-' || LPAD((RANDOM() * 999)::int::text, 3, '0') as sku,
    'Моторно масло Castrol GTX 5W-30 4L' as name,
    'motorno-maslo-castrol-gtx-5w-30-4l' as slug,
    'Синтетично моторно масло Castrol GTX 5W-30 4L за бензинови и дизелови двигатели. Осигурява отлична защита при всички условия.' as description,
    'Моторно масло Castrol GTX 5W-30 4L - синтетично качество' as short_description,
    52.99 as price,
    65.99 as compare_price,
    32.99 as cost_price,
    20 as stock,
    5 as min_stock_level,
    3.5 as weight,
    (SELECT id FROM brands WHERE name = 'Castrol' LIMIT 1) as brand_id,
    (SELECT id FROM categories WHERE slug = 'dvigatel' LIMIT 1) as category_id,
    ARRAY[
        'https://example.com/products/castrol-gtx-5w30-1.jpg',
        'https://example.com/products/castrol-gtx-5w30-2.jpg'
    ] as images,
    jsonb_build_object(
        'type', 'Моторно масло',
        'viscosity', '5W-30',
        'volume', '4L',
        'technology', 'Синтетично',
        'warranty', '6 месеца',
        'origin', 'Великобритания',
        'api_rating', 'SN/CF',
        'acea_rating', 'A3/B4'
    ) as specifications,
    jsonb_build_object(
        'makes', ARRAY['BMW', 'Mercedes', 'Audi', 'Volkswagen', 'Opel', 'Ford', 'Toyota'],
        'years', ARRAY['2000-2024'],
        'models', ARRAY['Универсално приложение'],
        'engines', ARRAY['Бензинови', 'Дизелови']
    ) as compatibility,
    true as is_active,
    true as is_featured,
    'Моторно масло Castrol GTX 5W-30 4L - Авточасти' as meta_title,
    'Моторно масло Castrol GTX 5W-30 4L синтетично за всички двигатели.' as meta_description,
    ARRAY['моторно масло', 'castrol', 'gtx', '5w-30', 'синтетично'] as meta_keywords;

-- 🔧 PRODUCT 5: BRAKE DISCS (Brembo)
INSERT INTO products (
    sku, name, slug, description, short_description, price, compare_price, cost_price,
    stock, min_stock_level, weight, brand_id, category_id, images, specifications, compatibility,
    is_active, is_featured, meta_title, meta_description, meta_keywords
)
SELECT 
    'AP-' || EXTRACT(EPOCH FROM NOW())::text || '-' || LPAD((RANDOM() * 999)::int::text, 3, '0') as sku,
    'Спирачен диск Brembo 09.A415.11' as name,
    'spirachen-disk-brembo-09-a415-11' as slug,
    'Спирачен диск Brembo 09.A415.11 за BMW 3 Series. Изключително качество и дълготрайност от световния лидер в спирачните системи.' as description,
    'Спирачен диск Brembo 09.A415.11 - премиум качество' as short_description,
    125.99 as price,
    159.99 as compare_price,
    75.99 as cost_price,
    8 as stock,
    2 as min_stock_level,
    8.5 as weight,
    (SELECT id FROM brands WHERE name = 'Brembo' LIMIT 1) as brand_id,
    (SELECT id FROM categories WHERE slug = 'spirachki' LIMIT 1) as category_id,
    ARRAY[
        'https://example.com/products/brembo-09a41511-1.jpg',
        'https://example.com/products/brembo-09a41511-2.jpg',
        'https://example.com/products/brembo-09a41511-3.jpg'
    ] as images,
    jsonb_build_object(
        'type', 'Спирачен диск',
        'position', 'Предна ос',
        'diameter', '330mm',
        'thickness', '25mm',
        'material', 'Сива чугун',
        'warranty', '24 месеца',
        'origin', 'Италия',
        'oem_number', '09.A415.11',
        'surface_treatment', 'Покритие против корозия'
    ) as specifications,
    jsonb_build_object(
        'makes', ARRAY['BMW'],
        'years', ARRAY['2012-2024'],
        'models', ARRAY['3 Series F30', '3 Series F31', '4 Series F32'],
        'engines', ARRAY['2.0L Diesel', '2.0L Petrol', '3.0L Petrol']
    ) as compatibility,
    true as is_active,
    true as is_featured,
    'Спирачен диск Brembo 09.A415.11 - Авточасти' as meta_title,
    'Спирачен диск Brembo 09.A415.11 за BMW 3 Series. Премиум качество от Италия.' as meta_description,
    ARRAY['спирачен диск', 'brembo', 'bmw', '3 series', 'спирачки'] as meta_keywords;

-- ✅ VERIFY ADDED PRODUCTS
SELECT 'Recently Added Products:' as info;
SELECT 
    p.name,
    p.price || ' лв.' as price,
    p.stock || ' бр.' as stock,
    b.name as brand,
    c.name as category,
    p.created_at
FROM products p
LEFT JOIN brands b ON p.brand_id = b.id
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.created_at >= NOW() - INTERVAL '1 hour'
ORDER BY p.created_at DESC; 