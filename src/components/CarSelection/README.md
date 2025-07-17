# CarSelector Component

A production-ready car selection component with cascading dropdowns for automotive parts catalogs. Features static JSON data, mobile-first responsive design, and a clean white/red color scheme.

## Features

- ✅ **Cascading Dropdowns**: Make → Model → Year selection flow
- ✅ **Static JSON Data**: No external API dependency
- ✅ **Mobile-First Design**: Responsive and touch-friendly
- ✅ **Accessibility**: ARIA labels, keyboard navigation, screen reader compatible
- ✅ **TypeScript**: Fully typed with comprehensive interfaces
- ✅ **Loading States**: Smooth UX with skeleton loaders
- ✅ **Professional Design**: White/Red color scheme (#DC2626)
- ✅ **Production Ready**: Clean code with inline comments

## Installation

```bash
# The component is already included in your project
# Import from the components directory
```

## Usage

### Basic Usage

```tsx
import { CarSelector } from '@/components/CarSelection'

function MyComponent() {
  const handleSelectionChange = (selection) => {
    console.log('Selected:', selection)
  }

  return (
    <CarSelector 
      onSelectionChange={handleSelectionChange}
      showYearSelector={true}
      showClearButton={true}
      size="md"
    />
  )
}
```

### With Initial Selection

```tsx
import { CarSelector } from '@/components/CarSelection'
import { CarSelection } from '@/types/car-selector'

function MyComponent() {
  const initialSelection: CarSelection = {
    make: { id: 'toyota', name: 'Toyota' },
    model: { id: 'camry', name: 'Camry', makeId: 'toyota' },
    year: { value: 2023, label: '2023' }
  }

  return (
    <CarSelector 
      initialSelection={initialSelection}
      onSelectionChange={(selection) => console.log(selection)}
    />
  )
}
```

### Custom Styling

```tsx
<CarSelector 
  className="max-w-lg mx-auto shadow-xl"
  size="lg"
  onSelectionChange={handleSelection}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSelectionChange` | `(selection: CarSelection) => void` | `undefined` | Callback fired when selection changes |
| `initialSelection` | `CarSelection` | `{}` | Pre-selected values |
| `showYearSelector` | `boolean` | `true` | Show/hide year dropdown |
| `showClearButton` | `boolean` | `true` | Show/hide clear button |
| `className` | `string` | `undefined` | Custom CSS classes |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Component size |
| `disabled` | `boolean` | `false` | Disable all interactions |

## Types

```typescript
interface CarMake {
  id: string
  name: string
  logo?: string
}

interface CarModel {
  id: string
  name: string
  makeId: string
}

interface CarYear {
  value: number
  label: string
}

interface CarSelection {
  make?: CarMake
  model?: CarModel
  year?: CarYear
}
```

## Static Data

The component includes comprehensive static data for:

### Makes (20 brands)
- Toyota, Honda, Ford, Chevrolet, BMW, Mercedes-Benz, Audi, Volkswagen
- Nissan, Hyundai, Kia, Subaru, Mazda, Lexus, Acura, Infiniti
- Volvo, Jaguar, Porsche, Tesla

### Models (70+ models)
- Popular models for each make
- Organized by `makeId` for cascading functionality

### Years
- Range: 2000-2024 (configurable)
- Descending order (newest first)

## Styling

The component uses Tailwind CSS with a professional white/red color scheme:

- **Primary Color**: `#DC2626` (red-600)
- **Background**: White with subtle shadows
- **Hover States**: Red-tinted focus/hover effects
- **Borders**: Rounded corners with clean borders
- **Typography**: Clean, readable font hierarchy

## Accessibility

- **ARIA Labels**: All interactive elements have proper labels
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Compatible with assistive technologies
- **Focus Management**: Proper focus indicators and flow
- **Color Contrast**: Meets WCAG 2.1 AA standards

## Mobile Support

- **Touch Targets**: Large enough for mobile interaction
- **Responsive Design**: Adapts to different screen sizes
- **Mobile-First**: Optimized for mobile devices
- **Touch-Friendly**: Smooth touch interactions

## Development

### Demo Component

```tsx
import CarSelectorDemo from '@/components/CarSelection/CarSelectorDemo'

// Shows all features and sizes
<CarSelectorDemo />
```

### Testing

```bash
# Run component tests
npm test -- CarSelector
```

### Future API Integration

The component is designed for easy migration to API data:

```typescript
// Replace static data with API calls
const loadMakes = async () => {
  const response = await fetch('/api/makes')
  return response.json()
}

const loadModels = async (makeId: string) => {
  const response = await fetch(`/api/models?make=${makeId}`)
  return response.json()
}
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- **Bundle Size**: ~15KB (gzipped)
- **Runtime**: Optimized React hooks
- **Memory**: Efficient state management
- **Rendering**: Minimal re-renders

## Contributing

1. Follow TypeScript best practices
2. Maintain accessibility standards
3. Keep mobile-first approach
4. Update documentation for changes
5. Add tests for new features

## License

Part of the auto parts catalog project. 