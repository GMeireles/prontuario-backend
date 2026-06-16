import { authService } from '../services/authService.js';
import { getPermissionsForRole, getProfileLabel } from '../config/permissions.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    return successResponse(res, user, { status: 201, message: 'Usuário registrado com sucesso' });
  } catch (err) {
    return errorResponse(res, err.message, null, err.status || 400);
  }
};

export const login = async (req, res) => {
  try {
    const tokens = await authService.login(req.body);
    return successResponse(res, tokens);
  } catch (err) {
    return errorResponse(res, err.message || 'Erro interno no login.', null, err.status || 500);
  }
};

export const me = async (req, res) => {
  return successResponse(res, {
    ...req.user,
    permissions: getPermissionsForRole(req.user.role),
    profile: getProfileLabel(req.user.role),
  });
};

export const refresh = async (req, res) => {
  try {
    const result = await authService.refresh(req.body.refreshToken);
    return successResponse(res, result);
  } catch (err) {
    return errorResponse(res, err.message || 'Erro interno ao renovar token.', null, err.status || 500);
  }
};

export const logout = async (req, res) => {
  try {
    await authService.logout(req.body.refreshToken);
    return successResponse(res, null, { message: 'Logout realizado com sucesso' });
  } catch (err) {
    return errorResponse(res, 'Erro interno no logout.', null, 500);
  }
};
