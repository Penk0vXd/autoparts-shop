import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { randomBytes, createHash } from 'crypto'
import { z } from 'zod'
import type { AuthUser, RegisterInput, LoginInput, ResetPasswordInput, VerificationToken } from '@/types/auth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const resendApiKey = process.env.RESEND_API_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

if (!resendApiKey) {
  throw new Error('Missing Resend API key')
}

// Initialize Supabase admin client for server-side operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

// Initialize Resend for email
const resend = new Resend(resendApiKey)

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
})

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string(),
})

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

// Helper to generate secure random token
function generateToken(): string {
  return randomBytes(32).toString('hex')
}

// Helper to hash password with Argon2id
async function hashPassword(password: string): Promise<string> {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: 'temp@example.com', // Temporary email
    password,
    email_confirm: true,
  })
  
  if (error) throw error
  
  // Delete the temporary user
  await supabaseAdmin.auth.admin.deleteUser(data.user.id)
  
  // Return the hashed password
  return data.user.encrypted_password
}

// Register new user
export async function register(input: RegisterInput): Promise<AuthResponse> {
  try {
    // Validate input
    const validated = registerSchema.parse(input)
    
    // Check if user exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', validated.email)
      .single()
    
    if (existingUser) {
      return { user: null, error: 'Email already registered' }
    }
    
    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: validated.email,
      password: validated.password,
      email_confirm: false,
    })
    
    if (authError) throw authError
    
    // Create user profile
    const { error: profileError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authData.user.id,
        email: validated.email,
        first_name: validated.firstName,
        last_name: validated.lastName,
        is_verified: false,
        is_admin: false,
      })
    
    if (profileError) throw profileError
    
    // Generate verification token
    const token = generateToken()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    
    const { error: tokenError } = await supabaseAdmin
      .from('verification_tokens')
      .insert({
        user_id: authData.user.id,
        token,
        type: 'email',
        expires_at: expiresAt.toISOString(),
      })
    
    if (tokenError) throw tokenError
    
    // Send verification email
    await resend.emails.send({
      from: 'noreply@yourdomain.com',
      to: validated.email,
      subject: 'Verify your email',
      html: `
        <h1>Welcome!</h1>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}">
          Verify Email
        </a>
      `,
    })
    
    return {
      user: {
        id: authData.user.id,
        email: validated.email,
        firstName: validated.firstName,
        lastName: validated.lastName,
        isVerified: false,
        isAdmin: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    }
  } catch (error) {
    console.error('Registration error:', error)
    return { user: null, error: 'Registration failed' }
  }
}

// Login user
export async function login(input: LoginInput): Promise<AuthResponse> {
  try {
    // Validate input
    const validated = loginSchema.parse(input)
    
    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
      email: validated.email,
      password: validated.password,
    })
    
    if (authError) {
      return { user: null, error: 'Invalid credentials' }
    }
    
    // Get user profile
    const { data: user, error: profileError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single()
    
    if (profileError) throw profileError
    
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        isVerified: user.is_verified,
        isAdmin: user.is_admin,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
    }
  } catch (error) {
    console.error('Login error:', error)
    return { user: null, error: 'Login failed' }
  }
}

// Request password reset
export async function requestPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if user exists
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single()
    
    if (userError || !user) {
      // Return success even if user doesn't exist to prevent enumeration
      return { success: true }
    }
    
    // Generate reset token
    const token = generateToken()
    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hour
    
    // Delete any existing reset tokens
    await supabaseAdmin
      .from('verification_tokens')
      .delete()
      .eq('user_id', user.id)
      .eq('type', 'password_reset')
    
    // Create new reset token
    const { error: tokenError } = await supabaseAdmin
      .from('verification_tokens')
      .insert({
        user_id: user.id,
        token,
        type: 'password_reset',
        expires_at: expiresAt.toISOString(),
      })
    
    if (tokenError) throw tokenError
    
    // Send reset email
    await resend.emails.send({
      from: 'noreply@yourdomain.com',
      to: email,
      subject: 'Reset your password',
      html: `
        <h1>Password Reset</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}">
          Reset Password
        </a>
        <p>This link will expire in 1 hour.</p>
      `,
    })
    
    return { success: true }
  } catch (error) {
    console.error('Password reset request error:', error)
    return { success: false, error: 'Failed to send reset email' }
  }
}

// Reset password
export async function resetPassword(input: ResetPasswordInput): Promise<AuthResponse> {
  try {
    // Validate input
    const validated = resetPasswordSchema.parse(input)
    
    // Get token
    const { data: token, error: tokenError } = await supabaseAdmin
      .from('verification_tokens')
      .select('*')
      .eq('token', validated.token)
      .eq('type', 'password_reset')
      .single()
    
    if (tokenError || !token) {
      return { user: null, error: 'Invalid or expired token' }
    }
    
    // Check if token is expired
    if (new Date(token.expires_at) < new Date()) {
      return { user: null, error: 'Token expired' }
    }
    
    // Update password
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      token.user_id,
      { password: validated.password }
    )
    
    if (updateError) throw updateError
    
    // Delete used token
    await supabaseAdmin
      .from('verification_tokens')
      .delete()
      .eq('id', token.id)
    
    // Get updated user
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', token.user_id)
      .single()
    
    if (userError) throw userError
    
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        isVerified: user.is_verified,
        isAdmin: user.is_admin,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
    }
  } catch (error) {
    console.error('Password reset error:', error)
    return { user: null, error: 'Password reset failed' }
  }
}

// Verify email
export async function verifyEmail(token: string): Promise<AuthResponse> {
  try {
    // Get token
    const { data: tokenData, error: tokenError } = await supabaseAdmin
      .from('verification_tokens')
      .select('*')
      .eq('token', token)
      .eq('type', 'email')
      .single()
    
    if (tokenError || !tokenData) {
      return { user: null, error: 'Invalid or expired token' }
    }
    
    // Check if token is expired
    if (new Date(tokenData.expires_at) < new Date()) {
      return { user: null, error: 'Token expired' }
    }
    
    // Update user verification status
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ is_verified: true })
      .eq('id', tokenData.user_id)
    
    if (updateError) throw updateError
    
    // Delete used token
    await supabaseAdmin
      .from('verification_tokens')
      .delete()
      .eq('id', tokenData.id)
    
    // Get updated user
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', tokenData.user_id)
      .single()
    
    if (userError) throw userError
    
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        isVerified: user.is_verified,
        isAdmin: user.is_admin,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
    }
  } catch (error) {
    console.error('Email verification error:', error)
    return { user: null, error: 'Email verification failed' }
  }
} 