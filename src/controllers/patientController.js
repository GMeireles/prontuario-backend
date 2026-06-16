import { patientService } from '../services/patientService.js';
import { patientSummaryService } from '../services/patientSummaryService.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';

export const listPatients = async (req, res) => {
  try {
    const result = await patientService.list(req.tenant_id, req.query);
    return paginatedResponse(res, result.data, result.pagination);
  } catch (err) {
    return errorResponse(res, err.message, null, 500);
  }
};

export const createPatient = async (req, res) => {
  try {
    const patient = await patientService.create(req.body, req.tenant_id);
    return successResponse(res, patient, { status: 201, message: 'Paciente criado com sucesso' });
  } catch (err) {
    return errorResponse(res, err.message, null, err.status || 400);
  }
};

export const updatePatient = async (req, res) => {
  try {
    const patient = await patientService.update(req.params.id, req.body, req.tenant_id);
    if (!patient) return errorResponse(res, 'Paciente não encontrado', null, 404);
    return successResponse(res, patient, { message: 'Paciente atualizado com sucesso' });
  } catch (err) {
    return errorResponse(res, err.message, null, err.status || 400);
  }
};

export const deletePatient = async (req, res) => {
  try {
    const result = await patientService.archive(req.params.id, req.tenant_id);
    if (!result.found) return errorResponse(res, 'Paciente não encontrado', null, 404);
    const message = result.hardDeleted
      ? 'Paciente removido com sucesso'
      : 'Paciente arquivado com sucesso';
    return successResponse(res, { archived: result.archived, hardDeleted: result.hardDeleted }, { message });
  } catch (err) {
    return errorResponse(res, err.message, null, err.status || 400);
  }
};

export const listRecentPatients = async (req, res) => {
  try {
    const patients = await patientService.listRecent(req.tenant_id);
    return successResponse(res, patients);
  } catch (err) {
    return errorResponse(res, err.message, null, 500);
  }
};

export const getPatient = async (req, res) => {
  try {
    const patient = await patientService.getById(req.params.id, req.tenant_id);
    if (!patient) return errorResponse(res, 'Paciente não encontrado', null, 404);
    return successResponse(res, patient);
  } catch (err) {
    return errorResponse(res, err.message, null, 500);
  }
};

export const getPatientSummary = async (req, res) => {
  try {
    const summary = await patientSummaryService.getSummary(req.params.id, req.tenant_id);
    if (!summary) return errorResponse(res, 'Paciente não encontrado', null, 404);
    return successResponse(res, summary);
  } catch (err) {
    return errorResponse(res, err.message, null, 500);
  }
};
