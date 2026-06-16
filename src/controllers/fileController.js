import { fileService } from '../services/fileService.js';

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const file = await fileService.createFromUpload(
      req.file,
      req.body,
      req.user.tenant_id,
      req.user.id
    );
    res.status(201).json(file);
  } catch (err) {
    console.error('Erro uploadFile:', err);
    res.status(500).json({ error: 'Erro ao salvar arquivo', details: err.message });
  }
};

export const downloadFile = async (req, res) => {
  try {
    const file = await fileService.findById(req.params.id, req.user.tenant_id);
    if (!file) return res.status(404).json({ error: 'Arquivo não encontrado' });
    res.download(file.filepath, file.filename);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao baixar arquivo' });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const deleted = await fileService.delete(req.params.id, req.user.tenant_id);
    if (!deleted) return res.status(404).json({ error: 'Arquivo não encontrado' });
    res.json({ success: true, message: 'Arquivo removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir arquivo' });
  }
};

export const listFiles = async (req, res) => {
  try {
    const files = await fileService.listByPatient(req.params.patientId);
    res.json({ success: true, data: files });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar arquivos' });
  }
};
