import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

// Client-side Supabase client (with RLS)
export const supabase = createClient(supabaseUrl, supabaseKey)

// Server-side Supabase client (bypasses RLS for admin operations)
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
)

// Helper to get user session server-side
export async function getServerSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

// Helper to require authentication server-side
export async function requireServerAuth() {
  const { session, error } = await getServerSession()
  
  if (error || !session?.user) {
    throw new Error('Authentication required')
  }
  
  return session.user
}

// Helper to check if user is admin
export async function isAdmin(userId: string): Promise<boolean> {
  const { data } = await supabaseAdmin.auth.admin.getUserById(userId)
  return data.user?.user_metadata?.role === 'admin' || false
}

// Generic error handler for database operations
export function handleDbError(error: any, operation: string) {
  console.error(`Database error in ${operation}:`, error)
  
  if (error.code === 'PGRST116') {
    throw new Error('Resource not found')
  }
  
  if (error.code === '23505') {
    throw new Error('Resource already exists')
  }
  
  if (error.code === '23503') {
    throw new Error('Referenced resource not found')
  }
  
  throw new Error(`Database operation failed: ${operation}`)
} 