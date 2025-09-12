import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import db from '../models/index.js'

const { User } = db

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body
    const hashed = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password_hash: hashed,
      role: 'admin', // pode mudar conforme lógica
      tenant_id: 1
    })

    res.status(201).json(user)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.warn(`[AUTH] Tentativa de login com email inexistente: ${email}`);
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      console.warn(`[AUTH] Senha incorreta para usuário: ${email}`);
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, tenant_id: user.tenant_id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token });

  } catch (err) {
    console.error('[AUTH] Erro inesperado no login:', err);
    res.status(500).json({ error: 'Erro interno ao tentar realizar login.' });
  }
};

export const me = async (req, res) => {
  res.json(req.user)
}
