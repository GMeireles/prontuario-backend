import express from 'express'
import { register, login, me, refresh, logout } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { loginRateLimiter } from '../middlewares/rateLimit.js';
import { validate } from '../middlewares/validate.js'
import { registerValidation, loginValidation} from '../validations/authValidation.js'

const router = express.Router()

// Cadastro de usuário (apenas admin criará via UI futuramente)
router.post('/register', registerValidation, validate, register)

// Login
router.post('/login', loginValidation, loginRateLimiter, validate, login)

// Dados do usuário logado
router.get('/me', authMiddleware, me)

router.post('/refresh', refresh);
router.post('/logout', logout);

export default router
