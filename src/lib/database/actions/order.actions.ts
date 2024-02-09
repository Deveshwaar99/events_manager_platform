'use server'

import { handleError } from '@/lib/utils'
import { connectToDatabase } from '..'
import Order from '../models/order.models'
import User from '../models/user.models'
import Event from '../models/events.models'

type CreateOrderParams = {
  createdAt: Date
  stripeId: string
  totalAmount: string
  eventId: string
  buyerId: string
}

type FetchOrdersByUserParams = {
  userId: string
  page?: number
  limit?: number
}

export async function createOrder(orderDetails: CreateOrderParams) {
  try {
    await connectToDatabase()
    const newOrder = await Order.create(orderDetails)

    return JSON.parse(JSON.stringify(newOrder))
  } catch (error) {
    handleError(error)
  }
}

export async function fetchOrdersByUser({ userId, page = 1, limit = 3 }: FetchOrdersByUserParams) {
  try {
    await connectToDatabase()

    const skipAmount = (Number(page) - 1) * limit

    const orderedEvents = await Order.distinct('eventId')
      .find({ buyerId: userId })
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)
      .populate({
        path: 'eventId',
        model: Event,
        populate: {
          path: 'organizer',
          model: User,
          select: '_id firstName lastName',
        },
      })

    const ordersCount = await Order.distinct('event._id').countDocuments({ buyerId: userId })

    return {
      data: JSON.parse(JSON.stringify(orderedEvents)),
      totalPages: Math.ceil(ordersCount / limit),
    }
  } catch (error) {
    handleError(error)
  }
}
