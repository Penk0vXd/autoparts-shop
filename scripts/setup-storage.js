#!/usr/bin/env node

/**
 * Setup Supabase Storage Bucket
 * 
 * This script creates the storage bucket and policies for file uploads.
 * Run this after setting up your Supabase project.
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupStorage() {
  console.log('🚀 Setting up Supabase storage for file uploads...')
  
  try {
    // Check if bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError)
      return
    }
    
    const uploadsBucket = buckets.find(bucket => bucket.id === 'uploads')
    
    if (uploadsBucket) {
      console.log('✅ Storage bucket "uploads" already exists')
    } else {
      console.log('📦 Creating storage bucket "uploads"...')
      
      const { data, error } = await supabase.storage.createBucket('uploads', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
      })
      
      if (error) {
        console.error('❌ Error creating bucket:', error)
        return
      }
      
      console.log('✅ Storage bucket created successfully')
    }
    
    console.log('🎉 Storage setup complete!')
    console.log('📝 You can now upload files to the "uploads" bucket')
    console.log('🔗 Files will be publicly accessible via Supabase URLs')
    
  } catch (error) {
    console.error('❌ Setup failed:', error)
  }
}

setupStorage() 