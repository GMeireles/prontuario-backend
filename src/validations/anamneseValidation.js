// validations/anamneseValidation.js
import { body } from 'express-validator';

export const anamneseCreateValidation = [
  body('patient_id').isInt().withMessage('Paciente inválido'),
  body('main_complaint').notEmpty().withMessage('Queixa principal é obrigatória'),
  body('tenant_id').isInt().withMessage('Tenant ID é obrigatório e deve ser numérico')
];

export const anamneseUpdateValidation = [
  body('main_complaint').optional().notEmpty().withMessage('Queixa principal não pode ser vazia'),
  body('medical_history').optional(),
  body('family_history').optional(),
  body('lifestyle').optional(),
  body('allergies').optional()
];
