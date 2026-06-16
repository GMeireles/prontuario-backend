import { errorResponse } from '../utils/apiResponse.js';

export const notFoundHandler = (req, res) => {
  errorResponse(res, 'Rota não encontrada', null, 404);
};
