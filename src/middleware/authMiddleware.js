import { verifyToken } from '../utils/jwt.js';
import db from '../models/index.js';
import { getPermissionsForRole, getProfileLabel } from '../config/permissions.js';
import { errorResponse } from '../utils/apiResponse.js';

const { User } = db;

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return errorResponse(res, 'Token não fornecido', null, 401);
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return errorResponse(res, 'Formato de token inválido', null, 401);
    }

    const decoded = verifyToken(parts[1]);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return errorResponse(res, 'Usuário não encontrado', null, 401);
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: getProfileLabel(user.role),
      tenant_id: user.tenant_id,
      permissions: getPermissionsForRole(user.role),
    };
    req.userId = user.id;

    next();
  } catch (error) {
    return errorResponse(res, 'Token inválido', null, 403);
  }
};
