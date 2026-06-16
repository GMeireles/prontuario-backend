import db from '../models/index.js';
import { buildPaginationMeta } from '../utils/pagination.js';

const { Prescription, Patient, User, PrescriptionFile, File } = db;

export const prescriptionService = {
  create(data, tenantId, professionalId) {
    return Prescription.create({
      ...data,
      professional_id: professionalId,
      tenant_id: tenantId
    });
  },

  async listByPatient(patientId, { page = 1, limit = 10, type } = {}) {
    const offset = (page - 1) * limit;
    const where = { patient_id: patientId };
    if (type) where.type = type;

    const { rows, count } = await Prescription.findAndCountAll({
      where,
      include: [
        { model: Patient, as: 'patient' },
        { model: User, as: 'professional', attributes: ['id', 'name', 'email'] },
        {
          model: PrescriptionFile,
          as: 'prescription_files',
          include: [{ model: File, as: 'file' }]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10)
    });

    return {
      data: rows,
      pagination: buildPaginationMeta(count, page, limit)
    };
  },

  async findById(id) {
    return Prescription.findByPk(id);
  },

  async update(id, data) {
    const prescription = await Prescription.findByPk(id);
    if (!prescription) return null;
    await prescription.update(data);
    return prescription;
  },

  async delete(id) {
    const prescription = await Prescription.findByPk(id);
    if (!prescription) return false;
    await prescription.destroy();
    return true;
  }
};
