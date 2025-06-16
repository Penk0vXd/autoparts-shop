'use server'

import { redirect } from 'next/navigation'
import Stripe from 'stripe'
import { supabase } from '@/lib/db'
import { requireServerAuth } from '@/lib/auth'
import type { CartItem } from '@/store/cartStore'
import type { CheckoutForm } from '@/store/checkoutStore'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
})

export async function createCheckoutSession(data: {
  items: CartItem[]
} & CheckoutForm) {
  try {
    // Require authentication
    const user = await requireServerAuth()

    // Start a transaction
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        status: 'pending',
        shipping_details: data.shipping,
        billing_details: data.billing,
        total: data.items.reduce((sum, item) => sum + (item.price * item.qty), 0)
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Create order items
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(
        data.items.map(item => ({
          order_id: order.id,
          product_id: item.id,
          quantity: item.qty,
          price: item.price
        }))
      )

    if (itemsError) throw itemsError

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: data.items.map(item => ({
        price_data: {
          currency: 'bgn',
          product_data: {
            name: item.name,
            images: [item.image_url]
          },
          unit_amount: Math.round(item.price * 100)
        },
        quantity: item.qty
      })),
      customer_email: data.shipping.email,
      metadata: {
        order_id: order.id
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`
    })

    return session.url
  } catch (error) {
    console.error('Checkout session error:', error)
    throw new Error('Failed to create checkout session')
  }
} 