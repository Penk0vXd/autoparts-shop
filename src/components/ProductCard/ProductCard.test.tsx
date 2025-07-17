import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ProductCard, ProductCardSkeleton, ProductCardGrid } from './ProductCard'
import { VehicleProvider } from '@/contexts/VehicleContext'
import type { ProductWithRelations } from '@/types/supabase'

// Mock the SafeImage component
jest.mock('@/components/ui/SafeImage', () => ({
  SafeImage: ({ alt, onLoad, onError, ...props }: any) => {
    // Simulate successful image load
    setTimeout(() => onLoad?.(), 0)
    return <img alt={alt} {...props} data-testid="safe-image" />
  }
}))

// Mock the VehicleContext module
const mockUseVehicleCompatibility = jest.fn()

jest.mock('@/contexts/VehicleContext', () => ({
  VehicleProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="vehicle-provider">{children}</div>,
  useVehicleCompatibility: () => mockUseVehicleCompatibility()
}))

// Mock the require call for dynamic import
const originalRequire = require
jest.doMock('@/contexts/VehicleContext', () => ({
  useVehicleCompatibility: () => mockUseVehicleCompatibility()
}))

const mockProduct: ProductWithRelations = {
  id: '1',
  sku: 'BOX-OF-001',
  name: 'Маслен филтър Bosch F026407006',
  slug: 'maslen-filter-bosch-f026407006',
  description: 'Оригинален маслен филтър от Bosch за BMW, Mercedes и Audi.',
  short_description: 'Оригинален маслен филтър за BMW, Mercedes, Audi',
  price: 25.99,
  compare_price: 32.99,
  cost_price: 15.59,
  stock: 15,
  min_stock_level: 5,
  weight: 0.5,
  dimensions: null,
  image_url: 'https://example.com/oil-filter.jpg',
  images: [
    'https://example.com/oil-filter.jpg',
    'https://example.com/oil-filter-2.jpg'
  ],
  specifications: {
    material: 'Хартия',
    diameter: '76mm',
    height: '85mm',
    thread: 'M20 x 1.5'
  },
  compatibility: {
    makes: ['BMW', 'Mercedes-Benz', 'Audi'],
    models: ['3 Series', 'C-Class', 'A4'],
    years: ['2010-2024'],
    engines: ['320i', '318d', '320d', 'C200', 'C220d']
  },
  is_active: true,
  is_featured: true,
  is_deleted: false,
  meta_title: null,
  meta_description: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  category_id: '1',
  brand_id: '1',
  brand: {
    id: '1',
    name: 'Bosch',
    slug: 'bosch',
    logo_url: null,
    description: null,
    category: 'parts',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  category: {
    id: '1',
    name: 'Филтри',
    slug: 'filtri',
    description: null,
    parent_id: null,
    image_url: null,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
}

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <VehicleProvider>
      {component}
    </VehicleProvider>
  )
}

