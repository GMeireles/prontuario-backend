import { tenantService } from '../services/tenantService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const createTenant = async (req, res, next) => {
  try {
    const tenant = await tenantService.create(req.body);
    return successResponse(res, tenant, { status: 201, message: 'Tenant criado com sucesso' });
  } catch (error) {
    next(error);
  }
};

export const listTenants = async (req, res, next) => {
  try {
    const tenants = await tenantService.list();
    return successResponse(res, tenants);
  } catch (error) {
    next(error);
  }
};

export const getTenant = async (req, res, next) => {
  try {
    const tenant = await tenantService.findById(req.params.id);
    if (!tenant) return errorResponse(res, 'Tenant não encontrado', null, 404);
    return successResponse(res, tenant);
  } catch (error) {
    next(error);
  }
};

export const updateTenant = async (req, res, next) => {
  try {
    const tenant = await tenantService.update(req.params.id, req.body);
    if (!tenant) return errorResponse(res, 'Tenant não encontrado', null, 404);
    return successResponse(res, tenant, { message: 'Tenant atualizado com sucesso' });
  } catch (error) {
    next(error);
  }
};

export const deleteTenant = async (req, res, next) => {
  try {
    const deleted = await tenantService.delete(req.params.id);
    if (!deleted) return errorResponse(res, 'Tenant não encontrado', null, 404);
    return successResponse(res, null, { message: 'Tenant removido com sucesso' });
  } catch (error) {
    next(error);
  }
};
