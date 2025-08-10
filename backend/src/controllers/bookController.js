// Book controller: CRUD, search, and constraints for delete when borrowed.

import Book from '../models/Book.js'

export const createBook = async (req, res, next) => {
  try {
    const { title, author, category } = req.body
    if (!title || !author) return res.status(400).json({ message: 'Title and author are required' })
    const book = await Book.create({ title, author, category })
    res.status(201).json(book)
  } catch (err) {
    next(err)
  }
}

export const getBooks = async (req, res, next) => {
  try {
    const { q, category, status } = req.query
    const filter = {}
    if (q) {
      const regex = new RegExp(q, 'i')
      filter.$or = [{ title: regex }, { author: regex }, { category: regex }]
    }
    if (category) filter.category = category
    if (status) filter.status = status
    const books = await Book.find(filter).sort({ createdAt: -1 })
    res.json(books)
  } catch (err) {
    next(err)
  }
}

export const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id)
    if (!book) return res.status(404).json({ message: 'Book not found' })
    res.json(book)
  } catch (err) {
    next(err)
  }
}

export const updateBook = async (req, res, next) => {
  try {
    const { title, author, category } = req.body
    const book = await Book.findById(req.params.id)
    if (!book) return res.status(404).json({ message: 'Book not found' })
    if (title) book.title = title
    if (author) book.author = author
    book.category = category !== undefined ? category : book.category
    await book.save()
    res.json(book)
  } catch (err) {
    next(err)
  }
}

export const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id)
    if (!book) return res.status(404).json({ message: 'Book not found' })
    if (book.status === 'borrowed') {
      return res.status(400).json({ message: 'Cannot delete a borrowed book' })
    }
    await book.deleteOne()
    res.json({ message: 'Book deleted' })
  } catch (err) {
    next(err)
  }
}


