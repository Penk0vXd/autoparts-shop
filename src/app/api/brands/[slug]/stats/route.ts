import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { BrandStatistics } from '@/types/brand-detail';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // First, get the brand basic info
    const { data: brand, error: brandError } = await supabase
      .from('brands')
      .select('*')
      .eq('slug', slug)
      .single();

    if (brandError || !brand) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Brand not found' 
        },
        { status: 404 }
      );
    }

    // Get product statistics
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, price, stock, is_featured, category_id')
      .eq('brand_id', brand.id)
      .eq('is_active', true)
      .eq('is_deleted', false);

    if (productsError) {
      console.error('Products query error:', productsError);
    }

    // Get category count
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id')
      .in('id', products?.map(p => p.category_id).filter(Boolean) || []);

    if (categoriesError) {
      console.error('Categories query error:', categoriesError);
    }

    // Calculate statistics
    const productList = products || [];
    const categoryList = categories || [];
    
    const prices = productList.map(p => p.price).filter(Boolean);
    const totalStock = productList.reduce((sum, p) => sum + (p.stock || 0), 0);
    const inStockProducts = productList.filter(p => (p.stock || 0) > 0).length;
    const featuredProducts = productList.filter(p => p.is_featured).length;

    // Create brand statistics with fallback data
    const brandStats: BrandStatistics = {
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      logo_url: brand.logo_url,
      country: (brand as any).country || 'Unknown',
      founded_year: (brand as any).founded_year || 1900,
      is_premium: (brand as any).is_premium || false,
      website_url: (brand as any).website_url || null,
      sort_order: (brand as any).sort_order || 0,
      total_products: productList.length,
      total_categories: categoryList.length,
      avg_price: prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0,
      min_price: prices.length > 0 ? Math.min(...prices) : 0,
      max_price: prices.length > 0 ? Math.max(...prices) : 0,
      total_stock: totalStock,
      in_stock_products: inStockProducts,
      featured_products: featuredProducts
    };

    return NextResponse.json({
      success: true,
      data: brandStats,
      meta: {
        generated_at: new Date().toISOString(),
        cache_duration: '2 minutes'
      }
    });

  } catch (error) {
    console.error('Brand stats API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
} 