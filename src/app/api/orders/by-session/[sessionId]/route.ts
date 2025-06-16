import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import { requireServerAuth } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    // Require authentication
    const user = await requireServerAuth()

    // Get order by session ID
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .eq('stripe_session_id', params.sessionId)
      .single()

    if (error) throw error

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Get order by session API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
} 