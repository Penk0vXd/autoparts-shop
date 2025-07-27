# 🔧 Environment Setup - Fix 500 Error

## 🚨 **IMMEDIATE FIX NEEDED**

Your API is returning a **500 Internal Server Error** because environment variables are missing. Here's how to fix it:

## 📝 **Step 1: Create `.env.local` file**

Create a file called `.env.local` in your project root with these variables:

```env
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Discord Webhook (REQUIRED)
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/your-webhook-url
```

## 🔍 **Step 2: Get Your Supabase Credentials**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

## 🎯 **Step 3: Get Your Discord Webhook**

1. Go to your Discord server
2. Right-click on a channel → **Edit Channel**
3. Go to **Integrations** → **Webhooks**
4. Click **New Webhook**
5. Copy the **Webhook URL** → `DISCORD_WEBHOOK_URL`

## ✅ **Step 4: Test the Setup**

1. Save the `.env.local` file
2. Restart your development server: `npm run dev`
3. Visit: `http://localhost:3000/api/debug-env`
4. You should see all variables marked as "SET"

## 🚀 **Step 5: Test the Form**

1. Go to: `http://localhost:3000/request`
2. Fill out the form
3. Submit
4. Check Discord for the notification

## 🔧 **For Vercel Deployment**

Add these same environment variables to Vercel:
1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Add each variable from `.env.local`
4. Redeploy

## 🎯 **Expected Result**

After setting up the environment variables:
- ✅ Form submissions will work
- ✅ Data will be saved to Supabase
- ✅ Discord notifications will be sent
- ✅ No more 500 errors

**The 500 error will be fixed once you add the environment variables!** 