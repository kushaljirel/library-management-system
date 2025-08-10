// Transactions API service for borrow/return and dashboards.

import api from './api.js'

export async function borrowBook(bookId) {
  const { data } = await api.post('/transactions/borrow', { bookId })
  return data
}

export async function returnBook(bookId) {
  const { data } = await api.post('/transactions/return', { bookId })
  return data
}

export async function getTransactions() {
  const { data } = await api.get('/transactions')
  return data
}

export async function getActiveTransactions() {
  const { data } = await api.get('/transactions/active')
  return data
}

export async function getOverdue() {
  const { data } = await api.get('/transactions/overdue')
  return data
}

export async function getStats() {
  const { data } = await api.get('/transactions/stats')
  return data
}


