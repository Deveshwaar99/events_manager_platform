'use server'

import { handleError } from '@/lib/utils'
import { connectToDatabase } from '../index'
//models
import User from '../models/user.models'
import Event from '../models/events.models'

import { NextResponse } from 'next/server'
import Order from '../models/order.models'
import { revalidatePath } from 'next/cache'

export type CreateUserParams = {
  clerkId: string
  firstName: string
  lastName: string
  username: string
  email: string
  photo: string
}
export type UserUpdateProperties = {
  firstName: string
  lastName: string
  username: string
  photo: string
}

export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase()
    const newUser = await User.create(user)

    return JSON.parse(JSON.stringify(newUser))
  } catch (error) {
    handleError(error)
  }
}

export async function getUserById(id: string) {
  try {
    await connectToDatabase()
    const user = await User.findById(id)
    if (!user) {
      throw new Error('User not found')
    }
    return JSON.parse(JSON.stringify(user))
  } catch (error) {
    handleError(error)
  }
}

export async function updateUser(clerkId: string, updateProperties: UserUpdateProperties) {
  try {
    let updatedUser = await User.findOneAndUpdate({ clerkId }, updateProperties, { new: true })
    if (!updatedUser) {
      throw new Error('User not found')
    }
    return JSON.parse(JSON.stringify(updatedUser))
  } catch (error) {
    handleError(error)
  }
}

//Delete User and remove organized events

export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase()

    // Find user to delete
    const userToDelete = await User.findOne({ clerkId })

    if (!userToDelete) {
      throw new Error('User not found')
    }

    // Unlink relationships
    await Promise.all([
      // Update the 'events' collection to remove references to the user
      Event.updateMany(
        { _id: { $in: userToDelete.events } },
        { $pull: { organizer: userToDelete._id } }
      ),

      // Update the 'orders' collection to remove references to the user
      Order.updateMany({ _id: { $in: userToDelete.orders } }, { $unset: { buyerId: 1 } }),
    ])

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id)
    revalidatePath('/')

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null
  } catch (error) {
    handleError(error)
  }
}
