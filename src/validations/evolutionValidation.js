// validations/evolutionValidation.js
import { body } from 'express-validator';

export const evolutionCreateValidation = [
  body('patient_id').isInt().withMessage('Paciente inválido'),
  body('note').notEmpty().withMessage('A evolução não pode ser vazia'),
    body('tenant_id').isInt().withMessage('Tenant ID é obrigatório e deve ser numérico')
];

export const evolutionUpdateValidation = [
  body('note').optional().notEmpty().withMessage('A evolução não pode ser vazia')
];
