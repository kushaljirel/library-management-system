// Users API service for user management operations.

import api from './api.js'

export async function getUsers() {
  const { data } = await api.get('/users')
  return data
}

export async function deleteUser(userId) {
  const { data } = await api.delete(`/users/${userId}`)
  return data
}

export async function updateProfile(profileData) {
  const { data } = await api.put('/users/profile', profileData)
  return data
}

export async function updatePassword(passwordData) {
  const { data } = await api.put('/users/password', passwordData)
  return data
}

export async function deleteAccount() {
  const { data } = await api.delete('/users/account')
  return data
}


