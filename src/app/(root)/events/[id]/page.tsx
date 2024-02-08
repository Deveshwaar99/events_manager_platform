import {
  fetchAllEvents,
  fetchEventbyId,
  getRelatedEventsByCategory,
} from '@/lib/database/actions/events.actions'
import Image from 'next/image'
import calendarImg from '../../../../../public/assets/icons/calendar.svg'
import locationImg from '../../../../../public/assets/icons/location.svg'

//test

import { formatDateTime } from '@/lib/utils'
import { IEvent } from '@/lib/database/models/events.models'
import EventsCollection from '@/components/shared/EventsCollection'
import CheckoutButton from '@/components/shared/CheckoutButton'

type SearchParamProps = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function EventDetails(context: SearchParamProps) {
  const eventId = context.params.id
  const page = Number(context.searchParams.page) | 1

  const event = await fetchEventbyId(eventId)
  const relatedEvents = await getRelatedEventsByCategory({
    categoryId: event.category._id,
    eventId: event._id,
    page,
    limit: 3,
  })

  return (
    <>
      <section className="flex justify-center bg-dotted-pattern bg-primary-50 bg-contain">
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl wrapper">
          <Image
            src={event.imageUrl}
            alt="hero image"
            width={1000}
            height={1000}
            className="h-3/4 min-h-[300px] object-center object-cover"
          />

          <div className="flex flex-col gap-8 p-5 md:p-10 w-full">
            <div className="flex flex-col gap-6">
              <h2 className="h2-bold">{event.title}</h2>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex gap-3">
                  <p className="bg-green-500/10 px-5 py-2 p-bold-20 rounded-full text-green-700">
                    {event.isFree ? 'FREE' : `$${event.price}`}
                  </p>
                  <p className="bg-grey-500/10 p-medium-16 px-4 py-2.5 rounded-full text-grey-500">
                    {event.category.name}
                  </p>
                </div>

                <p className="p-medium-18 mt-2 sm:mt-0 ml-2">
                  by{' '}
                  <span className="text-primary-500">
                    {event.organizer.firstName} {event.organizer.lastName}
                  </span>
                </p>
              </div>
            </div>

            <CheckoutButton event={event} />

            <div className="flex flex-col gap-5">
              <div className="flex gap-2 md:gap-3">
                <Image src="/assets/icons/calendar.svg" alt="calendar" width={32} height={32} />
                <div className="flex flex-wrap items-center p-medium-16 lg:p-regular-20">
                  <p>
                    {formatDateTime(event.startDateTime).dateOnly} -{' '}
                    {formatDateTime(event.startDateTime).timeOnly}
                  </p>
                  <p>
                    {formatDateTime(event.endDateTime).dateOnly} -{' '}
                    {formatDateTime(event.endDateTime).timeOnly}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-regular-20">
                <Image src="/assets/icons/location.svg" alt="location" width={32} height={32} />
                <p className="p-medium-16 lg:p-regular-20">{event.location}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="p-bold-20 text-grey-600 ">What to expect:</p>
              <p className="p-medium-16 lg:p-regular-18">{event.description}</p>
              <p className="p-medium-16 lg:p-regular-18 text-primary-500 truncate underline">
                {event.url}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related EVENTS */}
      <section className="flex flex-col gap-8 md:gap-12 my-8 wrapper">
        <h2 className="h2-bold">Related Events</h2>

        <EventsCollection
          data={relatedEvents?.data}
          emptyTitle="No Events Found"
          emptyStateSubtext="Come back later"
          collectionType="All_Events"
          limit={3}
          page={page}
          totalPages={relatedEvents?.totalPages}
        />
      </section>
    </>
  )
}
