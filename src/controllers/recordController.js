import { recordService } from '../services/recordService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const listRecords = async (req, res) => {
  try {
    const records = await recordService.listByPatient(req.params.patientId, req.tenant_id);
    return successResponse(res, records);
  } catch (err) {
    return errorResponse(res, err.message, null, 500);
  }
};

export const createRecord = async (req, res) => {
  try {
    const record = await recordService.create(req.params.patientId, req.body.description, req.tenant_id);
    return successResponse(res, record, { status: 201, message: 'Registro criado com sucesso' });
  } catch (err) {
    return errorResponse(res, err.message, null, 400);
  }
};

export const updateRecord = async (req, res) => {
  try {
    const record = await recordService.update(req.params.id, req.body.description, req.tenant_id);
    if (!record) return errorResponse(res, 'Registro não encontrado', null, 404);
    return successResponse(res, record, { message: 'Registro atualizado com sucesso' });
  } catch (err) {
    return errorResponse(res, err.message, null, 400);
  }
};

export const deleteRecord = async (req, res) => {
  try {
    const deleted = await recordService.delete(req.params.id, req.tenant_id);
    if (!deleted) return errorResponse(res, 'Registro não encontrado', null, 404);
    return successResponse(res, null, { message: 'Registro removido com sucesso' });
  } catch (err) {
    return errorResponse(res, err.message, null, 400);
  }
};
