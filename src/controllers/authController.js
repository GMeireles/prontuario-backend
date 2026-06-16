import { authService } from '../services/authService.js';

export const register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(err.status || 400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const tokens = await authService.login(req.body);
    res.json(tokens);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Erro interno no login.' });
  }
};

export const me = async (req, res) => {
  res.json(req.user);
};

export const refresh = async (req, res) => {
  try {
    const result = await authService.refresh(req.body.refreshToken);
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Erro interno ao renovar token.' });
  }
};

export const logout = async (req, res) => {
  try {
    await authService.logout(req.body.refreshToken);
    res.json({ success: true, message: 'Logout realizado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro interno no logout.' });
  }
};
