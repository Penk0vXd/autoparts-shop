# Discord Webhook Setup Guide

## Environment Variables

### Required Environment Variables

Create a `.env.local` file in your project root:

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

## Discord Webhook Setup

### 1. Create Discord Webhook

1. **Go to your Discord server**
2. **Server Settings** → **Integrations** → **Webhooks**
3. **Click "New Webhook"**
4. **Configure the webhook:**
   - **Name**: "AutoParts Notifications"
   - **Channel**: Select the channel where you want notifications
   - **Copy the webhook URL**

### 2. Test the Webhook

Run the test script to verify your webhook works:

```bash
node test-discord-webhook.js
```

## API Route Details

### Endpoint: `/api/request`

**Method**: `POST`

**Content-Type**: `application/json`

**Request Body**:
```json
{
  "full_name": "John Doe",
  "phone": "+1234567890",
  "car_details": "BMW 320i 2018",
  "message": "I need brake pads for my BMW"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Request submitted successfully",
  "id": "uuid-here",
  "discord_sent": true
}
```

**Error Response** (400/500):
```json
{
  "success": false,
  "error": "Error message here"
}
```

## Frontend Integration

### Basic Usage

```typescript
const response = await fetch('/api/request', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    full_name: 'John Doe',
    phone: '+1234567890',
    car_details: 'BMW 320i 2018',
    message: 'I need brake pads'
  })
})

const result = await response.json()
```

### Advanced Usage

See `frontend-example.ts` for comprehensive examples including:
- Error handling
- Loading states
- React hooks
- Form components

## Testing

### Local Testing

1. **Set environment variables** in `.env.local`
2. **Start development server**:
   ```bash
   npm run dev
   ```
3. **Submit test request** at `http://localhost:3000/request`
4. **Check Discord channel** for notification
5. **Check terminal logs** for `[Discord]` messages

### Production Testing

1. **Deploy to Vercel**
2. **Set environment variables** in Vercel dashboard
3. **Test live site** at your Vercel URL
4. **Submit request** and verify Discord notification
5. **Check Vercel function logs** for debugging

## Troubleshooting

### Common Issues

#### 1. "Discord webhook URL not configured"
- **Solution**: Set `DISCORD_WEBHOOK_URL` in environment variables

#### 2. "Invalid webhook URL format"
- **Solution**: Ensure webhook URL starts with `https://discord.com/api/webhooks/`

#### 3. "Webhook failed with status 404"
- **Solution**: Check if webhook URL is correct and channel exists

#### 4. "Webhook failed with status 429"
- **Solution**: Discord rate limit exceeded, wait and retry

#### 5. "Database error: Failed to save request"
- **Solution**: Check Supabase connection and environment variables

### Debug Logs

The API provides comprehensive logging:

```
[API] POST /api/request - Request received
[API] Raw request body: {"full_name":"John Doe",...}
[API] Parsed request data: { full_name: '***', phone: '***', ... }
[API] Saving to Supabase...
[API] Request saved to Supabase with ID: uuid-here
[Discord] Preparing notification payload...
[Discord] Sending notification to webhook...
[Discord] Notification sent successfully
[API] Request processed successfully
```

## Security Notes

- ✅ `NEXT_PUBLIC_SUPABASE_URL` - Safe to expose
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Safe to expose
- ⚠️ `SUPABASE_SERVICE_ROLE_KEY` - Keep secret
- ⚠️ `DISCORD_WEBHOOK_URL` - Keep secret (contains auth token)

## Performance Features

- ✅ **Edge Runtime Compatible** - Fast serverless execution
- ✅ **TypeScript Support** - Full type safety
- ✅ **Error Resilience** - Request succeeds even if Discord fails
- ✅ **Input Validation** - Prevents malformed requests
- ✅ **Rate Limit Safe** - Respects Discord API limits
- ✅ **Comprehensive Logging** - Easy debugging

## Discord Message Format

When a request is submitted, Discord receives a rich embed:

```
🚗 Нова заявка за авточасти
├── 👤 Клиент: [Customer Name]
├── 📞 Телефон: [Phone Number]
├── 🚙 Автомобил: [Car Details]
├── 🔧 Описание на частта: [Part Description]
├── 🆔 ID на заявката: [Request ID]
└── 📅 Дата и час: [Bulgarian Date/Time]
```

## Deployment Checklist

- ✅ Environment variables set in Vercel
- ✅ Discord webhook URL configured
- ✅ Supabase database connected
- ✅ API route deployed and tested
- ✅ Frontend form integrated
- ✅ Error handling implemented
- ✅ Logging configured for debugging

## Support

If you encounter issues:

1. **Check environment variables** are set correctly
2. **Verify Discord webhook URL** is valid
3. **Test with the provided test script**
4. **Check server logs** for detailed error messages
5. **Ensure Supabase connection** is working

The Discord webhook integration is designed to be robust and reliable in both local development and production environments. 