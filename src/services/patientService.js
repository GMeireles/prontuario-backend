import { Op } from 'sequelize';
import db from '../models/index.js';
import { planLimitsService } from './planLimitsService.js';
import { buildPaginationMeta } from '../utils/pagination.js';

const {
  Patient,
  Anamnese,
  Evolution,
  Appointment,
  File,
  Prescription,
  Record,
  PatientAasi
} = db;

function validateResponsible(birth_date, responsible_name) {
  const age = Math.floor((Date.now() - new Date(birth_date).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  if (age < 18 && !responsible_name) {
    const err = new Error('Responsável é obrigatório para menores de 18 anos');
    err.status = 400;
    throw err;
  }
  return age;
}

async function assertCpfUnique(cpf, tenantId, excludeId = null) {
  if (!cpf) return;
  const where = { tenant_id: tenantId, cpf };
  if (excludeId) where.id = { [Op.ne]: excludeId };
  const existing = await Patient.findOne({ where });
  if (existing) {
    const err = new Error('CPF já cadastrado para esta clínica');
    err.status = 409;
    throw err;
  }
}

async function hasClinicalData(patientId, tenantId) {
  const where = { patient_id: patientId, tenant_id: tenantId };
  const counts = await Promise.all([
    Anamnese.count({ where }),
    Evolution.count({ where }),
    Appointment.count({ where }),
    File.count({ where }),
    Prescription.count({ where }),
    Record.count({ where }),
    PatientAasi.count({ where })
  ]);
  return counts.some((c) => c > 0);
}

function buildListWhere(tenantId, query = {}) {
  const where = { tenant_id: tenantId };
  const { q, cpf, phone, active } = query;

  if (active === 'true') where.active = true;
  else if (active === 'false') where.active = false;

  if (q) {
    where.name = { [Op.like]: `%${String(q).trim()}%` };
  }
  if (cpf) {
    where.cpf = { [Op.like]: `%${String(cpf).replace(/\D/g, '')}%` };
  }
  if (phone) {
    where.phone = { [Op.like]: `%${String(phone).trim()}%` };
  }

  return where;
}

export const patientService = {
  async list(tenantId, query = {}) {
    const page = Math.max(parseInt(query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(query.limit, 10) || 15, 1), 100);
    const offset = (page - 1) * limit;
    const sortField = query.sort === 'created_at' ? 'createdAt' : 'name';
    const sortOrder = String(query.order || 'asc').toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    const { rows, count } = await Patient.findAndCountAll({
      where: buildListWhere(tenantId, query),
      order: [[sortField, sortOrder]],
      limit,
      offset
    });

    return {
      data: rows,
      pagination: buildPaginationMeta(count, page, limit)
    };
  },

  listRecent(tenantId) {
    return Patient.findAll({
      where: { tenant_id: tenantId, active: true },
      order: [['createdAt', 'DESC']],
      limit: 5
    });
  },

  getById(id, tenantId) {
    return Patient.findOne({ where: { id, tenant_id: tenantId } });
  },

  async create(data, tenantId) {
    await planLimitsService.assertCanCreatePatient(tenantId);
    await assertCpfUnique(data.cpf, tenantId);
    const age = validateResponsible(data.birth_date, data.responsible_name);
    return Patient.create({
      ...data,
      responsible_name: age < 18 ? data.responsible_name : null,
      tenant_id: tenantId,
      active: data.active !== false
    });
  },

  async update(id, data, tenantId) {
    const patient = await Patient.findOne({ where: { id, tenant_id: tenantId } });
    if (!patient) return null;

    if (data.cpf && data.cpf !== patient.cpf) {
      await assertCpfUnique(data.cpf, tenantId, id);
    }

    const age = validateResponsible(data.birth_date ?? patient.birth_date, data.responsible_name ?? patient.responsible_name);
    await patient.update({
      ...data,
      responsible_name: age < 18 ? (data.responsible_name ?? patient.responsible_name) : null
    });
    return patient;
  },

  async archive(id, tenantId) {
    const patient = await Patient.findOne({ where: { id, tenant_id: tenantId } });
    if (!patient) return { found: false };

    const hasData = await hasClinicalData(id, tenantId);
    if (hasData) {
      await patient.update({ active: false, archived_at: new Date() });
      return { found: true, archived: true, hardDeleted: false };
    }

    await patient.destroy();
    return { found: true, archived: false, hardDeleted: true };
  },

  async delete(id, tenantId) {
    return this.archive(id, tenantId);
  }
};
