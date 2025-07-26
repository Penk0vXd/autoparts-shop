import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'
import { isFeatureEnabled } from '@/config/features'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Fallback dummy values for MVP mode or when env vars are missing
const dummyUrl = 'https://dummy-project-id.supabase.co'
const dummyKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bW15LXByb2plY3QtaWQiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NjkzNTAwMCwiZXhwIjoxOTYyNTExMDAwfQ.dummy-signature'

// Check if we need real Supabase (when products are enabled) or can use dummy
const needsRealSupabase = isFeatureEnabled('products') || isFeatureEnabled('admin')

if (needsRealSupabase && (!supabaseUrl || !supabaseKey)) {
  console.warn('⚠️ Products feature enabled but Supabase environment variables missing. Using dummy client.')
}

// Client-side Supabase client (with RLS)
export const supabase = createClient<Database>(
  supabaseUrl || dummyUrl, 
  supabaseKey || dummyKey
)

// Server-side Supabase client (bypasses RLS for admin operations)
export const supabaseAdmin = createClient<Database>(
  supabaseUrl || dummyUrl,
  supabaseServiceKey || dummyKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function getServerSession() {
  if (!needsRealSupabase) return null
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) {
      console.error('Error getting session:', error)
      return null
    }
    return session
  } catch (error) {
    console.error('Session error:', error)
    return null
  }
}

export async function getCurrentUser() {
  if (!needsRealSupabase) return null
  
  try {
    const session = await getServerSession()
    return session?.user ?? null
  } catch (error) {
    console.error('User error:', error)
    return null
  }
}

export async function getUserById(userId: string) {
  if (!needsRealSupabase) return null
  
  try {
    const { data } = await supabaseAdmin.auth.admin.getUserById(userId)
    return data.user
  } catch (error) {
    console.error('Get user by ID error:', error)
    return null
  }
}

// Database error handler with feature flag awareness
export function handleDbError(error: any, context = 'Database operation') {
  if (!needsRealSupabase) {
    console.log(`[MVP Mode] ${context} skipped - products disabled`)
    return { data: null, error: 'Products feature disabled' }
  }
  
  console.error(`${context}:`, error)
  return { data: null, error: error.message || 'Database error' }
}

// Legacy auth functions - stubs for compatibility
export async function requireServerAuth() {
  // Stub implementation for legacy compatibility
  return null
}

export async function isAdmin() {
  // Stub implementation for legacy compatibility
  return false
} 