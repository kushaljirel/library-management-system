// Signup page that registers users and stores JWT in localStorage.

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../services/auth.js'
import { saveToken } from '../utils/auth.js'

export default function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
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
      const res = await register(form.name.trim(), form.email.trim(), form.password)
      saveToken(res.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-md">
      <div className="card">
        <h1 className="text-2xl font-semibold mb-4">Sign Up</h1>
        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input className="input" type="text" name="name" value={form.name} onChange={onChange} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input className="input" type="email" name="email" value={form.email} onChange={onChange} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input className="input" type="password" name="password" value={form.password} onChange={onChange} required minLength={6} />
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Signing up...' : 'Create Account'}
          </button>
        </form>
        <p className="mt-3 text-sm">
          Already have an account? <Link to="/login" className="text-blue-600 underline">Login</Link>
        </p>
      </div>
    </div>
  )
}


