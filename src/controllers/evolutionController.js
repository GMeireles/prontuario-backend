import { evolutionService } from '../services/evolutionService.js';

export const createEvolution = async (req, res, next) => {
  try {
    const evolution = await evolutionService.create(
      req.params.patientId,
      req.body.note,
      req.tenant_id,
      req.user.id
    );
    res.status(201).json({ success: true, data: evolution });
  } catch (error) {
    next(error);
  }
};

export const listEvolutions = async (req, res, next) => {
  try {
    const evolutions = await evolutionService.listByPatient(req.params.patientId, req.tenant_id);
    res.json({ success: true, data: evolutions });
  } catch (error) {
    next(error);
  }
};

export const updateEvolution = async (req, res, next) => {
  try {
    const evolution = await evolutionService.update(req.params.id, req.body, req.tenant_id);
    if (!evolution) {
      return res.status(404).json({ success: false, message: 'Evolução não encontrada' });
    }
    res.json({ success: true, data: evolution });
  } catch (error) {
    next(error);
  }
};

export const deleteEvolution = async (req, res, next) => {
  try {
    const deleted = await evolutionService.delete(req.params.id, req.tenant_id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Evolução não encontrada' });
    }
    res.json({ success: true, message: 'Evolução removida com sucesso' });
  } catch (error) {
    next(error);
  }
};
