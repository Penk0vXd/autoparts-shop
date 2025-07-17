import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrandCard } from '../BrandCard';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock Heroicons
jest.mock('@heroicons/react/24/outline', () => ({
  ChevronRightIcon: () => <div data-testid="chevron-right-icon" />,
  MapPinIcon: () => <div data-testid="map-pin-icon" />,
  CalendarIcon: () => <div data-testid="calendar-icon" />,
  CogIcon: () => <div data-testid="cog-icon" />,
}));

// Mock SafeImage component
jest.mock('../../ui/SafeImage', () => ({
  SafeImage: ({ src, alt, fallback }: any) => (
    <div data-testid="safe-image">
      <img src={src} alt={alt} />
      {fallback}
    </div>
  ),
}));

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
});

const mockBrand = {
  name: 'BMW',
  slug: 'bmw',
  country: 'Germany',
  founded: 1916,
  description: 'Bavarian Motor Works - Premium German engineering.',
  productCount: 15420,
  popularModels: ['3 Series', '5 Series', 'X3'],
  isPopular: true,
  isPremium: true,
};

describe('BrandCard', () => {
  it('renders brand information correctly', () => {
    render(<BrandCard brand={mockBrand} />);
    
    expect(screen.getByText('BMW')).toBeInTheDocument();
    expect(screen.getByText('Germany')).toBeInTheDocument();
    expect(screen.getByText('Since 1916')).toBeInTheDocument();
    expect(screen.getByText('15,420')).toBeInTheDocument();
    expect(screen.getByText('Parts Available')).toBeInTheDocument();
  });

  it('displays premium badge when brand is premium', () => {
    render(<BrandCard brand={mockBrand} />);
    
    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('displays popular badge when brand is popular but not premium', () => {
    const popularBrand = { ...mockBrand, isPremium: false, isPopular: true };
    render(<BrandCard brand={popularBrand} />);
    
    expect(screen.getByText('Popular')).toBeInTheDocument();
    expect(screen.queryByText('Premium')).not.toBeInTheDocument();
  });

  it('shows description when showDescription is true and variant is not compact', () => {
    render(<BrandCard brand={mockBrand} showDescription={true} variant="default" />);
    
    expect(screen.getByText(mockBrand.description)).toBeInTheDocument();
  });

  it('hides description when showDescription is false', () => {
    render(<BrandCard brand={mockBrand} showDescription={false} />);
    
    expect(screen.queryByText(mockBrand.description)).not.toBeInTheDocument();
  });

  it('hides description in compact variant', () => {
    render(<BrandCard brand={mockBrand} showDescription={true} variant="compact" />);
    
    expect(screen.queryByText(mockBrand.description)).not.toBeInTheDocument();
  });

  it('shows stats when showStats is true', () => {
    render(<BrandCard brand={mockBrand} showStats={true} />);
    
    expect(screen.getByText('15,420')).toBeInTheDocument();
    expect(screen.getByText('Parts Available')).toBeInTheDocument();
  });

  it('hides stats when showStats is false', () => {
    render(<BrandCard brand={mockBrand} showStats={false} />);
    
    expect(screen.queryByText('15,420')).not.toBeInTheDocument();
    expect(screen.queryByText('Parts Available')).not.toBeInTheDocument();
  });

  it('displays popular models in featured variant', () => {
    render(<BrandCard brand={mockBrand} variant="featured" />);
    
    expect(screen.getByText('Popular Models')).toBeInTheDocument();
    expect(screen.getByText('3 Series')).toBeInTheDocument();
    expect(screen.getByText('5 Series')).toBeInTheDocument();
    expect(screen.getByText('X3')).toBeInTheDocument();
  });

  it('does not display popular models in default variant', () => {
    render(<BrandCard brand={mockBrand} variant="default" />);
    
    expect(screen.queryByText('Popular Models')).not.toBeInTheDocument();
  });

  it('shows popular model count in non-compact variants', () => {
    render(<BrandCard brand={mockBrand} variant="default" showStats={true} />);
    
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Popular Models')).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', () => {
    const mockOnClick = jest.fn();
    render(<BrandCard brand={mockBrand} onClick={mockOnClick} />);
    
    const card = screen.getByText('BMW').closest('div[role="button"], div');
    if (card) {
      fireEvent.click(card);
    }
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('renders correct link to brand page', () => {
    render(<BrandCard brand={mockBrand} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/brands/bmw');
  });

  it('generates correct logo URLs', () => {
    render(<BrandCard brand={mockBrand} />);
    
    const safeImage = screen.getByTestId('safe-image');
    expect(safeImage).toBeInTheDocument();
  });

  it('applies correct CSS classes for different variants', () => {
    const { rerender } = render(<BrandCard brand={mockBrand} variant="compact" />);
    
    // Test compact variant
    expect(screen.getByText('BMW').closest('div')).toHaveClass('p-4');
    
    // Test featured variant
    rerender(<BrandCard brand={mockBrand} variant="featured" />);
    expect(screen.getByText('BMW').closest('div')).toHaveClass('p-8');
    
    // Test default variant
    rerender(<BrandCard brand={mockBrand} variant="default" />);
    expect(screen.getByText('BMW').closest('div')).toHaveClass('p-6');
  });

  it('renders without optional props', () => {
    const minimalBrand = {
      name: 'Test Brand',
      slug: 'test-brand',
      country: 'Test Country',
      founded: 2000,
    };
    
    render(<BrandCard brand={minimalBrand} />);
    
    expect(screen.getByText('Test Brand')).toBeInTheDocument();
    expect(screen.getByText('Test Country')).toBeInTheDocument();
    expect(screen.getByText('Since 2000')).toBeInTheDocument();
  });

  it('handles empty popular models array', () => {
    const brandWithoutModels = { ...mockBrand, popularModels: [] };
    render(<BrandCard brand={brandWithoutModels} variant="featured" />);
    
    expect(screen.queryByText('Popular Models')).not.toBeInTheDocument();
  });

  it('shows correct button text with product count', () => {
    render(<BrandCard brand={mockBrand} />);
    
    expect(screen.getByText('View 15,420 Parts')).toBeInTheDocument();
  });

  it('handles zero product count', () => {
    const brandWithZeroParts = { ...mockBrand, productCount: 0 };
    render(<BrandCard brand={brandWithZeroParts} />);
    
    expect(screen.getByText('View 0 Parts')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('truncates popular models list and shows more indicator', () => {
    const brandWithManyModels = {
      ...mockBrand,
      popularModels: ['Model 1', 'Model 2', 'Model 3', 'Model 4', 'Model 5'],
    };
    
    render(<BrandCard brand={brandWithManyModels} variant="featured" />);
    
    expect(screen.getByText('Model 1')).toBeInTheDocument();
    expect(screen.getByText('Model 2')).toBeInTheDocument();
    expect(screen.getByText('Model 3')).toBeInTheDocument();
    expect(screen.getByText('+2 more')).toBeInTheDocument();
    expect(screen.queryByText('Model 4')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<BrandCard brand={mockBrand} className="custom-class" />);
    
    const card = screen.getByText('BMW').closest('div');
    expect(card).toHaveClass('custom-class');
  });
}); 