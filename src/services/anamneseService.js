import db from '../models/index.js';
import { anamneseTemplateService } from './anamneseTemplateService.js';
import { anamneseAnswerService } from './anamneseAnswerService.js';
import { digitalSignatureService } from './digitalSignatureService.js';

const {
  Anamnese, Patient, User, AnamneseTemplate, AnamneseTemplateField,
  AnamneseAnswer, DigitalSignature, sequelize
} = db;

const anamneseIncludes = [
  { model: Patient, as: 'patient' },
  { model: User, as: 'professional', attributes: ['id', 'name', 'email'] },
  { model: User, as: 'signer', attributes: ['id', 'name', 'email'] },
  {
    model: AnamneseTemplate,
    as: 'template',
    include: [{
      model: AnamneseTemplateField,
      as: 'fields',
      where: { active: true },
      required: false
    }]
  },
  { model: AnamneseAnswer, as: 'answers' },
  { model: DigitalSignature, as: 'signature' }
];

function lockedError() {
  const err = new Error('Anamnese assinada e bloqueada para edição');
  err.status = 403;
  throw err;
}

function formatAnamnese(row) {
  if (!row) return null;
  const plain = row.toJSON ? row.toJSON() : { ...row };
  const isLegacy = !plain.template_id;

  if (plain.template?.fields) {
    plain.template.fields.sort((a, b) => a.order_index - b.order_index);
  }

  const answersMap = anamneseAnswerService.answersToMap(plain.answers);
  const answers = (plain.answers || []).map((a) => ({
    ...a,
    value: anamneseAnswerService.displayValue(a)
  }));

  return {
    ...plain,
    isLegacy,
    answers,
    answersMap,
    signature: digitalSignatureService.formatSignature(plain.signature)
  };
}

