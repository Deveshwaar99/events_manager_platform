import EventsCollection from '@/components/shared/EventsCollection'
import { Button } from '@/components/ui/button'
import { fetchEventByOrganizer } from '@/lib/database/actions/events.actions'
import { fetchOrdersByUser } from '@/lib/database/actions/order.actions'
import { IOrder } from '@/lib/database/models/order.models'
import { auth, useAuth } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

export type ProfilePageParams = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

async function ProfilePage({ params, searchParams }: ProfilePageParams) {
  const { sessionClaims } = auth()
  const userId = sessionClaims?.userId as string

  const ordersPage = Number(searchParams?.ordersPage) || 1
  const eventsPage = Number(searchParams?.eventsPage) || 1

  //ordered Events
  const orders = await fetchOrdersByUser({ userId, page: ordersPage, limit: 3 })
  const orderedEvents = orders?.data.length ? orders.data.map((item: IOrder) => item.eventId) : []

  //Organized events
  const organizedEvents = await fetchEventByOrganizer({ userId, page: ordersPage, limit: 6 })

  return (
    <>
      <section className="bg-dotted-pattern bg-primary-50 bg-cover bg-center py-1 md:py-2 ">
        <div className="flex items-center justify-center sm:justify-between wrapper">
          <h3 className="text-center sm:text-left h3-bold">My Tickets</h3>
          <Button asChild size="lg" className="sm:flex button hidden">
            <Link href="/#events">Explore More Events</Link>
          </Button>
        </div>
      </section>

      <section className="my-4 wrapper">
        <EventsCollection
          data={orderedEvents}
          emptyTitle="No event tickets purchased yet"
          emptyStateSubtext="No worries - plenty of exciting events to explore!"
          collectionType="My_Tickets"
          limit={3}
          page={ordersPage}
          urlParamName="ordersPage"
          totalPages={orderedEvents?.totalPages}
        />
      </section>
      {/* Events Organized */}
      <section className="bg-dotted-pattern bg-primary-50 bg-cover bg-center py-1 md:py-2">
        <div className="flex items-center justify-center sm:justify-between wrapper">
          <h3 className="text-center sm:text-left h3-bold">Events Organized</h3>
          <Button asChild size="lg" className="sm:flex button hidden">
            <Link href="/events/create">Create New Event</Link>
          </Button>
        </div>
      </section>

      <section className="my-8 wrapper">
        <EventsCollection
          data={organizedEvents?.data}
          emptyTitle="No events have been created yet"
          emptyStateSubtext="Go create some now"
          collectionType="Events_Organized"
          limit={3}
          page={eventsPage}
          urlParamName="eventsPage"
          totalPages={organizedEvents?.totalPages}
        />
      </section>
    </>
  )
}

export default ProfilePage
