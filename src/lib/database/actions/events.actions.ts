'use server'
import mongoose from 'mongoose'
import { handleError } from '@/lib/utils'
import { connectToDatabase } from '..'
import User from '../models/user.models'
import Event from '../models/events.models'
import Category from '../models/category.models'
import { revalidatePath } from 'next/cache'
import { getCategoryIdByName } from './category.actions'
import { skip } from 'node:test'

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
type UpdateEventParams = {
  userId: string
  eventId: string
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
type QueryParams = {
  query: string
  page: number
  category: string
  limit: number
}
type DeleteEventParams = {
  eventId: string
  path: string
}

type GetRelatedEventsByCategoryParams = {
  categoryId: string
  eventId: string
  limit: number
  page: number
}

type FetchEventsByOrganizerParams = {
  userId: string
  page: number
  limit: number
}

// function populateEvent(query: any) {
//   return query.populate('organizer', '_id firstName lastName').populate('category', '_id name')
// }

//CREATE
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
    handleError(error)
  }
}

//FETCH

//FETCH SINGLE EVENT
export async function fetchEventbyId(id: string) {
  try {
    await connectToDatabase()

    const event = await Event.findById(id)
      .populate({ path: 'organizer', model: User, select: '_id firstName lastName' })
      .populate({ path: 'category', model: Category, select: '_id name' })

    if (!event) throw new Error('Event not found')

    return JSON.parse(JSON.stringify(event))
  } catch (error) {
    handleError(error)
  }
}

//FETCH ALL EVENTS
export async function fetchAllEvents({ query, category, page, limit }: QueryParams) {
  try {
    await connectToDatabase()
    const titleQuery = query ? { title: { $regex: new RegExp(query, 'i') } } : {}
    const categoryQuery = category ? await getCategoryIdByName(category) : {}

    const combinedConditions = { ...titleQuery, ...categoryQuery }
    const skipVal = (page - 1) * limit
    const limitVal = limit

    const events = await Event.find(combinedConditions)
      .sort({ createdAt: 'desc' })
      .skip(skipVal)
      .limit(limitVal)
      .populate({ path: 'organizer', model: User, select: '_id firstName lastName' })
      .populate({ path: 'category', model: Category, select: '_id name' })

    const totalDocs = await Event.countDocuments(combinedConditions)
    const pageCount = Math.ceil(totalDocs / limit)

    return { data: JSON.parse(JSON.stringify(events)), pageCount }
  } catch (error) {
    handleError(error)
  }
}

//FETCH RELATED EVENTS BASED ON CATEGORY
export async function getRelatedEventsByCategory({
  categoryId,
  eventId,
  limit = 3,
  page = 1,
}: GetRelatedEventsByCategoryParams) {
  try {
    await connectToDatabase()

    const conditions = { $and: [{ category: categoryId }, { _id: { $ne: eventId } }] }
    const skipAmount = (Number(page) - 1) * limit

    const relatedEvents = await Event.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)
      .populate({ path: 'organizer', model: User, select: '_id firstName lastName' })
      .populate({ path: 'category', model: Category, select: '_id name' })
    const eventsCount = await Event.countDocuments(conditions)

    return {
      data: JSON.parse(JSON.stringify(relatedEvents)),
      totalPages: Math.ceil(eventsCount / limit),
    }
  } catch (error) {
    handleError(error)
  }
}

//FETCH EVENTS BASED ON ORGANIZER
export async function fetchEventByOrganizer({
  userId,
  page,
  limit = 6,
}: FetchEventsByOrganizerParams) {
  try {
    await connectToDatabase()
    const skip = (Number(page) - 1) * limit

    const organizedEvents = await Event.find({ organizer: userId })
      .populate({ path: 'organizer', model: User, select: '_id firstName lastName' })
      .populate({ path: 'category', model: Category, select: '_id name' })
      .sort({ createdAt: 'desc' })
      .skip(skip)
      .limit(limit)

    const eventCount = await Event.countDocuments({ organizer: userId })
    return {
      data: JSON.parse(JSON.stringify(organizedEvents)),
      totalPages: Math.ceil(eventCount / limit),
    }
  } catch (error) {
    handleError(error)
  }
}

//UPDATE SINGLE EVENT
export async function updateEventById({ userId, eventId, eventDetails }: UpdateEventParams) {
  try {
    await connectToDatabase()

    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId, organizer: userId },
      { ...eventDetails, category: eventDetails.categoryId }
    )
    if (!updatedEvent) throw new Error('Unable to update event')

    return JSON.parse(JSON.stringify(updatedEvent))
  } catch (error) {
    handleError(error)
  }
}

//DELETE SINGLE EVENT
export async function deleteEventbyId({ eventId, path = '/' }: DeleteEventParams) {
  try {
    await connectToDatabase()

    const deletedEvent = await Event.findByIdAndDelete(eventId)
    if (deletedEvent) revalidatePath(path)

    if (!deletedEvent) throw new Error('Event not found')
  } catch (error) {
    handleError(error)
  }
}
