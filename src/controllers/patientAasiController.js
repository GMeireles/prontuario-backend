import { patientAasiService } from '../services/patientAasiService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const listPatientAasis = async (req, res) => {
  try {
    const rows = await patientAasiService.listByPatient(
      req.params.patientId,
      req.tenant_id,
      { active: req.query.active }
    );
    return successResponse(res, rows);
  } catch (err) {
    return errorResponse(res, err.message, null, err.status || 500);
  }
};

export const getPatientAasi = async (req, res) => {
  try {
    const row = await patientAasiService.getById(
      req.params.patientId,
      req.params.aasiId,
      req.tenant_id
    );
    if (!row) return errorResponse(res, 'Aparelho não encontrado', null, 404);
    return successResponse(res, row);
  } catch (err) {
    return errorResponse(res, err.message, null, err.status || 500);
  }
};

export const createPatientAasi = async (req, res) => {
  try {
    const row = await patientAasiService.create(
      req.params.patientId,
      req.tenant_id,
      req.body,
      req.user.id
    );
    return successResponse(res, row, { status: 201, message: 'Aparelho cadastrado com sucesso' });
  } catch (err) {
    return errorResponse(res, err.message, null, err.status || 400);
  }
};

export const updatePatientAasi = async (req, res) => {
  try {
    const row = await patientAasiService.update(
      req.params.patientId,
      req.params.aasiId,
      req.tenant_id,
      req.body,
      req.user.id
    );
    if (!row) return errorResponse(res, 'Aparelho não encontrado', null, 404);
    return successResponse(res, row, { message: 'Aparelho atualizado com sucesso' });
  } catch (err) {
    return errorResponse(res, err.message, null, err.status || 400);
  }
};

export const deletePatientAasi = async (req, res) => {
  try {
    const row = await patientAasiService.deactivate(
      req.params.patientId,
      req.params.aasiId,
      req.tenant_id,
      req.user.id
    );
    if (!row) return errorResponse(res, 'Aparelho não encontrado', null, 404);
    return successResponse(res, row, { message: 'Aparelho desativado com sucesso' });
  } catch (err) {
    return errorResponse(res, err.message, null, err.status || 400);
  }
};
