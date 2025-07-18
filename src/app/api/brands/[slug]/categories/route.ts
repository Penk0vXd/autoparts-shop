import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { BrandCategoryBreakdown, CategoryWithIcon, CATEGORY_ICONS } from '@/types/brand-detail';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // First, get the brand
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

    // Get products with categories
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        id,
        price,
        stock,
        categories:category_id (
          id,
          name,
          slug,
          description
        )
      `)
      .eq('brand_id', brand.id)
      .eq('is_active', true)
      .eq('is_deleted', false)
      .not('category_id', 'is', null);

    if (productsError) {
      console.error('Products query error:', productsError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to fetch products' 
        },
        { status: 500 }
      );
    }

    // Group products by category and calculate statistics
    const categoryMap = new Map<string, {
      category: any;
      products: any[];
    }>();

    (products || []).forEach(product => {
      const category = product.categories as any;
      if (!category) {
        return;
      }

      const categoryId = category.id;
      if (!categoryMap.has(categoryId)) {
        categoryMap.set(categoryId, {
          category,
          products: []
        });
      }
      categoryMap.get(categoryId)!.products.push(product);
    });

    // Convert to CategoryWithIcon format
    const categoriesWithIcons: CategoryWithIcon[] = Array.from(categoryMap.values())
      .map((item, index) => {
        const { category, products } = item;
        const prices = products.map(p => p.price).filter(Boolean);
        const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
        const inStockCount = products.filter(p => (p.stock || 0) > 0).length;

        return {
          brand_id: brand.id,
          brand_name: brand.name,
          brand_slug: brand.slug,
          category_id: category.id,
          category_name: category.name,
          category_slug: category.slug,
          category_description: category.description,
          product_count: products.length,
          avg_price: prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0,
          min_price: prices.length > 0 ? Math.min(...prices) : 0,
          max_price: prices.length > 0 ? Math.max(...prices) : 0,
          total_stock: totalStock,
          in_stock_count: inStockCount,
          icon: CATEGORY_ICONS[category.slug] || '📦',
          order: index + 1
        };
      })
      .sort((a, b) => b.product_count - a.product_count); // Sort by product count descending

    return NextResponse.json({
      success: true,
      data: categoriesWithIcons,
      meta: {
        total_categories: categoriesWithIcons.length,
        total_products: categoriesWithIcons.reduce((sum, cat) => sum + cat.product_count, 0),
        generated_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Brand categories API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
} 