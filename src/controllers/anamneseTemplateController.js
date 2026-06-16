import { anamneseTemplateService } from '../services/anamneseTemplateService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const listTemplates = async (req, res) => {
  try {
    const rows = await anamneseTemplateService.list(req.tenant_id, { active: req.query.active });
    return successResponse(res, rows);
  } catch (err) {
    return errorResponse(res, err.message, null, err.status || 500);
  }
};

export const getTemplate = async (req, res) => {
  try {
    const row = await anamneseTemplateService.getById(req.params.id, req.tenant_id);
    if (!row) return errorResponse(res, 'Template não encontrado', null, 404);
    return successResponse(res, row);
  } catch (err) {
    return errorResponse(res, err.message, null, err.status || 500);
  }
};

export const createTemplate = async (req, res) => {
  try {
    const row = await anamneseTemplateService.create(req.tenant_id, req.body, req.user.id);
    return successResponse(res, row, { status: 201, message: 'Template criado com sucesso' });
  } catch (err) {
    return errorResponse(res, err.message, null, err.status || 400);
  }
};

export const updateTemplate = async (req, res) => {
  try {
    const row = await anamneseTemplateService.update(req.params.id, req.tenant_id, req.body, req.user.id);
    if (!row) return errorResponse(res, 'Template não encontrado', null, 404);
    return successResponse(res, row, { message: 'Template atualizado com sucesso' });
  } catch (err) {
    return errorResponse(res, err.message, null, err.status || 400);
  }
};

export const deleteTemplate = async (req, res) => {
  try {
    const row = await anamneseTemplateService.deactivate(req.params.id, req.tenant_id, req.user.id);
    if (!row) return errorResponse(res, 'Template não encontrado', null, 404);
    return successResponse(res, row, { message: 'Template desativado com sucesso' });
  } catch (err) {
    return errorResponse(res, err.message, null, err.status || 400);
  }
};

export const addTemplateField = async (req, res) => {
  try {
    const row = await anamneseTemplateService.addField(req.params.id, req.tenant_id, req.body);
    return successResponse(res, row, { status: 201, message: 'Campo adicionado com sucesso' });
  } catch (err) {
    return errorResponse(res, err.message, null, err.status || 400);
  }
};

export const updateTemplateField = async (req, res) => {
  try {
    const row = await anamneseTemplateService.updateField(
      req.params.id,
      req.params.fieldId,
      req.tenant_id,
      req.body
    );
    if (!row) return errorResponse(res, 'Campo não encontrado', null, 404);
    return successResponse(res, row, { message: 'Campo atualizado com sucesso' });
  } catch (err) {
    return errorResponse(res, err.message, null, err.status || 400);
  }
};

export const deleteTemplateField = async (req, res) => {
  try {
    const row = await anamneseTemplateService.deactivateField(
      req.params.id,
      req.params.fieldId,
      req.tenant_id
    );
    if (!row) return errorResponse(res, 'Campo não encontrado', null, 404);
    return successResponse(res, row, { message: 'Campo desativado com sucesso' });
  } catch (err) {
    return errorResponse(res, err.message, null, err.status || 400);
  }
};
