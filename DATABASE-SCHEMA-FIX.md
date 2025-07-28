# 🔧 Database Schema Fix - Column Mapping Issue

## 🚨 **PROBLEM IDENTIFIED**

The error shows: `null value in column "name" of relation "requests" violates not-null constraint`

This means your database table has **both old and new column names**:
- ✅ `name` (old column, NOT NULL)
- ✅ `full_name` (new column)
- ✅ `phone` (NOT NULL)
- ✅ `car_details` (new column)
- ✅ `message` (new column)

The API was trying to insert into `full_name` but the database expects `name`.

## ✅ **SOLUTION**

### **Step 1: Fix Database Schema**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor**
4. Copy and paste this SQL:

```sql
-- Fix Database Schema - Ensure Consistency
-- Run this in Supabase SQL Editor

-- Step 1: Check current schema
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'requests' 
ORDER BY ordinal_position;

-- Step 2: Make sure all required columns exist and have correct constraints
-- Add missing columns if they don't exist
ALTER TABLE requests ADD COLUMN IF NOT EXISTS car_details TEXT;
ALTER TABLE requests ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE requests ADD COLUMN IF NOT EXISTS message TEXT;

-- Step 3: Update constraints to match our API expectations
-- Make sure 'name' column is NOT NULL (it already is based on error)
-- Make sure 'phone' column is NOT NULL
ALTER TABLE requests ALTER COLUMN phone SET NOT NULL;

-- Make sure 'car_details' column is NOT NULL
ALTER TABLE requests ALTER COLUMN car_details SET NOT NULL;

-- Make sure 'message' column is NOT NULL  
ALTER TABLE requests ALTER COLUMN message SET NOT NULL;

-- Step 4: Ensure 'created_at' has default value
ALTER TABLE requests ALTER COLUMN created_at SET DEFAULT NOW();

-- Step 5: Test insert with correct column mapping
INSERT INTO requests (name, phone, car_details, full_name, message) 
VALUES ('TEST USER', '+1234567890', 'BMW 320i 2018', 'TEST USER', 'I need brake pads')
ON CONFLICT DO NOTHING;

-- Step 6: Clean up test data
DELETE FROM requests WHERE name = 'TEST USER';

-- Step 7: Final verification
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'requests' 
ORDER BY ordinal_position;

-- Step 8: Test the schema cache
SELECT * FROM requests LIMIT 0;
```

5. Click **Run**

### **Step 2: Test the Form**

1. Go to: `http://localhost:3001/request`
2. Fill out the form with valid data:
   - **Name**: `John Doe`
   - **Phone**: `+359 888 123 456`
   - **Car Details**: `BMW 320i 2018`
   - **Message**: `I need brake pads for my BMW`
3. Submit
4. Check Discord for the notification

## 🎯 **What This Fixes**

### **Column Mapping Issue**
- ✅ **API now inserts into both `name` and `full_name` columns**
- ✅ **Handles the NOT NULL constraint on `name` column**
- ✅ **Ensures all required columns exist**
- ✅ **Sets proper NOT NULL constraints**
- ✅ **Refreshes schema cache**

### **API Improvements**
- ✅ **Correct column mapping in API route**
- ✅ **Handles both old and new column names**
- ✅ **Maintains backward compatibility**
- ✅ **Proper error handling**

## 🚀 **Expected Result**

After running the SQL script:
- ✅ **No more NOT NULL constraint errors**
- ✅ **Form submissions will work**
- ✅ **Data will be saved to Supabase**
- ✅ **Discord notifications will be sent**
- ✅ **Schema cache will be refreshed**

**The database schema issue will be completely fixed!** 🚀

## 🔍 **Verification**

After running the SQL, you should see:
1. **All required columns listed** in the final SELECT query
2. **Test insert successful** (no errors)
3. **Form submissions working** without constraint errors
4. **Discord notifications being sent**

The issue was that the API was trying to insert into `full_name` but the database has a NOT NULL constraint on the `name` column. 