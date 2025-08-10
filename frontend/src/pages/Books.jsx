// Books page for searching, listing, and borrowing/returning; admin can manage books.

import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getBooks, deleteBook as deleteBookApi } from '../services/books.js'
import { borrowBook, returnBook, getActiveTransactions } from '../services/transactions.js'
import BookCard from '../components/BookCard.jsx'
import { getUserInfo } from '../utils/auth.js'

export default function Books() {
  const user = getUserInfo()
  const isAdmin = user?.role === 'admin'

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeByBookId, setActiveByBookId] = useState({})

  const loadActive = async () => {
    const active = await getActiveTransactions()
    const map = {}
    active.forEach(t => {
      map[t.book?._id] = t
    })
    setActiveByBookId(map)
  }

  const loadBooks = async () => {
    setLoading(true)
    try {
      const res = await getBooks({ q: query, category: category || undefined, status: status || undefined })
      setBooks(res)
      await loadActive()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBooks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSearch = (e) => {
    e.preventDefault()
    loadBooks()
  }

  const onBorrow = async (bookId) => {
    await borrowBook(bookId)
    await loadBooks()
  }

  const onReturn = async (bookId) => {
    await returnBook(bookId)
    await loadBooks()
  }

  const onDelete = async (bookId) => {
    if (!confirm('Delete this book?')) return
    await deleteBookApi(bookId)
    await loadBooks()
  }

  const categories = useMemo(() => {
    const set = new Set()
    books.forEach(b => b.category && set.add(b.category))
    return Array.from(set)
  }, [books])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Books</h1>
        {isAdmin && (
          <Link to="/books/new" className="btn btn-primary">Add Book</Link>
        )}
      </div>

      <form onSubmit={onSearch} className="card grid grid-cols-1 md:grid-cols-4 gap-3">
        <input className="input md:col-span-2" placeholder="Search by title/author/category" value={query} onChange={e => setQuery(e.target.value)} />
        <select className="input" value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="input" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">Any Status</option>
          <option value="available">Available</option>
          <option value="borrowed">Borrowed</option>
        </select>
        <div className="md:col-span-4 flex gap-2">
          <button className="btn btn-secondary" type="button" onClick={() => { setQuery(''); setCategory(''); setStatus(''); }}>Clear</button>
          <button className="btn btn-primary" type="submit">Search</button>
        </div>
      </form>

      {loading ? <div>Loading...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {books.map(book => {
            const activeTx = activeByBookId[book._id]
            const canReturn = activeTx && activeTx.user && activeTx.user._id === user?.id
            const isOverdue = activeTx && new Date(activeTx.dueDate) < new Date()
            return (
              <BookCard
                key={book._id}
                book={book}
                isAdmin={isAdmin}
                canReturn={!!canReturn}
                isOverdue={!!isOverdue}
                onBorrow={() => onBorrow(book._id)}
                onReturn={() => onReturn(book._id)}
                onDelete={() => onDelete(book._id)}
              />
            )
          })}
          {books.length === 0 && <div className="text-sm text-gray-600">No books found.</div>}
        </div>
      )}
    </div>
  )
}


