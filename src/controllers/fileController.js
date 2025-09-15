// controllers/fileController.js
import File from '../models/File.js';

export const uploadFile = async (req, res, next) => {
  try {
    const { patient_id, type } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: 'Nenhum arquivo enviado' });
    }

    const savedFile = await File.create({
      patient_id,
      type,
      filename: file.originalname,
      filepath: file.path,
      mimetype: file.mimetype,
      size: file.size,
      uploaded_by: req.user.id
    });

    res.status(201).json({ success: true, data: savedFile });
  } catch (error) {
    next(error);
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
