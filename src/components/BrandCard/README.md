# BrandCard Component

A comprehensive, animated card component for displaying automotive brand information with logos, statistics, and interactive features.

## Features

- 🎨 **Beautiful Design**: Modern card design with hover animations and smooth transitions
- 🏷️ **Smart Badges**: Premium and Popular badges for brand classification
- 📊 **Rich Information**: Brand logos, statistics, popular models, and descriptions
- 🎭 **Multiple Variants**: Default, Compact, and Featured layouts
- 📱 **Responsive**: Mobile-first design that works on all screen sizes
- 🖼️ **Logo Support**: Automatic logo loading with fallbacks
- ⚡ **Performance**: Optimized with lazy loading and efficient rendering
- 🎪 **Animations**: Framer Motion powered smooth animations
- ♿ **Accessible**: WCAG compliant with proper ARIA labels
- 🧪 **Well Tested**: Comprehensive test coverage

## Installation

The component is already included in the project and uses these dependencies:

```json
{
  "framer-motion": "^12.16.0",
  "@heroicons/react": "^2.0.0"
}
```

## Basic Usage

```tsx
import { BrandCard } from '@/components/BrandCard';

const brand = {
  name: 'BMW',
  slug: 'bmw',
  country: 'Germany',
  founded: 1916,
  description: 'Premium German engineering...',
  productCount: 15420,
  popularModels: ['3 Series', '5 Series', 'X3'],
  isPopular: true,
  isPremium: true,
};

export default function BrandsList() {
  return (
    <BrandCard 
      brand={brand}
      onClick={() => console.log('Brand clicked')}
    />
  );
}
```

## Props API

### BrandCardProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `brand` | `BrandData` | required | Brand information object |
| `onClick` | `() => void` | undefined | Click handler for the card |
| `className` | `string` | `''` | Additional CSS classes |
| `variant` | `'default' \| 'compact' \| 'featured'` | `'default'` | Card layout variant |
| `showStats` | `boolean` | `true` | Whether to show statistics section |
| `showDescription` | `boolean` | `true` | Whether to show brand description |

### BrandData Interface

```tsx
interface BrandData {
  name: string;              // Brand name (e.g., "BMW")
  slug: string;              // URL slug (e.g., "bmw")
  country: string;           // Country of origin (e.g., "Germany")
  founded: number;           // Year founded (e.g., 1916)
  description?: string;      // Brand description
  productCount?: number;     // Number of available parts
  popularModels?: string[];  // Array of popular model names
  logoUrl?: string;          // Custom logo URL (optional)
  isPopular?: boolean;       // Show "Popular" badge
  isPremium?: boolean;       // Show "Premium" badge
}
```

## Variants

### Default Variant

Standard card layout with full information display.

```tsx
<BrandCard 
  brand={brand}
  variant="default"
  showStats={true}
  showDescription={true}
/>
```

### Compact Variant

Smaller card perfect for grid layouts with many brands.

```tsx
<BrandCard 
  brand={brand}
  variant="compact"
  showDescription={false}
/>
```

### Featured Variant

Large card with popular models display, perfect for highlighting top brands.

```tsx
<BrandCard 
  brand={brand}
  variant="featured"
  showStats={true}
  showDescription={true}
/>
```

## Layout Examples

### Grid of Default Cards

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {brands.map(brand => (
    <BrandCard 
      key={brand.slug}
      brand={brand}
      variant="default"
    />
  ))}
</div>
```

### Compact Grid

```tsx
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
  {brands.map(brand => (
    <BrandCard 
      key={brand.slug}
      brand={brand}
      variant="compact"
      showDescription={false}
    />
  ))}
</div>
```

### Featured Brands Section

```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
  {featuredBrands.map(brand => (
    <BrandCard 
      key={brand.slug}
      brand={brand}
      variant="featured"
    />
  ))}
</div>
```

## Logo Handling

The component automatically handles logo loading with multiple fallback strategies:

1. **Primary**: `/logos/{slug}.svg`
2. **Fallback**: `/logos/{slug}.png`
3. **Generated**: Letter-based fallback

```tsx
// Custom logo URL
const brandWithCustomLogo = {
  ...brand,
  logoUrl: 'https://example.com/custom-logo.svg'
};

<BrandCard brand={brandWithCustomLogo} />
```

## Styling & Customization

### Custom CSS Classes

```tsx
<BrandCard 
  brand={brand}
  className="my-custom-class shadow-2xl"
/>
```

### Custom Styling

```css
.my-custom-class {
  @apply border-2 border-blue-500;
}

.my-custom-class:hover {
  @apply border-blue-700 shadow-2xl;
}
```

## Animation Configuration

The component uses Framer Motion for animations. Customize the animations by modifying the motion props:

```tsx
// In BrandCard.tsx
<motion.div
  whileHover={{ y: -4, scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
```

## Accessibility

The component includes several accessibility features:

- **Semantic HTML**: Proper heading hierarchy and landmark elements
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Descriptive alt text and ARIA labels
- **Focus Management**: Visible focus indicators
- **Color Contrast**: WCAG AA compliant color combinations

## Performance Tips

1. **Image Optimization**: Use optimized logos in SVG format when possible
2. **Lazy Loading**: Images are loaded only when needed
3. **Efficient Rendering**: Use `React.memo()` for brand lists
4. **Virtual Scrolling**: Consider virtualization for large brand lists

```tsx
const MemoizedBrandCard = React.memo(BrandCard);

// Use in large lists
{brands.map(brand => (
  <MemoizedBrandCard 
    key={brand.slug}
    brand={brand}
  />
))}
```

## Examples

### Interactive Brand Gallery

```tsx
function BrandGallery() {
  const [selectedBrand, setSelectedBrand] = useState(null);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {brands.map(brand => (
        <BrandCard
          key={brand.slug}
          brand={brand}
          onClick={() => setSelectedBrand(brand)}
          className={selectedBrand?.slug === brand.slug ? 'ring-2 ring-blue-500' : ''}
        />
      ))}
    </div>
  );
}
```

### Filtered Brand List

```tsx
function FilteredBrands() {
  const [filter, setFilter] = useState('all');
  
  const filteredBrands = brands.filter(brand => {
    if (filter === 'premium') return brand.isPremium;
    if (filter === 'popular') return brand.isPopular;
    return true;
  });
  
  return (
    <div>
      <div className="mb-6">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('premium')}>Premium</button>
        <button onClick={() => setFilter('popular')}>Popular</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBrands.map(brand => (
          <BrandCard key={brand.slug} brand={brand} />
        ))}
      </div>
    </div>
  );
}
```

## Testing

The component includes comprehensive tests covering:

- Rendering with different props
- Variant behaviors
- Click interactions
- Badge display logic
- Logo fallback handling
- Accessibility features

Run tests with:

```bash
npm test BrandCard
```

## Demo

Visit `/demo/brand-cards` to see the interactive demo with all variants and features.

## Contributing

When contributing to this component:

1. Maintain TypeScript strict mode compliance
2. Add tests for new features
3. Update documentation
4. Follow the existing code style
5. Test with real automotive data

---

*The BrandCard component is part of the AutoParts Shop design system.* 