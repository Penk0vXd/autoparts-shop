import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const yearId = searchParams.get('yearId');

    if (!yearId) {
      return NextResponse.json(
        { error: 'Year ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('vehicle_engines')
      .select('*')
      .eq('year_id', yearId)
      .eq('is_active', true)
      .order('horsepower', { ascending: false });

    if (error) {
      console.error('Error fetching vehicle engines:', error);
      return NextResponse.json(
        { error: 'Failed to fetch vehicle engines' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0,
      yearId
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 