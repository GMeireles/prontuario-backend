export function formatErrorResponse(error, defaultMessage = 'Erro interno do servidor.') {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const response = { error: defaultMessage };

  if (isDevelopment && error?.message) {
    response.details = error.message;
  }

  return response;
}

export function errorHandlerMiddleware(error, req, res, next) {
  console.error('Erro não tratado:', error);
  const statusCode = error.statusCode || error.status || 500;
  const message = error.message || 'Erro interno do servidor.';
  res.status(statusCode).json(formatErrorResponse(error, message));
}
