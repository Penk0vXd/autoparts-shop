import { searchProducts } from './searchService'
import { supabase } from '@/lib/db'

// Mock Supabase
jest.mock('@/lib/db', () => ({
  supabase: {
    rpc: jest.fn(),
    from: jest.fn(),
  },
}))

const mockSupabase = supabase as jest.Mocked<typeof supabase>

describe('searchService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns empty array for empty query', async () => {
    const result = await searchProducts('')
    expect(result).toEqual([])
    expect(mockSupabase.rpc).not.toHaveBeenCalled()
  })

  it('returns empty array for whitespace query', async () => {
    const result = await searchProducts('   ')
    expect(result).toEqual([])
    expect(mockSupabase.rpc).not.toHaveBeenCalled()
  })

  it('calls prefix RPC function with correct parameters', async () => {
    const mockRpcData = [{ id: '1' }]
    const mockFullData = [
      {
        id: '1',
        name: 'Bosch Oil Filter',
        slug: 'bosch-oil-filter',
        price: 25.99,
        images: ['image1.jpg'],
        brand: { name: 'Bosch', slug: 'bosch' }
      }
    ]

    // Mock RPC call
    mockSupabase.rpc.mockResolvedValue({
      data: mockRpcData,
      error: null
    })

    // Mock select call
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        in: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: mockFullData,
            error: null
          })
        })
      })
    } as any)

    const result = await searchProducts('filter', 5)

    expect(mockSupabase.rpc).toHaveBeenCalledWith('search_products_prefix', {
      query: 'filter',
      lim: 5
    })
    expect(result).toEqual(mockFullData)
  })

  it('returns empty array for single letter that does not start any word', async () => {
    // Mock RPC returning empty results
    mockSupabase.rpc.mockResolvedValue({
      data: [],
      error: null
    })

    const result = await searchProducts('r') // 'r' is inside "filter" but doesn't start it

    expect(result).toEqual([])
  })

  it('returns results for prefix match', async () => {
    const mockRpcData = [{ id: '2' }]
    const mockFullData = [
      {
        id: '2',
        name: 'Радиатор BMW',
        slug: 'radiator-bmw',
        price: 199.99,
        images: null,
        brand: { name: 'BMW', slug: 'bmw' }
      }
    ]

    // Mock RPC call
    mockSupabase.rpc.mockResolvedValue({
      data: mockRpcData,
      error: null
    })

    // Mock select call
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        in: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: mockFullData,
            error: null
          })
        })
      })
    } as any)

    const result = await searchProducts('рад') // Should match "Радиатор"

    expect(result).toEqual(mockFullData)
  })

  it('handles multi-word prefix search', async () => {
    const mockRpcData = [{ id: '3' }]
    const mockFullData = [
      {
        id: '3',
        name: 'Маслен филтър Bosch',
        slug: 'maslen-filter-bosch',
        price: 25.99,
        images: null,
        brand: { name: 'Bosch', slug: 'bosch' }
      }
    ]

    // Mock RPC call
    mockSupabase.rpc.mockResolvedValue({
      data: mockRpcData,
      error: null
    })

    // Mock select call
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        in: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: mockFullData,
            error: null
          })
        })
      })
    } as any)

    const result = await searchProducts('масл филт') // Should match "Маслен филтър"

    expect(result).toEqual(mockFullData)
  })

  it('handles RPC errors and falls back to old search', async () => {
    const mockFallbackRpcData = [{ id: '4' }]
    const mockFallbackFullData = [
      {
        id: '4',
        name: 'Fallback Product',
        slug: 'fallback-product',
        price: 15.99,
        images: [],
        brand: { name: 'Test', slug: 'test' }
      }
    ]

    // Mock prefix search RPC failure
    mockSupabase.rpc
      .mockResolvedValueOnce({
        data: null,
        error: new Error('Prefix search failed')
      })
      // Mock old search RPC success
      .mockResolvedValueOnce({
        data: mockFallbackRpcData,
        error: null
      })

    // Mock select call for fallback
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        in: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: mockFallbackFullData,
            error: null
          })
        })
      })
    } as any)

    const result = await searchProducts('test')

    expect(result).toEqual(mockFallbackFullData)
  })

  it('returns empty array on complete fallback failure', async () => {
    // Mock all RPC calls to fail
    mockSupabase.rpc.mockResolvedValue({
      data: null,
      error: new Error('All searches failed')
    })

    // Mock final ILIKE fallback to also fail
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        or: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue({
              data: null,
              error: new Error('ILIKE search failed')
            })
          })
        })
      })
    } as any)

    const result = await searchProducts('test')

    expect(result).toEqual([])
  })
}) 