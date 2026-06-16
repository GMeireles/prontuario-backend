import { fileService } from '../services/fileService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'Nenhum arquivo enviado', null, 400);
    }

    const file = await fileService.createFromUpload(
      req.file,
      req.body,
      req.user.tenant_id,
      req.user.id
    );
    return successResponse(res, file, { status: 201, message: 'Arquivo enviado com sucesso' });
  } catch (err) {
    console.error('Erro uploadFile:', err);
    return errorResponse(res, 'Erro ao salvar arquivo', [{ message: err.message }], 500);
  }
};

export const downloadFile = async (req, res) => {
  try {
    const file = await fileService.findById(req.params.id, req.user.tenant_id);
    if (!file) return errorResponse(res, 'Arquivo não encontrado', null, 404);
    res.download(file.filepath, file.filename);
  } catch (err) {
    return errorResponse(res, 'Erro ao baixar arquivo', null, 500);
  }
};

export const deleteFile = async (req, res) => {
  try {
    const deleted = await fileService.delete(req.params.id, req.user.tenant_id);
    if (!deleted) return errorResponse(res, 'Arquivo não encontrado', null, 404);
    return successResponse(res, null, { message: 'Arquivo removido com sucesso' });
  } catch (err) {
    return errorResponse(res, 'Erro ao excluir arquivo', null, 500);
  }
};

export const listFiles = async (req, res) => {
  try {
    const files = await fileService.listByPatient(req.params.patientId);
    return successResponse(res, files);
  } catch (err) {
    return errorResponse(res, 'Erro ao listar arquivos', null, 500);
  }
};
