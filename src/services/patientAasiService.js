import db from '../models/index.js';

const { Patient, PatientAasi } = db;

async function assertPatientInTenant(patientId, tenantId) {
  const patient = await Patient.findOne({ where: { id: patientId, tenant_id: tenantId } });
  if (!patient) {
    const err = new Error('Paciente não encontrado');
    err.status = 404;
    throw err;
  }
  return patient;
}

export const patientAasiService = {
  async listByPatient(patientId, tenantId, { active } = {}) {
    await assertPatientInTenant(patientId, tenantId);
    const where = { patient_id: patientId, tenant_id: tenantId };
    if (active === 'true') where.active = true;
    else if (active === 'false') where.active = false;

    return PatientAasi.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });
  },

  async getById(patientId, aasiId, tenantId) {
    await assertPatientInTenant(patientId, tenantId);
    return PatientAasi.findOne({
      where: { id: aasiId, patient_id: patientId, tenant_id: tenantId }
    });
  },

  async create(patientId, tenantId, data, userId) {
    await assertPatientInTenant(patientId, tenantId);
    return PatientAasi.create({
      ...data,
      patient_id: patientId,
      tenant_id: tenantId,
      created_by: userId,
      updated_by: userId,
      ear: data.ear || 'unknown',
      active: data.active !== false
    });
  },

  async update(patientId, aasiId, tenantId, data, userId) {
    const row = await this.getById(patientId, aasiId, tenantId);
    if (!row) return null;
    await row.update({ ...data, updated_by: userId });
    return row;
  },

  async deactivate(patientId, aasiId, tenantId, userId) {
    const row = await this.getById(patientId, aasiId, tenantId);
    if (!row) return null;
    await row.update({ active: false, updated_by: userId });
    return row;
  }
};
