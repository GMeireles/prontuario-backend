import { errorResponse } from '../utils/apiResponse.js';

/** @deprecated Prefer requirePermission — mantido para compatibilidade interna */
export const roleMiddleware = (roles = []) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return errorResponse(res, 'Permissão negada', null, 403);
    }
    next();
  };
};
