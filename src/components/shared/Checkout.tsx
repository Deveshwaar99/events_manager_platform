import { IEvent } from '@/lib/database/models/events.models'
import { Button } from '../ui/button'

import { loadStripe } from '@stripe/stripe-js'
import { useEffect } from 'react'
import { checkoutOrder } from '@/lib/stripe.actions'

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

type CheckoutProps = {
  userId: string
  event: IEvent
}

function Checkout({ userId, event }: CheckoutProps) {
  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search)
    if (query.get('success')) {
      console.log('Order placed! You will receive an email confirmation.')
    }

    if (query.get('canceled')) {
      console.log('Order canceled -- continue to shop around and checkout when you’re ready.')
    }
  }, [])

  async function handleCheckout() {
    const order = {
      buyerId: userId,
      eventId: event._id,
      eventTitle: event.title,
      isFree: event.isFree,
      price: event.price,
    }

    checkoutOrder(order)
  }

  return (
    <form action={() => handleCheckout()} method="POST">
      <Button type="submit" role="link" size="lg" className="button sm:w-fit">
        {event.isFree ? 'Get ticket' : 'Buy ticket'}
      </Button>
    </form>
  )
}

export default Checkout
