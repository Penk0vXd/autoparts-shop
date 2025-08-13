# Contact Form Setup Guide

## 🔧 Environment Variables Required

Add these to your `.env.local` file:

```bash
# Email (Resend)
RESEND_API_KEY=your_resend_api_key

# Discord Webhook (Optional)
DISCORD_WEBHOOK_URL=your_discord_webhook_url
```

## 📧 Resend Setup

1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Verify your domain (avtochasti.bg) in Resend
4. Add the API key to your environment variables

## 🗄️ Database Setup

Run the migration to create the contact_submissions table:

```bash
# If using Supabase CLI
supabase db push

# Or manually run the SQL in supabase/migrations/20241201000000_create_contact_submissions.sql
```

## 🔗 Discord Webhook (Optional)

1. Create a Discord server channel
2. Go to Channel Settings > Integrations > Webhooks
3. Create a new webhook
4. Copy the webhook URL to your environment variables

## ✨ Features Implemented

### ✅ Form Validation
- All fields required except subject (optional)
- Email validation
- Input sanitization (XSS protection)
- Length limits (name: 100 chars, subject: 200 chars, message: 2000 chars)

### ✅ Email Notifications
- **Admin Email**: Styled notification to info@avtochasti.bg
- **User Confirmation**: Friendly "thank you" email with details
- **Timestamp**: Bulgarian timezone formatting
- **IP Tracking**: For security and analytics

### ✅ UX Features
- Loading states during submission
- Success/error messages in Bulgarian
- Form reset after successful submission
- Red submit button as requested

### ✅ Security & Reliability
- Input sanitization
- Error handling (graceful failures)
- Database storage (optional)
- Discord webhook alerts (optional)

## 📧 Email Templates

### Admin Notification Email
- Professional styling with gradient header
- Complete form data with timestamp and IP
- Call-to-action for 2-hour response time
- Clickable email links

### User Confirmation Email
- Friendly "thank you" message
- Reiterates their subject and message
- Promises 2-hour response time
- Includes contact information

## 🚀 Testing

Test the form by:
1. Filling out all required fields
2. Submitting with/without subject
3. Checking admin email received
4. Checking user confirmation email
5. Verifying database entry (if enabled)

## 🔒 Security Notes

- All inputs are sanitized to prevent XSS
- IP addresses are logged for security
- Email validation prevents spam
- Graceful error handling prevents data loss 