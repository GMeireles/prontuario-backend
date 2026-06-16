import { body, param } from 'express-validator';

export const anamneseCreateValidation = [
  param('patientId').isInt().withMessage('Paciente inválido'),
  body('main_complaint').notEmpty().withMessage('Queixa principal é obrigatória'),
];

export const anamneseUpdateValidation = [
  body('main_complaint').optional().notEmpty().withMessage('Queixa principal não pode ser vazia'),
  body('medical_history').optional(),
  body('family_history').optional(),
  body('lifestyle').optional(),
  body('allergies').optional()
];
