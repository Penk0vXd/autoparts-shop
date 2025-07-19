import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import type { VehicleEngine, VehicleEngineResponse } from '@/types/vehicle-filter';

export const dynamic = 'force-dynamic'

/**
 * GET /api/vehicle-filter/engines?yearId=uuid
 * 
 * Fetch vehicle engines filtered by year ID
 * Returns engines sorted by horsepower (descending)
 */
export async function GET(request: Request): Promise<NextResponse<VehicleEngineResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const yearId = searchParams.get('yearId');

    if (!yearId) {
      return NextResponse.json(
        { 
          success: false,
          data: [],
          count: 0,
          error: 'Year ID is required' 
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('vehicle_engines')
      .select(`
        *,
        year:vehicle_years(
          *,
          model:vehicle_models(
            *,
            brand:vehicle_brands(*)
          )
        )
      `)
      .eq('year_id', yearId)
      .eq('is_active', true)
      .order('horsepower', { ascending: false })
      .order('fuel_type', { ascending: true })
      .order('engine_name', { ascending: true });

    if (error) {
      console.error('Error fetching vehicle engines:', error);
      return NextResponse.json(
        { 
          success: false,
          data: [],
          count: 0,
          error: 'Failed to fetch vehicle engines' 
        },
        { status: 500 }
      );
    }

    const engines: VehicleEngine[] = data || [];

    return NextResponse.json(
      {
        success: true,
        data: engines,
        count: engines.length,
        yearId
      },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=300', // 5 minutes cache
        }
      }
    );
  } catch (error) {
    console.error('Unexpected error in engines API:', error);
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