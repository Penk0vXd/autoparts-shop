# Product Images Management Guide

This guide explains how to manage product images with real URLs stored in your database.

## Overview

Your autoparts shop now supports:
- ✅ **Real product images** from external URLs (like Unsplash, CDN, etc.)
- ✅ **Database storage** of image URLs in `products.image_url` and `products.images`
- ✅ **Smart fallbacks** with local placeholders
- ✅ **Admin interface** to manage images
- ✅ **Bulk update** functionality

## How It Works

### 1. Database Schema
```sql
-- Your products table already has:
image_url TEXT,      -- Primary image URL
images JSONB,        -- Array of image URLs
```

### 2. Image Priority System
1. **Primary**: `image_url` from database (external URL)
2. **Secondary**: `images[0]` from database (first image in array)
3. **Fallback**: Local placeholder `/images/placeholder-product.svg`

### 3. Smart Image Matching
The system automatically assigns appropriate images based on product names:
- "Brake Pads" → brake pad photos
- "Oil Filter" → oil filter photos
- "Battery" → battery photos
- etc.

## Usage

### Method 1: Admin Interface (Recommended)
1. Go to: `/admin/product-images`
2. Click "Update All Product Images" to bulk update
3. Or manually update individual products

### Method 2: Script (for bulk operations)
```bash
# Update all products with real image URLs
node scripts/update-product-images.js
```

### Method 3: API (for programmatic updates)
```javascript
// Update specific product
const response = await fetch('/api/products/update-images', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    productId: 'product-id',
    imageUrls: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg'
    ]
  })
})

// Update all products (smart matching)
const response = await fetch('/api/products/update-images', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({})
})
```

## Adding Your Own Images

### Option 1: Direct URL
```javascript
// Any public image URL works
const imageUrl = 'https://your-cdn.com/brake-pads.jpg'
```

### Option 2: Upload to Image Host
1. Upload to Cloudinary, AWS S3, or any image host
2. Get the public URL
3. Update the product via admin interface

### Option 3: Custom Image Mapping
Edit `src/app/api/products/update-images/route.ts`:
```javascript
const REAL_PRODUCT_IMAGES = {
  'brake-pads': [
    'https://your-images.com/brake-pad-1.jpg',
    'https://your-images.com/brake-pad-2.jpg'
  ],
  // Add more categories...
}
```

## Examples

### Real Product Images (Currently Used)
- Brake Pads: `https://images.unsplash.com/photo-1486262715619-67b85e0b08d3`
- Oil Filters: `https://images.unsplash.com/photo-1625047509168-a7026f36de04`
- Batteries: `https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b`

### How Images Display
```tsx
// In your components, images are automatically loaded from database
<SafeImage
  src={product.image_url || '/images/placeholder-product.svg'}
  alt={product.name}
  width={300}
  height={300}
/>
```

## Benefits

### ✅ Real Product Photos
- Professional automotive parts images
- High-quality, properly cropped
- Consistent aspect ratios

### ✅ SEO & Performance
- Optimized image URLs with proper dimensions
- Next.js Image component optimization
- Fast loading with smart caching

### ✅ Easy Management
- Admin interface for non-technical users
- Bulk updates for efficiency
- API for programmatic control

### ✅ Fallback System
- Never shows broken images
- Graceful degradation
- Maintains visual consistency

## Troubleshooting

### Images Not Loading?
1. Check database: `SELECT image_url FROM products LIMIT 5`
2. Verify URL accessibility: test in browser
3. Check CORS settings if using custom CDN

### Want Different Images?
1. Use admin interface: `/admin/product-images`
2. Or run script: `node scripts/update-product-images.js`
3. Or update via API

### Performance Issues?
1. Use optimized image URLs with proper sizing
2. Consider CDN for faster loading
3. Next.js automatically optimizes images

## Next Steps

1. **Run the update**: Visit `/admin/product-images` and click "Update All"
2. **Verify results**: Check your product pages for real images
3. **Customize**: Add your own product images if needed
4. **Monitor**: Check image loading and performance

Your autoparts shop now has a professional image management system! 🚀 