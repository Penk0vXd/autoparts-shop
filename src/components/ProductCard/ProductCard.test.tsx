import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { ProductCard } from './ProductCard'
import type { Product } from '@/types/db'

// Mock messages for testing
const messages = {
  products: {
    inStock: 'В наличност',
    outOfStock: 'Изчерпан',
    addToCart: 'Добави в количката',
  },
  common: {
    loading: 'Зареждане...',
  },
}

const mockProduct: Product = {
  id: '1',
  sku: 'TEST-001',
  name: 'Test Product',
  slug: 'test-product',
  description: 'Test product description',
  short_description: 'Short description',
  price: 25.99,
  compare_price: 32.99,
  stock_quantity: 10,
  min_stock_level: 5,
  is_active: true,
  is_featured: false,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  brand: {
    id: '1',
    name: 'Test Brand',
    slug: 'test-brand',
    category: 'car' as const,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
}

const renderWithIntl = (component: React.ReactElement) => {
  return render(
    <NextIntlClientProvider messages={messages} locale="bg">
      {component}
    </NextIntlClientProvider>
  )
}

describe('ProductCard', () => {
  it('renders without crashing', () => {
    renderWithIntl(<ProductCard product={mockProduct} />)
    expect(screen.getByText('Test Product')).toBeInTheDocument()
  })

  it('displays product name and brand', () => {
    renderWithIntl(<ProductCard product={mockProduct} />)
    
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('Test Brand')).toBeInTheDocument()
  })

  it('displays price correctly', () => {
    renderWithIntl(<ProductCard product={mockProduct} />)
    
    // Should display formatted price in BGN
    expect(screen.getByText(/25,99/)).toBeInTheDocument()
  })

  it('shows discount when compare_price is higher', () => {
    renderWithIntl(<ProductCard product={mockProduct} />)
    
    // Should show discount percentage
    expect(screen.getByText('-21%')).toBeInTheDocument()
    // Should show original price crossed out
    expect(screen.getByText(/32,99/)).toBeInTheDocument()
  })

  it('displays stock status correctly', () => {
    renderWithIntl(<ProductCard product={mockProduct} />)
    
    expect(screen.getByText('В наличност')).toBeInTheDocument()
  })

  it('shows out of stock when stock is 0', () => {
    const outOfStockProduct = { ...mockProduct, stock_quantity: 0 }
    renderWithIntl(<ProductCard product={outOfStockProduct} />)
    
    expect(screen.getByText('Изчерпан')).toBeInTheDocument()
  })

  it('disables add to cart button when out of stock', () => {
    const outOfStockProduct = { ...mockProduct, stock_quantity: 0 }
    renderWithIntl(<ProductCard product={outOfStockProduct} />)
    
    const addToCartButton = screen.getByRole('button', { name: /добави в количката/i })
    expect(addToCartButton).toBeDisabled()
  })

  it('enables add to cart button when in stock', () => {
    renderWithIntl(<ProductCard product={mockProduct} />)
    
    const addToCartButton = screen.getByRole('button', { name: /добави в количката/i })
    expect(addToCartButton).not.toBeDisabled()
  })

  it('shows featured badge when product is featured', () => {
    const featuredProduct = { ...mockProduct, is_featured: true }
    renderWithIntl(<ProductCard product={featuredProduct} />)
    
    expect(screen.getByText('Топ')).toBeInTheDocument()
  })
}) 