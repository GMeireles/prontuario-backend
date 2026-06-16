import { digitalSignatureService } from '../services/digitalSignatureService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const listPatientSignatures = async (req, res) => {
  try {
    const rows = await digitalSignatureService.listByPatient(req.params.patientId, req.tenant_id);
    const formatted = rows.map((r) => digitalSignatureService.formatSignature(r));
    return successResponse(res, formatted);
  } catch (err) {
    return errorResponse(res, err.message, null, err.status || 500);
  }
};

export const getSignature = async (req, res) => {
  try {
    const row = await digitalSignatureService.getById(req.params.id, req.tenant_id);
    if (!row) return errorResponse(res, 'Assinatura não encontrada', null, 404);
    return successResponse(res, digitalSignatureService.formatSignature(row));
  } catch (err) {
    return errorResponse(res, err.message, null, err.status || 500);
  }
};
