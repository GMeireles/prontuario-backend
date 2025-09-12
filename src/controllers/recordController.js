import db from '../models/index.js'
const { Record } = db

export const listRecords = async (req, res) => {
  const records = await Record.findAll({
    where: { patient_id: req.params.patientId, tenant_id: req.tenant_id }
  })
  res.json(records)
}

export const createRecord = async (req, res) => {
  try {
    const record = await Record.create({
      patient_id: req.params.patientId,
      description: req.body.description,
      tenant_id: req.tenant_id
    })
    res.status(201).json(record)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

export const updateRecord = async (req, res) => {
  try {
    const record = await Record.findOne({ where: { id: req.params.id, tenant_id: req.tenant_id } })
    if (!record) return res.status(404).json({ error: 'Registro não encontrado' })

    await record.update({ description: req.body.description })
    res.json(record)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

export const deleteRecord = async (req, res) => {
  try {
    const record = await Record.findOne({ where: { id: req.params.id, tenant_id: req.tenant_id } })
    if (!record) return res.status(404).json({ error: 'Registro não encontrado' })

    await record.destroy()
    res.json({ message: 'Registro removido com sucesso' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}
