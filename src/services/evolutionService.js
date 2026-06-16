import db from '../models/index.js';

const { Evolution, Patient, User } = db;

export const evolutionService = {
  create(patientId, note, tenantId, professionalId) {
    return Evolution.create({
      patient_id: patientId,
      tenant_id: tenantId,
      professional_id: professionalId,
      note
    });
  },

  listByPatient(patientId, tenantId) {
    return Evolution.findAll({
      where: { patient_id: patientId, tenant_id: tenantId },
      include: [
        { model: Patient, as: 'patient' },
        { model: User, as: 'professional', attributes: ['id', 'name', 'email'] }
      ],
      attributes: ['id', 'note', 'created_at', 'updated_at'],
      order: [['created_at', 'DESC']]
    });
  },

  async findById(id, tenantId) {
    return Evolution.findOne({ where: { id, tenant_id: tenantId } });
  },

  async update(id, data, tenantId) {
    const evolution = await this.findById(id, tenantId);
    if (!evolution) return null;
    await evolution.update(data);
    return evolution;
  },

  async delete(id, tenantId) {
    const evolution = await this.findById(id, tenantId);
    if (!evolution) return false;
    await evolution.destroy();
    return true;
  }
};
