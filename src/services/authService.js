import bcrypt from 'bcrypt';
import crypto from 'crypto';
import db from '../models/index.js';
import { signAccessToken } from '../utils/jwt.js';

const { User, Tenant, RefreshToken } = db;

const generateRefreshToken = async (user) => {
  const token = crypto.randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await RefreshToken.create({
    user_id: user.id,
    token,
    expires_at: expiresAt
  });

  return token;
};

export const authService = {
  async register({ name, email, password, tenant_id }) {
    const tenant = await Tenant.findByPk(tenant_id);
    if (!tenant) {
      const err = new Error('Tenant não encontrado.');
      err.status = 404;
      throw err;
    }

    const hashed = await bcrypt.hash(password, 10);
    return User.create({
      name,
      email,
      password_hash: hashed,
      role: 'admin',
      tenant_id
    });
  },

  async login({ email, password }) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      const err = new Error('Credenciais inválidas.');
      err.status = 401;
      throw err;
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      const err = new Error('Credenciais inválidas.');
      err.status = 401;
      throw err;
    }

    const accessToken = signAccessToken(user);
    const refreshToken = await generateRefreshToken(user);
    return { accessToken, refreshToken };
  },

  async refresh(refreshToken) {
    if (!refreshToken) {
      const err = new Error('Refresh token é obrigatório.');
      err.status = 400;
      throw err;
    }

    const stored = await RefreshToken.findOne({ where: { token: refreshToken } });
    if (!stored || stored.expires_at < new Date()) {
      const err = new Error('Refresh token inválido ou expirado.');
      err.status = 403;
      throw err;
    }

    const user = await User.findByPk(stored.user_id);
    return { accessToken: signAccessToken(user) };
  },

  async logout(refreshToken) {
    await RefreshToken.destroy({ where: { token: refreshToken } });
  }
};
