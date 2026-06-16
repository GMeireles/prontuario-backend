import { body, param } from 'express-validator';

export const evolutionCreateValidation = [
  param('patientId').isInt().withMessage('Paciente inválido'),
  body('note').notEmpty().withMessage('A evolução não pode ser vazia')
];

export const evolutionUpdateValidation = [
  body('note').optional().notEmpty().withMessage('A evolução não pode ser vazia')
];
