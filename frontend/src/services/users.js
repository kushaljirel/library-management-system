// Users API service for admin user listing.

import api from './api.js'

export async function getUsers() {
  const { data } = await api.get('/users')
  return data
}


