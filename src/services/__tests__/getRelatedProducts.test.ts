import { getRelatedProducts } from '../productService'
import { supabase } from '@/lib/db'

// Mock Supabase client
jest.mock('@/lib/db', () => ({
  supabase: {
    from: jest.fn()
  }
}))

describe('getRelatedProducts', () => {
  const mockProducts = [
    { id: '1', name: 'Product 1', category_id: 'cat1', brand_id: 'brand1', sales_count: 10 },
    { id: '2', name: 'Product 2', category_id: 'cat1', brand_id: 'brand1', sales_count: 5 },
    { id: '3', name: 'Product 3', category_id: 'cat1', brand_id: 'brand2', sales_count: 15 },
    { id: '4', name: 'Product 4', category_id: 'cat2', brand_id: 'brand1', sales_count: 20 },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns products from same category and brand', async () => {
    const mockSelect = jest.fn().mockReturnValue({
      data: [mockProducts[1]],
      error: null
    })

    ;(supabase.from as jest.Mock).mockReturnValue({
      select: mockSelect,
      neq: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      gt: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnValue({ data: [mockProducts[1]], error: null })
    })

    const result = await getRelatedProducts('1', 'cat1', 'brand1')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('2')
  })

  it('falls back to same category different brand when no exact matches', async () => {
    const mockSelect = jest.fn().mockReturnValue({
      data: [mockProducts[2]],
      error: null
    })

    ;(supabase.from as jest.Mock).mockReturnValue({
      select: mockSelect,
      neq: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      gt: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnValue({ data: [mockProducts[2]], error: null })
    })

    const result = await getRelatedProducts('1', 'cat1', 'brand2')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('3')
  })

  it('falls back to top selling products when no other matches', async () => {
    const mockSelect = jest.fn().mockReturnValue({
      data: [mockProducts[3]],
      error: null
    })

    ;(supabase.from as jest.Mock).mockReturnValue({
      select: mockSelect,
      neq: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      gt: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnValue({ data: [mockProducts[3]], error: null })
    })

    const result = await getRelatedProducts('1', 'cat3', 'brand3')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('4')
  })
}) 