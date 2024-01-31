import { Schema, model, models } from 'mongoose'

const UserSchema = new Schema({
  clerkId: {
    type: String,
    required: [true, 'Clerk ID is required'],
    unique: [true, 'Clerk ID must be unique'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: [true, 'Email must be unique'],
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: [true, 'Username must be unique'],
  },
  firstName: { type: String, required: [true, 'First name is required'] },
  lastName: { type: String, required: [true, 'Last name is required'] },
  photo: { type: String, required: [true, 'Photo is required'] },
  events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
})

const User = models.User || model('User', UserSchema)

export default User
