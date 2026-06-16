import { anamneseService } from '../services/anamneseService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const createAnamnese = async (req, res, next) => {
  try {
    const anamnese = await anamneseService.create(
      req.params.patientId,
      req.body,
      req.tenant_id,
      req.user.id
    );
    return successResponse(res, anamnese, { status: 201, message: 'Anamnese criada com sucesso' });
  } catch (error) {
    next(error);
  }
};

export const listAnamneses = async (req, res, next) => {
  try {
    const anamneses = await anamneseService.listByPatient(req.params.patientId);
    return successResponse(res, anamneses);
  } catch (error) {
    next(error);
  }
};

export const updateAnamnese = async (req, res, next) => {
  try {
    const anamnese = await anamneseService.update(req.params.id, req.body);
    if (!anamnese) {
      return errorResponse(res, 'Anamnese não encontrada', null, 404);
    }
    return successResponse(res, anamnese, { message: 'Anamnese atualizada com sucesso' });
  } catch (error) {
    next(error);
  }
};

export const deleteAnamnese = async (req, res, next) => {
  try {
    const deleted = await anamneseService.delete(req.params.id);
    if (!deleted) {
      return errorResponse(res, 'Anamnese não encontrada', null, 404);
    }
    return successResponse(res, null, { message: 'Anamnese removida com sucesso' });
  } catch (error) {
    next(error);
  }
};

export const getAnamneseByPatient = async (req, res) => {
  try {
    const anamnese = await anamneseService.getByPatient(req.params.patientId, req.user.tenant_id);
    return successResponse(res, anamnese || null);
  } catch (err) {
    return errorResponse(res, err.message, null, 500);
  }
};
