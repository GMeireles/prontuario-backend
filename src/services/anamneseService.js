import db from '../models/index.js';

const { Anamnese, Patient, User } = db;

export const anamneseService = {
  create(patientId, data, tenantId, professionalId) {
    return Anamnese.create({
      patient_id: patientId,
      tenant_id: tenantId,
      professional_id: professionalId,
      ...data
    });
  },

  listByPatient(patientId) {
    return Anamnese.findAll({
      where: { patient_id: patientId },
      include: [
        { model: Patient, as: 'patient' },
        { model: User, as: 'professional', attributes: ['id', 'name', 'email'] }
      ]
    });
  },

  getByPatient(patientId, tenantId) {
    return Anamnese.findOne({ where: { patient_id: patientId, tenant_id: tenantId } });
  },

  async findById(id) {
    return Anamnese.findByPk(id);
  },

  async update(id, data) {
    const anamnese = await Anamnese.findByPk(id);
    if (!anamnese) return null;
    await anamnese.update(data);
    return anamnese;
  },

  async delete(id) {
    const anamnese = await Anamnese.findByPk(id);
    if (!anamnese) return false;
    await anamnese.destroy();
    return true;
  }
};
