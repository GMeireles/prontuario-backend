import db from '../models/index.js'
const { Patient } = db

export const listPatients = async (req, res) => {
  const patients = await Patient.findAll({ where: { tenant_id: req.tenant_id } })
  res.json(patients)
}

export const createPatient = async (req, res) => {
  try {
    const patient = await Patient.create({
      ...req.body,
      tenant_id: req.tenant_id
    })
    res.status(201).json(patient)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

export const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findOne({ where: { id: req.params.id, tenant_id: req.tenant_id } })
    if (!patient) return res.status(404).json({ error: 'Paciente não encontrado' })

    await patient.update(req.body)
    res.json(patient)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

export const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findOne({ where: { id: req.params.id, tenant_id: req.tenant_id } })
    if (!patient) return res.status(404).json({ error: 'Paciente não encontrado' })

    await patient.destroy()
    res.json({ message: 'Paciente removido com sucesso' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}
