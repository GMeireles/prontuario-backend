import { anamneseService } from '../services/anamneseService.js';

export const createAnamnese = async (req, res, next) => {
  try {
    const anamnese = await anamneseService.create(
      req.params.patientId,
      req.body,
      req.tenant_id,
      req.user.id
    );
    res.status(201).json({ success: true, data: anamnese });
  } catch (error) {
    next(error);
  }
};

export const listAnamneses = async (req, res, next) => {
  try {
    const anamneses = await anamneseService.listByPatient(req.params.patientId);
    res.json({ success: true, data: anamneses });
  } catch (error) {
    next(error);
  }
};

export const updateAnamnese = async (req, res, next) => {
  try {
    const anamnese = await anamneseService.update(req.params.id, req.body);
    if (!anamnese) {
      return res.status(404).json({ success: false, message: 'Anamnese não encontrada' });
    }
    res.json({ success: true, data: anamnese });
  } catch (error) {
    next(error);
  }
};

export const deleteAnamnese = async (req, res, next) => {
  try {
    const deleted = await anamneseService.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Anamnese não encontrada' });
    }
    res.json({ success: true, message: 'Anamnese removida com sucesso' });
  } catch (error) {
    next(error);
  }
};

export const getAnamneseByPatient = async (req, res) => {
  try {
    const anamnese = await anamneseService.getByPatient(req.params.patientId, req.user.tenant_id);
    res.json(anamnese || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
