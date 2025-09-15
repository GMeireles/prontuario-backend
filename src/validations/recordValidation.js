import { body } from 'express-validator'

export const recordCreateValidation = [
  body('description').notEmpty().withMessage('Descrição é obrigatória'),
    body('tenant_id').isInt().withMessage('Tenant ID é obrigatório e deve ser numérico')
]

export const recordUpdateValidation = [
  body('description').optional().notEmpty().withMessage('Descrição não pode estar vazia')
]
