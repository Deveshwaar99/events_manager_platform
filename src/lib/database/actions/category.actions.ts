'use server'

import { handleError } from '@/lib/utils'
import { connectToDatabase } from '..'
import Category from '../models/category.models'
export async function fetchCategories() {
  try {
    await connectToDatabase()
    const categoryList = await Category.find()
    return JSON.parse(JSON.stringify(categoryList))
  } catch (error) {
    handleError(error)
  }
}

export async function addNewCategory(newCategory: string) {
  try {
    await connectToDatabase()
    const addedCategory = await Category.create({ name: newCategory.trim() })
    return JSON.parse(JSON.stringify(addedCategory))
  } catch (error) {
    handleError(error)
  }
}

export async function getCategoryIdByName(name: string) {
  try {
    await connectToDatabase()

    const category = await Category.findOne(
      {
        name: { $regex: new RegExp(name, 'i') },
      },
      {
        _id: 1,
      }
    )

    return category?._id
  } catch (error) {
    handleError(error)
  }
}
