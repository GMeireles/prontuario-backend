import db from '../models/index.js';

const { AnamneseAnswer, AnamneseTemplateField } = db;

function validationError(msg) {
  const err = new Error(msg);
  err.status = 400;
  throw err;
}

function normalizeValue(field, rawValue) {
  const type = field.type;
  if (rawValue === null || rawValue === undefined || rawValue === '') {
    return { value_text: null, value_json: null };
  }

  switch (type) {
    case 'boolean':
      return {
        value_text: rawValue === true || rawValue === 'true' || rawValue === '1' ? 'true' : 'false',
        value_json: rawValue === true || rawValue === 'true' || rawValue === '1'
      };
    case 'number':
      return { value_text: String(rawValue), value_json: Number(rawValue) };
    case 'select':
    case 'multiselect':
      return {
        value_text: Array.isArray(rawValue) ? rawValue.join(', ') : String(rawValue),
        value_json: rawValue
      };
    default:
      return { value_text: String(rawValue), value_json: null };
  }
}

function displayValue(answer) {
  if (!answer) return null;
  if (answer.value_json !== null && answer.value_json !== undefined) {
    if (typeof answer.value_json === 'boolean') return answer.value_json;
    return answer.value_json;
  }
  return answer.value_text;
}

export const anamneseAnswerService = {
  displayValue,

  async validateAndNormalize(templateFields, answersMap) {
    const activeFields = templateFields.filter((f) => f.active);
    const normalized = {};

    for (const field of activeFields) {
      const raw = answersMap[field.key];
      const isEmpty = raw === null || raw === undefined || raw === '';

      if (field.required && isEmpty) {
        validationError(`Campo obrigatório: ${field.label}`);
      }

      if (!isEmpty) {
        normalized[field.key] = {
          template_field_id: field.id,
          field_key: field.key,
          ...normalizeValue(field, raw)
        };
      }
    }

    return normalized;
  },

  async upsertForAnamnese(anamneseId, tenantId, normalizedAnswers, transaction) {
    const keys = Object.keys(normalizedAnswers);
    for (const key of keys) {
      const data = normalizedAnswers[key];
      const existing = await AnamneseAnswer.findOne({
        where: { anamnese_id: anamneseId, field_key: key },
        transaction
      });

      if (existing) {
        await existing.update({
          template_field_id: data.template_field_id,
          value_text: data.value_text,
          value_json: data.value_json
        }, { transaction });
      } else {
        await AnamneseAnswer.create({
          tenant_id: tenantId,
          anamnese_id: anamneseId,
          template_field_id: data.template_field_id,
          field_key: key,
          value_text: data.value_text,
          value_json: data.value_json
        }, { transaction });
      }
    }
  },

  answersToMap(answers) {
    const map = {};
    for (const a of answers || []) {
      map[a.field_key] = displayValue(a);
    }
    return map;
  },

  async getFieldsForTemplate(templateId, tenantId) {
    return AnamneseTemplateField.findAll({
      where: { template_id: templateId, tenant_id: tenantId, active: true },
      order: [['order_index', 'ASC']]
    });
  }
};
