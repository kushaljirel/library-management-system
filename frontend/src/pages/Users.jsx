// Admin page to list users.

import { useEffect, useState } from 'react'
import { getUsers } from '../services/users.js'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const res = await getUsers()
        setUsers(res)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Users</h1>
      <div className="card overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-t">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2"><span className={`badge ${u.role === 'admin' ? 'badge-red' : 'badge-green'}`}>{u.role}</span></td>
                <td className="p-2">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div className="mt-2 text-sm text-gray-600">Loading...</div>}
        {!loading && users.length === 0 && <div className="mt-2 text-sm text-gray-600">No users found.</div>}
      </div>
    </div>
  )
}


