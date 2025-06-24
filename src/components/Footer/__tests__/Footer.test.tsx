import { render, screen } from '@testing-library/react'
import Footer from '../Footer'

// Mock Next.js Link component
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
  MockLink.displayName = 'MockLink'
  return MockLink
})

describe('Footer Component', () => {
  it('renders without crashing', () => {
    render(<Footer />)
    expect(screen.getByText('Авточасти')).toBeInTheDocument()
  })

  it('displays brand information', () => {
    render(<Footer />)
    expect(screen.getByText('Авточасти')).toBeInTheDocument()
    expect(screen.getByText(/Вашият надежден партньор/)).toBeInTheDocument()
  })

  it('displays default categories when none provided', () => {
    render(<Footer />)
    expect(screen.getByText('Двигатели')).toBeInTheDocument()
    expect(screen.getByText('Спирачки')).toBeInTheDocument()
    expect(screen.getByText('Окачване')).toBeInTheDocument()
    expect(screen.getByText('Електрика')).toBeInTheDocument()
  })

  it('displays custom categories when provided', () => {
    const customCategories = [
      { id: '1', name: 'Custom Category', slug: 'custom' }
    ]
    render(<Footer categories={customCategories} />)
    expect(screen.getByText('Custom Category')).toBeInTheDocument()
  })

  it('displays contact information with icons', () => {
    render(<Footer />)
    expect(screen.getByText('+359 888 123 456')).toBeInTheDocument()
    expect(screen.getByText('info@autoparts.bg')).toBeInTheDocument()
    expect(screen.getByText('София, България')).toBeInTheDocument()
  })

  it('has correct links with proper accessibility labels', () => {
    render(<Footer />)
    const contactLink = screen.getByLabelText('Свържете се с нас')
    expect(contactLink).toHaveAttribute('href', '/contact')
  })

  it('displays current year in copyright', () => {
    render(<Footer />)
    const currentYear = new Date().getFullYear()
    expect(screen.getByText(`© ${currentYear} Авточасти. Всички права запазени.`)).toBeInTheDocument()
  })
}) 