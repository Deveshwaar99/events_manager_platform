import { IEvent } from '@/lib/database/models/events.models'
import { formatDateTime } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'

import searchImg from '../../../public/assets/icons/arrow.svg'
import editImg from '../../../public/assets/icons/edit.svg'
import deleteImg from '../../../public/assets/icons/delete.svg'

import { auth } from '@clerk/nextjs'
import { DeleteEventAlertDialog } from './DeleteEventAlertDialog'
type CardProps = {
  event: IEvent
  hasOrderLink: boolean
  hidePrice: boolean
}

function Card({ event, hasOrderLink, hidePrice }: CardProps) {
  const { sessionClaims } = auth()
  const userId = sessionClaims?.userId as string

  const isEventCreator = userId === event.organizer._id.toString()

  return (
    <div className="relative flex flex-col bg-white shadow-md hover:shadow-lg rounded-xl w-full max-w-[400px] min-h-[380px] md:min-h-[438px] transition-all overflow-hidden group">
      <Link
        href={`/events/${event._id}`}
        style={{ backgroundImage: `url(${event.imageUrl})` }}
        className="flex-grow flex-center bg-cover bg-center text-grey-500"
      />

      {isEventCreator && !hidePrice && (
        <div className="top-2 right-2 absolute flex flex-col gap-4 bg-white shadow-sm p-3 rounded-xl transition-all">
          <Link href={`/events/${event._id}/edit`}>
            <Image src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
          </Link>

          <DeleteEventAlertDialog eventId={event._id} />
        </div>
      )}

      <div className="flex flex-col gap-3 md:gap-4 p-5 min-h-[230px]">
        {!hidePrice && (
          <div className="flex gap-2">
            <span className="bg-green-100 px-4 py-1 p-semibold-14 rounded-full w-min text-green-60">
              {event.isFree ? 'FREE' : `$${event.price}`}
            </span>
            <p className="bg-grey-500/10 px-4 py-1 line-clamp-1 p-semibold-14 rounded-full w-min text-grey-500">
              {event.category.name}
            </p>
          </div>
        )}

        <p className="p-medium-16 p-medium-18 text-grey-500">
          {formatDateTime(event.startDateTime.toString()).dateTime}
        </p>

        <Link href={`/events/${event._id}`}>
          <p className="flex-1 p-medium-16 md:p-medium-20 line-clamp-2 text-black">{event.title}</p>
        </Link>

        <div className="flex-between w-full">
          <p className="p-medium-14 md:p-medium-16 text-grey-600">
            {event.organizer.firstName} {event.organizer.lastName}
          </p>

          {hasOrderLink && (
            <Link href={`/orders?eventId=${event._id}`} className="flex gap-2">
              <p className="text-primary-500">Order Details</p>
              <Image src="/assets/icons/arrow.svg" alt="search" width={10} height={10} />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Card
