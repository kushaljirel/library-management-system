// JWT auth middleware to protect routes and attach user info.

import jwt from 'jsonwebtoken'

export const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    const token = authHeader.split(' ')[1]
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role
    }
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

