import db from '../models/index.js'
const { Patient } = db

// Listar todos os pacientes do tenant
export const listPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll({
      where: { tenant_id: req.user.tenant_id }
    })
    res.json(patients)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Criar paciente
export const createPatient = async (req, res) => {
  try {
    const {
      name,
      email,
      birth_date,
      cpf,
      gender,
      phone,
      address,
      city,
      state,
      zip_code,
      responsible_name
    } = req.body

    // Verificar idade do paciente
    const age = Math.floor((Date.now() - new Date(birth_date).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    if (age < 18 && !responsible_name) {
      return res.status(400).json({ error: 'Responsável é obrigatório para menores de 18 anos' })
    }

    const patient = await Patient.create({
      name,
      email,
      birth_date,
      cpf,
      gender,
      phone,
      address,
      city,
      state,
      zip_code,
      responsible_name: age < 18 ? responsible_name : null,
      tenant_id: req.user.tenant_id
    })

    res.status(201).json(patient)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// Atualizar paciente
export const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      where: { id: req.params.id, tenant_id: req.user.tenant_id }
    })
    if (!patient) return res.status(404).json({ error: 'Paciente não encontrado' })

    const {
      name,
      email,
      birth_date,
      cpf,
      gender,
      phone,
      address,
      city,
      state,
      zip_code,
      responsible_name
    } = req.body

    const age = Math.floor((Date.now() - new Date(birth_date).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    if (age < 18 && !responsible_name) {
      return res.status(400).json({ error: 'Responsável é obrigatório para menores de 18 anos' })
    }

    await patient.update({
      name,
      email,
      birth_date,
      cpf,
      gender,
      phone,
      address,
      city,
      state,
      zip_code,
      responsible_name: age < 18 ? responsible_name : null
    })

    res.json(patient)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// Deletar paciente
export const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      where: { id: req.params.id, tenant_id: req.user.tenant_id }
    })
    if (!patient) return res.status(404).json({ error: 'Paciente não encontrado' })

    await patient.destroy()
    res.json({ message: 'Paciente removido com sucesso' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// Listar pacientes mais recentes
export const listRecentPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll({
      where: { tenant_id: req.user.tenant_id },
      order: [['createdAt', 'DESC']],
      limit: 5
    })
    res.json(patients)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// listar 1 paciente
export const getPatient = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      where: { id: req.params.id, tenant_id: req.user.tenant_id },
    });
    if (!patient) {
      return res.status(404).json({ error: "Paciente não encontrado" });
    }
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
