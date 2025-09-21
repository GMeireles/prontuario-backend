// controllers/fileController.js
import db from '../models/index.js';
const { File } = db;
import { Op } from 'sequelize'

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      console.error('⚠️ Nenhum arquivo recebido pelo multer', req.body)
      return res.status(400).json({ error: 'Nenhum arquivo enviado' })
    }

    const file = await File.create({
      filename: req.file.filename,
      filepath: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
      type: req.body.type || 'document',
      patient_id: req.body.patient_id,
      tenant_id: req.user.tenant_id,
      uploaded_by: req.user.id
    })

    res.status(201).json(file)
  } catch (err) {
    console.error('Erro uploadFile:', err)
    res.status(500).json({ error: 'Erro ao salvar arquivo', details: err.message })
  }
}


export const downloadFile = async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (!file || file.tenant_id !== req.user.tenant_id) {
      return res.status(404).json({ error: 'Arquivo não encontrado' });
    }

    res.download(file.filepath, file.filename);
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

export const listFiles = async (req, res) => {
  try {
    const { patientId } = req.params;

    const files = await File.findAll({
      where: {
        patient_id: patientId,
        type: { [Op.ne]: 'prescription' }
      },
      order: [['created_at', 'DESC']]
    });

    res.json({ success: true, data: files });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar arquivos' });
  }
};



