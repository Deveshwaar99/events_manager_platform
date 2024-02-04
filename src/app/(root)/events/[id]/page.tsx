import { fetchEvent } from '@/lib/database/actions/events.actions'
import Image from 'next/image'
export default async function EventDetails(context: { params: { id: string } }) {
  const { params } = context
  const eventId = params.id

  //   const event = await fetchEvent(eventId)

  return (
    <section className="flex justify-center bg-contain bg-primary-50 bg-dotted-pattern ">
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl ">
        <Image
          src={event.imageUrl}
          alt="hero image"
          width={1000}
          height={1000}
          className=" h-full min-h-[300px] object-cover object-center"
        />
      </div>
    </section>
  )
}
