import db from '../models/index.js';
import { planLimitsService } from './planLimitsService.js';

const { Patient } = db;

function validateResponsible(birth_date, responsible_name) {
  const age = Math.floor((Date.now() - new Date(birth_date).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  if (age < 18 && !responsible_name) {
    const err = new Error('Responsável é obrigatório para menores de 18 anos');
    err.status = 400;
    throw err;
  }
  return age;
}

export const patientService = {
  list(tenantId) {
    return Patient.findAll({ where: { tenant_id: tenantId } });
  },

  listRecent(tenantId) {
    return Patient.findAll({
      where: { tenant_id: tenantId },
      order: [['createdAt', 'DESC']],
      limit: 5
    });
  },

  getById(id, tenantId) {
    return Patient.findOne({ where: { id, tenant_id: tenantId } });
  },

  async create(data, tenantId) {
    await planLimitsService.assertCanCreatePatient(tenantId);
    const age = validateResponsible(data.birth_date, data.responsible_name);
    return Patient.create({
      ...data,
      responsible_name: age < 18 ? data.responsible_name : null,
      tenant_id: tenantId
    });
  },

  async update(id, data, tenantId) {
    const patient = await Patient.findOne({ where: { id, tenant_id: tenantId } });
    if (!patient) return null;

    const age = validateResponsible(data.birth_date, data.responsible_name);
    await patient.update({
      ...data,
      responsible_name: age < 18 ? data.responsible_name : null
    });
    return patient;
  },

  async delete(id, tenantId) {
    const patient = await Patient.findOne({ where: { id, tenant_id: tenantId } });
    if (!patient) return false;
    await patient.destroy();
    return true;
  }
};
