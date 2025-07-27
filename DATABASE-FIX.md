# 🔧 Database Schema Fix - 500 Error

## 🚨 **IMMEDIATE FIX NEEDED**

The error shows: `"Could not find the 'car_details' column of 'requests' in the schema cache"`

This means your Supabase `requests` table is missing the required columns.

## 📝 **Step 1: Fix Database Schema**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor**
4. Copy and paste this SQL:

```sql
-- Fix requests table schema
-- Run this in your Supabase SQL Editor

-- First, let's check what columns currently exist
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'requests' 
ORDER BY ordinal_position;

-- Add missing columns if they don't exist
DO $$ 
BEGIN
    -- Add car_details column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'requests' AND column_name = 'car_details'
    ) THEN
        ALTER TABLE requests ADD COLUMN car_details TEXT;
    END IF;
    
    -- Add full_name column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'requests' AND column_name = 'full_name'
    ) THEN
        ALTER TABLE requests ADD COLUMN full_name TEXT;
    END IF;
    
    -- Add phone column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'requests' AND column_name = 'phone'
    ) THEN
        ALTER TABLE requests ADD COLUMN phone TEXT;
    END IF;
    
    -- Add message column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'requests' AND column_name = 'message'
    ) THEN
        ALTER TABLE requests ADD COLUMN message TEXT;
    END IF;
    
    -- Add created_at column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'requests' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE requests ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- Make required columns NOT NULL
ALTER TABLE requests ALTER COLUMN full_name SET NOT NULL;
ALTER TABLE requests ALTER COLUMN phone SET NOT NULL;
ALTER TABLE requests ALTER COLUMN car_details SET NOT NULL;
ALTER TABLE requests ALTER COLUMN message SET NOT NULL;

-- Verify the final table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'requests' 
ORDER BY ordinal_position;
```

5. Click **Run** to execute the SQL

## ✅ **Step 2: Verify the Fix**

After running the SQL, you should see a table with these columns:
- `id` (UUID, PRIMARY KEY)
- `full_name` (TEXT, NOT NULL)
- `phone` (TEXT, NOT NULL)
- `car_details` (TEXT, NOT NULL)
- `message` (TEXT, NOT NULL)
- `created_at` (TIMESTAMPTZ, DEFAULT NOW())

## 🚀 **Step 3: Test the Form**

1. Go back to your form: `http://localhost:3001/request`
2. Fill out the form
3. Submit
4. Check Discord for the notification

## 🎯 **Expected Result**

After fixing the database schema:
- ✅ **No more 500 errors**
- ✅ **Form submissions will work**
- ✅ **Data will be saved to Supabase**
- ✅ **Discord notifications will be sent**

**The database schema error will be completely fixed!** 🚀 