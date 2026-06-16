import { recordService } from '../services/recordService.js';

export const listRecords = async (req, res) => {
  const records = await recordService.listByPatient(req.params.patientId, req.tenant_id);
  res.json(records);
};

export const createRecord = async (req, res) => {
  try {
    const record = await recordService.create(req.params.patientId, req.body.description, req.tenant_id);
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateRecord = async (req, res) => {
  try {
    const record = await recordService.update(req.params.id, req.body.description, req.tenant_id);
    if (!record) return res.status(404).json({ error: 'Registro não encontrado' });
    res.json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteRecord = async (req, res) => {
  try {
    const deleted = await recordService.delete(req.params.id, req.tenant_id);
    if (!deleted) return res.status(404).json({ error: 'Registro não encontrado' });
    res.json({ message: 'Registro removido com sucesso' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
