import { hasPermission } from '../config/permissions.js';
import { errorResponse } from '../utils/apiResponse.js';

export const requireAuth = (req, res, next) => {
  if (!req.user?.id) {
    return errorResponse(res, 'Autenticação necessária', null, 401);
  }
  next();
};

export const requirePermission = (...permissions) => {
  return (req, res, next) => {
    if (!req.user?.id) {
      return errorResponse(res, 'Autenticação necessária', null, 401);
    }

    const allowed = permissions.some((p) => hasPermission(req.user.role, p));
    if (!allowed) {
      return errorResponse(res, 'Permissão negada', null, 403);
    }
    next();
  };
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user?.id) {
      return errorResponse(res, 'Autenticação necessária', null, 401);
    }
    if (!roles.includes(req.user.role)) {
      return errorResponse(res, 'Permissão negada', null, 403);
    }
    next();
  };
};
