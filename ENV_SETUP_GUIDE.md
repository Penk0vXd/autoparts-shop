# 🔐 Industrial-Grade Request System - Environment Setup

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# 🏗️ HOLY DATA LAYER (SUPABASE)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# 🚨 DISCORD WEBHOOK (REAL-TIME ALERTS)
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/your-webhook-id/your-webhook-token

# 🔒 ADMIN SYSTEM (ULTRA-MINIMAL BACKDOOR)
NEXT_PUBLIC_ADMIN_MODE=false

# 🌍 DEPLOYMENT CONFIGURATION
NODE_ENV=development
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Setup Instructions

### 1. Supabase Configuration

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. Get your service role key (keep this secret!)
4. Run the database migration in `supabase/migrations/20240124_create_requests_table.sql`

### 2. Discord Webhook Setup

1. Open your Discord server
2. Go to Server Settings > Integrations > Webhooks
3. Click "New Webhook"
4. Choose the channel for request notifications
5. Copy the webhook URL
6. Add it to your `.env.local` as `DISCORD_WEBHOOK_URL`

### 3. Admin Interface (Optional)

- Set `NEXT_PUBLIC_ADMIN_MODE=true` to enable the admin interface
- Access it at `/admin/requests` (only when enabled)
- **NEVER enable this in production without proper authentication**

### 4. Development vs Production

**Development:**
```bash
NODE_ENV=development
NEXT_PUBLIC_BASE_URL=http://localhost:3000
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/test-webhook-id/test-token
```

**Production (Vercel):**
```bash
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/real-webhook-id/real-token
```

## Security Notes

🔑 **SERVICE ROLE KEY**: Never expose this in client code! Only use server-side.

🚨 **DISCORD WEBHOOK**: Keep this secret - anyone with this URL can spam your Discord.

🔒 **ADMIN MODE**: Only enable in secure, authenticated environments.

📁 **Environment Files**: Add `.env.local` to `.gitignore` - never commit secrets!

## Testing the Setup

1. Fill in all environment variables
2. Restart your development server: `npm run dev`
3. Submit a test request at `/request`
4. Check your Discord channel for the notification
5. Verify the request appears in Supabase

## Deployment Checklist

- ✅ Set all environment variables in Vercel dashboard
- ✅ Verify Discord webhook is working
- ✅ Test request submission flow
- ✅ Confirm Supabase RLS policies are active
- ✅ Set `ADMIN_MODE=false` in production
- ✅ Verify database migration has run

## Troubleshooting

**"Service role key not found":**
- Check your `.env.local` file exists
- Verify the `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Restart your development server

**"Discord webhook failed":**
- Verify the webhook URL is correct
- Check the Discord channel permissions
- Test the webhook URL with a manual POST request

**"Request submission failed":**
- Check browser console for errors
- Verify Supabase connection
- Check the API route at `/api/request` 