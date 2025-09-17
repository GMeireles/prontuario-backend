// controllers/evolutionController.js
import db from '../models/index.js';
const { Evolution, Patient, User } = db;

export const createEvolution = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const { note } = req.body;
    const professional_id = req.user.id;

    const evolution = await Evolution.create({
      patient_id: patientId,
      tenant_id: req.tenant_id,  // ✅ segurança multi-tenant
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
    where: { patient_id: patientId, tenant_id: req.tenant_id },
    include: [
      { model: Patient, as: 'patient' },
      { model: User, as: 'professional', attributes: ['id', 'name', 'email'] }
    ],
    attributes: ['id', 'note', 'created_at', 'updated_at'], // ✅ datas corretas
    order: [['created_at', 'DESC']]
  });

  console.log("Evoluções retornadas:", evolutions)


    res.json({ success: true, data: evolutions });
  } catch (error) {
    next(error);
  }
};

export const updateEvolution = async (req, res, next) => {
  try {
    const { id } = req.params

    const evolution = await Evolution.findOne({
      where: { id, tenant_id: req.tenant_id }
    })

    if (!evolution) {
      return res.status(404).json({ success: false, message: 'Evolução não encontrada' })
    }

    await evolution.update(req.body)
    res.json({ success: true, data: evolution })
  } catch (error) {
    next(error)
  }
}


export const deleteEvolution = async (req, res, next) => {
  try {
    const { id } = req.params;

    const evolution = await Evolution.findOne({ where: { id, tenant_id: req.tenant_id } });
    if (!evolution) {
      return res.status(404).json({ success: false, message: 'Evolução não encontrada' });
    }

    await evolution.destroy();
    res.json({ success: true, message: 'Evolução removida com sucesso' });
  } catch (error) {
    next(error);
  }
};


