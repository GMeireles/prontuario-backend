import { validationResult } from 'express-validator'

export const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Erro de validação',
      details: errors.array().map(e => ({ field: e.param, message: e.msg }))
    })
  }
  next()
}
