import { body } from 'express-validator';

export const patientCreateValidation = [
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('cpf')
    .notEmpty().withMessage('CPF é obrigatório')
    .isLength({ min: 11, max: 11 }).withMessage('CPF deve ter 11 dígitos')
    .isNumeric().withMessage('CPF deve conter apenas números'),
  body('birth_date').isDate().withMessage('Data de nascimento inválida'),
  body('gender')
    .notEmpty().withMessage('Sexo é obrigatório')
    .isIn(['M', 'F', 'O']).withMessage('Sexo deve ser M, F ou O'),
  body('email').optional({ values: 'falsy' }).isEmail().withMessage('E-mail inválido'),
  body('phone').optional({ values: 'falsy' }).isLength({ min: 8 }).withMessage('Telefone inválido'),
  body('rg').optional({ values: 'falsy' }).isLength({ max: 20 }).withMessage('RG muito longo'),
  body('notes').optional({ values: 'falsy' }).isLength({ max: 5000 }).withMessage('Observações muito longas'),
  body('address').optional({ values: 'falsy' }).isLength({ max: 255 }).withMessage('Endereço muito longo'),
  body('city').optional({ values: 'falsy' }).isLength({ max: 100 }).withMessage('Cidade muito longa'),
  body('state').optional({ values: 'falsy' }).isLength({ min: 2, max: 2 }).withMessage('Estado deve ter 2 caracteres'),
  body('zip_code').optional({ values: 'falsy' }).matches(/^\d{5}-?\d{3}$/).withMessage('CEP inválido'),
  body('responsible_name').optional({ values: 'falsy' }).isLength({ max: 100 }).withMessage('Nome do responsável muito longo')
];

export const patientUpdateValidation = [
  body('name').optional().notEmpty().withMessage('Nome não pode estar vazio'),
  body('cpf')
    .optional()
    .isLength({ min: 11, max: 11 }).withMessage('CPF deve ter 11 dígitos')
    .isNumeric().withMessage('CPF deve conter apenas números'),
  body('birth_date').optional().isDate().withMessage('Data de nascimento inválida'),
  body('gender').optional().isIn(['M', 'F', 'O']).withMessage('Sexo deve ser M, F ou O'),
  body('email').optional({ values: 'falsy' }).isEmail().withMessage('E-mail inválido'),
  body('phone').optional({ values: 'falsy' }).isLength({ min: 8 }).withMessage('Telefone inválido'),
  body('rg').optional({ values: 'falsy' }).isLength({ max: 20 }).withMessage('RG muito longo'),
  body('notes').optional({ values: 'falsy' }).isLength({ max: 5000 }).withMessage('Observações muito longas'),
  body('address').optional({ values: 'falsy' }).isLength({ max: 255 }).withMessage('Endereço muito longo'),
  body('city').optional({ values: 'falsy' }).isLength({ max: 100 }).withMessage('Cidade muito longa'),
  body('state').optional({ values: 'falsy' }).isLength({ min: 2, max: 2 }).withMessage('Estado deve ter 2 caracteres'),
  body('zip_code').optional({ values: 'falsy' }).matches(/^\d{5}-?\d{3}$/).withMessage('CEP inválido'),
  body('responsible_name').optional({ values: 'falsy' }).isLength({ max: 100 }).withMessage('Nome do responsável muito longo'),
  body('active').optional().isBoolean().withMessage('active deve ser booleano')
];