describe('ProductCard', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockUseVehicleCompatibility.mockReset()
    mockUseVehicleCompatibility.mockReturnValue({
      checkProductCompatibility: jest.fn(() => true),
      getProductFilters: jest.fn(() => ({})),
      hasFilters: false
    })
  })

  describe('Basic Functionality', () => {
    it('renders without crashing', () => {
      render(<ProductCard product={mockProduct} />)
      expect(screen.getByText('Маслен филтър Bosch F026407006')).toBeInTheDocument()
    })

    it('renders without VehicleProvider', () => {
      render(<ProductCard product={mockProduct} />)
      expect(screen.getByText('Маслен филтър Bosch F026407006')).toBeInTheDocument()
      expect(screen.getByText('Bosch')).toBeInTheDocument()
      expect(screen.getByText('Филтри')).toBeInTheDocument()
    })

    it('displays product name, brand, and category', () => {
      renderWithProvider(<ProductCard product={mockProduct} />)
      
      expect(screen.getByText('Маслен филтър Bosch F026407006')).toBeInTheDocument()
      expect(screen.getByText('Bosch')).toBeInTheDocument()
      expect(screen.getByText('Филтри')).toBeInTheDocument()
    })

    it('displays SKU correctly', () => {
      render(<ProductCard product={mockProduct} />)
      
      expect(screen.getByText('Код: BOX-OF-001')).toBeInTheDocument()
    })

    it('displays price correctly', () => {
      render(<ProductCard product={mockProduct} />)
      
      expect(screen.getByText('25.99 лв')).toBeInTheDocument()
    })

    it('shows discount when compare_price is higher', () => {
      render(<ProductCard product={mockProduct} />)
      
      // Should show discount percentage
      expect(screen.getByText('-21%')).toBeInTheDocument()
      // Should show original price crossed out
      expect(screen.getByText('32.99 лв')).toBeInTheDocument()
    })
  })

  describe('Stock Management', () => {
    it('displays correct stock status for in-stock product', () => {
      render(<ProductCard product={mockProduct} />)
      
      expect(screen.getByText('В наличност')).toBeInTheDocument()
      expect(screen.getByText('Бърза доставка')).toBeInTheDocument()
    })

    it('shows low stock warning when stock is below minimum level', () => {
      const lowStockProduct = { ...mockProduct, stock: 3 }
      render(<ProductCard product={lowStockProduct} />)
      
      expect(screen.getByText('Малко количество')).toBeInTheDocument()
    })

    it('shows out of stock when stock is 0', () => {
      const outOfStockProduct = { ...mockProduct, stock: 0 }
      render(<ProductCard product={outOfStockProduct} />)
      
      expect(screen.getByText('Няма наличност')).toBeInTheDocument()
    })

    it('disables add to cart button when out of stock', () => {
      const outOfStockProduct = { ...mockProduct, stock: 0 }
      render(<ProductCard product={outOfStockProduct} />)
      
      const addToCartButton = screen.getByRole('button', { name: /добави в количката/i })
      expect(addToCartButton).toBeDisabled()
    })

    it('enables add to cart button when in stock', () => {
      render(<ProductCard product={mockProduct} />)
      
      const addToCartButton = screen.getByRole('button', { name: /добави в количката/i })
      expect(addToCartButton).not.toBeDisabled()
    })
  })

  describe('Vehicle Compatibility', () => {
    it('shows compatibility status when VehicleProvider is available and has filters', () => {
      mockUseVehicleCompatibility.mockReturnValue({
        checkProductCompatibility: jest.fn(() => true),
        getProductFilters: jest.fn(() => ({})),
        hasFilters: true
      })

      renderWithProvider(<ProductCard product={mockProduct} />)
      
      expect(screen.getByText('Съвместим')).toBeInTheDocument()
    })

    it('shows incompatibility warning when product is not compatible', () => {
      mockUseVehicleCompatibility.mockReturnValue({
        checkProductCompatibility: jest.fn(() => false),
        getProductFilters: jest.fn(() => ({})),
        hasFilters: true
      })

      renderWithProvider(<ProductCard product={mockProduct} />)
      
      expect(screen.getByText('Проверете съвместимостта')).toBeInTheDocument()
    })

    it('does not show compatibility when no filters are active', () => {
      mockUseVehicleCompatibility.mockReturnValue({
        checkProductCompatibility: jest.fn(() => true),
        getProductFilters: jest.fn(() => ({})),
        hasFilters: false
      })

      renderWithProvider(<ProductCard product={mockProduct} />)
      
      expect(screen.queryByText('Съвместим')).not.toBeInTheDocument()
      expect(screen.queryByText('Проверете съвместимостта')).not.toBeInTheDocument()
    })

    it('hides compatibility when showCompatibility is false', () => {
      mockUseVehicleCompatibility.mockReturnValue({
        checkProductCompatibility: jest.fn(() => true),
        getProductFilters: jest.fn(() => ({})),
        hasFilters: true
      })

      renderWithProvider(<ProductCard product={mockProduct} showCompatibility={false} />)
      
      expect(screen.queryByText('Съвместим')).not.toBeInTheDocument()
      expect(screen.queryByText('Проверете съвместимостта')).not.toBeInTheDocument()
    })

    it('works without VehicleProvider and does not show compatibility', () => {
      render(<ProductCard product={mockProduct} />)
      
      // Should not show compatibility status when outside VehicleProvider
      expect(screen.queryByText('Съвместим')).not.toBeInTheDocument()
      expect(screen.queryByText('Проверете съвместимостта')).not.toBeInTheDocument()
    })
  })

  describe('Product Features', () => {
    it('shows featured badge when product is featured', () => {
      render(<ProductCard product={mockProduct} />)
      
      expect(screen.getByText('Препоръчан')).toBeInTheDocument()
    })

    it('displays specifications when available', () => {
      render(<ProductCard product={mockProduct} />)
      
      expect(screen.getByText('Material:')).toBeInTheDocument()
      expect(screen.getByText('Хартия')).toBeInTheDocument()
      expect(screen.getByText('Diameter:')).toBeInTheDocument()
      expect(screen.getByText('76mm')).toBeInTheDocument()
    })

    it('shows guarantee text', () => {
      render(<ProductCard product={mockProduct} />)
      
      expect(screen.getByText('Гаранция включена')).toBeInTheDocument()
    })

    it('links to product detail page', () => {
      render(<ProductCard product={mockProduct} />)
      
      const productLinks = screen.getAllByRole('link', { name: /маслен филтър bosch/i })
      expect(productLinks[0]).toHaveAttribute('href', '/products/maslen-filter-bosch-f026407006')
    })
  })

  describe('User Interactions', () => {
    it('calls onAddToCart when add to cart button is clicked', () => {
      const mockAddToCart = jest.fn()
      render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />)
      
      const addToCartButton = screen.getByRole('button', { name: /добави в количката/i })
      fireEvent.click(addToCartButton)
      
      expect(mockAddToCart).toHaveBeenCalledWith(mockProduct)
    })

    it('calls onAddToWishlist when wishlist button is clicked', () => {
      const mockAddToWishlist = jest.fn()
      render(<ProductCard product={mockProduct} onAddToWishlist={mockAddToWishlist} />)
      
      const wishlistButton = screen.getByLabelText('Добави в желани')
      fireEvent.click(wishlistButton)
      
      expect(mockAddToWishlist).toHaveBeenCalledWith(mockProduct)
    })

    it('calls onQuickView when quick view button is clicked', () => {
      const mockQuickView = jest.fn()
      render(<ProductCard product={mockProduct} onQuickView={mockQuickView} />)
      
      const quickViewButton = screen.getByLabelText('Бърз преглед')
      fireEvent.click(quickViewButton)
      
      expect(mockQuickView).toHaveBeenCalledWith(mockProduct)
    })

    it('hides wishlist button when showWishlist is false', () => {
      render(<ProductCard product={mockProduct} showWishlist={false} />)
      
      expect(screen.queryByLabelText('Добави в желани')).not.toBeInTheDocument()
    })

    it('hides quick view button when showQuickView is false', () => {
      render(<ProductCard product={mockProduct} showQuickView={false} />)
      
      expect(screen.queryByLabelText('Бърз преглед')).not.toBeInTheDocument()
    })
  })

  describe('Size Variants', () => {
    it('applies different sizes correctly', () => {
      const { rerender } = render(<ProductCard product={mockProduct} size="sm" />)
      
      // Check if small size class is applied
      expect(screen.getByText('Маслен филтър Bosch F026407006').closest('div')).toHaveClass('text-sm')
      
      rerender(<ProductCard product={mockProduct} size="lg" />)
      
      // Check if large size class is applied
      expect(screen.getByText('Маслен филтър Bosch F026407006').closest('div')).toHaveClass('text-lg')
    })
  })

  describe('Image Handling', () => {
    it('handles image navigation when multiple images are available', () => {
      render(<ProductCard product={mockProduct} />)
      
      // Should show navigation dots for multiple images
      const dots = screen.getAllByLabelText(/Изображение \d+/)
      expect(dots).toHaveLength(2) // mockProduct has 2 images
      
      // Click second dot
      fireEvent.click(dots[1])
      
      // Should switch to second image (testing would require more complex image mock)
    })
  })
})

describe('ProductCardSkeleton', () => {
  it('renders skeleton loader correctly', () => {
    render(<ProductCardSkeleton />)
    
    // Should render with default medium size
    expect(screen.getByRole('generic')).toHaveClass('animate-pulse')
  })

  it('applies different sizes correctly', () => {
    const { rerender } = render(<ProductCardSkeleton size="sm" />)
    
    expect(screen.getByRole('generic')).toBeInTheDocument()
    
    rerender(<ProductCardSkeleton size="lg" />)
    
    expect(screen.getByRole('generic')).toBeInTheDocument()
  })
})

describe('ProductCardGrid', () => {
  it('renders grid container correctly', () => {
    render(
      <ProductCardGrid>
        <div>Child 1</div>
        <div>Child 2</div>
      </ProductCardGrid>
    )
    
    expect(screen.getByText('Child 1')).toBeInTheDocument()
    expect(screen.getByText('Child 2')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(
      <ProductCardGrid className="custom-class">
        <div>Child</div>
      </ProductCardGrid>
    )
    
    const gridContainer = screen.getByText('Child').parentElement
    expect(gridContainer).toHaveClass('custom-class')
  })
}) 