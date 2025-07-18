import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import type { VehicleBrand, VehicleBrandResponse } from '@/types/vehicle-filter';

/**
 * GET /api/vehicle-filter/brands
 * 
 * Fetch all active vehicle brands for the dynamic filtering system
 * Returns brands sorted by premium status and name
 */
export async function GET(): Promise<NextResponse<VehicleBrandResponse>> {
  try {
    const { data, error } = await supabase
      .from('vehicle_brands')
      .select('*')
      .eq('is_active', true)
      .order('is_premium', { ascending: false })
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching vehicle brands:', error);
      return NextResponse.json(
        { 
          success: false,
          data: [],
          count: 0,
          error: 'Failed to fetch vehicle brands' 
        },
        { status: 500 }
      );
    }

    const brands: VehicleBrand[] = data || [];

    return NextResponse.json(
      {
        success: true,
        data: brands,
        count: brands.length
      },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=300', // 5 minutes cache
        }
      }
    );
  } catch (error) {
    console.error('Unexpected error in brands API:', error);
    return NextResponse.json(
      { 
        success: false,
        data: [],
        count: 0,
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
} 