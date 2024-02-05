import { fetchEvent } from '@/lib/database/actions/events.actions'
import Image from 'next/image'
import calendarImg from '../../../../../public/assets/icons/calendar.svg'
import locationImg from '../../../../../public/assets/icons/location.svg'

//test
import test from './test.jpg'
import { formatDateTime } from '@/lib/utils'

export default async function EventDetails(context: { params: { id: string } }) {
  const { params } = context
  const eventId = params.id

  // const event = await fetchEvent(eventId)

  const event = {
    _id: '65bfad930fa0fbb2b71511f4',
    title: 'Docker Conf',
    description: 'Docker annual Conference',
    location: 'Bandarawela',
    imageUrl: 'https://utfs.io/f/b5512885-5385-4169-970e-ffc9d8303e62-yuzo1c.ico',
    startDateTime: '2024-02-04T18:00:00.000Z',
    endDateTime: '2024-02-06T15:08:51.000Z',
    price: '',
    isFree: true,
    url: 'abc.com',
    category: { _id: '65bf78ecb767adb30b67d03a', name: 'Docker' },
    organizer: {
      _id: '65bf88383cec2eb29661847a',
      firstName: 'Devesh',
      lastName: 'P',
    },
    createdAt: '2024-02-04T15:30:27.993Z',
    __v: 0,
  }

  return (
    <section className="flex justify-center bg-contain bg-primary-50 bg-dotted-pattern">
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl ">
        <Image
          src={test}
          alt="hero image"
          width={1000}
          height={1000}
          className=" h-full min-h-[300px] object-cover object-center"
        />

        <div className="flex flex-col gap-8 p-5 md:p-10">
          <div className="flex flex-col gap-6 ">
            <h2 className="h2-bold">{event.title}</h2>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex gap-3 ">
                <p className="px-5 py-2 text-green-700 rounded-full p-bold-20 bg-green-500/10">
                  {event.isFree ? 'FREE' : `$${event.price}`}
                </p>
                <p className=" p-medium-16 rounded-full bg-grey-500/10 px-4 py-2.5 text-grey-500">
                  {event.category.name}
                </p>
              </div>
              <p className="mt-2 ml-2 p-medium-18 sm:mt-0">
                by{' '}
                <span className="text-primary-500">
                  {event.organizer.firstName} {event.organizer.lastName}
                </span>
              </p>
            </div>
          </div>
          <button>checkout</button>
          <div className="flex gap-5 felx-col">
            <div className="flex gap-2 md:gap-3">
              <Image src={calendarImg} alt="calendar" width={32} height={32} />
              <div className="flex flex-wrap items-center p-medium-16 lg:p-regular-20 md:gap-3">
                <p>
                  {formatDateTime(event.startDateTime).dateOnly} -{' '}
                  {formatDateTime(event.startDateTime).timeOnly}
                </p>
                <p>
                  {formatDateTime(event.endDateTime).dateOnly} -{' '}
                  {formatDateTime(event.endDateTime).timeOnly}
                </p>
              </div>
              <div className="flex items-center gap-3 p-regular-20">
                <Image src={locationImg} alt="location" width={32} height={32} />
                <p className="p-medium-16 lg:p-regular-20">{event.location}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="p-bold-20 text-grey-600">What to expect:</p>
            <p className="p-medium-16 lg:p-regular-18">{event.description}</p>
            <p className="underline truncate p-medium-16 lg:p-regular-18 text-primary-500">
              {event.url}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
