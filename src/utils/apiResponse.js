export function successResponse(res, data, options = {}) {
  const { message, status = 200 } = options;
  const body = { success: true, data };
  if (message) body.message = message;
  return res.status(status).json(body);
}

export function errorResponse(res, message, errors = null, status = 400) {
  const body = { success: false, message };
  if (errors != null) body.errors = errors;
  return res.status(status).json(body);
}

export function paginatedResponse(res, data, pagination, options = {}) {
  const { message, status = 200 } = options;
  const body = { success: true, data, pagination };
  if (message) body.message = message;
  return res.status(status).json(body);
}

export function noContentResponse(res) {
  return res.status(204).send();
}
