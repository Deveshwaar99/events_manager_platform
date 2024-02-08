'use server'

import { handleError } from '@/lib/utils'
import { connectToDatabase } from '..'
import Order from '../models/order.models'

type CreateOrderParams = {
  createdAt: Date
  stripeId: string
  totalAmount: string
  eventId: string
  buyerId: string
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
