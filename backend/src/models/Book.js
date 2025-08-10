// Book model with title, author, category, and status.

import mongoose from 'mongoose'

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    status: { type: String, enum: ['available', 'borrowed'], default: 'available' }
  },
  { timestamps: true }
)

export default mongoose.model('Book', bookSchema)


