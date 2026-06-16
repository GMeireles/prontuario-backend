import db from '../models/index.js';
import { Op } from 'sequelize';

const { Appointment, Patient, User } = db;

export const appointmentService = {
  list(tenantId) {
    return Appointment.findAll({
      where: { tenant_id: tenantId },
      include: [
        { model: Patient, as: 'patient' },
        { model: User, as: 'professional', attributes: ['id', 'name', 'email'] }
      ],
      order: [['date_time', 'ASC']]
    });
  },

  listToday(tenantId) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return Appointment.findAll({
      where: {
        tenant_id: tenantId,
        date_time: { [Op.between]: [start, end] }
      },
      include: [
        { model: Patient, as: 'patient', attributes: ['id', 'name'] },
        { model: User, as: 'professional', attributes: ['id', 'name'] }
      ],
      order: [['date_time', 'ASC']]
    });
  },

  create(data, tenantId, professionalId) {
    return Appointment.create({
      ...data,
      tenant_id: tenantId,
      professional_id: data.professional_id || professionalId
    });
  },

  async findById(id, tenantId) {
    return Appointment.findOne({ where: { id, tenant_id: tenantId } });
  },

  async update(id, data, tenantId) {
    const appointment = await this.findById(id, tenantId);
    if (!appointment) return null;
    await appointment.update(data);
    return appointment;
  },

  async delete(id, tenantId) {
    const appointment = await this.findById(id, tenantId);
    if (!appointment) return false;
    await appointment.destroy();
    return true;
  },

  async cancel(id, reason, tenantId) {
    return this.update(id, { status: 'cancelled', cancellation_reason: reason }, tenantId);
  },

  async confirm(id, tenantId) {
    return this.update(id, { status: 'confirmed' }, tenantId);
  },

  async complete(id, tenantId) {
    return this.update(id, { status: 'completed' }, tenantId);
  }
};
