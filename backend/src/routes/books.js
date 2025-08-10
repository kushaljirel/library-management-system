// Book routes: public list/get, admin create/update/delete.

import { Router } from 'express'
import { auth } from '../middlewares/auth.js'
import { requireAdmin } from '../middlewares/role.js'
import { createBook, getBooks, getBookById, updateBook, deleteBook } from '../controllers/bookController.js'

const router = Router()

router.get('/', auth, getBooks)
router.get('/:id', auth, getBookById)
router.post('/', auth, requireAdmin, createBook)
router.put('/:id', auth, requireAdmin, updateBook)
router.delete('/:id', auth, requireAdmin, deleteBook)

export default router


