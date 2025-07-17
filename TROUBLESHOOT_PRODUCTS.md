# 🔧 Troubleshooting: Products Not Showing on Website

## 📋 Step-by-Step Debugging

### **Step 1: Run the Debug Script**
1. Go to **Supabase Dashboard** → Your project → **SQL Editor**
2. Copy and paste the entire `debug-products.sql` script
3. Click **"Run"**
4. Check the output results

### **Step 2: Check Database Setup**

**If you see "No tables" or "0 tables":**
1. Run `database_migration_safe.sql` first
2. Then run `debug-products.sql` again

**If you see "0 products":**
1. Run `add-product.sql` to add sample products
2. Run `add-more-products.sql` to add more products
3. Run `debug-products.sql` again

### **Step 3: Check Your Supabase Connection**

**Create `.env.local` file in your project root:**
```bash
# Get these from Supabase Dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**To get your Supabase credentials:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the values to your `.env.local` file

### **Step 4: Check Website for Errors**

1. **Open your website** in browser
2. **Press F12** to open Developer Tools
3. **Go to Console tab**
4. **Look for errors** (red text)

**Common errors and solutions:**
- `Missing Supabase environment variables` → Check `.env.local`
- `Failed to fetch products` → Check database connection
- `CORS error` → Restart your dev server
- `404 on /api/products` → Check API routes exist

### **Step 5: Test API Directly**

**Visit these URLs in your browser:**
- `http://localhost:3000/api/products` → Should show products JSON
- `http://localhost:3000/api/brands` → Should show brands JSON
- `http://localhost:3000/api/categories` → Should show categories JSON

**If you get errors:**
1. Check your `.env.local` file
2. Restart your dev server: `npm run dev`
3. Check Supabase dashboard for connection issues

### **Step 6: Quick Database Check**

**Run this in Supabase SQL Editor:**
```sql
-- Quick check
SELECT 
    'Products:' as type, 
    COUNT(*) as count 
FROM products 
WHERE is_active = true

UNION ALL

SELECT 
    'Brands:' as type, 
    COUNT(*) as count 
FROM brands 
WHERE is_active = true

UNION ALL

SELECT 
    'Categories:' as type, 
    COUNT(*) as count 
FROM categories 
WHERE is_active = true;
```

**You should see:**
- Products: 6 (if you ran both SQL scripts)
- Brands: 8 (from seed data)
- Categories: 4 (from seed data)

## 🚨 Most Common Issues & Solutions

### **Issue 1: "No products showing"**
**Solution:**
1. Run `database_migration_safe.sql`
2. Run `add-product.sql`
3. Run `add-more-products.sql`
4. Check `.env.local` file

### **Issue 2: "API errors in console"**
**Solution:**
1. Check `.env.local` has correct Supabase URLs
2. Restart dev server: `npm run dev`
3. Check Supabase project is active

### **Issue 3: "Products exist but not displaying"**
**Solution:**
1. Run `debug-products.sql`
2. Check for missing columns (script will add them)
3. Clear browser cache and refresh

### **Issue 4: "Database connection error"**
**Solution:**
1. Check Supabase project is not paused
2. Verify API keys in `.env.local`
3. Check your IP is not blocked

## 🛠️ Complete Setup Checklist

### ✅ **Database Setup**
- [ ] Run `database_migration_safe.sql`
- [ ] Tables created (products, brands, categories)
- [ ] Run `debug-products.sql` - shows tables exist

### ✅ **Data Setup**
- [ ] Run `add-product.sql`
- [ ] Run `add-more-products.sql`
- [ ] Run `debug-products.sql` - shows products exist

### ✅ **Environment Setup**
- [ ] `.env.local` file created
- [ ] Supabase URL added
- [ ] Supabase keys added
- [ ] Dev server restarted

### ✅ **Website Check**
- [ ] Visit `http://localhost:3000/catalog`
- [ ] Press F12 → Console → No errors
- [ ] Visit `http://localhost:3000/api/products` → Shows JSON
- [ ] Products display on website

## 🎯 Quick Test Commands

**Test 1: Check Database**
```sql
SELECT COUNT(*) FROM products WHERE is_active = true;
```

**Test 2: Check API**
Visit: `http://localhost:3000/api/products`

**Test 3: Check Website**
Visit: `http://localhost:3000/catalog`

**Test 4: Check Console**
Press F12 → Console → Look for errors

## 📞 Still Not Working?

If you're still having issues:

1. **Run `debug-products.sql`** and share the output
2. **Check browser console** for errors
3. **Verify `.env.local`** has correct Supabase credentials
4. **Try visiting `/api/products`** directly in browser

**The most common issue is missing `.env.local` file or incorrect Supabase credentials.** 