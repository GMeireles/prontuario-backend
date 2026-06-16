import { verifyToken } from '../utils/jwt.js';
import db from '../models/index.js';
import { formatErrorResponse } from '../utils/errorHandler.js';

const { User } = db;

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ error: 'Formato de token inválido' });
    }

    const decoded = verifyToken(parts[1]);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      tenant_id: user.tenant_id
    };
    req.userId = user.id;

    next();
  } catch (error) {
    return res.status(403).json(formatErrorResponse(error, 'Token inválido'));
  }
};
