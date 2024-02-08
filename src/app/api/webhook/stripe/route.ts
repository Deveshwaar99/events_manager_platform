import { createOrder } from '@/lib/database/actions/order.actions'
import { NextRequest, NextResponse } from 'next/server'
import stripe from 'stripe'

export async function POST(request: Request) {
  const body = await request.json()

  const sig = request.headers.get('stripe-signature') as string
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!
  let event

  try {
    console.log(sig, endpointSecret)
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
    console.log('Event recieved', event)
  } catch (err) {
    console.log('error in catch')
    NextResponse.json({ message: 'Webhook error', error: err }, { status: 400 })
    return
  }

  // Handle the event
  console.log('A')
  switch (event?.type) {
    case 'checkout.session.completed':
      const { id, amount_total, metadata } = event.data.object
      console.log('B')
      const order = {
        stripeId: id,
        eventId: metadata?.eventId || '',
        buyerId: metadata?.buyerId || '',
        totalAmount: amount_total ? (amount_total / 100).toString() : '0',
        createdAt: new Date(),
      }
      console.log('C')
      const newOrder = await createOrder(order)
      return NextResponse.json({ message: 'OK', order: newOrder })
      break
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ message: '' }, { status: 200 })
}
