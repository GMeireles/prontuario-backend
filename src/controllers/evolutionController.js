// controllers/evolutionController.js
import Evolution from '../models/Evolution.js';
import Patient from '../models/Patient.js';
import User from '../models/User.js';

export const createEvolution = async (req, res, next) => {
  try {
    const { patient_id, note } = req.body;
    const professional_id = req.user.id;

    const evolution = await Evolution.create({
      patient_id,
      professional_id,
      note
    });

    res.status(201).json({ success: true, data: evolution });
  } catch (error) {
    next(error);
  }
};

export const listEvolutions = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    const evolutions = await Evolution.findAll({
      where: { patient_id: patientId },
      include: [
        { model: Patient, as: 'patient' },
        { model: User, as: 'professional', attributes: ['id', 'name', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, data: evolutions });
  } catch (error) {
    next(error);
  }
};

export const updateEvolution = async (req, res, next) => {
  try {
    const { id } = req.params;
    const evolution = await Evolution.findByPk(id);

    if (!evolution) {
      return res.status(404).json({ success: false, message: 'Evolução não encontrada' });
    }

    await evolution.update(req.body);
    res.json({ success: true, data: evolution });
  } catch (error) {
    next(error);
  }
};

export const deleteEvolution = async (req, res, next) => {
  try {
    const { id } = req.params;
    const evolution = await Evolution.findByPk(id);

    if (!evolution) {
      return res.status(404).json({ success: false, message: 'Evolução não encontrada' });
    }

    await evolution.destroy();
    res.json({ success: true, message: 'Evolução removida com sucesso' });
  } catch (error) {
    next(error);
  }
};
