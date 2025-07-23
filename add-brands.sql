-- Add missing premium car brands to database
-- Run this in your Supabase SQL editor
-- Uses ON CONFLICT DO NOTHING to skip existing brands (handles name and slug conflicts)

-- European Premium Brands (missing from current database)
INSERT INTO brands (name, slug, logo_url, description, is_active) VALUES
('Porsche', 'porsche', '/logos/porsche.png', 'Немски спортни автомобили', true),
('Mini', 'mini', '/logos/mini.png', 'Британски премиум компакти', true),
('Jaguar', 'jaguar', '/logos/jaguar.png', 'Британски луксозни автомобили', true),
('Land Rover', 'land-rover', '/logos/land-rover.png', 'Британски офроуд специалисти', true),
('Volvo', 'volvo', '/logos/volvo.png', 'Шведска сигурност и качество', true)
ON CONFLICT DO NOTHING;

-- Japanese Reliability (Very popular in Bulgaria)  
INSERT INTO brands (name, slug, logo_url, description, is_active) VALUES
('Mazda', 'mazda', '/logos/mazda.png', 'Японска иновация и дизайн', true),
('Subaru', 'subaru', '/logos/subaru.png', '4x4 специалисти от Япония', true),
('Mitsubishi', 'mitsubishi', '/logos/mitsubishi.png', 'Японски кросоувъри и седани', true),
('Lexus', 'lexus', '/logos/lexus.png', 'Toyota луксозна гама', true),
('Infiniti', 'infiniti', '/logos/infiniti.png', 'Nissan премиум марка', true)
ON CONFLICT DO NOTHING;

-- American Brands (Growing market in Bulgaria)
INSERT INTO brands (name, slug, logo_url, description, is_active) VALUES  
('Jeep', 'jeep', '/logos/jeep.png', 'Американски офроуд легенди', true),
('Chevrolet', 'chevrolet', '/logos/chevrolet.png', 'Американски автомобили', true),
('Chrysler', 'chrysler', '/logos/chrysler.png', 'Американски луксозни седани', true),
('Cadillac', 'cadillac', '/logos/cadillac.png', 'Американски луксозни автомобили', true)
ON CONFLICT DO NOTHING;

-- Electric/Future Focus
INSERT INTO brands (name, slug, logo_url, description, is_active) VALUES
('Tesla', 'tesla', '/logos/tesla.png', 'Електрически автомобили от бъдещето', true)
ON CONFLICT DO NOTHING;

-- Existing European brands to add (have logos)
INSERT INTO brands (name, slug, logo_url, description, is_active) VALUES
('Renault', 'renault', '/logos/renault.png', 'Френски автомобили', true),
('Peugeot', 'peugeot', '/logos/peugeot.png', 'Френски дизайн и иновации', true),
('Citroën', 'citroën', '/logos/citroen.png', 'Френски комфорт и технологии', true),
('Fiat', 'fiat', '/logos/fiat.png', 'Италиански стил и ефективност', true),
('Seat', 'seat', '/logos/seat.png', 'Испански дизайн с немска техника', true),
('Skoda', 'skoda', '/logos/skoda.png', 'Чешко качество и практичност', true),
('Alfa Romeo', 'alfa-romeo', '/logos/alfa-romeo.png', 'Италиански спортен дух', true),
('Opel', 'opel', '/logos/opel.png', 'Немска инженерия за всеки ден', true)
ON CONFLICT DO NOTHING;

-- Asian Popular Brands
INSERT INTO brands (name, slug, logo_url, description, is_active) VALUES
('Honda', 'honda', '/logos/honda.png', 'Японска надеждност и ефективност', true),
('Nissan', 'nissan', '/logos/nissan.png', 'Японска технология и иновации', true),
('Hyundai', 'hyundai', '/logos/hyundai.png', 'Корейско качество и гаранция', true),
('Kia', 'kia', '/logos/kia.png', 'Корейски дизайн и технологии', true)
ON CONFLICT DO NOTHING;

-- Ultra-luxury brands (for premium market)
INSERT INTO brands (name, slug, logo_url, description, is_active) VALUES
('Ferrari', 'ferrari', '/logos/ferrari.png', 'Итaliански суперспортни автомобили', true),
('Lamborghini', 'lamborghini', '/logos/lamborghini.png', 'Италиански суперкари', true),
('Maserati', 'maserati', '/logos/maserati.png', 'Италиански луксозни спортни автомобили', true),
('Rolls-Royce', 'rolls-royce', '/logos/rolls-royce.png', 'Британски ултра-луксозни автомобили', true),
('Bentley', 'bentley', '/logos/bentley.png', 'Британски луксозни GT автомобили', true),
('Aston Martin', 'aston-martin', '/logos/aston-martin.png', 'Британски луксозни спортни автомобили', true),
('McLaren', 'mclaren', '/logos/mclaren.png', 'Британски суперспортни автомобили', true)
ON CONFLICT DO NOTHING;

-- Budget/Value brands
INSERT INTO brands (name, slug, logo_url, description, is_active) VALUES
('Dacia', 'dacia', '/logos/dacia.png', 'Румънски бюджетни автомобили', true),
('Lada', 'lada', '/logos/lada.png', 'Руски автомобили', true)
ON CONFLICT DO NOTHING; 