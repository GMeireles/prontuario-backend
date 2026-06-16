import { body, param } from 'express-validator';

export const anamneseCreateValidation = [
  param('patientId').isInt().withMessage('Paciente inválido'),
  body('main_complaint').optional(),
  body('templateId').optional().isInt().withMessage('Template inválido'),
  body('answers').optional().isObject().withMessage('Respostas inválidas'),
];

export const anamneseUpdateValidation = [
  body('main_complaint').optional(),
  body('medical_history').optional(),
  body('family_history').optional(),
  body('lifestyle').optional(),
  body('allergies').optional(),
  body('answers').optional().isObject().withMessage('Respostas inválidas')
];

export const anamneseSignValidation = [
  param('id').isInt().withMessage('Anamnese inválida'),
  body('typedName').notEmpty().withMessage('Nome para assinatura é obrigatório'),
  body('confirmationText').notEmpty().withMessage('Texto de confirmação é obrigatório'),
  body('signerDocument').optional()
];
