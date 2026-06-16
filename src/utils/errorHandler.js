export function formatErrorResponse(error, defaultMessage = 'Erro interno do servidor.') {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const response = {
    success: false,
    message: defaultMessage,
  };

  if (isDevelopment && error?.message) {
    response.errors = [{ message: error.message }];
  }

  return response;
}

export function errorHandlerMiddleware(error, req, res, next) {
  console.error('Erro não tratado:', error);
  const statusCode = error.statusCode || error.status || 500;
  const response = formatErrorResponse(error, error.message || 'Erro interno do servidor.');
  res.status(statusCode).json(response);
}
