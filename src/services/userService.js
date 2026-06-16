import db from '../models/index.js';

const { User } = db;

export const userService = {
  list(tenantId, { role } = {}) {
    const where = { tenant_id: tenantId };
    if (role) where.role = role;

    return User.findAll({
      where,
      attributes: ['id', 'name', 'email', 'role'],
      order: [['name', 'ASC']]
    });
  }
};
