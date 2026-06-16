import { Op } from 'sequelize';
import db from '../models/index.js';

const {
  Patient,
  Anamnese,
  Evolution,
  Appointment,
  File,
  Prescription,
  PatientAasi,
  User
} = db;

export const patientSummaryService = {
  async getSummary(patientId, tenantId) {
    const patient = await Patient.findOne({ where: { id: patientId, tenant_id: tenantId } });
    if (!patient) return null;

    const where = { patient_id: patientId, tenant_id: tenantId };

    const [
      anamneses,
      evolutions,
      appointments,
      files,
      prescriptions,
      aasis,
      nextAppointment,
      lastEvolution
    ] = await Promise.all([
      Anamnese.count({ where }),
      Evolution.count({ where }),
      Appointment.count({ where }),
      File.count({ where }),
      Prescription.count({ where }),
      PatientAasi.count({ where: { ...where, active: true } }),
      Appointment.findOne({
        where: {
          ...where,
          date_time: { [Op.gte]: new Date() }
        },
        order: [['date_time', 'ASC']],
        include: [{ model: User, as: 'professional', attributes: ['id', 'name'] }]
      }),
      Evolution.findOne({
        where,
        order: [['createdAt', 'DESC']],
        include: [{ model: User, as: 'professional', attributes: ['id', 'name'] }]
      })
    ]);

    return {
      patient,
      counts: {
        anamneses,
        evolutions,
        appointments,
        files,
        prescriptions,
        aasis
      },
      nextAppointment,
      lastEvolution
    };
  }
};
