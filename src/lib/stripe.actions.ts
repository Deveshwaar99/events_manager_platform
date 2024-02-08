'use server'

import Stripe from 'stripe'
import { handleError } from './utils'
import { redirect } from 'next/navigation'
import { error } from 'console'

type CheckoutOrderParams = {
  buyerId: string
  eventId: string
  eventTitle: string
  price: string
  isFree: boolean
}

export async function checkoutOrder(order: CheckoutOrderParams) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  const price = order.isFree ? 0 : Number(order.price) * 100

  try {
    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: price,
            product_data: {
              name: order.eventTitle,
            },
          },
          quantity: 1,
        },
      ],
      metadata: { eventId: order.eventId, buyerId: order.buyerId },
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
    })

    redirect(session.url!)
  } catch (error) {
    throw error
  }
}
