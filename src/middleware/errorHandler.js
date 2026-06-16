import { formatErrorResponse } from '../utils/errorHandler.js';

export const errorHandler = (err, req, res, next) => {
  console.error('Erro capturado:', err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json(formatErrorResponse(err, err.message || 'Erro interno do servidor'));
};
