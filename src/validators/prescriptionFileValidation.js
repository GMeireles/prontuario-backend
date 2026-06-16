// validations/prescriptionFileValidation.js
import { body } from 'express-validator';

export const prescriptionFileAddValidation = [
  body('file_id')
    .isInt().withMessage('O ID do arquivo deve ser um número inteiro')
    .notEmpty().withMessage('O campo file_id é obrigatório')
];
