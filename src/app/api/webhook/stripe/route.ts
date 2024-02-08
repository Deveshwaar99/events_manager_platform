import { createOrder } from '@/lib/database/actions/order.actions'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_WEBHOOK_SECRET!)

export async function POST(request: Request) {
  const body = await request.json()
  const sig = request.headers.get('stripe-signature') as string
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!
  let event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err) {
    NextResponse.json({ message: 'Webhook error', error: err }, { status: 400 })
    return
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const { id, amount_total, metadata } = event.data.object

      const order = {
        stripeId: id,
        eventId: metadata?.eventId || '',
        buyerId: metadata?.buyerId || '',
        totalAmount: amount_total ? (amount_total / 100).toString() : '0',
        createdAt: new Date(),
      }

      const newOrder = await createOrder(order)
      return NextResponse.json({ message: 'OK', order: newOrder })
      break
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ message: '' }, { status: 200 })
}
