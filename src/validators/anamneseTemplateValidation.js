import { body, param } from 'express-validator';

const FIELD_TYPES = ['text', 'textarea', 'number', 'boolean', 'select', 'multiselect', 'date'];

export const templateCreateValidation = [
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('description').optional(),
  body('active').optional().isBoolean(),
  body('is_default').optional().isBoolean()
];

export const templateUpdateValidation = [
  param('id').isInt(),
  body('name').optional().notEmpty(),
  body('description').optional(),
  body('active').optional().isBoolean(),
  body('is_default').optional().isBoolean()
];

export const templateFieldCreateValidation = [
  param('id').isInt(),
  body('label').notEmpty().withMessage('Label é obrigatório'),
  body('key').notEmpty().withMessage('Key é obrigatória'),
  body('type').optional().isIn(FIELD_TYPES),
  body('options').optional(),
  body('placeholder').optional(),
  body('help_text').optional(),
  body('required').optional().isBoolean(),
  body('order_index').optional().isInt()
];

export const templateFieldUpdateValidation = [
  param('id').isInt(),
  param('fieldId').isInt(),
  body('label').optional().notEmpty(),
  body('key').optional().notEmpty(),
  body('type').optional().isIn(FIELD_TYPES),
  body('options').optional(),
  body('placeholder').optional(),
  body('help_text').optional(),
  body('required').optional().isBoolean(),
  body('order_index').optional().isInt(),
  body('active').optional().isBoolean()
];
