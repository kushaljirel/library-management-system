// Auth controller: register, login, and current user profile.

import jwt from 'jsonwebtoken'
import User from '../models/User.js'

function signToken(user) {
  const payload = {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role
  }
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d'
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn })
}

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' })
    }
    const exists = await User.findOne({ email: email.toLowerCase() })
    if (exists) {
      return res.status(400).json({ message: 'Email already in use' })
    }
    const user = await User.create({ name, email: email.toLowerCase(), password })
    const token = signToken(user)
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    })
  } catch (err) {
    next(err)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }
    const match = await user.comparePassword(password)
    if (!match) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }
    const token = signToken(user)
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    })
  } catch (err) {
    next(err)
  }
}

export const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (err) {
    next(err)
  }
}


