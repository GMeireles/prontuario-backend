import { tenantService } from '../services/tenantService.js';

export const createTenant = async (req, res, next) => {
  try {
    const tenant = await tenantService.create(req.body);
    res.status(201).json({ success: true, data: tenant });
  } catch (error) {
    next(error);
  }
};

export const listTenants = async (req, res, next) => {
  try {
    const tenants = await tenantService.list();
    res.json({ success: true, data: tenants });
  } catch (error) {
    next(error);
  }
};

export const getTenant = async (req, res, next) => {
  try {
    const tenant = await tenantService.findById(req.params.id);
    if (!tenant) return res.status(404).json({ success: false, message: 'Tenant não encontrado' });
    res.json({ success: true, data: tenant });
  } catch (error) {
    next(error);
  }
};

export const updateTenant = async (req, res, next) => {
  try {
    const tenant = await tenantService.update(req.params.id, req.body);
    if (!tenant) return res.status(404).json({ success: false, message: 'Tenant não encontrado' });
    res.json({ success: true, data: tenant });
  } catch (error) {
    next(error);
  }
};

export const deleteTenant = async (req, res, next) => {
  try {
    const deleted = await tenantService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Tenant não encontrado' });
    res.json({ success: true, message: 'Tenant removido com sucesso' });
  } catch (error) {
    next(error);
  }
};
