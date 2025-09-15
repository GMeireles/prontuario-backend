// controllers/prescriptionController.js
import Prescription from '../models/Prescription.js';
import Patient from '../models/Patient.js';
import User from '../models/User.js';

export const createPrescription = async (req, res, next) => {
  try {
    const { patient_id, type, description, dosage, frequency, duration } = req.body;
    const professional_id = req.user.id;

    const prescription = await Prescription.create({
      patient_id,
      professional_id,
      type,
      description,
      dosage,
      frequency,
      duration
    });

    res.status(201).json({ success: true, data: prescription });
  } catch (error) {
    next(error);
  }
};

export const listPrescriptions = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    const prescriptions = await Prescription.findAll({
      where: { patient_id: patientId },
      include: [
        { model: Patient, as: 'patient' },
        { model: User, as: 'professional', attributes: ['id', 'name', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, data: prescriptions });
  } catch (error) {
    next(error);
  }
};

export const updatePrescription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prescription = await Prescription.findByPk(id);

    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescrição não encontrada' });
    }

    await prescription.update(req.body);
    res.json({ success: true, data: prescription });
  } catch (error) {
    next(error);
  }
};

export const deletePrescription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prescription = await Prescription.findByPk(id);

    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescrição não encontrada' });
    }

    await prescription.destroy();
    res.json({ success: true, message: 'Prescrição removida com sucesso' });
  } catch (error) {
    next(error);
  }
};
