import { body } from 'express-validator'

export const recordCreateValidation = [
  body('description').notEmpty().withMessage('Descrição é obrigatória')
]

export const recordUpdateValidation = [
  body('description').optional().notEmpty().withMessage('Descrição não pode estar vazia')
]
