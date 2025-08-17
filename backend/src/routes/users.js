// User routes: user management operations.

import { Router } from 'express'
import { auth } from '../middlewares/auth.js'
import { requireAdmin } from '../middlewares/role.js'
import { 
  getUsers, 
  updateProfile, 
  updatePassword, 
  deleteUser, 
  deleteAccount 
} from '../controllers/userController.js'

const router = Router()

// Admin routes
router.get('/', auth, requireAdmin, getUsers)
router.delete('/:id', auth, requireAdmin, deleteUser)

// User routes (authenticated users can manage their own profile)
router.put('/profile', auth, updateProfile)
router.put('/password', auth, updatePassword)
router.delete('/account', auth, deleteAccount)

export default router


