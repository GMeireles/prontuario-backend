import fs from 'fs';
import path from 'path';
import db from '../models/index.js';
import { Op } from 'sequelize';

const { File } = db;

export const fileService = {
  createFromUpload(file, body, tenantId, uploadedBy) {
    return File.create({
      filename: file.filename,
      filepath: file.path,
      mimetype: file.mimetype,
      size: file.size,
      type: body.type || 'document',
      patient_id: body.patient_id,
      tenant_id: tenantId,
      uploaded_by: uploadedBy
    });
  },

  async findById(id, tenantId) {
    const file = await File.findByPk(id);
    if (!file || file.tenant_id !== tenantId) return null;
    return file;
  },

  listByPatient(patientId) {
    return File.findAll({
      where: {
        patient_id: patientId,
        type: { [Op.ne]: 'prescription' }
      },
      order: [['created_at', 'DESC']]
    });
  },

  async delete(id, tenantId) {
    const file = await this.findById(id, tenantId);
    if (!file) return false;
    fs.unlinkSync(path.resolve(file.filepath));
    await file.destroy();
    return true;
  }
};
