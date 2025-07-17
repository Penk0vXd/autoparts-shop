# 🔧 Google Sheets Integration Setup Guide

## Overview
This guide will help you set up Google Sheets as your order management backend for the MVP. All customer orders will be automatically saved to a Google Sheet with timestamps and complete order details.

## Prerequisites
- Google account
- Google Cloud Console access
- Next.js application deployed (local or production)

## Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it "Автoчасти - Поръчки" (or any name you prefer)
4. **Important**: Copy the Sheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
   ```
   The `SHEET_ID` is the long string between `/d/` and `/edit`

## Step 2: Set Up Google API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google Sheets API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

4. Create API Key:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the generated API key
   - **Optional**: Restrict the API key to only Google Sheets API for security

## Step 3: Configure Sheet Permissions

1. Open your Google Sheet
2. Click the "Share" button (top right)
3. Under "General access", select "Anyone with the link"
4. Set permission to "Editor"
5. Click "Done"

⚠️ **Security Note**: This makes your sheet publicly writable. For production, consider using service account authentication instead.

## Step 4: Initialize Sheet Headers

Run this code once to set up the sheet headers:

```javascript
import { googleSheetsService } from '@/services/googleSheetsService'

// Call this once during setup
await googleSheetsService.initializeSheet()
```

Or manually add these headers to row 1:
```
Номер на поръчка | Дата и час | Име на клиент | Телефон | Адрес | Бележки | Продукт | SKU | Цена на продукт | Доставка | Общо | Статус | Начин на плащане
```

## Step 5: Environment Variables

Create a `.env.local` file in your project root:

```bash
# Google Sheets Configuration
NEXT_PUBLIC_GOOGLE_SHEET_ID=your_sheet_id_here
NEXT_PUBLIC_GOOGLE_API_KEY=your_api_key_here
```

Replace with your actual values:
- `NEXT_PUBLIC_GOOGLE_SHEET_ID`: The Sheet ID from Step 1
- `NEXT_PUBLIC_GOOGLE_API_KEY`: The API key from Step 2

## Step 6: Test the Integration

1. Start your Next.js application
2. Navigate to `/order?product=brake-pads-brembo`
3. Fill out the order form
4. Submit the order
5. Check your Google Sheet - you should see the order data appear!

## Expected Sheet Structure

Your Google Sheet will automatically populate with:

| Column | Description |
|--------|-------------|
| Номер на поръчка | Auto-generated order number (ORD-YYMMDD-XXXX) |
| Дата и час | Bulgarian timezone timestamp |
| Име на клиент | Customer name |
| Телефон | Customer phone |
| Адрес | Delivery address |
| Бележки | Customer notes |
| Продукт | Product name |
| SKU | Product SKU |
| Цена на продукт | Product price in BGN |
| Доставка | Delivery fee |
| Общо | Total amount |
| Статус | Order status (starts as "Нова поръчка") |
| Начин на плащане | Payment method (always "Наложен платеж") |

## Troubleshooting

### "Google Sheets not configured" Error
- Check that your environment variables are set correctly
- Verify the Sheet ID is correct
- Make sure the API key is valid

### "Permission denied" Error
- Ensure your Google Sheet is shared with "Anyone with the link" as Editor
- Check that the Google Sheets API is enabled in your project

### Orders not appearing in sheet
- Check browser console for errors
- Verify the sheet name is "Orders" (or update the service)
- Test the connection using the test function

### Fallback Mode
If Google Sheets fails, orders are automatically saved to localStorage for development. Check browser console for "Order saved to localStorage" messages.

## Production Considerations

For production deployment:

1. **Use Service Account**: Instead of API keys, use Google Service Account for better security
2. **Error Handling**: Implement email notifications for failed orders
3. **Data Validation**: Add server-side validation
4. **Backup**: Consider dual-write to both Sheets and a database
5. **Monitoring**: Set up alerts for order processing failures

## Security Notes

- API keys in environment variables are visible to client-side code
- For production, implement server-side API routes
- Consider using Google Apps Script for additional security
- Regularly rotate API keys
- Monitor API usage and quotas

---

**💡 Pro Tip**: Set up Google Sheets notifications to get email alerts when new orders arrive!

**🚀 MVP Ready**: Once configured, your order management system is fully operational with zero additional infrastructure! 