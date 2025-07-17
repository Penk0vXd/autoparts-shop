# Product Card Component

A world-class MVP Product Card component designed for Bulgarian automotive parts store that transforms browsing into a trust-building, conversion-optimized experience.

## Overview

The Product Card component displays individual product information in a clean, professional, and mobile-first design. It features premium styling, accessibility compliance, and conversion optimization techniques specifically designed for Bulgarian automotive parts e-commerce.

## Key Features

### ✅ Core Features
- **Product Name** - Bulgarian, clear typography
- **Primary Image** - High-quality, optimized with lazy loading
- **Price** - Currency clearly formatted (лв.)
- **Compatibility Note** - e.g. "Подходящо за BMW 3 Series 2015-2020"
- **Availability Badge** - "В наличност" / "Очаква се"
- **CTA Button** - "Виж детайли"

### ✅ Design Excellence
- **Color Palette** - Clean White (#FFFFFF) base, Premium Red (#D32F2F) for CTAs
- **Typography** - Modern sans-serif with Cyrillic support
- **Card Shape** - Rounded corners (8px radius minimum) for premium feel
- **Shadow/Elevation** - Subtle shadow to lift from background
- **Hover State** - Slight shadow increase, image zoom 1.02x
- **Mobile-first** - Responsive design with 44px minimum touch targets

### ✅ UX Principles
- **Visual Hierarchy** - Image dominant, price clearly visible
- **Compatibility Reassurance** - Immediate vehicle fit information
- **Clear Primary Action** - Single CTA only
- **Accessibility** - WCAG 2.1 AA compliant with Bulgarian ARIA labels
- **Performance** - Lazy-loaded images for fast loading

## Installation

```bash
# The component is already installed in your project
# Import from the components directory
```

## Basic Usage

```tsx
import { ProductCard } from '@/components/ProductCard'
import { ProductCardData } from '@/types/product-card'

function ProductCatalog() {
  const handleViewDetails = (product: ProductCardData) => {
    // Navigate to product details page
    router.push(`/products/${product.slug}`)
  }

  const handleAddToCart = (product: ProductCardData) => {
    // Add product to cart
    console.log('Added to cart:', product)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onViewDetails={handleViewDetails}
          onAddToCart={handleAddToCart}
          showQuickActions={true}
          showCompatibility={true}
          showRating={true}
          showBrand={true}
          showAvailability={true}
        />
      ))}
    </div>
  )
}
```

## Advanced Usage

### With Reference for Programmatic Control

```tsx
import { useRef } from 'react'
import { ProductCard, ProductCardRef } from '@/components/ProductCard'

function ProductPage() {
  const cardRef = useRef<ProductCardRef>(null)

  const handleRefresh = () => {
    cardRef.current?.refresh()
  }

  const handleTrackEvent = () => {
    cardRef.current?.trackEvent({
      type: 'click',
      timestamp: Date.now(),
      productId: product.id
    })
  }

  return (
    <ProductCard
      ref={cardRef}
      product={product}
      onViewDetails={handleViewDetails}
      colorScheme="premium"
      size="lg"
      hoverEffect="lift"
    />
  )
}
```

### Custom Styling and Configuration

```tsx
<ProductCard
  product={product}
  onViewDetails={handleViewDetails}
  onAddToCart={handleAddToCart}
  onAddToWishlist={handleAddToWishlist}
  // Design customization
  colorScheme="premium"
  size="lg"
  borderRadius="xl"
  shadowIntensity="lg"
  hoverEffect="lift"
  imageAspectRatio="4:3"
  // Feature configuration
  showQuickActions={true}
  showCompatibility={true}
  showRating={true}
  showBrand={true}
  showAvailability={true}
  showInstallments={true}
  showLocalPickup={true}
  showBadges={true}
  showQuickView={true}
  showAddToCart={true}
  // UX configuration
  enableHover={true}
  enableLazyLoading={true}
  maxNameLines={2}
  maxDescriptionLines={3}
  // State
  isInWishlist={false}
  isInCart={false}
  selectedVehicle={userVehicle}
  // Accessibility
  ariaLabel="Custom aria label"
  ariaDescribedBy="description-id"
/>
```

## Props API

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `product` | `ProductCardData` | Product data object with all required information |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onViewDetails` | `(product: ProductCardData) => void` | `undefined` | Callback when "Виж детайли" button is clicked |
| `onAddToCart` | `(product: ProductCardData) => void` | `undefined` | Callback when add to cart action is triggered |
| `onAddToWishlist` | `(product: ProductCardData) => void` | `undefined` | Callback when wishlist action is triggered |
| `onQuickView` | `(product: ProductCardData) => void` | `undefined` | Callback when quick view action is triggered |
| `onCompatibilityCheck` | `(product: ProductCardData) => void` | `undefined` | Callback when compatibility check is triggered |

### Styling Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `colorScheme` | `'default' \| 'premium' \| 'minimal'` | `'default'` | Color scheme variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Component size |
| `borderRadius` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Border radius intensity |
| `shadowIntensity` | `'sm' \| 'md' \| 'lg'` | `'md'` | Shadow intensity |
| `hoverEffect` | `'lift' \| 'zoom' \| 'glow' \| 'none'` | `'lift'` | Hover effect type |
| `imageAspectRatio` | `'square' \| '4:3' \| '16:9' \| '3:2'` | `'square'` | Image aspect ratio |
| `className` | `string` | `undefined` | Additional CSS classes |

### Feature Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showQuickActions` | `boolean` | `true` | Show quick action buttons (wishlist, quick view) |
| `showCompatibility` | `boolean` | `true` | Show compatibility information |
| `showRating` | `boolean` | `true` | Show product rating and reviews |
| `showBrand` | `boolean` | `true` | Show brand information |
| `showAvailability` | `boolean` | `true` | Show availability status |
| `showInstallments` | `boolean` | `false` | Show installment payment options |
| `showLocalPickup` | `boolean` | `false` | Show local pickup availability |
| `showBadges` | `boolean` | `true` | Show product badges (new, featured, sale) |
| `showQuickView` | `boolean` | `false` | Show quick view button |
| `showAddToCart` | `boolean` | `false` | Show add to cart button |

### Behavior Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enableHover` | `boolean` | `true` | Enable hover effects |
| `enableLazyLoading` | `boolean` | `true` | Enable lazy loading for images |
| `priority` | `boolean` | `false` | Load image with high priority |
| `maxNameLines` | `number` | `2` | Maximum lines for product name |
| `maxDescriptionLines` | `number` | `3` | Maximum lines for description |

### State Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isInWishlist` | `boolean` | `false` | Whether product is in wishlist |
| `isInCart` | `boolean` | `false` | Whether product is in cart |
| `selectedVehicle` | `CompatibleVehicle` | `undefined` | Currently selected vehicle for compatibility |

### Accessibility Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `ariaLabel` | `string` | Auto-generated | Custom ARIA label |
| `ariaDescribedBy` | `string` | `undefined` | ARIA described by ID |
| `testId` | `string` | `'product-card'` | Test ID for automation |

## ProductCardRef API

When using `ref`, the component exposes these methods:

| Method | Type | Description |
|--------|------|-------------|
| `focus()` | `() => void` | Focus the card |
| `blur()` | `() => void` | Remove focus from the card |
| `refresh()` | `() => void` | Refresh the card data |
| `addToCart()` | `() => void` | Programmatically add to cart |
| `addToWishlist()` | `() => void` | Programmatically add to wishlist |
| `checkCompatibility()` | `() => void` | Check product compatibility |
| `openQuickView()` | `() => void` | Open quick view |
| `viewDetails()` | `() => void` | Navigate to product details |
| `trackEvent()` | `(event: ProductCardEvent) => void` | Track analytics event |
| `validate()` | `() => ProductCardValidation` | Validate product data |
| `getAnalytics()` | `() => ProductCardAnalytics` | Get analytics data |

## ProductCardData Interface

```typescript
interface ProductCardData {
  id: string
  name: string
  slug: string
  description?: string
  shortDescription?: string
  price: ProductPrice
  images: ProductImage[]
  availability: ProductAvailability
  compatibility: ProductCompatibility
  brand: ProductBrand
  category: ProductCategory
  specifications?: ProductSpecification[]
  tags?: string[]
  sku?: string
  partNumber?: string
  isNew?: boolean
  isFeatured?: boolean
  isOnSale?: boolean
  rating?: ProductRating
  reviews?: ProductReview[]
  createdAt?: string
  updatedAt?: string
}
```

## Responsive Design

The component follows a mobile-first approach with these breakpoints:

- **Mobile** (default): Single column layout
- **Tablet** (768px+): 2-3 column grid
- **Desktop** (1024px+): 3-4 column grid
- **Large Desktop** (1280px+): 4+ column grid

## Accessibility

### WCAG 2.1 AA Compliance

- **Keyboard Navigation**: Full keyboard support with tab order
- **Screen Reader**: Bulgarian ARIA labels and descriptions
- **Touch Targets**: Minimum 44px touch target size
- **Color Contrast**: Meets WCAG AA requirements
- **Focus Management**: Visible focus indicators

### Bulgarian Language Support

All text content is provided in Bulgarian through the `messages/bg.json` file:

```json
{
  "productCard": {
    "viewDetails": "Виж детайли",
    "addToCart": "Добави в количката",
    "addToWishlist": "Добави в желания",
    "availability": {
      "inStock": "В наличност",
      "outOfStock": "Изчерпан",
      "preOrder": "Предварителна поръчка"
    }
  }
}
```

## Performance Optimization

### Image Loading
- **Lazy Loading**: Images load only when needed
- **Next.js Image**: Automatic optimization and WebP conversion
- **Blur Placeholder**: Smooth loading experience
- **Responsive Images**: Different sizes for different screen sizes

### Bundle Size
- **Tree Shaking**: Only imports used components
- **Code Splitting**: Component loads independently
- **Minimal Dependencies**: Uses only essential libraries

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Browsers**: iOS Safari 14+, Chrome Mobile 90+
- **Graceful Degradation**: Fallbacks for older browsers

## Examples

### Basic Product Grid

```tsx
function ProductGrid({ products }: { products: ProductCardData[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onViewDetails={(product) => router.push(`/products/${product.slug}`)}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
        />
      ))}
    </div>
  )
}
```

### Featured Products Section

```tsx
function FeaturedProducts({ products }: { products: ProductCardData[] }) {
  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Препоръчани продукти</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.filter(p => p.isFeatured).map(product => (
          <ProductCard
            key={product.id}
            product={product}
            size="lg"
            colorScheme="premium"
            showBadges={true}
            showRating={true}
            showInstallments={true}
            onViewDetails={handleViewDetails}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
          />
        ))}
      </div>
    </section>
  )
}
```

### Search Results

```tsx
function SearchResults({ 
  products, 
  loading, 
  query 
}: { 
  products: ProductCardData[]
  loading: boolean
  query: string 
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          Няма намерени продукти
        </h3>
        <p className="text-gray-600">
          Опитайте с различни ключови думи за "{query}"
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          showCompatibility={true}
          showQuickActions={true}
          enableHover={true}
          onViewDetails={handleViewDetails}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
          onQuickView={handleQuickView}
        />
      ))}
    </div>
  )
}
```

## Testing

The component includes comprehensive testing support:

```tsx
// Test example
import { render, screen, fireEvent } from '@testing-library/react'
import { ProductCard } from '@/components/ProductCard'
import { mockProductData } from '@/data/example-product-data'

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    render(<ProductCard product={mockProductData[0]} />)
    
    expect(screen.getByText(mockProductData[0].name)).toBeInTheDocument()
    expect(screen.getByText('129,99 лв.')).toBeInTheDocument()
    expect(screen.getByText('В наличност')).toBeInTheDocument()
  })
  
  it('handles view details click', () => {
    const handleViewDetails = jest.fn()
    render(
      <ProductCard 
        product={mockProductData[0]} 
        onViewDetails={handleViewDetails}
      />
    )
    
    fireEvent.click(screen.getByText('Виж детайли'))
    expect(handleViewDetails).toHaveBeenCalledWith(mockProductData[0])
  })
})
```

## Troubleshooting

### Common Issues

1. **Images not loading**
   - Check image URLs are accessible
   - Verify Next.js Image configuration
   - Ensure proper image formats (JPG, PNG, WebP)

2. **Styling not applied**
   - Verify Tailwind CSS is configured
   - Check for CSS class conflicts
   - Ensure proper import order

3. **Performance issues**
   - Enable lazy loading
   - Optimize image sizes
   - Use proper grid containerization

### Debug Mode

Enable debug mode to see component internals:

```tsx
<ProductCard
  product={product}
  testId="debug-product-card"
  onViewDetails={(product) => {
    console.log('Product clicked:', product)
  }}
/>
```

## Migration Guide

### From v1.x to v2.x

- Update prop names: `showCompatibility` → `showCompatibility`
- New required prop: `product` must include `availability` field
- Updated TypeScript interfaces: Import from `@/types/product-card`

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation for API changes
4. Ensure Bulgarian language support
5. Test on multiple devices and browsers

## License

This component is part of the Bulgarian automotive parts store project.

---

*Built with ❤️ by the God of Programming* 