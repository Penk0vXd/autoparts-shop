import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const modelId = searchParams.get('modelId');

    if (!modelId) {
      return NextResponse.json(
        { error: 'Model ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('vehicle_years')
      .select('*')
      .eq('model_id', modelId)
      .eq('is_active', true)
      .order('year', { ascending: false });

    if (error) {
      console.error('Error fetching vehicle years:', error);
      return NextResponse.json(
        { error: 'Failed to fetch vehicle years' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0,
      modelId
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 