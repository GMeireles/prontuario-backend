import db from '../models/index.js';

const { Tenant } = db;

export const tenantService = {
  create(data) {
    return Tenant.create(data);
  },

  list() {
    return Tenant.findAll();
  },

  findById(id) {
    return Tenant.findByPk(id);
  },

  async update(id, data) {
    const tenant = await Tenant.findByPk(id);
    if (!tenant) return null;
    await tenant.update(data);
    return tenant;
  },

  async delete(id) {
    const tenant = await Tenant.findByPk(id);
    if (!tenant) return false;
    await tenant.destroy();
    return true;
  }
};
