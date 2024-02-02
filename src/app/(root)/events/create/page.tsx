import EventForm from '@/components/shared/EventForm'

export default function CreateEvent() {
  return (
    <>
      <section className="py-5 bg-center bg-cover bg-primary-50 bg-dotted-pattern md:py-10">
        <h3 className="text-left wrapper h3-bold md:text-center">Create Event</h3>
      </section>
      <div className="my-8 wrapper">
        <EventForm id="4" type="create" />
      </div>
    </>
  )
}
