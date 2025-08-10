// Transaction routes: borrow, return, list, stats, active, overdue.

import { Router } from 'express'
import { auth } from '../middlewares/auth.js'
import { borrowBook, returnBook, getTransactions, getOverdue, getStats, getActive } from '../controllers/transactionController.js'

const router = Router()

router.post('/borrow', auth, borrowBook)
router.post('/return', auth, returnBook)
router.get('/', auth, getTransactions)
router.get('/active', auth, getActive)
router.get('/overdue', auth, getOverdue)
router.get('/stats', auth, getStats)

export default router


