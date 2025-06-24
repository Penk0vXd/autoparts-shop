import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!

// Create Supabase client with fallback for build time
let supabaseClient
if (!supabaseUrl || !supabaseAnonKey) {
  if (process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV) {
    console.warn('Missing Supabase environment variables')
  }
  // Create a dummy client for build time
  const dummyUrl = 'https://dummy.supabase.co'
  const dummyKey = 'dummy-key'
  supabaseClient = createClient(dummyUrl, dummyKey)
} else {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = supabaseClient

// Client-side Supabase client
export const createClientComponentClient = () => {
  const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const publicKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  if (!publicUrl || !publicKey) {
    console.warn('Missing public Supabase environment variables')
    return createClient('https://dummy.supabase.co', 'dummy-key')
  }
  
  return createClient(publicUrl, publicKey)
} 