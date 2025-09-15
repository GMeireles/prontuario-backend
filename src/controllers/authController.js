import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid';
import db from '../models/index.js'

const { User, Tenant, RefreshToken } = db

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, tenant_id: user.tenant_id },
    process.env.JWT_SECRET,
    { expiresIn: '15m' } // curta duração
  );
};

const generateRefreshToken = async (user) => {
  const token = uuidv4();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 dias

  await RefreshToken.create({
    user_id: user.id,
    token,
    expires_at: expiresAt
  });

  return token;
};

export const register = async (req, res) => {
  try {
    const { name, email, password, tenant_id } = req.body

    const tenant = await Tenant.findByPk(tenant_id)
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant não encontrado.' })
    }

    const hashed = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password_hash: hashed,
      role: 'admin', // ou 'professional', dependendo da lógica
      tenant_id
    })

    res.status(201).json(user)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Credenciais inválidas.' });

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(401).json({ error: 'Credenciais inválidas.' });

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ error: 'Erro interno no login.' });
  }
};

export const me = async (req, res) => {
  res.json(req.user)
}

export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'Refresh token é obrigatório.' });

    const stored = await RefreshToken.findOne({ where: { token: refreshToken } });
    if (!stored || stored.expires_at < new Date()) {
      return res.status(403).json({ error: 'Refresh token inválido ou expirado.' });
    }

    const user = await User.findByPk(stored.user_id);
    const newAccessToken = generateAccessToken(user);

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(500).json({ error: 'Erro interno ao renovar token.' });
  }
};

export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    await RefreshToken.destroy({ where: { token: refreshToken } });
    res.json({ success: true, message: 'Logout realizado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro interno no logout.' });
  }
};
