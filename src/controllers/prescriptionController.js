// controllers/prescriptionController.js
import db from '../models/index.js'

const { Prescription, Patient, User, PrescriptionFile, File } = db

export const createPrescription = async (req, res, next) => {
  try {
    const { patient_id, type, description, dosage, frequency, duration } = req.body
    const professional_id = req.user.id

    const prescription = await Prescription.create({
      patient_id,
      professional_id,
      tenant_id: req.user.tenant_id,
      type,
      description,
      dosage,
      frequency,
      duration
    })

    res.status(201).json({ success: true, data: prescription })
  } catch (error) {
    next(error)
  }
}

export const listPrescriptions = async (req, res, next) => {
  try {
    const { patientId } = req.params
    const { page = 1, limit = 10, type } = req.query

    const offset = (page - 1) * limit
    const where = { patient_id: patientId }
    if (type) where.type = type

    const { rows, count } = await Prescription.findAndCountAll({
      where,
      include: [
        { model: Patient, as: 'patient' },
        { model: User, as: 'professional', attributes: ['id', 'name', 'email'] },
        {
          model: PrescriptionFile,
          as: 'prescription_files',
          include: [{ model: File, as: 'file' }]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10)
    })

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(count / limit)
      }
    })
  } catch (error) {
    next(error)
  }
}

export const updatePrescription = async (req, res, next) => {
  try {
    const { id } = req.params
    const prescription = await Prescription.findByPk(id)

    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescrição não encontrada' })
    }

    await prescription.update(req.body)
    res.json({ success: true, data: prescription })
  } catch (error) {
    next(error)
  }
}

export const deletePrescription = async (req, res, next) => {
  try {
    const { id } = req.params
    const prescription = await Prescription.findByPk(id)

    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescrição não encontrada' })
    }

    await prescription.destroy()
    res.json({ success: true, message: 'Prescrição removida com sucesso' })
  } catch (error) {
    next(error)
  }
}
