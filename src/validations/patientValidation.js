import { body } from 'express-validator'

export const patientCreateValidation = [
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('birth_date').isDate().withMessage('Data de nascimento inválida'),
  body('email').optional().isEmail().withMessage('E-mail inválido'),
  body('phone').optional().isLength({ min: 8 }).withMessage('Telefone inválido')
]

export const patientUpdateValidation = [
  body('name').optional().notEmpty().withMessage('Nome não pode estar vazio'),
  body('birth_date').optional().isDate().withMessage('Data de nascimento inválida'),
  body('email').optional().isEmail().withMessage('E-mail inválido'),
  body('phone').optional().isLength({ min: 8 }).withMessage('Telefone inválido')
]
