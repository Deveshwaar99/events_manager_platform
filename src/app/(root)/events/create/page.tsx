import EventForm from '@/components/shared/EventForm'
import { auth, useUser } from '@clerk/nextjs'
import { clerkClient } from '@clerk/nextjs/server'
export default async function CreateEvent() {
  // const { userId: clerkId } = auth()
  // const user = await clerkClient.users.getUser(clerkId ?? '')
  const { sessionClaims } = auth()
  const userId = sessionClaims?.userId as string

  return (
    <>
      <section className="py-5 bg-center bg-cover bg-primary-50 bg-dotted-pattern md:py-10">
        <h3 className="text-left wrapper h3-bold md:text-center">Create Event</h3>
      </section>
      <div className="my-8 wrapper">
        <EventForm userId={userId} type="create" />
      </div>
    </>
  )
}
