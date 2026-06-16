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
    if (error.status) return errorResponse(res, error.message, null, error.status);
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
    const anamnese = await anamneseService.update(req.params.id, req.body, req.tenant_id);
    if (!anamnese) {
      return errorResponse(res, 'Anamnese não encontrada', null, 404);
    }
    return successResponse(res, anamnese, { message: 'Anamnese atualizada com sucesso' });
  } catch (error) {
    if (error.status) return errorResponse(res, error.message, null, error.status);
    next(error);
  }
};

export const deleteAnamnese = async (req, res, next) => {
  try {
    const deleted = await anamneseService.delete(req.params.id, req.tenant_id);
    if (!deleted) {
      return errorResponse(res, 'Anamnese não encontrada', null, 404);
    }
    return successResponse(res, null, { message: 'Anamnese removida com sucesso' });
  } catch (error) {
    if (error.status) return errorResponse(res, error.message, null, error.status);
    next(error);
  }
};

export const getAnamneseByPatient = async (req, res) => {
  try {
    const anamnese = await anamneseService.getByPatient(req.params.patientId, req.tenant_id);
    return successResponse(res, anamnese || null);
  } catch (err) {
    return errorResponse(res, err.message, null, 500);
  }
};

export const signAnamnese = async (req, res) => {
  try {
    const anamnese = await anamneseService.sign(
      req.params.id,
      req.tenant_id,
      req.user.id,
      req.body,
      {
        ip: req.ip || req.headers['x-forwarded-for'] || null,
        userAgent: req.headers['user-agent'] || null
      }
    );
    return successResponse(res, anamnese, { message: 'Anamnese assinada com sucesso' });
  } catch (err) {
    return errorResponse(res, err.message, null, err.status || 500);
  }
};
