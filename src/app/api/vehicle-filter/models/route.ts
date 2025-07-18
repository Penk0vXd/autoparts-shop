import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import type { VehicleModel, VehicleModelResponse } from '@/types/vehicle-filter';

/**
 * GET /api/vehicle-filter/models?brandId=uuid
 * 
 * Fetch vehicle models filtered by brand ID
 * Returns models sorted by year start (newest first)
 */
export async function GET(request: Request): Promise<NextResponse<VehicleModelResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brandId');

    if (!brandId) {
      return NextResponse.json(
        { 
          success: false,
          data: [],
          count: 0,
          error: 'Brand ID is required' 
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('vehicle_models')
      .select(`
        *,
        brand:vehicle_brands(*)
      `)
      .eq('brand_id', brandId)
      .eq('is_active', true)
      .order('year_start', { ascending: false })
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching vehicle models:', error);
      return NextResponse.json(
        { 
          success: false,
          data: [],
          count: 0,
          error: 'Failed to fetch vehicle models' 
        },
        { status: 500 }
      );
    }

    const models: VehicleModel[] = data || [];

    return NextResponse.json(
      {
        success: true,
        data: models,
        count: models.length,
        brandId
      },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=300', // 5 minutes cache
        }
      }
    );
  } catch (error) {
    console.error('Unexpected error in models API:', error);
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