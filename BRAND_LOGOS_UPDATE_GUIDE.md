# Brand Logos Update Guide

## Overview
This guide explains how to update the brand logos in the database to display proper logo images.

## Files Created

### 1. **Brand Logo SVG Files**
Created in `public/logos/parts/`:
- `bosch.svg` - Bosch logo (red)
- `brembo.svg` - Brembo logo (dark red)
- `castrol.svg` - Castrol logo (green)
- `febi-bilstein.svg` - Febi Bilstein logo (dark gray)
- `hella.svg` - Hella logo (blue)
- `mann-filter.svg` - Mann Filter logo (orange)
- `sachs.svg` - Sachs logo (dark blue)
- `thule.svg` - Thule logo (blue)

### 2. **Database Update Script**
- `update-brand-logos.sql` - SQL script to update logo URLs

## How to Update Database

### Step 1: Run SQL Script in Supabase

1. **Open Supabase Dashboard**
   - Go to: https://myrcbwztlqwsbcblreim.supabase.co/
   - Navigate to SQL Editor

2. **Copy and Run SQL Script**
   ```sql
   -- Copy the entire content from update-brand-logos.sql
   -- Paste it into the SQL Editor
   -- Click "Run" to execute
   ```

3. **Verify Results**
   - Check that all 8 brands have logo_url values
   - Verify URLs point to `/logos/parts/[brand-name].svg`

### Step 2: Test the API

After running the SQL script, test the API:

```bash
# Test brands API
curl -s "http://localhost:3000/api/brands" | ConvertFrom-Json | Select-Object -ExpandProperty data | Select-Object name, logo_url | Format-Table
```

Expected output:
```
name          logo_url
----          --------
Bosch         /logos/parts/bosch.svg
Brembo        /logos/parts/brembo.svg
Castrol       /logos/parts/castrol.svg
Febi Bilstein /logos/parts/febi-bilstein.svg
Hella         /logos/parts/hella.svg
Mann Filter   /logos/parts/mann-filter.svg
Sachs         /logos/parts/sachs.svg
Thule         /logos/parts/thule.svg
```

### Step 3: Check Website

Visit the brands page to see the logos:
- Homepage: http://localhost:3000/
- Brands page: http://localhost:3000/brands

## Logo Design

All logos are designed as:
- **Size**: 200x60 pixels
- **Format**: SVG (scalable)
- **Style**: Professional with brand colors
- **Background**: White with colored border
- **Typography**: Arial, bold font

## Troubleshooting

If logos don't appear:
1. **Check file paths** - Ensure all SVG files exist in `public/logos/parts/`
2. **Verify database** - Confirm logo_url fields are updated
3. **Clear cache** - Restart the Next.js development server
4. **Check console** - Look for 404 errors in browser console

## Next Steps

1. **Run the SQL script** to update the database
2. **Test the brands page** to verify logos display correctly
3. **Add more brands** if needed using the same pattern
4. **Replace with official logos** when available

## Files to Keep

- `update-brand-logos.sql` - Database update script
- `public/logos/parts/*.svg` - Brand logo files
- This guide for reference 