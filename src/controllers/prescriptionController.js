import { prescriptionService } from '../services/prescriptionService.js';

export const createPrescription = async (req, res, next) => {
  try {
    const prescription = await prescriptionService.create(req.body, req.user.tenant_id, req.user.id);
    res.status(201).json({ success: true, data: prescription });
  } catch (error) {
    next(error);
  }
};

export const listPrescriptions = async (req, res, next) => {
  try {
    const result = await prescriptionService.listByPatient(req.params.patientId, req.query);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const updatePrescription = async (req, res, next) => {
  try {
    const prescription = await prescriptionService.update(req.params.id, req.body);
    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescrição não encontrada' });
    }
    res.json({ success: true, data: prescription });
  } catch (error) {
    next(error);
  }
};

export const deletePrescription = async (req, res, next) => {
  try {
    const deleted = await prescriptionService.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Prescrição não encontrada' });
    }
    res.json({ success: true, message: 'Prescrição removida com sucesso' });
  } catch (error) {
    next(error);
  }
};
