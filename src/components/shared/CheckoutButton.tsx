'use client'
import { IEvent } from '@/lib/database/models/events.models'
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs'
import { Button } from '../ui/button'
import Link from 'next/link'
import Checkout from './Checkout'

function CheckoutButton({ event }: { event: IEvent }) {
  const isClosedEvent = new Date(event.endDateTime) < new Date(event.startDateTime)

  const { user } = useUser()
  const userId = user?.publicMetadata.userId as string
  return (
    <>
      <div className="flex items-center gap-3">
        {isClosedEvent ? (
          <p className="p-2 text-red-400 ">Sorry, tickets are no longer available</p>
        ) : (
          <>
            <SignedOut>
              <Button asChild className="rounded-full button" size="lg">
                <Link href="/sign-in">Get tickets</Link>
              </Button>
            </SignedOut>

            <SignedIn>
              <Checkout userId={userId} event={event} />
            </SignedIn>
          </>
        )}
      </div>
    </>
  )
}

export default CheckoutButton
