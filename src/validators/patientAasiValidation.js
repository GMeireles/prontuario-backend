import { body, param } from 'express-validator';

const EAR_VALUES = ['right', 'left', 'bilateral', 'unknown'];

export const patientIdParam = [
  param('patientId').isInt({ min: 1 }).withMessage('Paciente inválido')
];

export const aasiIdParam = [
  param('aasiId').isInt({ min: 1 }).withMessage('AASI inválido')
];

export const patientAasiCreateValidation = [
  ...patientIdParam,
  body('ear').optional().isIn(EAR_VALUES).withMessage('Orelha inválida'),
  body('brand').optional({ values: 'falsy' }).isLength({ max: 100 }),
  body('model').optional({ values: 'falsy' }).isLength({ max: 100 }),
  body('serial_number').optional({ values: 'falsy' }).isLength({ max: 100 }),
  body('power').optional({ values: 'falsy' }).isLength({ max: 50 }),
  body('technology').optional({ values: 'falsy' }).isLength({ max: 100 }),
  body('color').optional({ values: 'falsy' }).isLength({ max: 50 }),
  body('supplier').optional({ values: 'falsy' }).isLength({ max: 150 }),
  body('acquisition_date').optional({ values: 'falsy' }).isDate(),
  body('adaptation_date').optional({ values: 'falsy' }).isDate(),
  body('warranty_until').optional({ values: 'falsy' }).isDate(),
  body('notes').optional({ values: 'falsy' }).isLength({ max: 5000 })
];

export const patientAasiUpdateValidation = [
  ...patientIdParam,
  ...aasiIdParam,
  body('ear').optional().isIn(EAR_VALUES).withMessage('Orelha inválida'),
  body('brand').optional({ values: 'falsy' }).isLength({ max: 100 }),
  body('model').optional({ values: 'falsy' }).isLength({ max: 100 }),
  body('serial_number').optional({ values: 'falsy' }).isLength({ max: 100 }),
  body('power').optional({ values: 'falsy' }).isLength({ max: 50 }),
  body('technology').optional({ values: 'falsy' }).isLength({ max: 100 }),
  body('color').optional({ values: 'falsy' }).isLength({ max: 50 }),
  body('supplier').optional({ values: 'falsy' }).isLength({ max: 150 }),
  body('acquisition_date').optional({ values: 'falsy' }).isDate(),
  body('adaptation_date').optional({ values: 'falsy' }).isDate(),
  body('warranty_until').optional({ values: 'falsy' }).isDate(),
  body('notes').optional({ values: 'falsy' }).isLength({ max: 5000 }),
  body('active').optional().isBoolean()
];

export const patientAasiGetValidation = [...patientIdParam, ...aasiIdParam];
export const patientAasiListValidation = [...patientIdParam];
export const patientAasiDeleteValidation = [...patientIdParam, ...aasiIdParam];
