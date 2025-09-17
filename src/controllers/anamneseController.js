// controllers/anamneseController.js
import db from '../models/index.js';
const { Anamnese, Patient, User } = db;

export const createAnamnese = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const { main_complaint, medical_history, family_history, lifestyle, allergies } = req.body;
    const professional_id = req.user.id;

    const anamnese = await Anamnese.create({
      patient_id: patientId,
      tenant_id: req.tenant_id,   // ✅ agora pega do middleware
      professional_id,
      main_complaint,
      medical_history,
      family_history,
      lifestyle,
      allergies
    });

    res.status(201).json({ success: true, data: anamnese });
  } catch (error) {
    next(error);
  }
};

export const listAnamneses = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    const anamneses = await Anamnese.findAll({
      where: { patient_id: patientId },
      include: [
        { model: Patient, as: 'patient' },
        { model: User, as: 'professional', attributes: ['id', 'name', 'email'] }
      ]
    });

    res.json({ success: true, data: anamneses });
  } catch (error) {
    next(error);
  }
};

export const updateAnamnese = async (req, res, next) => {
  try {
    const { id } = req.params;

    const anamnese = await Anamnese.findByPk(id);
    if (!anamnese) {
      return res.status(404).json({ success: false, message: 'Anamnese não encontrada' });
    }

    await anamnese.update(req.body);

    res.json({ success: true, data: anamnese });
  } catch (error) {
    next(error);
  }
};

export const deleteAnamnese = async (req, res, next) => {
  try {
    const { id } = req.params;

    const anamnese = await Anamnese.findByPk(id);
    if (!anamnese) {
      return res.status(404).json({ success: false, message: 'Anamnese não encontrada' });
    }

    await anamnese.destroy();

    res.json({ success: true, message: 'Anamnese removida com sucesso' });
  } catch (error) {
    next(error);
  }
};

export const getAnamneseByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const anamnese = await Anamnese.findOne({
      where: { patient_id: patientId, tenant_id: req.user.tenant_id },
    });

    if (!anamnese) {
      return res.json(null); // retorna vazio
    }

    res.json(anamnese);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};