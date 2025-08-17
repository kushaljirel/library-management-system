// User controller: user management operations.

import User from '../models/User.js'
import bcrypt from 'bcryptjs'

export const getUsers = async (_req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    res.json(users)
  } catch (err) {
    next(err)
  }
}

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body
    const userId = req.user.id

    // Check if email is already taken by another user
    const existingUser = await User.findOne({ email, _id: { $ne: userId } })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' })
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(user)
  } catch (err) {
    next(err)
  }
}

export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body
    const userId = req.user.id

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password)
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' })
    }

    // Hash new password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds)

    // Update password
    await User.findByIdAndUpdate(userId, { password: hashedPassword })

    res.json({ message: 'Password updated successfully' })
  } catch (err) {
    next(err)
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const currentUserId = req.user.id

    // Prevent users from deleting themselves through admin panel
    if (id === currentUserId) {
      return res.status(400).json({ message: 'Cannot delete your own account from here' })
    }

    const user = await User.findByIdAndDelete(id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({ message: 'User deleted successfully' })
  } catch (err) {
    next(err)
  }
}

export const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.id

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Prevent admin users from deleting their own accounts
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Admin accounts cannot be deleted' })
    }

    await User.findByIdAndDelete(userId)
    res.json({ message: 'Account deleted successfully' })
  } catch (err) {
    next(err)
  }
}


