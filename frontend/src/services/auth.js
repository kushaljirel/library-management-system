// Auth service for login, register, and fetching current user.

import api from './api.js'

export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password })
  return data
}

export async function register(name, email, password) {
  const { data } = await api.post('/auth/register', { name, email, password })
  return data
}

export async function getMe() {
  const { data } = await api.get('/auth/me')
  return data
}


