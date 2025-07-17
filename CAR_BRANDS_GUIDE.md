# 🚗 Car Brands System Guide

## 📋 Quick Setup

1. **Go to Supabase Dashboard** → Your project → SQL Editor
2. **Copy & paste** content from `add-car-brands.sql`
3. **Click "Run"** to execute
4. **Check results** → You'll see 50+ car brands added

## 🏗️ What Was Created

### 1. **`car_makes` Table**
- **50+ popular car brands** from global market
- **Popularity ratings** (1-10) for Bulgarian market
- **Country information** for each brand
- **Logo URLs** linked to your `/logos/` directory
- **Website URLs** and founding years
- **Auto-updating timestamps**

### 2. **Performance Features**
- **Indexes** for fast queries
- **Triggers** for automatic timestamp updates
- **Views** for popular brands
- **Constraints** for data integrity

### 3. **Bulgarian Market Focus**
- **German brands** (BMW, Mercedes, Audi, VW) - highest popularity
- **French brands** (Renault, Peugeot, Dacia) - very popular
- **Japanese brands** (Toyota, Honda, Nissan) - growing popularity
- **All major brands** from Europe, Asia, America

## 📊 Database Structure

```sql
CREATE TABLE car_makes (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,        -- "BMW", "Mercedes-Benz"
    slug TEXT NOT NULL UNIQUE,        -- "bmw", "mercedes-benz"
    logo_url TEXT,                    -- "/logos/bmw.png"
    country TEXT,                     -- "Germany", "Japan"
    website_url TEXT,                 -- "https://www.bmw.com"
    founded_year INTEGER,             -- 1916
    is_active BOOLEAN DEFAULT true,   -- Active/inactive
    popularity INTEGER (1-10),        -- Bulgarian market popularity
    sort_order INTEGER DEFAULT 0,    -- Manual sorting
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

## 🔍 Usage Examples

### Popular German Brands
```sql
SELECT name, popularity, founded_year
FROM car_makes 
WHERE country = 'Germany' AND is_active = true
ORDER BY popularity DESC;
```

### Top 10 Most Popular Brands
```sql
SELECT * FROM popular_car_makes LIMIT 10;
```

### Brands by Country Statistics
```sql
SELECT 
    country,
    COUNT(*) as brand_count,
    ROUND(AVG(popularity), 1) as avg_popularity
FROM car_makes
WHERE is_active = true
GROUP BY country
ORDER BY brand_count DESC;
```

### Search Brands
```sql
SELECT name, country, popularity
FROM car_makes
WHERE name ILIKE '%mer%' AND is_active = true;
```

## 🛠️ Management Operations

### Add New Car Brand
```sql
INSERT INTO car_makes (name, slug, country, popularity, logo_url)
VALUES ('New Brand', 'new-brand', 'Country', 8, '/logos/new-brand.png');
```

### Update Brand Popularity
```sql
UPDATE car_makes 
SET popularity = 9 
WHERE slug = 'tesla';
```

### Disable Brand
```sql
UPDATE car_makes 
SET is_active = false 
WHERE slug = 'old-brand';
```

## 🔗 Integration with Products

### Link Products to Car Brands
```sql
-- Update product compatibility to reference car_makes
UPDATE products 
SET compatibility = jsonb_set(
    compatibility,
    '{car_make_ids}',
    (SELECT jsonb_agg(id) FROM car_makes WHERE name = ANY(
        (compatibility->>'makes')::text[]
    ))
)
WHERE compatibility->>'makes' IS NOT NULL;
```

### Create Car Models Table (Optional)
```sql
CREATE TABLE car_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    make_id UUID REFERENCES car_makes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    generation TEXT,
    year_start INTEGER,
    year_end INTEGER,
    body_type TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(make_id, slug)
);
```

## 📈 Analytics Queries

### Brands by Popularity
```sql
SELECT 
    name,
    country,
    popularity,
    founded_year,
    CASE 
        WHEN popularity >= 9 THEN 'Very Popular'
        WHEN popularity >= 7 THEN 'Popular'
        WHEN popularity >= 5 THEN 'Moderate'
        ELSE 'Niche'
    END as market_status
FROM car_makes
WHERE is_active = true
ORDER BY popularity DESC, name ASC;
```

### Country Analysis
```sql
SELECT 
    country,
    COUNT(*) as total_brands,
    COUNT(CASE WHEN popularity >= 8 THEN 1 END) as popular_brands,
    ROUND(AVG(popularity), 1) as avg_popularity,
    MIN(founded_year) as oldest_brand,
    MAX(founded_year) as newest_brand
FROM car_makes
WHERE is_active = true
GROUP BY country
ORDER BY avg_popularity DESC;
```

## 🎯 Next Steps

1. **Use in vehicle selectors** - Replace mock data with database data
2. **Create car models table** - Add specific models for each brand
3. **Link with products** - Use car_makes.id in product compatibility
4. **Build admin interface** - Manage brands through your app
5. **Add more brands** - Expand with local/regional brands

## 🌟 Features

- ✅ **50+ Global Brands** - All major manufacturers
- ✅ **Bulgarian Market Focus** - Popularity ratings for local market
- ✅ **Logo Integration** - Links to your existing logo files
- ✅ **Performance Optimized** - Indexes for fast queries
- ✅ **Auto-timestamps** - Tracks creation and updates
- ✅ **Extensible** - Easy to add models, variants, etc.
- ✅ **Production Ready** - Constraints, triggers, views

Your car brands system is now ready to power vehicle selectors, product compatibility, and market analytics! 