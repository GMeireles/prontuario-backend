import { validationResult } from 'express-validator';
import { errorResponse } from '../utils/apiResponse.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(
      res,
      'Erro de validação',
      errors.array().map((e) => ({ field: e.path || e.param, message: e.msg })),
      400
    );
  }
  next();
};
