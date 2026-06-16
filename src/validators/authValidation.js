import { body } from 'express-validator'

export const registerValidation = [
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('E-mail inválido'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres')
]

export const loginValidation = [
  body('email').isEmail().withMessage('E-mail inválido'),
  body('password').notEmpty().withMessage('Senha é obrigatória')
]
