# MVP Vehicle Selector Component

A world-class vehicle selection component designed for Bulgarian auto parts stores. Transforms buyer fear of wrong fit into absolute confidence through intelligent design and user experience.

![MVP Vehicle Selector](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)
![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-brightgreen)
![Mobile](https://img.shields.io/badge/Mobile-First-blue)

## ✨ Features

### 🎯 Core Functionality
- **Three-step cascading selection**: Make → Model → Year
- **Static JSON data**: No API dependency for MVP
- **Progressive disclosure**: Never show more than needed
- **Zero errors principle**: Disable Next until selection made
- **Validation feedback**: Always confirm choice visually

### 📱 Mobile-First Design
- **44px minimum touch targets**: Optimized for mobile devices
- **Responsive grid layout**: 1 column on mobile, 3 on desktop
- **Touch feedback**: Scale and shadow effects on interaction
- **Swipe-friendly dropdowns**: Large, easy-to-tap options

### 🌐 Bulgarian Language Support
- **Complete Bulgarian localization**: All labels, messages, and tooltips
- **Cyrillic font support**: Clear sans-serif typography
- **Cultural adaptations**: Bulgarian market-specific car brands
- **Error messages**: Contextual and helpful in Bulgarian

### ♿ Accessibility (WCAG 2.1 AA)
- **Screen reader support**: Complete ARIA implementation
- **Keyboard navigation**: Full keyboard accessibility
- **High contrast support**: Meets color contrast requirements
- **Focus management**: Logical tab order and focus indicators
- **Announcements**: Status changes announced to screen readers

### 🎨 Professional Design
- **Premium color palette**: Red (#D32F2F), White, Light Gray, Almost Black
- **Subtle animations**: Fade-ins, hover states, loading indicators
- **Modern typography**: Clean sans-serif with proper spacing
- **Consistent spacing**: 8px grid system throughout
- **Brand logos**: Optional car brand logos for better recognition

### 🚀 Performance
- **Lightweight**: Minimal bundle size impact
- **Fast interactions**: Simulated loading states for better UX
- **Optimized rendering**: Efficient React patterns
- **Memory efficient**: Proper cleanup and state management

## 🚀 Quick Start

### Basic Usage

```tsx
import { MVPVehicleSelector } from '@/components/MVPVehicleSelector'

function MyComponent() {
  const handleSelectionChange = (selection) => {
    console.log('Selection:', selection)
  }

  const handleFindParts = (selection) => {
    // Navigate to parts catalog with filters
    router.push(`/catalog?make=${selection.make.id}&model=${selection.model.id}&year=${selection.year}`)
  }

  return (
    <MVPVehicleSelector
      onSelectionChange={handleSelectionChange}
      onFindParts={handleFindParts}
      showConfirmation={true}
      showProgress={true}
      colorScheme="default"
      size="md"
    />
  )
}
```

### With Reference

```tsx
import { useRef } from 'react'
import { MVPVehicleSelector, MVPVehicleSelectorRef } from '@/components/MVPVehicleSelector'

function MyComponent() {
  const selectorRef = useRef<MVPVehicleSelectorRef>(null)

  const handleSubmit = () => {
    if (selectorRef.current?.validate()) {
      const selection = selectorRef.current.getSelection()
      // Process selection
    }
  }

  const handleReset = () => {
    selectorRef.current?.reset()
  }

  return (
    <div>
      <MVPVehicleSelector
        ref={selectorRef}
        onFindParts={handleFindParts}
      />
      <button onClick={handleSubmit}>Submit</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  )
}
```

## 📋 Props

### Required Props
None - the component works with default values.

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSelectionChange` | `(selection: MVPVehicleSelection) => void` | `undefined` | Callback when selection changes |
| `onFindParts` | `(selection: MVPVehicleSelection) => void` | `undefined` | Callback when Find Parts button is clicked |
| `onReset` | `() => void` | `undefined` | Callback when reset is triggered |
| `initialSelection` | `Partial<MVPVehicleSelection>` | `{}` | Initial selection state |
| `className` | `string` | `undefined` | Additional CSS classes |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Component size |
| `showConfirmation` | `boolean` | `true` | Show confirmation UI |
| `autoFocus` | `boolean` | `true` | Auto-focus first dropdown |
| `disabled` | `boolean` | `false` | Disable all interactions |
| `showProgress` | `boolean` | `true` | Show progress indicator |
| `showTooltips` | `boolean` | `true` | Show tooltips |
| `enableKeyboardNavigation` | `boolean` | `true` | Enable keyboard navigation |
| `sortByPopularity` | `boolean` | `true` | Sort options by popularity |
| `maxDropdownHeight` | `number` | `320` | Maximum dropdown height in pixels |
| `colorScheme` | `'default' \| 'premium' \| 'minimal'` | `'default'` | Color scheme |
| `showLogos` | `boolean` | `true` | Show brand logos |
| `showStepNumbers` | `boolean` | `true` | Show step numbers |
| `ariaLabel` | `string` | `'Изберете вашия автомобил'` | ARIA label |
| `testId` | `string` | `'mvp-vehicle-selector'` | Test ID for testing |

## 🎯 Component Methods

When using a ref, you can access these methods:

```tsx
const selectorRef = useRef<MVPVehicleSelectorRef>(null)

// Focus the first dropdown
selectorRef.current?.focus()

// Blur the component
selectorRef.current?.blur()

// Reset the selection
selectorRef.current?.reset()

// Clear the selection (same as reset)
selectorRef.current?.clear()

// Validate the current selection
const isValid = selectorRef.current?.validate()

// Submit the selection (same as clicking Find Parts)
selectorRef.current?.submit()

// Get the current selection
const selection = selectorRef.current?.getSelection()

// Set the selection programmatically
selectorRef.current?.setSelection({
  make: { id: 'bmw', name: 'BMW', popularity: 10 },
  model: { id: 'bmw-3-series', name: '3 Series', makeId: 'bmw', years: [2020, 2021, 2022, 2023, 2024], popularity: 10 },
  year: 2023
})
```

## 🎨 Color Schemes

### Default
- Primary: Red (#D32F2F)
- Background: White (#FFFFFF)
- Text: Almost Black (#111827)
- Secondary: Light Gray (#F3F4F6)

### Premium
- Darker, more sophisticated colors
- Enhanced contrast and depth
- Professional appearance

### Minimal
- Lighter, cleaner appearance
- Reduced visual noise
- Modern and minimalist

## 📊 Data Structure

### MVPVehicleSelection

```typescript
interface MVPVehicleSelection {
  make?: MVPVehicleMake
  model?: MVPVehicleModel
  year?: number
}

interface MVPVehicleMake {
  id: string
  name: string
  logo?: string
  popularity: number // 1-10 scale
}

interface MVPVehicleModel {
  id: string
  name: string
  makeId: string
  years: number[]
  popularity: number // 1-10 scale
}
```

### Static Data

The component uses static JSON data from `@/data/mvp-vehicle-data.ts`:

```typescript
export const MVP_VEHICLE_DATA: MVPVehicleData = {
  makes: [
    { id: 'bmw', name: 'BMW', logo: '/logos/bmw.png', popularity: 10 },
    { id: 'mercedes-benz', name: 'Mercedes-Benz', logo: '/logos/mercedes-benz.png', popularity: 10 },
    // ... more makes
  ],
  models: [
    { id: 'bmw-3-series', name: '3 Series', makeId: 'bmw', years: [2000, 2001, /* ... */ 2024], popularity: 10 },
    // ... more models
  ]
}
```

## 🔧 Customization

### Custom Styling

```tsx
<MVPVehicleSelector
  className="my-custom-selector"
  colorScheme="premium"
  size="lg"
/>
```

```css
.my-custom-selector {
  /* Custom styles */
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

### Custom Color Scheme

Modify the color classes in the component or create your own theme:

```tsx
// Custom color scheme implementation
const customColors = {
  primary: 'bg-blue-600 hover:bg-blue-700',
  secondary: 'bg-gray-100 hover:bg-gray-200',
  // ... other colors
}
```

## ♿ Accessibility Features

### Screen Reader Support
- Complete ARIA implementation
- Proper role assignments
- Status announcements
- Error announcements

### Keyboard Navigation
- **Tab**: Navigate between dropdowns
- **Enter/Space**: Open/close dropdowns
- **Arrow keys**: Navigate dropdown options
- **Escape**: Close dropdown

### Focus Management
- Logical tab order
- Visible focus indicators
- Auto-focus on relevant elements
- Focus trapping in dropdowns

### ARIA Attributes
- `aria-label`: Descriptive labels
- `aria-expanded`: Dropdown state
- `aria-selected`: Option selection
- `aria-required`: Required fields
- `aria-invalid`: Error states

## 🧪 Testing

### Unit Tests

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MVPVehicleSelector } from '@/components/MVPVehicleSelector'

test('renders vehicle selector', () => {
  render(<MVPVehicleSelector />)
  expect(screen.getByText('Изберете вашия автомобил')).toBeInTheDocument()
})

test('handles make selection', () => {
  const handleChange = jest.fn()
  render(<MVPVehicleSelector onSelectionChange={handleChange} />)
  
  fireEvent.click(screen.getByText('Изберете марка'))
  fireEvent.click(screen.getByText('BMW'))
  
  expect(handleChange).toHaveBeenCalledWith(
    expect.objectContaining({
      make: expect.objectContaining({ name: 'BMW' })
    })
  )
})
```

### Integration Tests

```tsx
test('complete selection flow', async () => {
  const handleFindParts = jest.fn()
  render(<MVPVehicleSelector onFindParts={handleFindParts} />)
  
  // Select make
  fireEvent.click(screen.getByText('Изберете марка'))
  fireEvent.click(screen.getByText('BMW'))
  
  // Select model
  fireEvent.click(screen.getByText('Изберете модел'))
  fireEvent.click(screen.getByText('3 Series'))
  
  // Select year
  fireEvent.click(screen.getByText('Изберете година'))
  fireEvent.click(screen.getByText('2023'))
  
  // Click Find Parts
  fireEvent.click(screen.getByText('Намери части'))
  
  expect(handleFindParts).toHaveBeenCalledWith({
    make: expect.objectContaining({ name: 'BMW' }),
    model: expect.objectContaining({ name: '3 Series' }),
    year: 2023
  })
})
```

## 🎯 UX Principles

### Progressive Disclosure
- Only show relevant options at each step
- Disable later steps until prerequisites are met
- Clear visual hierarchy

### Zero Errors
- Validation prevents invalid selections
- Clear error messages in Bulgarian
- Helpful guidance throughout

### Psychological Reinforcement
- Confirmation UI with positive messaging
- Success indicators and checkmarks
- Professional appearance builds trust

### Mobile-First
- 44px minimum touch targets
- Optimized for touch interactions
- Responsive design patterns

## 📦 Dependencies

- React 18+
- TypeScript 4.5+
- Tailwind CSS 3.0+
- Heroicons (for icons)
- Next.js 13+ (for the project structure)

## 🔄 Updates & Maintenance

### Version History
- **v1.0.0**: Initial MVP implementation
- Full Bulgarian localization
- Static JSON data
- Accessibility compliance
- Mobile-first design

### Roadmap
- [ ] Animation enhancements
- [ ] Advanced filtering options
- [ ] Integration with product catalog
- [ ] Performance optimizations
- [ ] A/B testing framework

## 🤝 Contributing

### Code Style
- Follow existing TypeScript patterns
- Use semantic naming conventions
- Include JSDoc comments
- Maintain accessibility standards

### Testing
- Write unit tests for new features
- Test accessibility compliance
- Verify mobile responsiveness
- Test keyboard navigation

### Documentation
- Update README for new features
- Include usage examples
- Document API changes
- Maintain changelog

## 📄 License

This component is part of the autoparts-shop project and follows the project's licensing terms.

## 🔗 Related Components

- `VehicleSelector`: Full-featured vehicle selector with API integration
- `CarSelection`: NHTSA API-based car selection
- `BrandCard`: Brand display components
- `ProductCard`: Product listing components

## 💡 Tips & Best Practices

### Performance
- Use React.memo for expensive child components
- Implement proper key props for lists
- Consider virtualization for large datasets
- Optimize images with next/image

### UX
- Always provide feedback for user actions
- Maintain consistent loading states
- Use appropriate error boundaries
- Test with real users

### Accessibility
- Test with screen readers
- Verify keyboard navigation
- Check color contrast ratios
- Validate ARIA implementation

### Maintenance
- Keep static data updated
- Monitor performance metrics
- Update dependencies regularly
- Review accessibility compliance

---

**Built with ❤️ by the God of Programming**

For questions or support, please refer to the project documentation or create an issue in the repository. 