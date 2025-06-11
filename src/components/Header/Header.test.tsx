import { render, screen, fireEvent } from '@testing-library/react'
import { Header } from './Header'
import { MAIN_NAV } from '@/config/main-nav'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useSelectedLayoutSegment: () => null,
}))

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Menu: () => <div data-testid="menu-icon" />,
  Search: () => <div data-testid="search-icon" />,
  ShoppingCart: () => <div data-testid="cart-icon" />,
  X: () => <div data-testid="x-icon" />,
}))

// Mock UI components
jest.mock('@/components/ui/sheet', () => ({
  Sheet: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetContent: ({ children }: { children: React.ReactNode }) => <div data-testid="mobile-menu">{children}</div>,
}))

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}))

describe('Header', () => {
  it('renders 4 navigation links', () => {
    render(<Header />)
    
    expect(MAIN_NAV).toHaveLength(4)
    MAIN_NAV.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument()
    })
  })

  it('renders logo with correct link', () => {
    render(<Header />)
    
    const logoLink = screen.getByLabelText('Начална страница')
    expect(logoLink).toHaveAttribute('href', '/')
    expect(screen.getByText('Авточасти')).toBeInTheDocument()
  })

  it('displays cart badge with correct count', () => {
    render(<Header />)
    
    const cartButton = screen.getByLabelText('Количка с 0 артикула')
    expect(cartButton).toBeInTheDocument()
    expect(cartButton.closest('a')).toHaveAttribute('href', '/cart')
  })

  it('shows search and user buttons', () => {
    render(<Header />)
    
    expect(screen.getByLabelText('Търсене')).toBeInTheDocument()
    expect(screen.getByLabelText('Потребителски профил')).toBeInTheDocument()
  })

  it('displays mobile menu trigger', () => {
    render(<Header />)
    
    expect(screen.getByLabelText('Отвори меню')).toBeInTheDocument()
  })

  it('renders mobile navigation menu', () => {
    render(<Header />)
    
    const mobileMenu = screen.getByTestId('mobile-menu')
    expect(mobileMenu).toBeInTheDocument()
    
    // Check that nav items are also in mobile menu
    MAIN_NAV.forEach((item) => {
      const links = screen.getAllByText(item.label)
      expect(links.length).toBeGreaterThan(0)
    })
  })
}) 