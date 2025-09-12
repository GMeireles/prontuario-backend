import express from 'express'
import { register, login, me } from '../controllers/authController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { validate } from '../middlewares/validate.js'
import { registerValidation, loginValidation } from '../validations/authValidation.js'

const router = express.Router()

// Cadastro de usuário (apenas admin criará via UI futuramente)
router.post('/register', registerValidation, validate, register)

// Login
router.post('/login', loginValidation, validate, login)

// Dados do usuário logado
router.get('/me', authMiddleware, me)

export default router
