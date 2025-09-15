// controllers/appointmentController.js
import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';
import User from '../models/User.js';

export const listAppointments = async (req, res) => {
  const appointments = await Appointment.findAll({ where: { tenant_id: req.tenant_id } })
  res.json(appointments)
}

export const createAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create({
      ...req.body,
      tenant_id: req.tenant_id
    })
    res.status(201).json(appointment)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ where: { id: req.params.id, tenant_id: req.tenant_id } })
    if (!appointment) return res.status(404).json({ error: 'Consulta não encontrada' })

    await appointment.destroy()
    res.json({ message: 'Consulta removida com sucesso' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// Reagendar ou atualizar
export const updateAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date, status, notes } = req.body;

    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Consulta não encontrada' });
    }

    await appointment.update({ date, status, notes });
    res.json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

// Cancelar com motivo
export const cancelAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Consulta não encontrada' });
    }

    await appointment.update({ status: 'cancelled', cancellation_reason: reason });
    res.json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

// Confirmar presença
export const confirmAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Consulta não encontrada' });
    }

    await appointment.update({ status: 'confirmed' });
    res.json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

// Concluir consulta
export const completeAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Consulta não encontrada' });
    }

    await appointment.update({ status: 'completed' });
    res.json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};
