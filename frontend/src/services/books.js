// Books API service for list/search/CRUD operations.

import api from './api.js'

export async function getBooks(params = {}) {
  const { data } = await api.get('/books', { params })
  return data
}

export async function getBook(id) {
  const { data } = await api.get(`/books/${id}`)
  return data
}

export async function createBook(payload) {
  const { data } = await api.post('/books', payload)
  return data
}

export async function updateBook(id, payload) {
  const { data } = await api.put(`/books/${id}`, payload)
  return data
}

export async function deleteBook(id) {
  const { data } = await api.delete(`/books/${id}`)
  return data
}


