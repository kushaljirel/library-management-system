// Transaction model for borrow/return events with due date logic.

import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    borrowDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    returnDate: { type: Date, default: null }
  },
  { timestamps: true }
)

transactionSchema.index({ user: 1, book: 1, returnDate: 1 })

export default mongoose.model('Transaction', transactionSchema)


