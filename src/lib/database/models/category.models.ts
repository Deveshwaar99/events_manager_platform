import { Document, Schema, model, models } from 'mongoose'

export interface ICategory extends Document {
  _id: string
  name: string
}

const CategorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: [true, 'Category name must be unique'],
  },
})

const Category = models?.Category || model('Category', CategorySchema)

export default Category
