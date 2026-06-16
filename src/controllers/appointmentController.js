import { appointmentService } from '../services/appointmentService.js';

export const listAppointments = async (req, res) => {
  try {
    const appointments = await appointmentService.list(req.user.tenant_id);
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const appointment = await appointmentService.create(req.body, req.user.tenant_id, req.user.id);
    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const deleted = await appointmentService.delete(req.params.id, req.user.tenant_id);
    if (!deleted) return res.status(404).json({ error: 'Consulta não encontrada' });
    res.json({ message: 'Consulta removida com sucesso' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentService.update(req.params.id, req.body, req.user.tenant_id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Consulta não encontrada' });
    }
    res.json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

export const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentService.cancel(req.params.id, req.body.reason, req.user.tenant_id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Consulta não encontrada' });
    }
    res.json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

export const confirmAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentService.confirm(req.params.id, req.user.tenant_id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Consulta não encontrada' });
    }
    res.json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

export const completeAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentService.complete(req.params.id, req.user.tenant_id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Consulta não encontrada' });
    }
    res.json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

export const listTodayAppointments = async (req, res) => {
  try {
    const appointments = await appointmentService.listToday(req.user.tenant_id);
    res.json(appointments);
  } catch (err) {
    console.error('Erro em listTodayAppointments:', err);
    res.status(500).json({ error: 'Erro ao carregar consultas de hoje' });
  }
};
