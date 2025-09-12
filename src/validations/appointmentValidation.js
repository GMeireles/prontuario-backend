import { body } from 'express-validator'

export const appointmentCreateValidation = [
  body('patient_id').isInt().withMessage('Paciente inválido'),
  body('date_time').isISO8601().withMessage('Data/hora inválida'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Observação muito longa')
]

export const appointmentUpdateValidation = [
  body('date_time').optional().isISO8601().withMessage('Data/hora inválida'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Observação muito longa')
]
