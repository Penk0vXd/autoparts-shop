'use server'

import { redirect } from 'next/navigation'
import { stripe } from '@/lib/stripe'
import type { DeliveryInfo, PaymentInfo, OrderSummary } from '@/store/cartStore'

interface CheckoutItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface CheckoutSessionData {
  items: CheckoutItem[]
  deliveryInfo: DeliveryInfo
  paymentInfo: PaymentInfo
  summary: OrderSummary
}

export async function createCheckoutSession(data: CheckoutSessionData) {
  const { items, deliveryInfo, paymentInfo, summary } = data

  // Ensure we have a proper base URL with scheme
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.startsWith('http') 
    ? process.env.NEXT_PUBLIC_SITE_URL 
    : `http://localhost:3000`

  try {
    // Create line items for Stripe
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'bgn',
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // Convert to stotinki
      },
      quantity: item.quantity,
    }))

    // Add delivery fee if applicable
    if (summary.deliveryFee > 0) {
      lineItems.push({
        price_data: {
          currency: 'bgn',
          product_data: {
            name: 'Доставка',
            images: [],
          },
          unit_amount: Math.round(summary.deliveryFee * 100),
        },
        quantity: 1,
      })
    }

    // Create discount coupon if applicable
    let discounts = undefined
    if (summary.discount > 0) {
      const coupon = await stripe.coupons.create({
        amount_off: Math.round(summary.discount * 100),
        currency: 'bgn',
        duration: 'once',
      })
      
      discounts = [{ coupon: coupon.id }]
    }

    // Determine payment method types based on selection
    const paymentMethodTypes: string[] = []
    switch (paymentInfo.method) {
      case 'card':
        paymentMethodTypes.push('card')
        break
      case 'digital':
        paymentMethodTypes.push('card') // Stripe handles Apple/Google Pay via card
        break
      case 'cash':
        // For cash on delivery, we still create a session but with special handling
        paymentMethodTypes.push('card')
        break
    }

    // Create customer address if provided
    let shippingAddressCollection = undefined
    let customerAddress = undefined

    if (deliveryInfo.method === 'address' && deliveryInfo.address) {
      shippingAddressCollection = {
        allowed_countries: ['BG' as const],
      }
      
      customerAddress = {
        line1: deliveryInfo.address.street,
        city: deliveryInfo.address.city,
        postal_code: deliveryInfo.address.postalCode,
        country: 'BG',
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: paymentMethodTypes as any,
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
      shipping_address_collection: shippingAddressCollection as any,
      billing_address_collection: 'required',
      discounts,
      metadata: {
        delivery_method: deliveryInfo.method,
        payment_method: paymentInfo.method,
        delivery_address: deliveryInfo.method === 'address' 
          ? JSON.stringify(deliveryInfo.address)
          : '',
        office_info: deliveryInfo.method === 'office'
          ? JSON.stringify(deliveryInfo.office)
          : '',
      },
      phone_number_collection: {
        enabled: true,
      },
    })

    return { url: session.url }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw new Error('Failed to create checkout session')
  }
} 