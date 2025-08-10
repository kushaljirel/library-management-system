// Login page that authenticates users and stores JWT in localStorage.

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../services/auth.js'
import { saveToken } from '../utils/auth.js'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await login(form.email.trim(), form.password)
      saveToken(res.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-md">
      <div className="card">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input className="input" type="email" name="email" value={form.email} onChange={onChange} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input className="input" type="password" name="password" value={form.password} onChange={onChange} required />
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-3 text-sm">
          No account? <Link to="/signup" className="text-blue-600 underline">Sign up</Link>
        </p>
      </div>
    </div>
  )
}


