import express from 'express';
import { register, login, me, refresh, logout } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { loginRateLimiter } from '../middleware/rateLimit.js';
import { validate } from '../middleware/validate.js';
import { registerValidation, loginValidation } from '../validators/authValidation.js';

const router = express.Router();

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, loginRateLimiter, validate, login);
router.get('/me', authMiddleware, me);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;
