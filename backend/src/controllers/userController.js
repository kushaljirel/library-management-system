// User controller: admin-only list of users.

import User from '../models/User.js'

export const getUsers = async (_req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    res.json(users)
  } catch (err) {
    next(err)
  }
}


