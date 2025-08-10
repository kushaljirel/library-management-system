// Page showing transactions; admin sees all, users see own; return action available for active items.

import { useEffect, useState } from 'react'
import { getTransactions, returnBook } from '../services/transactions.js'
import { getUserInfo } from '../utils/auth.js'

export default function Transactions() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const user = getUserInfo()

  const load = async () => {
    setLoading(true)
    try {
      const res = await getTransactions()
      setItems(res)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const onReturn = async (bookId) => {
    await returnBook(bookId)
    await load()
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Transactions</h1>
      <div className="card overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="p-2">Book</th>
              <th className="p-2">User</th>
              <th className="p-2">Borrowed</th>
              <th className="p-2">Due</th>
              <th className="p-2">Returned</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(t => {
              const overdue = !t.returnDate && new Date(t.dueDate) < new Date()
              const canReturn = !t.returnDate && t.user?._id === user?.id
              return (
                <tr key={t._id} className={`border-t ${overdue ? 'bg-red-50' : ''}`}>
                  <td className="p-2">{t.book?.title}</td>
                  <td className="p-2">{t.user?.name || 'User'}</td>
                  <td className="p-2">{new Date(t.borrowDate).toLocaleDateString()}</td>
                  <td className="p-2">{new Date(t.dueDate).toLocaleDateString()}</td>
                  <td className="p-2">{t.returnDate ? new Date(t.returnDate).toLocaleDateString() : '-'}</td>
                  <td className="p-2">
                    {canReturn && <button className="btn btn-primary" onClick={() => onReturn(t.book._id)}>Return</button>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {loading && <div className="mt-2 text-sm text-gray-600">Loading...</div>}
        {!loading && items.length === 0 && <div className="mt-2 text-sm text-gray-600">No transactions.</div>}
      </div>
    </div>
  )
}


