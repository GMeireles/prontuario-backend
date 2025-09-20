import { body } from 'express-validator'

export const patientCreateValidation = [
  // body('name')
  //   .notEmpty().withMessage('Nome é obrigatório'),

  // body('cpf')
  //   .notEmpty().withMessage('CPF é obrigatório')
  //   .isLength({ min: 11, max: 11 }).withMessage('CPF deve ter 11 dígitos')
  //   .isNumeric().withMessage('CPF deve conter apenas números'),

  // body('birth_date')
  //   .isDate().withMessage('Data de nascimento inválida'),

  // body('gender')
  //   .notEmpty().withMessage('Sexo é obrigatório')
  //   .isIn(['M', 'F', 'O']).withMessage('Sexo deve ser M, F ou O'),

  // body('email')
  //   .optional()
  //   .isEmail().withMessage('E-mail inválido'),

  // body('phone')
  //   .optional()
  //   .isLength({ min: 8 }).withMessage('Telefone inválido'),

  // body('address')
  //   .optional()
  //   .isLength({ max: 255 }).withMessage('Endereço muito longo'),

  // body('city')
  //   .optional()
  //   .isLength({ max: 100 }).withMessage('Cidade muito longa'),

  // body('state')
  //   .optional()
  //   .isLength({ min: 2, max: 2 }).withMessage('Estado deve ter 2 caracteres'),

  // body('zip_code')
  //   .optional()
  //   .matches(/^\d{5}-?\d{3}$/).withMessage('CEP inválido (use formato 00000-000)'),

  // body('responsible_name')
  //   .optional()
  //   .isLength({ max: 100 }).withMessage('Nome do responsável muito longo')
]

export const patientUpdateValidation = [
  // body('name')
  //   .optional()
  //   .notEmpty().withMessage('Nome não pode estar vazio'),

  // body('cpf')
  //   .optional()
  //   .isLength({ min: 11, max: 11 }).withMessage('CPF deve ter 11 dígitos')
  //   .isNumeric().withMessage('CPF deve conter apenas números'),

  // body('birth_date')
  //   .optional()
  //   .isDate().withMessage('Data de nascimento inválida'),

  // body('gender')
  //   .optional()
  //   .isIn(['M', 'F', 'O']).withMessage('Sexo deve ser M, F ou O'),

  // body('email')
  //   .optional()
  //   .isEmail().withMessage('E-mail inválido'),

  // body('phone')
  //   .optional()
  //   .isLength({ min: 8 }).withMessage('Telefone inválido'),

  // body('address')
  //   .optional()
  //   .isLength({ max: 255 }).withMessage('Endereço muito longo'),

  // body('city')
  //   .optional()
  //   .isLength({ max: 100 }).withMessage('Cidade muito longa'),

  // body('state')
  //   .optional()
  //   .isLength({ min: 2, max: 2 }).withMessage('Estado deve ter 2 caracteres'),

  // body('zip_code')
  //   .optional()
  //   .matches(/^\d{5}-?\d{3}$/).withMessage('CEP inválido (use formato 00000-000)'),

  // body('responsible_name')
  //   .optional()
  //   .isLength({ max: 100 }).withMessage('Nome do responsável muito longo')
]
