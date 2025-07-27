# MVP Auto Parts Store - Complete Setup Guide

## 📁 Project Structure

```
autoparts-shop/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── request/
│   │   │       └── route.ts          # API endpoint with Zod validation
│   │   ├── request/
│   │   │   └── page.tsx              # Form page with validation
│   │   ├── thank-you/
│   │   │   └── page.tsx              # Success page
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Homepage
│   ├── lib/
│   │   └── validation.ts             # Zod validation schemas
│   └── components/                   # UI components
├── tsconfig.json                     # TypeScript configuration
├── next.config.js                    # Next.js configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── package.json                      # Dependencies
└── .env.local                        # Environment variables
```

## 🔧 TypeScript Configuration

### `tsconfig.json` (Key Paths)
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 🌍 Environment Variables

### Local Development (`.env.local`)
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Discord Webhook (REQUIRED)
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/your-webhook-url
```

### Vercel Environment Variables
Add these same variables to your Vercel project:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add each variable:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DISCORD_WEBHOOK_URL`

## 📋 Form Fields

### Required Fields:
- **full_name**: String (2-100 chars, letters only)
- **phone**: String (6-20 chars, phone format)
- **car_details**: String (3-200 chars)
- **message**: String (10-1000 chars)

### Optional Fields:
- **file**: File upload (JPG, PNG, PDF, max 5MB)

## 🔍 API Endpoint

### `/api/request` (POST)

**Request Body:**
```json
{
  "full_name": "John Doe",
  "phone": "+359888123456",
  "car_details": "BMW 320i 2018",
  "message": "I need brake pads for my BMW",
  "file": null
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Request submitted successfully",
  "id": "uuid-here",
  "discord_sent": true
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "path": ["full_name"],
      "message": "Името трябва да е поне 2 символа"
    }
  ]
}
```

## 🚀 Deployment Steps

### 1. Local Development
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Start development server
npm run dev
```

### 2. Vercel Deployment
```bash
# Build locally to test
npm run build

# Deploy to Vercel
vercel --prod
```

### 3. Environment Setup on Vercel
1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add all required variables
5. Redeploy the project

## ✅ Validation Rules

### Frontend Validation (Zod)
- **full_name**: 2-100 chars, letters only
- **phone**: 6-20 chars, phone format
- **car_details**: 3-200 chars
- **message**: 10-1000 chars
- **file**: Optional, max 5MB, JPG/PNG/PDF only

### Backend Validation (Zod)
- Same rules as frontend
- Additional server-side validation
- Proper error responses with field details

## 🔐 Security Features

- ✅ **Input sanitization** - All inputs trimmed and validated
- ✅ **File type validation** - Only allowed file types
- ✅ **File size limits** - 5MB maximum
- ✅ **SQL injection protection** - Supabase handles this
- ✅ **Environment variable protection** - Sensitive data in env vars

## 📊 Database Schema

### Supabase `requests` table:
```sql
CREATE TABLE requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  car_details TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🎯 Discord Integration

### Webhook Setup:
1. Create Discord webhook in your server
2. Copy webhook URL
3. Add to environment variables
4. Test with form submission

### Discord Message Format:
```
🚗 Нова заявка за авточасти
├── 👤 Клиент: [Customer Name]
├── 📞 Телефон: [Phone Number]
├── 🚙 Автомобил: [Car Details]
├── 🔧 Описание на частта: [Part Description]
├── 🆔 ID на заявката: [Request ID]
└── 📅 Дата и час: [Bulgarian Date/Time]
```

## 🧪 Testing

### Local Testing:
1. Set up environment variables
2. Run `npm run dev`
3. Navigate to `http://localhost:3000/request`
4. Fill out form and submit
5. Check Discord channel for notification
6. Verify database entry in Supabase

### Production Testing:
1. Deploy to Vercel
2. Test form submission on live site
3. Verify Discord notifications
4. Check Vercel function logs

## 🔧 Troubleshooting

### Common Issues:

#### 1. "Module not found" errors
- Check `tsconfig.json` paths configuration
- Verify file exists in correct location
- Restart development server

#### 2. Environment variables not working
- Check `.env.local` file exists
- Verify variable names are correct
- Restart development server

#### 3. Discord webhook not working
- Verify webhook URL is correct
- Check Discord server permissions
- Test webhook manually

#### 4. Build errors
- Run `npm run build` locally first
- Check for TypeScript errors
- Verify all imports are correct

#### 5. Form validation errors
- Check Zod schema configuration
- Verify field names match
- Test validation logic

## 📈 Performance Features

- ✅ **Edge Runtime** - Fast serverless execution
- ✅ **TypeScript** - Full type safety
- ✅ **Zod Validation** - Robust input validation
- ✅ **Error Handling** - Comprehensive error management
- ✅ **Logging** - Detailed debugging information
- ✅ **File Upload** - Secure file handling

## 🎉 Success Metrics

Your MVP is ready when:
- ✅ Form submits successfully
- ✅ Data saved to Supabase
- ✅ Discord notification sent
- ✅ User redirected to thank-you page
- ✅ Works in both local and production
- ✅ All validations working
- ✅ Error handling functional

## 🚀 Ready for Production

The MVP includes:
- ✅ **Complete form functionality**
- ✅ **Robust validation**
- ✅ **Discord integration**
- ✅ **Database storage**
- ✅ **Error handling**
- ✅ **TypeScript safety**
- ✅ **Production deployment**

**🎯 Your MVP is now ready for real users!** 