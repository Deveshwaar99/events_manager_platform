import { Schema, Document, models, model } from 'mongoose'

export interface IOrder extends Document {
  _id: string
  createdAt: Date
  stripeId: string
  totalAmount: string
  eventId: string
  buyerId: string
}

const OrderSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  stripeId: {
    type: String,
    required: [true, 'stripeId is required'],
    unique: [true, 'stripeId must be unique'],
  },
  totalAmount: {
    type: String,
  },
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
  },
  buyerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
})

const Order = models.Order || model('Order', OrderSchema)

export default Order
