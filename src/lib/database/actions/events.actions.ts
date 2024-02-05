'use server'
import mongoose from 'mongoose'
import { handleError } from '@/lib/utils'
import { connectToDatabase } from '..'
import User from '../models/user.models'
import Event from '../models/events.models'
import Category from '../models/category.models'

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

// function populateEvent(query: any) {
//   return query.populate('organizer', '_id firstName lastName').populate('category', '_id name')
// }

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

export async function fetchEvent(id: string) {
  try {
    await connectToDatabase()

    const event = await Event.findById(id)
      .populate({ path: 'organizer', model: User, select: '_id firstName lastName' })
      .populate({ path: 'category', model: Category, select: '_id name' })

    if (!event) throw new Error('Event not found')

    return JSON.parse(JSON.stringify(event))
  } catch (error) {
    console.log(error)
    handleError(error)
  }
}
