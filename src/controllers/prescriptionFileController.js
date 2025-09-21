// controllers/prescriptionFileController.js
import db from '../models/index.js'

const { Prescription, PrescriptionFile, File } = db

export const addFileToPrescription = async (req, res, next) => {
  try {
    console.log('REQ BODY FILE_ID:', req.body.file_id)
    console.log('REQ PARAMS PRESCRIPTION_ID:', req.params.prescriptionId)
    const { prescriptionId } = req.params;
    const { file_id } = req.body;

    const prescription = await Prescription.findByPk(prescriptionId);
    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescrição não encontrada' });
    }

    const file = await File.findByPk(file_id);
    if (!file) {
      return res.status(404).json({ success: false, message: 'Arquivo não encontrado' });
    }

    const relation = await PrescriptionFile.create({
      prescription_id: prescriptionId,
      file_id
    });

    res.status(201).json({ success: true, data: relation });
  } catch (error) {
    next(error);
  }
};

export const listPrescriptionFiles = async (req, res, next) => {
  try {
    const { prescriptionId } = req.params;
    const files = await PrescriptionFile.findAll({
      where: { prescription_id: prescriptionId },
      include: [{ model: File, as: 'file' }]
    });
    res.json({ success: true, data: files });
  } catch (error) {
    next(error);
  }
};

export const removeFileFromPrescription = async (req, res, next) => {
  try {
    const { prescriptionId, fileId } = req.params;
    const relation = await PrescriptionFile.findOne({
      where: { prescription_id: prescriptionId, file_id: fileId }
    });

    if (!relation) {
      return res.status(404).json({ success: false, message: 'Relação não encontrada' });
    }

    await relation.destroy();
    res.json({ success: true, message: 'Arquivo desvinculado da prescrição' });
  } catch (error) {
    next(error);
  }
};
