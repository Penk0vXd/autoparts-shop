import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/db'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('STRIPE_WEBHOOK_SECRET is not set')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
})

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return new NextResponse(
        JSON.stringify({ error: 'No signature' }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        // Update order status
        const { error: orderError } = await supabase
          .from('orders')
          .update({ status: 'paid' })
          .eq('id', session.metadata?.order_id)

        if (orderError) throw orderError

        // Get order items
        const { data: orderItems, error: itemsError } = await supabase
          .from('order_items')
          .select('product_id, quantity')
          .eq('order_id', session.metadata?.order_id)

        if (itemsError) throw itemsError

        // Update product stock
        for (const item of orderItems) {
          const { error: stockError } = await supabase.rpc(
            'decrement_product_stock',
            {
              p_product_id: item.product_id,
              p_quantity: item.quantity
            }
          )

          if (stockError) throw stockError
        }

        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        
        // Update order status
        const { error: orderError } = await supabase
          .from('orders')
          .update({ status: 'expired' })
          .eq('id', session.metadata?.order_id)

        if (orderError) throw orderError
        break
      }
    }

    return new NextResponse(
      JSON.stringify({ received: true }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    console.error('Webhook error:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Webhook handler failed' }),
      { 
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
} 