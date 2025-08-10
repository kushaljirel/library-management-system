// Transaction controller: borrow, return, list, stats, active, overdue.

import Transaction from '../models/Transaction.js'
import Book from '../models/Book.js'

const DAYS_14_MS = 14 * 24 * 60 * 60 * 1000

export const borrowBook = async (req, res, next) => {
  try {
    const { bookId } = req.body
    if (!bookId) return res.status(400).json({ message: 'bookId is required' })
    const book = await Book.findById(bookId)
    if (!book) return res.status(404).json({ message: 'Book not found' })
    if (book.status !== 'available') return res.status(400).json({ message: 'Book is not available' })

    const existingActive = await Transaction.findOne({ book: bookId, user: req.user.id, returnDate: null })
    if (existingActive) return res.status(400).json({ message: 'You have already borrowed this book' })

    const now = Date.now()
    const tx = await Transaction.create({
      user: req.user.id,
      book: bookId,
      borrowDate: new Date(now),
      dueDate: new Date(now + DAYS_14_MS)
    })
    book.status = 'borrowed'
    await book.save()
    const populated = await tx.populate(['book', 'user'])
    res.status(201).json(populated)
  } catch (err) {
    next(err)
  }
}

export const returnBook = async (req, res, next) => {
  try {
    const { bookId } = req.body
    if (!bookId) return res.status(400).json({ message: 'bookId is required' })
    const book = await Book.findById(bookId)
    if (!book) return res.status(404).json({ message: 'Book not found' })

    const active = await Transaction.findOne({ user: req.user.id, book: bookId, returnDate: null })
    if (!active) return res.status(400).json({ message: 'No active borrow for this book by you' })

    active.returnDate = new Date()
    await active.save()

    // If no other active transactions (should not exist), mark book available
    const stillBorrowed = await Transaction.exists({ book: bookId, returnDate: null })
    if (!stillBorrowed) {
      book.status = 'available'
      await book.save()
    }

    const populated = await active.populate(['book', 'user'])
    res.json(populated)
  } catch (err) {
    next(err)
  }
}

export const getTransactions = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin'
    const filter = isAdmin ? {} : { user: req.user.id }
    const tx = await Transaction.find(filter).populate(['book', 'user']).sort({ createdAt: -1 })
    res.json(tx)
  } catch (err) {
    next(err)
  }
}

export const getActive = async (req, res, next) => {
  try {
    const tx = await Transaction.find({ user: req.user.id, returnDate: null }).populate(['book', 'user']).sort({ createdAt: -1 })
    res.json(tx)
  } catch (err) {
    next(err)
  }
}

export const getOverdue = async (req, res, next) => {
  try {
    const now = new Date()
    const filter = { returnDate: null, dueDate: { $lt: now } }
    if (req.user.role !== 'admin') {
      filter.user = req.user.id
    }
    const tx = await Transaction.find(filter).populate(['book', 'user']).sort({ dueDate: 1 })
    res.json(tx)
  } catch (err) {
    next(err)
  }
}

export const getStats = async (_req, res, next) => {
  try {
    const totalBooks = await Book.countDocuments()
    const totalBorrowed = await Book.countDocuments({ status: 'borrowed' })
    const totalOverdue = await Transaction.countDocuments({ returnDate: null, dueDate: { $lt: new Date() } })
    res.json({ totalBooks, totalBorrowed, totalOverdue })
  } catch (err) {
    next(err)
  }
}


