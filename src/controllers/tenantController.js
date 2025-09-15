import db from '../models/index.js';

const Tenant = db.Tenant;

export const createTenant = async (req, res, next) => {
  try {
    const { name, cnpj, email, phone, plan } = req.body;

    const tenant = await Tenant.create({ name, cnpj, email, phone, plan });
    res.status(201).json({ success: true, data: tenant });
  } catch (error) {
    next(error);
  }
};

export const listTenants = async (req, res, next) => {
  try {
    const tenants = await Tenant.findAll();
    res.json({ success: true, data: tenants });
  } catch (error) {
    next(error);
  }
};

export const getTenant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tenant = await Tenant.findByPk(id);

    if (!tenant) return res.status(404).json({ success: false, message: 'Tenant não encontrado' });

    res.json({ success: true, data: tenant });
  } catch (error) {
    next(error);
  }
};

export const updateTenant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tenant = await Tenant.findByPk(id);

    if (!tenant) return res.status(404).json({ success: false, message: 'Tenant não encontrado' });

    await tenant.update(req.body);
    res.json({ success: true, data: tenant });
  } catch (error) {
    next(error);
  }
};

export const deleteTenant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tenant = await Tenant.findByPk(id);

    if (!tenant) return res.status(404).json({ success: false, message: 'Tenant não encontrado' });

    await tenant.destroy();
    res.json({ success: true, message: 'Tenant removido com sucesso' });
  } catch (error) {
    next(error);
  }
};
