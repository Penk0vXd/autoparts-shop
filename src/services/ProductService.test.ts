import { 
  getProducts, 
  getProductBySlug, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getBrands,
  getCategories 
} from './productService'
import { supabase, supabaseAdmin } from '@/lib/db'

// Mock the database clients
jest.mock('@/lib/db', () => ({
  supabase: {
    from: jest.fn(),
  },
  supabaseAdmin: {
    from: jest.fn(),
    auth: {
      admin: {
        getUserById: jest.fn(),
      },
    },
  },
  handleDbError: jest.fn((error, operation) => {
    throw new Error(`Database operation failed: ${operation}`)
  }),
}))

const mockSupabase = supabase as jest.Mocked<typeof supabase>
const mockSupabaseAdmin = supabaseAdmin as jest.Mocked<typeof supabaseAdmin>

describe('ProductService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getProducts', () => {
    it('should fetch products with default pagination', async () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Test Product',
          slug: 'test-product',
          price: 29.99,
          stock: 10,
          brand: { name: 'Test Brand' },
          category: { name: 'Test Category' },
        },
      ]

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        range: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: mockProducts,
          error: null,
          count: 1,
        }),
      }

      mockSupabase.from.mockReturnValue(mockQuery as any)

      const result = await getProducts()

      expect(mockSupabase.from).toHaveBeenCalledWith('products')
      expect(mockQuery.select).toHaveBeenCalledWith(
        expect.stringContaining('brand:brands(*)')
      )
      expect(result.products).toEqual(mockProducts)
      expect(result.total).toBe(1)
      expect(result.page).toBe(1)
      expect(result.totalPages).toBe(1)
    })

    it('should apply filters correctly', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        lte: jest.fn().mockReturnThis(),
        gt: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        range: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: [],
          error: null,
          count: 0,
        }),
      }

      mockSupabase.from.mockReturnValue(mockQuery as any)

      const filters = {
        category: 'test-category',
        brand: 'test-brand',
        minPrice: 10,
        maxPrice: 100,
        inStock: true,
        featured: true,
        search: 'test search',
      }

      await getProducts(filters)

      expect(mockQuery.eq).toHaveBeenCalledWith('categories.slug', 'test-category')
      expect(mockQuery.eq).toHaveBeenCalledWith('brands.slug', 'test-brand')
      expect(mockQuery.gte).toHaveBeenCalledWith('price', 10)
      expect(mockQuery.lte).toHaveBeenCalledWith('price', 100)
      expect(mockQuery.gt).toHaveBeenCalledWith('stock', 0)
      expect(mockQuery.eq).toHaveBeenCalledWith('is_featured', true)
      expect(mockQuery.or).toHaveBeenCalledWith(
        'name.ilike.%test search%, description.ilike.%test search%'
      )
    })
  })

  describe('getProductBySlug', () => {
    it('should fetch product by slug', async () => {
      const mockProduct = {
        id: '1',
        name: 'Test Product',
        slug: 'test-product',
        price: 29.99,
        brand: { name: 'Test Brand' },
        category: { name: 'Test Category' },
      }

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockProduct,
          error: null,
        }),
      }

      mockSupabase.from.mockReturnValue(mockQuery as any)

      const result = await getProductBySlug('test-product')

      expect(mockSupabase.from).toHaveBeenCalledWith('products')
      expect(mockQuery.eq).toHaveBeenCalledWith('slug', 'test-product')
      expect(result).toEqual(mockProduct)
    })

    it('should return null for non-existent product', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST116' },
        }),
      }

      mockSupabase.from.mockReturnValue(mockQuery as any)

      const result = await getProductBySlug('non-existent')

      expect(result).toBeNull()
    })
  })

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const productData = {
        name: 'New Product',
        slug: 'new-product',
        sku: 'NP-001',
        price: 49.99,
      }

      const mockCreatedProduct = {
        id: '1',
        ...productData,
      }

      const mockQuery = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockCreatedProduct,
          error: null,
        }),
      }

      mockSupabaseAdmin.from.mockReturnValue(mockQuery as any)

      const result = await createProduct(productData)

      expect(mockSupabaseAdmin.from).toHaveBeenCalledWith('products')
      expect(mockQuery.insert).toHaveBeenCalledWith(productData)
      expect(result).toEqual(mockCreatedProduct)
    })
  })

  describe('updateProduct', () => {
    it('should update an existing product', async () => {
      const updateData = {
        name: 'Updated Product',
        price: 59.99,
      }

      const mockUpdatedProduct = {
        id: '1',
        ...updateData,
      }

      const mockQuery = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockUpdatedProduct,
          error: null,
        }),
      }

      mockSupabaseAdmin.from.mockReturnValue(mockQuery as any)

      const result = await updateProduct('1', updateData)

      expect(mockSupabaseAdmin.from).toHaveBeenCalledWith('products')
      expect(mockQuery.update).toHaveBeenCalledWith(
        expect.objectContaining(updateData)
      )
      expect(mockQuery.eq).toHaveBeenCalledWith('id', '1')
      expect(result).toEqual(mockUpdatedProduct)
    })
  })

  describe('deleteProduct', () => {
    it('should soft delete a product', async () => {
      const mockQuery = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          error: null,
        }),
      }

      mockSupabaseAdmin.from.mockReturnValue(mockQuery as any)

      await deleteProduct('1')

      expect(mockSupabaseAdmin.from).toHaveBeenCalledWith('products')
      expect(mockQuery.update).toHaveBeenCalledWith(
        expect.objectContaining({
          is_deleted: true,
          is_active: false,
        })
      )
      expect(mockQuery.eq).toHaveBeenCalledWith('id', '1')
    })
  })

  describe('getBrands', () => {
    it('should fetch all active brands', async () => {
      const mockBrands = [
        { id: '1', name: 'Brand 1', slug: 'brand-1' },
        { id: '2', name: 'Brand 2', slug: 'brand-2' },
      ]

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: mockBrands,
          error: null,
        }),
      }

      mockSupabase.from.mockReturnValue(mockQuery as any)

      const result = await getBrands()

      expect(mockSupabase.from).toHaveBeenCalledWith('brands')
      expect(mockQuery.eq).toHaveBeenCalledWith('is_active', true)
      expect(mockQuery.order).toHaveBeenCalledWith('name')
      expect(result).toEqual(mockBrands)
    })
  })

  describe('getCategories', () => {
    it('should fetch all active categories', async () => {
      const mockCategories = [
        { id: '1', name: 'Category 1', slug: 'category-1' },
        { id: '2', name: 'Category 2', slug: 'category-2' },
      ]

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: mockCategories,
          error: null,
        }),
      }

      mockSupabase.from.mockReturnValue(mockQuery as any)

      const result = await getCategories()

      expect(mockSupabase.from).toHaveBeenCalledWith('categories')
      expect(mockQuery.eq).toHaveBeenCalledWith('is_active', true)
      expect(mockQuery.order).toHaveBeenCalledWith('name')
      expect(result).toEqual(mockCategories)
    })
  })
}) 