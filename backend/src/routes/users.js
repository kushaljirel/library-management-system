// User routes: admin list users.

import { Router } from 'express'
import { auth } from '../middlewares/auth.js'
import { requireAdmin } from '../middlewares/role.js'
import { getUsers } from '../controllers/userController.js'

const router = Router()

router.get('/', auth, requireAdmin, getUsers)

export default router


