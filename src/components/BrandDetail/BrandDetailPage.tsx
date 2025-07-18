'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRightIcon, 
  StarIcon, 
  ShieldCheckIcon,
  GlobeAltIcon,
  CalendarIcon,
  ChartBarIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { 
  BrandStatistics, 
  CategoryWithIcon, 
  BrandProduct, 
  BrandDetailFilters,
  COUNTRY_FLAGS,
  formatPrice,
  formatProductCount,
  getBrandAge,
  getAvailabilityText,
  getAvailabilityColor
} from '@/types/brand-detail';
import { SafeImage } from '@/components/ui/SafeImage';
import { ProductCard } from '@/components/ProductCard';
import Link from 'next/link';

interface BrandDetailPageProps {
  brandSlug: string;
  initialData?: {
    brand: BrandStatistics;
    categories: CategoryWithIcon[];
    products: BrandProduct[];
  };
}

export function BrandDetailPage({ brandSlug, initialData }: BrandDetailPageProps) {
  // State Management
  const [brand, setBrand] = useState<BrandStatistics | null>(initialData?.brand || null);
  const [categories, setCategories] = useState<CategoryWithIcon[]>(initialData?.categories || []);
  const [products, setProducts] = useState<BrandProduct[]>(initialData?.products || []);
  const [loading, setLoading] = useState(!initialData);
  const [productsLoading, setProductsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter State
  const [filters, setFilters] = useState<BrandDetailFilters>({
    sortBy: 'name',
    page: 1,
    limit: 24
  });

  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 24,
    total: 0,
    totalPages: 0
  });

  // Fetch initial data
  useEffect(() => {
    if (!initialData) {
      fetchBrandData();
    }
  }, [brandSlug, initialData]);

  // Fetch products when filters change
  useEffect(() => {
    if (brand) {
      fetchProducts();
    }
  }, [filters, brand]);

  const fetchBrandData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch brand statistics and categories in parallel
      const [statsResponse, categoriesResponse] = await Promise.all([
        fetch(`/api/brands/${brandSlug}/stats`),
        fetch(`/api/brands/${brandSlug}/categories`)
      ]);

      if (!statsResponse.ok || !categoriesResponse.ok) {
        throw new Error('Failed to fetch brand data');
      }

      const [statsData, categoriesData] = await Promise.all([
        statsResponse.json(),
        categoriesResponse.json()
      ]);

      if (statsData.success && categoriesData.success) {
        setBrand(statsData.data);
        setCategories(categoriesData.data);
      } else {
        throw new Error('Invalid response data');
      }
    } catch (err) {
      console.error('Error fetching brand data:', err);
      setError('Failed to load brand information');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/brands/${brandSlug}/products?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.data);
        setPagination(data.pagination);
      } else {
        throw new Error(data.error || 'Failed to fetch products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    } finally {
      setProductsLoading(false);
    }
  };

  const handleCategoryFilter = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setFilters(prev => ({
      ...prev,
      category: categorySlug || undefined,
      page: 1
    }));
  };

  const handleFilterChange = (newFilters: Partial<BrandDetailFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  if (loading) {
    return <BrandDetailSkeleton />;
  }

  if (error || !brand) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Грешка при зареждането</h2>
          <p className="text-gray-600">{error || 'Марката не е намерена'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO and Meta */}
      <div className="sr-only">
        <h1>{brand.name} Car Parts Online</h1>
        <meta name="description" content={`Buy ${brand.name} Parts — Over ${formatProductCount(brand.total_products)} Genuine & Aftermarket Auto Parts`} />
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Начало
            </Link>
            <ChevronRightIcon className="h-4 w-4 text-gray-400" />
            <Link href="/brands" className="text-gray-500 hover:text-gray-700">
              Марки
            </Link>
            <ChevronRightIcon className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900 font-medium">{brand.name}</span>
          </nav>
        </div>
      </div>

      {/* Brand Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            
            {/* Brand Logo & Info */}
            <div className="flex items-center space-x-6 mb-6 lg:mb-0">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-white rounded-lg shadow-md flex items-center justify-center p-4">
                  <SafeImage
                    src={brand.logo_url || '/images/default-brand-logo.png'}
                    alt={`${brand.name} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{brand.name}</h1>
                  {brand.is_premium && (
                    <PremiumBadge />
                  )}
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <GlobeAltIcon className="h-4 w-4" />
                    <span>{COUNTRY_FLAGS[brand.country]} {brand.country}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span>Since {brand.founded_year}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ChartBarIcon className="h-4 w-4" />
                    <span>{getBrandAge(brand.founded_year)} years</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row sm:space-x-8 space-y-4 sm:space-y-0">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formatProductCount(brand.total_products)}
                </div>
                <div className="text-sm text-gray-600">Parts Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {brand.total_categories}
                </div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {formatPrice(brand.avg_price)}
                </div>
                <div className="text-sm text-gray-600">Avg Price</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
          
          {/* Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* All Categories Card */}
            <motion.div
              whileHover={{ y: -4 }}
              onClick={() => handleCategoryFilter('')}
              className={`cursor-pointer rounded-lg p-6 transition-all duration-200 ${
                selectedCategory === '' 
                  ? 'bg-blue-50 border-2 border-blue-200 shadow-md' 
                  : 'bg-white border border-gray-200 hover:shadow-md'
              }`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="text-2xl">🔍</div>
                <h3 className="font-semibold text-gray-900">All Categories</h3>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-600">
                  {brand.total_products} products
                </div>
                <div className="text-sm text-blue-600">
                  {formatPrice(brand.min_price)} - {formatPrice(brand.max_price)}
                </div>
              </div>
            </motion.div>

            {/* Category Cards */}
            {categories.map((category) => (
              <motion.div
                key={category.category_id}
                whileHover={{ y: -4 }}
                onClick={() => handleCategoryFilter(category.category_slug)}
                className={`cursor-pointer rounded-lg p-6 transition-all duration-200 ${
                  selectedCategory === category.category_slug
                    ? 'bg-blue-50 border-2 border-blue-200 shadow-md'
                    : 'bg-white border border-gray-200 hover:shadow-md'
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="text-2xl">{category.icon}</div>
                  <h3 className="font-semibold text-gray-900">{category.category_name}</h3>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-gray-600">
                    {formatProductCount(category.product_count)} products
                  </div>
                  <div className="text-sm text-blue-600">
                    {formatPrice(category.min_price)} - {formatPrice(category.max_price)}
                  </div>
                  <div className="text-xs text-green-600">
                    {category.in_stock_count} in stock
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search parts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FunnelIcon className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange({ sortBy: e.target.value as any })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-lg border border-gray-200 p-6 mb-6 overflow-hidden"
            >
              <FilterPanel 
                filters={filters} 
                onFilterChange={handleFilterChange}
                brandSlug={brandSlug}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        <div className="space-y-6">
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedCategory ? categories.find(c => c.category_slug === selectedCategory)?.category_name : 'All Products'}
              </h3>
              <p className="text-sm text-gray-600">
                Showing {products.length} of {pagination.total} products
              </p>
            </div>
          </div>

          {/* Products Grid */}
          <div className="relative">
            {productsLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <BrandProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Premium Badge Component with Shimmer Animation
function PremiumBadge() {
  return (
    <div className="relative inline-flex items-center px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold rounded-full overflow-hidden">
      <ShieldCheckIcon className="h-4 w-4 mr-1" />
      <span>Premium</span>
      <div className="absolute inset-0 -top-px bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-shimmer"></div>
    </div>
  );
}

// Brand Product Card Component
function BrandProductCard({ product }: { product: BrandProduct }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      <div className="aspect-square bg-gray-100 relative">
        <SafeImage
          src={product.image_url || '/images/placeholder-product.svg'}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.is_featured && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
            Featured
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
            {product.category_name}
          </span>
          <span className={`text-xs px-2 py-1 rounded ${getAvailabilityColor(product.availability)}`}>
            {getAvailabilityText(product.availability)}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="font-bold text-gray-900">
              {formatPrice(product.price)}
            </div>
            {product.compare_price && (
              <div className="text-sm text-gray-500 line-through">
                {formatPrice(product.compare_price)}
              </div>
            )}
          </div>
          
          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Filter Panel Component
function FilterPanel({ 
  filters, 
  onFilterChange, 
  brandSlug 
}: { 
  filters: BrandDetailFilters; 
  onFilterChange: (filters: Partial<BrandDetailFilters>) => void;
  brandSlug: string;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range
        </label>
        <div className="space-y-2">
          <input
            type="number"
            placeholder="Min price"
            value={filters.priceMin || ''}
            onChange={(e) => onFilterChange({ priceMin: Number(e.target.value) || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="number"
            placeholder="Max price"
            value={filters.priceMax || ''}
            onChange={(e) => onFilterChange({ priceMax: Number(e.target.value) || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Availability */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Availability
        </label>
        <select
          value={filters.availability || ''}
          onChange={(e) => onFilterChange({ availability: e.target.value as any || undefined })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All</option>
          <option value="in_stock">In Stock</option>
          <option value="low_stock">Low Stock</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
      </div>

      {/* Part Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Part Type
        </label>
        <select
          value={filters.partType || ''}
          onChange={(e) => onFilterChange({ partType: e.target.value as any || undefined })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All</option>
          <option value="oem">OEM</option>
          <option value="aftermarket">Aftermarket</option>
        </select>
      </div>

      {/* Clear Filters */}
      <div className="flex items-end">
        <button
          onClick={() => onFilterChange({ 
            priceMin: undefined, 
            priceMax: undefined, 
            availability: undefined, 
            partType: undefined 
          })}
          className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}

// Pagination Component
function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void; 
}) {
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    const startPage = Math.max(1, currentPage - 2);
    return startPage + i;
  }).filter(page => page <= totalPages);

  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-md ${
            page === currentPage
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}

// Loading Skeleton
function BrandDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
            <div className="flex-1 space-y-2">
              <div className="h-8 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-64"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 