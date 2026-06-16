import { evolutionService } from '../services/evolutionService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const createEvolution = async (req, res, next) => {
  try {
    const evolution = await evolutionService.create(
      req.params.patientId,
      req.body.note,
      req.tenant_id,
      req.user.id
    );
    return successResponse(res, evolution, { status: 201, message: 'Evolução criada com sucesso' });
  } catch (error) {
    next(error);
  }
};

export const listEvolutions = async (req, res, next) => {
  try {
    const evolutions = await evolutionService.listByPatient(req.params.patientId, req.tenant_id);
    return successResponse(res, evolutions);
  } catch (error) {
    next(error);
  }
};

export const updateEvolution = async (req, res, next) => {
  try {
    const evolution = await evolutionService.update(req.params.id, req.body, req.tenant_id);
    if (!evolution) {
      return errorResponse(res, 'Evolução não encontrada', null, 404);
    }
    return successResponse(res, evolution, { message: 'Evolução atualizada com sucesso' });
  } catch (error) {
    next(error);
  }
};

export const deleteEvolution = async (req, res, next) => {
  try {
    const deleted = await evolutionService.delete(req.params.id, req.tenant_id);
    if (!deleted) {
      return errorResponse(res, 'Evolução não encontrada', null, 404);
    }
    return successResponse(res, null, { message: 'Evolução removida com sucesso' });
  } catch (error) {
    next(error);
  }
};
