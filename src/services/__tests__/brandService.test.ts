import { getBrandBySlug, getBrands, countBrands } from '../brandService'
import { supabase } from '@/lib/db'

jest.mock('@/lib/db', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
    range: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
  },
  handleDbError: jest.fn(),
}))

describe('brandService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getBrandBySlug', () => {
    it('should return brand when found', async () => {
      const mockBrand = {
        id: '1',
        name: 'Bosch',
        slug: 'bosch',
        is_active: true,
      }

      ;(supabase.single as jest.Mock).mockResolvedValueOnce({
        data: mockBrand,
        error: null,
      })

      const result = await getBrandBySlug('bosch')
      expect(result).toEqual(mockBrand)
      expect(supabase.from).toHaveBeenCalledWith('brands')
      expect(supabase.eq).toHaveBeenCalledWith('is_active', true)
      expect(supabase.eq).toHaveBeenCalledWith('slug', 'bosch')
    })

    it('should return null when brand not found', async () => {
      ;(supabase.single as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: { code: 'PGRST116' },
      })

      const result = await getBrandBySlug('non-existent')
      expect(result).toBeNull()
    })
  })

  describe('getBrands', () => {
    it('should return paginated brands', async () => {
      const mockBrands = [
        { id: '1', name: 'Bosch', slug: 'bosch', is_active: true },
        { id: '2', name: 'Brembo', slug: 'brembo', is_active: true },
      ]

      ;(supabase.range as jest.Mock).mockResolvedValueOnce({
        data: mockBrands,
        error: null,
        count: 10,
      })

      const result = await getBrands(1, 2)
      expect(result).toEqual({
        data: mockBrands,
        total: 10,
        page: 1,
        totalPages: 5,
      })
      expect(supabase.from).toHaveBeenCalledWith('brands')
      expect(supabase.eq).toHaveBeenCalledWith('is_active', true)
      expect(supabase.range).toHaveBeenCalledWith(0, 1)
    })

    it('should handle empty results', async () => {
      ;(supabase.range as jest.Mock).mockResolvedValueOnce({
        data: [],
        error: null,
        count: 0,
      })

      const result = await getBrands()
      expect(result).toEqual({
        data: [],
        total: 0,
        page: 1,
        totalPages: 0,
      })
    })
  })

  describe('countBrands', () => {
    it('returns total count of active brands', async () => {
      ;(supabase.select as jest.Mock).mockResolvedValueOnce({
        count: 5,
        error: null,
      })

      const result = await countBrands()

      expect(result).toBe(5)
      expect(supabase.from).toHaveBeenCalledWith('brands')
      expect(supabase.select).toHaveBeenCalledWith('*', { count: 'exact', head: true })
      expect(supabase.eq).toHaveBeenCalledWith('is_active', true)
    })

    it('returns 0 when no brands exist', async () => {
      ;(supabase.select as jest.Mock).mockResolvedValueOnce({
        count: 0,
        error: null,
      })

      const result = await countBrands()

      expect(result).toBe(0)
    })
  })
}) 