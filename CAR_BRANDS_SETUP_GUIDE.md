# Car Manufacturer Brands Setup Guide

## Overview
This guide explains how to replace auto parts brands with car manufacturer brands on the `/brands` page.

## Current Situation
- **Current brands**: Auto parts brands (Bosch, Brembo, Castrol, etc.)
- **What you want**: Car manufacturer brands (BMW, Mercedes, Audi, etc.)
- **Available logos**: 43 car manufacturer logos in `public/logos/`

## Solution

### Step 1: Replace Brands with Car Manufacturers

**Run this SQL script in Supabase:**

```sql
-- Clear existing auto parts brands
DELETE FROM brands;

-- Reset sequence
ALTER SEQUENCE brands_id_seq RESTART WITH 1;

-- Add 43 car manufacturer brands with proper logos
INSERT INTO brands (name, slug, logo_url, country, is_active, created_at, updated_at) VALUES
('BMW', 'bmw', '/logos/bmw.png', 'Germany', true, NOW(), NOW()),
('Mercedes-Benz', 'mercedes-benz', '/logos/mercedes-benz.png', 'Germany', true, NOW(), NOW()),
('Audi', 'audi', '/logos/audi.png', 'Germany', true, NOW(), NOW()),
-- ... (43 total brands)
```

### Step 2: Update Products to Link to Car Manufacturers

**Run this SQL script to update products:**

```sql
-- Update products to be linked to car manufacturers
UPDATE products SET brand_id = (SELECT id FROM brands WHERE name = 'BMW') WHERE name LIKE '%BMW%';
UPDATE products SET brand_id = (SELECT id FROM brands WHERE name = 'Mercedes-Benz') WHERE name LIKE '%Mercedes%';
UPDATE products SET brand_id = (SELECT id FROM brands WHERE name = 'Audi') WHERE name LIKE '%Audi%';
-- ... (update all products)
```

## What You'll Get

### **43 Car Manufacturer Brands**
- **German**: BMW, Mercedes-Benz, Audi, Porsche, Opel
- **Italian**: Ferrari, Lamborghini, Maserati, Fiat, Alfa Romeo
- **American**: Tesla, Chevrolet, Cadillac, Ford, Jeep, Dodge
- **Japanese**: Lexus, Infiniti, Acura, Mazda, Subaru, Mitsubishi
- **Korean**: Hyundai, Kia, Genesis
- **French**: Peugeot, Renault, Citroën, DS
- **British**: Jaguar, Mini, Bentley, Rolls-Royce, Aston Martin, McLaren
- **Swedish**: Volvo, Saab
- **Chinese**: BYD, Chery
- **Others**: Dacia, SEAT, Lada

### **Updated Website Structure**
- `/brands` - Shows 43 car manufacturer brands with logos
- `/brands/bmw` - Shows BMW products (auto parts for BMW)
- `/brands/mercedes-benz` - Shows Mercedes products
- `/products` - Auto parts categorized by car manufacturer

## Files Created

1. `setup-car-brands.sql` - Main setup script
2. `update-products-for-car-brands.sql` - Update products script
3. `CAR_BRANDS_SETUP_GUIDE.md` - This guide

## How to Execute

### Option 1: Run Complete Setup
```bash
# Copy setup-car-brands.sql content
# Paste into Supabase SQL Editor
# Click "Run"
```

### Option 2: Step by Step
1. **Check current data**: Run `check-car-brands.sql`
2. **Setup car brands**: Run `setup-car-brands.sql`
3. **Update products**: Run `update-products-for-car-brands.sql`
4. **Test API**: Visit `/brands` page

## Expected Results

### Before
- 8 auto parts brands (Bosch, Brembo, etc.)
- Products linked to auto parts manufacturers

### After
- 43 car manufacturer brands (BMW, Mercedes, etc.)
- Products linked to car manufacturers they fit
- Professional car logos on `/brands` page

## Test Commands

```bash
# Test brands API
curl -s "http://localhost:3000/api/brands" | ConvertFrom-Json | Select-Object -ExpandProperty data | Select-Object name, country | Format-Table

# Test specific brand
curl -s "http://localhost:3000/api/brands/bmw" | ConvertFrom-Json

# Check brands page
curl -s "http://localhost:3000/brands"
```

## Troubleshooting

### If logos don't appear:
1. Check logo files exist in `public/logos/`
2. Verify `logo_url` paths in database
3. Clear browser cache
4. Restart Next.js dev server

### If products don't show:
1. Check `brand_id` in products table
2. Verify foreign key constraints
3. Check API endpoints work

## Next Steps

1. **Run the setup script** to get car manufacturer brands
2. **Update products** to link to car manufacturers
3. **Test the `/brands` page** to see all car logos
4. **Add more products** for different car manufacturers
5. **Create car-specific product pages** like `/brands/bmw/products`

This will give you a professional automotive parts catalog organized by car manufacturer brands! 