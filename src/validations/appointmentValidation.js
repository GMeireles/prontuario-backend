// validations/appointmentValidation.js
import { body } from 'express-validator';

export const appointmentCreateValidation = [
  body('patient_id').isInt().withMessage('Paciente inválido'),
  body('professional_id').isInt().withMessage('Profissional inválido'),
  body('date_time').isISO8601().withMessage('Data inválida')
];

export const appointmentUpdateValidation = [
  body('date_time').optional().isISO8601(),
  body('status').optional().isIn(['scheduled', 'confirmed', 'cancelled', 'completed']),
  body('notes').optional()
];

export const appointmentCancelValidation = [
  body('reason').notEmpty().withMessage('Motivo do cancelamento é obrigatório')
];
