import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET não configurado.');
  }
  return secret;
}

const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';

export function signAccessToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, tenant_id: user.tenant_id },
    getJwtSecret(),
    { expiresIn: ACCESS_EXPIRES_IN }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, getJwtSecret());
  } catch {
    throw new Error('Token inválido ou expirado');
  }
}
