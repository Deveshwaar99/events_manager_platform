import EventForm from '@/components/shared/EventForm'
import { fetchEventbyId } from '@/lib/database/actions/events.actions'
import { IEvent } from '@/lib/database/models/events.models'
import { auth } from '@clerk/nextjs'

export default async function UpdateEvent(context: { params: { id: string } }) {
  const { params } = context
  const eventId = params.id as string

  const { sessionClaims } = auth()
  const userId = sessionClaims?.userId as string

  const event: IEvent = await fetchEventbyId(eventId)

  return (
    <>
      <section className="bg-dotted-pattern bg-primary-50 bg-cover bg-center py-5 md:py-10">
        <h3 className="text-left md:text-center h3-bold wrapper">Create Event</h3>
      </section>
      <div className="my-8 wrapper">
        <EventForm userId={userId} eventId={eventId} event={event} type="update" />
      </div>
    </>
  )
}