export const anamneseService = {
  isLocked(anamnese) {
    return !!(anamnese?.locked_at);
  },

  async create(patientId, data, tenantId, professionalId) {
    const hasLegacyPayload = data.main_complaint !== undefined
      || data.medical_history !== undefined
      || !data.templateId;

    let templateId = data.templateId || null;
    let template = null;

    if (!hasLegacyPayload || data.templateId || data.answers) {
      if (templateId) {
        template = await anamneseTemplateService.getById(templateId, tenantId);
        if (!template) {
          const err = new Error('Template não encontrado');
          err.status = 404;
          throw err;
        }
      } else {
        template = await anamneseTemplateService.getDefault(tenantId);
        templateId = template?.id || null;
      }
    }

    if (templateId && template) {
      const answersMap = data.answers || {};
      const fields = template.fields || await anamneseAnswerService.getFieldsForTemplate(templateId, tenantId);
      const normalized = await anamneseAnswerService.validateAndNormalize(fields, answersMap);

      const mainComplaint = normalized.queixa_principal?.value_text
        || answersMap.queixa_principal
        || data.main_complaint
        || null;

      return sequelize.transaction(async (t) => {
        const anamnese = await Anamnese.create({
          patient_id: patientId,
          tenant_id: tenantId,
          professional_id: professionalId,
          template_id: templateId,
          main_complaint: mainComplaint
        }, { transaction: t });

        await anamneseAnswerService.upsertForAnamnese(anamnese.id, tenantId, normalized, t);
        return anamnese.id;
      }).then((id) => this.findById(id, tenantId));
    }

    if (!data.main_complaint) {
      const err = new Error('Queixa principal é obrigatória');
      err.status = 400;
      throw err;
    }

    const anamnese = await Anamnese.create({
      patient_id: patientId,
      tenant_id: tenantId,
      professional_id: professionalId,
      main_complaint: data.main_complaint,
      medical_history: data.medical_history || null,
      family_history: data.family_history || null,
      lifestyle: data.lifestyle || null,
      allergies: data.allergies || null
    });

    return this.findById(anamnese.id, tenantId);
  },

  listByPatient(patientId) {
    return Anamnese.findAll({
      where: { patient_id: patientId },
      include: [
        { model: Patient, as: 'patient' },
        { model: User, as: 'professional', attributes: ['id', 'name', 'email'] }
      ],
      order: [['created_at', 'DESC']]
    });
  },

  async getByPatient(patientId, tenantId) {
    const row = await Anamnese.findOne({
      where: { patient_id: patientId, tenant_id: tenantId },
      include: anamneseIncludes,
      order: [['created_at', 'DESC']]
    });
    return formatAnamnese(row);
  },

  async findById(id, tenantId) {
    const where = { id };
    if (tenantId) where.tenant_id = tenantId;
    const row = await Anamnese.findOne({
      where,
      include: anamneseIncludes
    });
    return formatAnamnese(row);
  },

  async update(id, data, tenantId) {
    const anamnese = await Anamnese.findOne({ where: { id, tenant_id: tenantId } });
    if (!anamnese) return null;
    if (this.isLocked(anamnese)) lockedError();

    if (anamnese.template_id && data.answers) {
      const template = await anamneseTemplateService.getById(anamnese.template_id, tenantId);
      const fields = template?.fields?.filter((f) => f.active) || [];
      const normalized = await anamneseAnswerService.validateAndNormalize(fields, data.answers);

      const mainComplaint = normalized.queixa_principal?.value_text
        || data.answers.queixa_principal
        || anamnese.main_complaint;

      await sequelize.transaction(async (t) => {
        await anamnese.update({ main_complaint: mainComplaint }, { transaction: t });
        await anamneseAnswerService.upsertForAnamnese(anamnese.id, tenantId, normalized, t);
      });

      return this.findById(id, tenantId);
    }

    await anamnese.update({
      main_complaint: data.main_complaint ?? anamnese.main_complaint,
      medical_history: data.medical_history !== undefined ? data.medical_history : anamnese.medical_history,
      family_history: data.family_history !== undefined ? data.family_history : anamnese.family_history,
      lifestyle: data.lifestyle !== undefined ? data.lifestyle : anamnese.lifestyle,
      allergies: data.allergies !== undefined ? data.allergies : anamnese.allergies
    });

    return this.findById(id, tenantId);
  },

  async delete(id, tenantId) {
    const anamnese = await Anamnese.findOne({ where: { id, tenant_id: tenantId } });
    if (!anamnese) return false;
    if (this.isLocked(anamnese)) lockedError();
    await anamnese.destroy();
    return true;
  },

  async sign(id, tenantId, userId, payload, reqMeta = {}) {
    const anamnese = await this.findById(id, tenantId);
    if (!anamnese) {
      const err = new Error('Anamnese não encontrada');
      err.status = 404;
      throw err;
    }
    if (this.isLocked(anamnese)) {
      const err = new Error('Anamnese já assinada');
      err.status = 400;
      throw err;
    }

    const typedName = payload.typedName || payload.signerName;
    const confirmationText = payload.confirmationText;
    if (!typedName || !confirmationText) {
      const err = new Error('Nome e confirmação são obrigatórios para assinatura');
      err.status = 400;
      throw err;
    }

    const expectedConfirmation = 'Eu confirmo a veracidade das informações';
    if (confirmationText.trim() !== expectedConfirmation) {
      const err = new Error(`Texto de confirmação inválido. Digite exatamente: "${expectedConfirmation}"`);
      err.status = 400;
      throw err;
    }

    const documentContent = digitalSignatureService.buildAnamneseCanonicalSnapshot(anamnese);
    const now = new Date();

    const signature = await digitalSignatureService.createTypedSignature({
      tenantId,
      patientId: anamnese.patient_id,
      userId,
      entityType: 'anamnese',
      entityId: anamnese.id,
      signerName: typedName,
      signerDocument: payload.signerDocument || null,
      signatureData: { typedName, confirmationText },
      documentContent,
      ipAddress: reqMeta.ip,
      userAgent: reqMeta.userAgent
    });

    await Anamnese.update({
      signed_at: now,
      signed_by: userId,
      signature_id: signature.id,
      locked_at: now
    }, { where: { id, tenant_id: tenantId } });

    return this.findById(id, tenantId);
  }
};
