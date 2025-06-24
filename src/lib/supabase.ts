import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!

// Create Supabase client with fallback for build time
let supabaseClient
if (!supabaseUrl || !supabaseAnonKey) {
  if (process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV) {
    console.warn('Missing Supabase environment variables')
  }
  // Create a dummy client for build time with realistic URL format
  const dummyUrl = 'https://dummy-project-id.supabase.co'
  const dummyKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bW15LXByb2plY3QtaWQiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NjkzNTAwMCwiZXhwIjoxOTYyNTExMDAwfQ.dummy-signature'
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
    // Return dummy client for client-side builds
    const dummyUrl = 'https://dummy-project-id.supabase.co'
    const dummyKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bW15LXByb2plY3QtaWQiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NjkzNTAwMCwiZXhwIjoxOTYyNTExMDAwfQ.dummy-signature'
    return createClient(dummyUrl, dummyKey)
  }
  
  return createClient(publicUrl, publicKey)
} 