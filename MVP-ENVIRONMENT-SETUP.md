# MVP Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
# Get these from your Supabase project settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Setting up Supabase

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and API keys

2. **Run the Database Setup**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `mvp-supabase-setup.sql`
   - Run the SQL to create the requests table

3. **Get Your API Keys**
   - In Supabase dashboard, go to Settings → API
   - Copy the Project URL
   - Copy the `anon` `public` key 
   - Copy the `service_role` `secret` key

## Vercel Deployment

Add these same environment variables to your Vercel project:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` 
   - `SUPABASE_SERVICE_ROLE_KEY`

## Security Notes

- ✅ `NEXT_PUBLIC_SUPABASE_URL` is safe to expose (it's public)
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` is safe to expose (it's for client-side use)
- ⚠️ `SUPABASE_SERVICE_ROLE_KEY` must be kept secret (never expose in client-side code)

The MVP uses Row Level Security (RLS) to ensure data protection even with public keys. 