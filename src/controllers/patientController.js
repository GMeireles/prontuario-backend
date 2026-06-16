import { patientService } from '../services/patientService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const listPatients = async (req, res) => {
  try {
    const patients = await patientService.list(req.user.tenant_id);
    return successResponse(res, patients);
  } catch (err) {
    return errorResponse(res, err.message, null, 500);
  }
};

export const createPatient = async (req, res) => {
  try {
    const patient = await patientService.create(req.body, req.user.tenant_id);
    return successResponse(res, patient, { status: 201, message: 'Paciente criado com sucesso' });
  } catch (err) {
    return errorResponse(res, err.message, null, err.status || 400);
  }
};

export const updatePatient = async (req, res) => {
  try {
    const patient = await patientService.update(req.params.id, req.body, req.user.tenant_id);
    if (!patient) return errorResponse(res, 'Paciente não encontrado', null, 404);
    return successResponse(res, patient, { message: 'Paciente atualizado com sucesso' });
  } catch (err) {
    return errorResponse(res, err.message, null, err.status || 400);
  }
};

export const deletePatient = async (req, res) => {
  try {
    const deleted = await patientService.delete(req.params.id, req.user.tenant_id);
    if (!deleted) return errorResponse(res, 'Paciente não encontrado', null, 404);
    return successResponse(res, null, { message: 'Paciente removido com sucesso' });
  } catch (err) {
    return errorResponse(res, err.message, null, 400);
  }
};

export const listRecentPatients = async (req, res) => {
  try {
    const patients = await patientService.listRecent(req.user.tenant_id);
    return successResponse(res, patients);
  } catch (err) {
    return errorResponse(res, err.message, null, 500);
  }
};

export const getPatient = async (req, res) => {
  try {
    const patient = await patientService.getById(req.params.id, req.user.tenant_id);
    if (!patient) return errorResponse(res, 'Paciente não encontrado', null, 404);
    return successResponse(res, patient);
  } catch (err) {
    return errorResponse(res, err.message, null, 500);
  }
};
