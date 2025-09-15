// controllers/fileController.js
import File from '../models/File.js';

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });

    const file = await File.create({
      filename: req.file.filename,
      filepath: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
      patient_id: req.body.patient_id,
      tenant_id: req.user.tenant_id, // sempre do token
      uploaded_by: req.user.id
    });

    res.status(201).json(file);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar arquivo' });
  }
};

export const downloadFile = async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (!file || file.tenant_id !== req.user.tenant_id) {
      return res.status(404).json({ error: 'Arquivo não encontrado' });
    }

    res.download(path.resolve(file.filepath), file.filename);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao baixar arquivo' });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (!file || file.tenant_id !== req.user.tenant_id) {
      return res.status(404).json({ error: 'Arquivo não encontrado' });
    }

    fs.unlinkSync(path.resolve(file.filepath));
    await file.destroy();

    res.json({ success: true, message: 'Arquivo removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir arquivo' });
  }
};

export const listFiles = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    const files = await File.findAll({
      where: { patient_id: patientId }
    });

    res.json({ success: true, data: files });
  } catch (error) {
    next(error);
  }
};
