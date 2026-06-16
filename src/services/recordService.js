import db from '../models/index.js';

const { Record } = db;

export const recordService = {
  listByPatient(patientId, tenantId) {
    return Record.findAll({
      where: { patient_id: patientId, tenant_id: tenantId }
    });
  },

  create(patientId, description, tenantId) {
    return Record.create({
      patient_id: patientId,
      description,
      tenant_id: tenantId
    });
  },

  async findById(id, tenantId) {
    return Record.findOne({ where: { id, tenant_id: tenantId } });
  },

  async update(id, description, tenantId) {
    const record = await this.findById(id, tenantId);
    if (!record) return null;
    await record.update({ description });
    return record;
  },

  async delete(id, tenantId) {
    const record = await this.findById(id, tenantId);
    if (!record) return false;
    await record.destroy();
    return true;
  }
};
