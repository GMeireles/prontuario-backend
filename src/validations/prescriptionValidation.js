// validations/prescriptionValidation.js
import { body } from 'express-validator';

export const prescriptionCreateValidation = [
  body('patient_id').isInt().withMessage('Paciente inválido'),
  body('type').isIn(['medication', 'conduct', 'referral']).withMessage('Tipo inválido'),
  body('description').notEmpty().withMessage('Descrição é obrigatória'),
  body('dosage').optional(),
  body('frequency').optional(),
  body('duration').optional(),
    body('tenant_id').isInt().withMessage('Tenant ID é obrigatório e deve ser numérico')
];

export const prescriptionUpdateValidation = [
  body('type').optional().isIn(['medication', 'conduct', 'referral']),
  body('description').optional().notEmpty(),
  body('dosage').optional(),
  body('frequency').optional(),
  body('duration').optional()
];
