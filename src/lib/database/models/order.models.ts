import { Schema, Document, models, model } from 'mongoose'

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
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
})

const Order = models.Order || model('Order', OrderSchema)

export default Order
