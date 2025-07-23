# 🚀 MVP Mode Setup Guide

Your autoparts shop is now configured to run in **MVP mode** - focusing on inquiries and brand showcase while hiding product catalog features.

## ✅ What's Been Fixed

1. **Environment Variables**: Created `.env.local` with safe dummy values
2. **Feature Flags**: All product features are disabled in `src/config/features.ts`
3. **Graceful Fallbacks**: Services return empty data when features are disabled
4. **Hydration Safe**: All conditional rendering waits for client hydration

## 🎯 Current MVP Features

**✅ ENABLED:**
- 🏠 Homepage with inquiry-focused hero
- 🏢 Brand pages and showcase
- 📝 Professional inquiry form (`/inquiry`)
- 📞 Contact page and information
- ℹ️ About page

**❌ DISABLED:**
- 🛒 Product catalog and search  
- 🛍️ Shopping cart functionality
- 🚗 Vehicle selector
- 📊 Product categories
- 🔍 Product search dialog

## 🚀 How to Run

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev

# Open in browser
# http://localhost:3000
```

## 📋 Key Pages to Test

- **Homepage**: `/` - Shows inquiry-focused hero
- **Inquiry Form**: `/inquiry` - Professional part request form
- **Brands**: `/brands` - Automotive brand showcase  
- **Contact**: `/contact` - Contact information and form
- **About**: `/about` - Company information

## 🔄 Enable Full Product Features

When ready to activate the complete e-commerce functionality:

1. **Update Feature Flags** in `src/config/features.ts`:
```typescript
export const FEATURES = {
  products: true,         // ← Change to true
  productSearch: true,    // ← Change to true
  productCategories: true, // ← Change to true
  shoppingCart: true,     // ← Change to true
  vehicleSelector: true,  // ← Change to true
  // ...rest unchanged
}
```

2. **Add Real Supabase Credentials** to `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

3. **Restart Development Server**:
```bash
npm run dev
```

## 🛠️ Troubleshooting

**If you see Supabase errors:**
- Verify `.env.local` exists with dummy values
- Restart the development server
- Check feature flags are set correctly

**If hydration errors occur:**
- Clear browser cache and reload
- Verify all conditional rendering uses hydration guards

**If pages show "not available":**
- This is expected for `/catalog` and `/categories` in MVP mode
- They redirect users to the inquiry form instead

---

**🎉 Your MVP is ready!** The site now presents as a professional consultation service for automotive parts, with all e-commerce features preserved but hidden. 