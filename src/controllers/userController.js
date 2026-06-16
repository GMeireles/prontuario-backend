import { userService } from '../services/userService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const listUsers = async (req, res) => {
  try {
    const users = await userService.list(req.user.tenant_id, req.query);
    return successResponse(res, users);
  } catch (err) {
    return errorResponse(res, err.message, null, 500);
  }
};

export const listProfessionals = async (req, res) => {
  try {
    const users = await userService.list(req.user.tenant_id, { role: 'professional' });
    return successResponse(res, users);
  } catch (err) {
    return errorResponse(res, err.message, null, 500);
  }
};
