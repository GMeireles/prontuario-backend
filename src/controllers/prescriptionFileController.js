import db from '../models/index.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

const { Prescription, PrescriptionFile, File } = db;

export const addFileToPrescription = async (req, res, next) => {
  try {
    const { prescriptionId } = req.params;
    const { file_id } = req.body;

    const prescription = await Prescription.findByPk(prescriptionId);
    if (!prescription) {
      return errorResponse(res, 'Prescrição não encontrada', null, 404);
    }

    const file = await File.findByPk(file_id);
    if (!file) {
      return errorResponse(res, 'Arquivo não encontrado', null, 404);
    }

    const relation = await PrescriptionFile.create({
      prescription_id: prescriptionId,
      file_id
    });

    return successResponse(res, relation, { status: 201, message: 'Arquivo vinculado à prescrição' });
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
    return successResponse(res, files);
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
      return errorResponse(res, 'Relação não encontrada', null, 404);
    }

    await relation.destroy();
    return successResponse(res, null, { message: 'Arquivo desvinculado da prescrição' });
  } catch (error) {
    next(error);
  }
};
