import db from '../models/index.js'
const { Appointment } = db

export const listAppointments = async (req, res) => {
  const appointments = await Appointment.findAll({ where: { tenant_id: req.tenant_id } })
  res.json(appointments)
}

export const createAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create({
      ...req.body,
      tenant_id: req.tenant_id
    })
    res.status(201).json(appointment)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

export const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ where: { id: req.params.id, tenant_id: req.tenant_id } })
    if (!appointment) return res.status(404).json({ error: 'Consulta não encontrada' })

    await appointment.update(req.body)
    res.json(appointment)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ where: { id: req.params.id, tenant_id: req.tenant_id } })
    if (!appointment) return res.status(404).json({ error: 'Consulta não encontrada' })

    await appointment.destroy()
    res.json({ message: 'Consulta removida com sucesso' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}
