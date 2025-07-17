# 🛍️ How to Add Products to Your Bulgarian Auto Parts Store

## 📋 Quick Steps

1. **Go to Supabase Dashboard** → Your project → SQL Editor
2. **Copy & paste** one of the SQL files below
3. **Click "Run"** to execute
4. **Check results** in the output

## 📁 Available SQL Files

### 1. `add-product.sql` - Main Product Addition
- **Adds:** Bosch brake pads example
- **Shows:** Available brands & categories
- **Includes:** Full product with all fields

### 2. `add-more-products.sql` - 5 Additional Products
- **Mann Filter** oil filter (Engine category)
- **Sachs** shock absorber (Suspension category)
- **Hella** LED bulb (Electrical category)
- **Castrol** motor oil (Engine category)
- **Brembo** brake disc (Brakes category)

## 🎯 Usage Instructions

### Step 1: Add First Product
```sql
-- Copy entire content of add-product.sql
-- Paste into Supabase SQL Editor
-- Click "Run"
```

### Step 2: Add More Products
```sql
-- Copy entire content of add-more-products.sql
-- Paste into Supabase SQL Editor
-- Click "Run"
```

### Step 3: Verify Products Added
```sql
SELECT p.name, p.price, p.stock, b.name as brand, c.name as category
FROM products p
JOIN brands b ON p.brand_id = b.id
JOIN categories c ON p.category_id = c.id
ORDER BY p.created_at DESC;
```

## 🔧 Customize Products

To add your own products, edit these values in the SQL:

```sql
'Your Product Name' as name,
'Your product description...' as description,
99.99 as price,
15 as stock,
(SELECT id FROM brands WHERE name = 'Your Brand' LIMIT 1) as brand_id,
(SELECT id FROM categories WHERE slug = 'your-category' LIMIT 1) as category_id,
```

## 📦 Available Brands
- Bosch, Febi Bilstein, Sachs, Brembo
- Thule, Hella, Castrol, Mann Filter

## 📂 Available Categories
- **dvigatel** (Engine parts)
- **spirachki** (Brakes)
- **okachvane** (Suspension)
- **elektrika** (Electrical)

## ✅ What Each Product Includes
- ✅ Unique SKU (auto-generated)
- ✅ Name & description in Bulgarian
- ✅ Pricing (price, compare_price, cost_price)
- ✅ Stock management
- ✅ Brand & category links
- ✅ Product images (placeholder URLs)
- ✅ Technical specifications (JSONB)
- ✅ Vehicle compatibility (JSONB)
- ✅ SEO metadata (title, description, keywords)
- ✅ Proper slug generation

## 🎉 Ready to Go!
Your products will be immediately available in your Next.js app with full search, filtering, and category functionality! 