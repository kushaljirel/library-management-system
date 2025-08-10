// Dashboard showing totals and overdue list.

import { useEffect, useState } from 'react'
import { getStats, getOverdue } from '../services/transactions.js'
import { getUserInfo } from '../utils/auth.js'

export default function Dashboard() {
  const [stats, setStats] = useState({ totalBooks: 0, totalBorrowed: 0, totalOverdue: 0 })
  const [overdue, setOverdue] = useState([])
  const [loading, setLoading] = useState(true)
  const user = getUserInfo()

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const s = await getStats()
        setStats(s)
        const od = await getOverdue()
        setOverdue(od)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      {loading ? <div>Loading...</div> : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card">
              <div className="text-sm text-gray-500">Total Books</div>
              <div className="text-3xl font-bold">{stats.totalBooks}</div>
            </div>
            <div className="card">
              <div className="text-sm text-gray-500">Borrowed</div>
              <div className="text-3xl font-bold">{stats.totalBorrowed}</div>
            </div>
            <div className="card">
              <div className="text-sm text-gray-500">Overdue</div>
              <div className="text-3xl font-bold">{stats.totalOverdue}</div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-3">Overdue Items</h2>
            {overdue.length === 0 ? (
              <div className="text-sm text-gray-600">No overdue items.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left">
                      <th className="p-2">Book</th>
                      <th className="p-2">Borrower</th>
                      <th className="p-2">Borrowed</th>
                      <th className="p-2">Due</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overdue.map(t => (
                      <tr key={t._id} className="bg-red-50">
                        <td className="p-2">{t.book?.title} <span className="text-xs text-gray-500">by {t.book?.author}</span></td>
                        <td className="p-2">{t.user?.name || (t.user?._id === user?.id ? 'You' : 'User')}</td>
                        <td className="p-2">{new Date(t.borrowDate).toLocaleDateString()}</td>
                        <td className="p-2">{new Date(t.dueDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}


