import { prescriptionService } from '../services/prescriptionService.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';

export const createPrescription = async (req, res, next) => {
  try {
    const prescription = await prescriptionService.create(req.body, req.user.tenant_id, req.user.id);
    return successResponse(res, prescription, { status: 201, message: 'Prescrição criada com sucesso' });
  } catch (error) {
    next(error);
  }
};

export const listPrescriptions = async (req, res, next) => {
  try {
    const result = await prescriptionService.listByPatient(req.params.patientId, req.query);
    return paginatedResponse(res, result.data, result.pagination);
  } catch (error) {
    next(error);
  }
};

export const updatePrescription = async (req, res, next) => {
  try {
    const prescription = await prescriptionService.update(req.params.id, req.body);
    if (!prescription) {
      return errorResponse(res, 'Prescrição não encontrada', null, 404);
    }
    return successResponse(res, prescription, { message: 'Prescrição atualizada com sucesso' });
  } catch (error) {
    next(error);
  }
};

export const deletePrescription = async (req, res, next) => {
  try {
    const deleted = await prescriptionService.delete(req.params.id);
    if (!deleted) {
      return errorResponse(res, 'Prescrição não encontrada', null, 404);
    }
    return successResponse(res, null, { message: 'Prescrição removida com sucesso' });
  } catch (error) {
    next(error);
  }
};
