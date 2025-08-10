// Admin page to add or edit a book.

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createBook, getBook, updateBook } from '../services/books.js'

export default function BookForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', author: '', category: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function load() {
      if (isEdit) {
        setLoading(true)
        try {
          const b = await getBook(id)
          setForm({ title: b.title || '', author: b.author || '', category: b.category || '' })
        } catch (e) {
          setError('Failed to load book')
        } finally {
          setLoading(false)
        }
      }
    }
    load()
  }, [id, isEdit])

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isEdit) {
        await updateBook(id, form)
      } else {
        await createBook(form)
      }
      navigate('/books')
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save book')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-lg">
      <div className="card">
        <h1 className="text-2xl font-semibold mb-4">{isEdit ? 'Edit Book' : 'Add Book'}</h1>
        {loading ? <div>Loading...</div> : (
          <form onSubmit={onSubmit} className="space-y-3">
            {error && <div className="text-sm text-red-600">{error}</div>}
            <div>
              <label className="block text-sm mb-1">Title</label>
              <input className="input" name="title" value={form.title} onChange={onChange} required />
            </div>
            <div>
              <label className="block text-sm mb-1">Author</label>
              <input className="input" name="author" value={form.author} onChange={onChange} required />
            </div>
            <div>
              <label className="block text-sm mb-1">Category</label>
              <input className="input" name="category" value={form.category} onChange={onChange} />
            </div>
            <div className="flex gap-2">
              <button className="btn btn-primary" disabled={loading} type="submit">{isEdit ? 'Update' : 'Create'}</button>
              <button className="btn btn-secondary" type="button" onClick={() => navigate('/books')}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}


