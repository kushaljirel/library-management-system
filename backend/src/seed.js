// Seed script to create an initial admin user and sample books.

import dotenv from 'dotenv'
dotenv.config()
import { connectDB } from './config/db.js'
import User from './models/User.js'
import Book from './models/Book.js'

async function seed() {
  await connectDB()

  const adminEmail = 'admin@library.com'
  const existingAdmin = await User.findOne({ email: adminEmail })
  if (!existingAdmin) {
    await User.create({
      name: 'Admin',
      email: adminEmail,
      password: 'Admin123!',
      role: 'admin'
    })
    console.log('Admin user created:', adminEmail, 'password: Admin123!')
  } else {
    console.log('Admin user already exists:', adminEmail)
  }

  const sampleBooks = [
    { title: 'The Pragmatic Programmer', author: 'Andrew Hunt, David Thomas', category: 'Programming' },
    { title: 'Clean Code', author: 'Robert C. Martin', category: 'Programming' },
    { title: 'Atomic Habits', author: 'James Clear', category: 'Self-help' },
    { title: 'Sapiens', author: 'Yuval Noah Harari', category: 'History' }
  ]

  for (const b of sampleBooks) {
    const exists = await Book.findOne({ title: b.title, author: b.author })
    if (!exists) {
      await Book.create(b)
      console.log('Book added:', b.title)
    } else {
      console.log('Book already exists:', b.title)
    }
  }

  console.log('Seeding complete.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})

