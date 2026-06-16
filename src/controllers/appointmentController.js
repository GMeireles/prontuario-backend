import { appointmentService } from '../services/appointmentService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const listAppointments = async (req, res) => {
  try {
    const appointments = await appointmentService.list(req.user.tenant_id);
    return successResponse(res, appointments);
  } catch (err) {
    return errorResponse(res, err.message, null, 500);
  }
};

export const createAppointment = async (req, res) => {
  try {
    const appointment = await appointmentService.create(req.body, req.user.tenant_id, req.user.id);
    return successResponse(res, appointment, { status: 201, message: 'Consulta criada com sucesso' });
  } catch (err) {
    return errorResponse(res, err.message, null, 400);
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const deleted = await appointmentService.delete(req.params.id, req.user.tenant_id);
    if (!deleted) return errorResponse(res, 'Consulta não encontrada', null, 404);
    return successResponse(res, null, { message: 'Consulta removida com sucesso' });
  } catch (err) {
    return errorResponse(res, err.message, null, 400);
  }
};

export const updateAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentService.update(req.params.id, req.body, req.user.tenant_id);
    if (!appointment) {
      return errorResponse(res, 'Consulta não encontrada', null, 404);
    }
    return successResponse(res, appointment, { message: 'Consulta atualizada com sucesso' });
  } catch (error) {
    next(error);
  }
};

export const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentService.cancel(req.params.id, req.body.reason, req.user.tenant_id);
    if (!appointment) {
      return errorResponse(res, 'Consulta não encontrada', null, 404);
    }
    return successResponse(res, appointment, { message: 'Consulta cancelada com sucesso' });
  } catch (error) {
    next(error);
  }
};

export const confirmAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentService.confirm(req.params.id, req.user.tenant_id);
    if (!appointment) {
      return errorResponse(res, 'Consulta não encontrada', null, 404);
    }
    return successResponse(res, appointment, { message: 'Consulta confirmada com sucesso' });
  } catch (error) {
    next(error);
  }
};

export const completeAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentService.complete(req.params.id, req.user.tenant_id);
    if (!appointment) {
      return errorResponse(res, 'Consulta não encontrada', null, 404);
    }
    return successResponse(res, appointment, { message: 'Consulta concluída com sucesso' });
  } catch (error) {
    next(error);
  }
};

export const listTodayAppointments = async (req, res) => {
  try {
    const appointments = await appointmentService.listToday(req.user.tenant_id);
    return successResponse(res, appointments);
  } catch (err) {
    console.error('Erro em listTodayAppointments:', err);
    return errorResponse(res, 'Erro ao carregar consultas de hoje', null, 500);
  }
};
