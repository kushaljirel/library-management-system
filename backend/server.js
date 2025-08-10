// Express server entry; sets up middlewares, routes, DB connection, and starts the server.

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { connectDB } from './src/config/db.js'
import authRoutes from './src/routes/auth.js'
import bookRoutes from './src/routes/books.js'
import userRoutes from './src/routes/users.js'
import transactionRoutes from './src/routes/transactions.js'

dotenv.config()

const app = express()

// Security + CORS
app.use(helmet())
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [FRONTEND_URL, 'http://localhost:5173']
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
app.use(cors(corsOptions))

// Body parsers
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

// Logging
app.use(morgan('dev'))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/books', bookRoutes)
app.use('/api/users', userRoutes)
app.use('/api/transactions', transactionRoutes)

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

// Not found handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Global error handler
app.use((err, req, res, _next) => {
  console.error(err)
  const status = err.status || 500
  res.status(status).json({ message: err.message || 'Server error' })
})

const PORT = process.env.PORT || 5000

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Failed to start server due to DB error:', err)
    process.exit(1)
  })

export default app


