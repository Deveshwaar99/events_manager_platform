'use server'

import { handleError } from '@/lib/utils'
import { connectToDatabase } from '../index'
//models
import User from '../models/user.models'
import Event from '../models/events.models'

import { NextResponse } from 'next/server'

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
// export async function deleteUser(clerkId: string) {
//   try {
//     await connectToDatabase()
//     const user = await User.findOne({ clerkId })
//     if (!user) {
//       throw new Error('User not found')
//     }
//     await Event.updateMany({ _id: { $in: user.events } },{$pull:})
//   } catch (error) {
//     handleError(error)
//   }
// }
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
