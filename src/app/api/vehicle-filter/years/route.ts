import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import type { VehicleYear, VehicleYearResponse } from '@/types/vehicle-filter';

export const dynamic = 'force-dynamic'

/**
 * GET /api/vehicle-filter/years?modelId=uuid
 * 
 * Fetch vehicle years filtered by model ID
 * Returns years sorted in descending order (newest first)
 */
export async function GET(request: Request): Promise<NextResponse<VehicleYearResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const modelId = searchParams.get('modelId');

    if (!modelId) {
      return NextResponse.json(
        { 
          success: false,
          data: [],
          count: 0,
          error: 'Model ID is required' 
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('vehicle_years')
      .select(`
        *,
        model:vehicle_models(
          *,
          brand:vehicle_brands(*)
        )
      `)
      .eq('model_id', modelId)
      .eq('is_active', true)
      .order('year', { ascending: false });

    if (error) {
      console.error('Error fetching vehicle years:', error);
      return NextResponse.json(
        { 
          success: false,
          data: [],
          count: 0,
          error: 'Failed to fetch vehicle years' 
        },
        { status: 500 }
      );
    }

    const years: VehicleYear[] = data || [];

    return NextResponse.json(
      {
        success: true,
        data: years,
        count: years.length,
        modelId
      },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=300', // 5 minutes cache
        }
      }
    );
  } catch (error) {
    console.error('Unexpected error in years API:', error);
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