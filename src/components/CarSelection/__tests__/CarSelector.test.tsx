import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CarSelector } from '../CarSelector'
import { CarSelection } from '@/types/car-selector'

describe('CarSelector', () => {
  const mockOnSelectionChange = jest.fn()

  beforeEach(() => {
    mockOnSelectionChange.mockClear()
  })

  it('renders with default props', () => {
    render(<CarSelector />)
    
    expect(screen.getByText('Select Your Vehicle')).toBeInTheDocument()
    expect(screen.getByText('Make')).toBeInTheDocument()
    expect(screen.getByText('Model')).toBeInTheDocument()
    expect(screen.getByText('Year')).toBeInTheDocument()
  })

  it('renders without year selector when showYearSelector is false', () => {
    render(<CarSelector showYearSelector={false} />)
    
    expect(screen.getByText('Make')).toBeInTheDocument()
    expect(screen.getByText('Model')).toBeInTheDocument()
    expect(screen.queryByText('Year')).not.toBeInTheDocument()
  })

  it('renders without clear button when showClearButton is false', () => {
    render(<CarSelector showClearButton={false} />)
    
    expect(screen.queryByText('Clear')).not.toBeInTheDocument()
  })

  it('opens make dropdown when clicked', () => {
    render(<CarSelector />)
    
    const makeButton = screen.getByRole('button', { name: /make selection/i })
    fireEvent.click(makeButton)
    
    expect(screen.getByText('Toyota')).toBeInTheDocument()
    expect(screen.getByText('Honda')).toBeInTheDocument()
    expect(screen.getByText('BMW')).toBeInTheDocument()
  })

  it('selects a make and enables model dropdown', async () => {
    render(<CarSelector onSelectionChange={mockOnSelectionChange} />)
    
    // Open make dropdown
    const makeButton = screen.getByRole('button', { name: /make selection/i })
    fireEvent.click(makeButton)
    
    // Select Toyota
    fireEvent.click(screen.getByText('Toyota'))
    
    // Wait for models to load
    await waitFor(() => {
      expect(screen.getByText('Camry')).toBeInTheDocument()
    })
    
    // Verify selection callback was called
    expect(mockOnSelectionChange).toHaveBeenCalledWith({
      make: { id: 'toyota', name: 'Toyota' },
      model: undefined,
      year: undefined
    })
  })

  it('cascades selection from make to model', async () => {
    render(<CarSelector onSelectionChange={mockOnSelectionChange} />)
    
    // Select Toyota
    const makeButton = screen.getByRole('button', { name: /make selection/i })
    fireEvent.click(makeButton)
    fireEvent.click(screen.getByText('Toyota'))
    
    // Wait for models to load
    await waitFor(() => {
      expect(screen.getByText('Camry')).toBeInTheDocument()
    })
    
    // Open model dropdown
    const modelButton = screen.getByRole('button', { name: /model selection/i })
    fireEvent.click(modelButton)
    
    // Select Camry
    fireEvent.click(screen.getByText('Camry'))
    
    // Verify selection callback was called
    expect(mockOnSelectionChange).toHaveBeenCalledWith({
      make: { id: 'toyota', name: 'Toyota' },
      model: { id: 'camry', name: 'Camry', makeId: 'toyota' },
      year: undefined
    })
  })

  it('selects a year when model is selected', async () => {
    render(<CarSelector onSelectionChange={mockOnSelectionChange} />)
    
    // Select Toyota
    const makeButton = screen.getByRole('button', { name: /make selection/i })
    fireEvent.click(makeButton)
    fireEvent.click(screen.getByText('Toyota'))
    
    // Wait and select Camry
    await waitFor(() => {
      expect(screen.getByText('Camry')).toBeInTheDocument()
    })
    
    const modelButton = screen.getByRole('button', { name: /model selection/i })
    fireEvent.click(modelButton)
    fireEvent.click(screen.getByText('Camry'))
    
    // Select year
    const yearButton = screen.getByRole('button', { name: /year selection/i })
    fireEvent.click(yearButton)
    fireEvent.click(screen.getByText('2023'))
    
    // Verify full selection
    expect(mockOnSelectionChange).toHaveBeenCalledWith({
      make: { id: 'toyota', name: 'Toyota' },
      model: { id: 'camry', name: 'Camry', makeId: 'toyota' },
      year: { value: 2023, label: '2023' }
    })
  })

  it('clears selection when clear button is clicked', async () => {
    render(<CarSelector onSelectionChange={mockOnSelectionChange} />)
    
    // Select Toyota
    const makeButton = screen.getByRole('button', { name: /make selection/i })
    fireEvent.click(makeButton)
    fireEvent.click(screen.getByText('Toyota'))
    
    // Wait for clear button to appear
    await waitFor(() => {
      expect(screen.getByText('Clear')).toBeInTheDocument()
    })
    
    // Click clear button
    fireEvent.click(screen.getByText('Clear'))
    
    // Verify selection was cleared
    expect(mockOnSelectionChange).toHaveBeenCalledWith({})
  })

  it('renders with initial selection', () => {
    const initialSelection: CarSelection = {
      make: { id: 'toyota', name: 'Toyota' },
      model: { id: 'camry', name: 'Camry', makeId: 'toyota' },
      year: { value: 2023, label: '2023' }
    }
    
    render(
      <CarSelector 
        initialSelection={initialSelection}
        onSelectionChange={mockOnSelectionChange}
      />
    )
    
    expect(screen.getByDisplayValue('Toyota')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Camry')).toBeInTheDocument()
    expect(screen.getByDisplayValue('2023')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <CarSelector className="custom-class" />
    )
    
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('disables all interactions when disabled prop is true', () => {
    render(<CarSelector disabled={true} />)
    
    const makeButton = screen.getByRole('button', { name: /make selection/i })
    expect(makeButton).toBeDisabled()
  })

  it('shows loading state when models are being loaded', async () => {
    render(<CarSelector />)
    
    // Select Toyota
    const makeButton = screen.getByRole('button', { name: /make selection/i })
    fireEvent.click(makeButton)
    fireEvent.click(screen.getByText('Toyota'))
    
    // Should show loading briefly
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    
    // Wait for models to load
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })
  })

  it('shows selection summary when vehicles are selected', async () => {
    render(<CarSelector />)
    
    // Select Toyota
    const makeButton = screen.getByRole('button', { name: /make selection/i })
    fireEvent.click(makeButton)
    fireEvent.click(screen.getByText('Toyota'))
    
    // Wait for selection summary
    await waitFor(() => {
      expect(screen.getByText('Selected Vehicle:')).toBeInTheDocument()
      expect(screen.getByText('Make:')).toBeInTheDocument()
      expect(screen.getByText('Toyota')).toBeInTheDocument()
    })
  })

  it('handles different sizes correctly', () => {
    const { rerender } = render(<CarSelector size="sm" />)
    const makeButton = screen.getByRole('button', { name: /make selection/i })
    expect(makeButton).toHaveClass('h-10')
    
    rerender(<CarSelector size="md" />)
    expect(makeButton).toHaveClass('h-12')
    
    rerender(<CarSelector size="lg" />)
    expect(makeButton).toHaveClass('h-14')
  })
}) 