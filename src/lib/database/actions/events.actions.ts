'use server'

import { handleError } from '@/lib/utils'
import { connectToDatabase } from '..'
import User from '../models/user.models'
import Event from '../models/events.models'

type CreateEventParams = {
  userId: string
  eventDetails: {
    title: string
    description: string
    location: string
    imageUrl: string
    startDateTime: Date
    endDateTime: Date
    categoryId: string
    price: string
    isFree: boolean
    url: string
  }
  //   path: string
}

export async function createEvent({ userId, eventDetails }: CreateEventParams) {
  try {
    await connectToDatabase()

    const user = await User.findById(userId)
    if (!user) throw new Error('User not found')

    const createdEvent = await Event.create({
      ...eventDetails,
      organizer: userId,
      category: eventDetails.categoryId,
    })
    if (!createEvent) throw new Error('Unable to create event')

    return JSON.parse(JSON.stringify(createdEvent))
  } catch (error) {
    console.log(error)
    handleError(error)
  }
}
