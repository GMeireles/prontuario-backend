import { patientService } from '../services/patientService.js';

export const listPatients = async (req, res) => {
  try {
    const patients = await patientService.list(req.user.tenant_id);
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createPatient = async (req, res) => {
  try {
    const patient = await patientService.create(req.body, req.user.tenant_id);
    res.status(201).json(patient);
  } catch (err) {
    res.status(err.status || 400).json({ error: err.message });
  }
};

export const updatePatient = async (req, res) => {
  try {
    const patient = await patientService.update(req.params.id, req.body, req.user.tenant_id);
    if (!patient) return res.status(404).json({ error: 'Paciente não encontrado' });
    res.json(patient);
  } catch (err) {
    res.status(err.status || 400).json({ error: err.message });
  }
};

export const deletePatient = async (req, res) => {
  try {
    const deleted = await patientService.delete(req.params.id, req.user.tenant_id);
    if (!deleted) return res.status(404).json({ error: 'Paciente não encontrado' });
    res.json({ message: 'Paciente removido com sucesso' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const listRecentPatients = async (req, res) => {
  try {
    const patients = await patientService.listRecent(req.user.tenant_id);
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPatient = async (req, res) => {
  try {
    const patient = await patientService.getById(req.params.id, req.user.tenant_id);
    if (!patient) return res.status(404).json({ error: 'Paciente não encontrado' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
