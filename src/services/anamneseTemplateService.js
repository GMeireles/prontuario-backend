import db from '../models/index.js';

const { AnamneseTemplate, AnamneseTemplateField } = db;

function notFound(msg = 'Template não encontrado') {
  const err = new Error(msg);
  err.status = 404;
  throw err;
}

export const anamneseTemplateService = {
  async list(tenantId, { active } = {}) {
    const where = { tenant_id: tenantId };
    if (active === 'true') where.active = true;
    else if (active === 'false') where.active = false;

    return AnamneseTemplate.findAll({
      where,
      include: [{
        model: AnamneseTemplateField,
        as: 'fields',
        where: { active: true },
        required: false,
        order: [['order_index', 'ASC']]
      }],
      order: [['is_default', 'DESC'], ['name', 'ASC']]
    });
  },

  async getById(id, tenantId) {
    return AnamneseTemplate.findOne({
      where: { id, tenant_id: tenantId },
      include: [{
        model: AnamneseTemplateField,
        as: 'fields',
        order: [['order_index', 'ASC']]
      }]
    });
  },

  async getDefault(tenantId) {
    return AnamneseTemplate.findOne({
      where: { tenant_id: tenantId, is_default: true, active: true },
      include: [{
        model: AnamneseTemplateField,
        as: 'fields',
        where: { active: true },
        required: false,
        order: [['order_index', 'ASC']]
      }]
    });
  },

  async create(tenantId, data, userId) {
    const template = await AnamneseTemplate.create({
      tenant_id: tenantId,
      name: data.name,
      description: data.description || null,
      active: data.active !== false,
      is_default: !!data.is_default,
      created_by: userId,
      updated_by: userId
    });

    if (template.is_default) {
      await AnamneseTemplate.update(
        { is_default: false },
        { where: { tenant_id: tenantId, id: { [db.Sequelize.Op.ne]: template.id } } }
      );
    }

    return this.getById(template.id, tenantId);
  },

  async update(id, tenantId, data, userId) {
    const template = await this.getById(id, tenantId);
    if (!template) return null;

    await template.update({
      name: data.name ?? template.name,
      description: data.description !== undefined ? data.description : template.description,
      active: data.active !== undefined ? data.active : template.active,
      is_default: data.is_default !== undefined ? data.is_default : template.is_default,
      updated_by: userId
    });

    if (template.is_default) {
      await AnamneseTemplate.update(
        { is_default: false },
        { where: { tenant_id: tenantId, id: { [db.Sequelize.Op.ne]: template.id } } }
      );
    }

    return this.getById(id, tenantId);
  },

  async deactivate(id, tenantId, userId) {
    const template = await this.getById(id, tenantId);
    if (!template) return null;
    await template.update({ active: false, is_default: false, updated_by: userId });
    return template;
  },

  async setDefault(id, tenantId, userId) {
    const template = await this.getById(id, tenantId);
    if (!template) return null;
    await AnamneseTemplate.update(
      { is_default: false },
      { where: { tenant_id: tenantId } }
    );
    await template.update({ is_default: true, active: true, updated_by: userId });
    return this.getById(id, tenantId);
  },

  async addField(templateId, tenantId, data) {
    const template = await this.getById(templateId, tenantId);
    if (!template) notFound();

    const maxOrder = await AnamneseTemplateField.max('order_index', {
      where: { template_id: templateId, tenant_id: tenantId }
    });

    return AnamneseTemplateField.create({
      tenant_id: tenantId,
      template_id: templateId,
      label: data.label,
      key: data.key,
      type: data.type || 'text',
      options: data.options || null,
      placeholder: data.placeholder || null,
      help_text: data.help_text || null,
      required: !!data.required,
      order_index: data.order_index ?? (maxOrder ?? -1) + 1,
      active: data.active !== false
    });
  },

  async updateField(templateId, fieldId, tenantId, data) {
    const field = await AnamneseTemplateField.findOne({
      where: { id: fieldId, template_id: templateId, tenant_id: tenantId }
    });
    if (!field) return null;
    await field.update({
      label: data.label ?? field.label,
      key: data.key ?? field.key,
      type: data.type ?? field.type,
      options: data.options !== undefined ? data.options : field.options,
      placeholder: data.placeholder !== undefined ? data.placeholder : field.placeholder,
      help_text: data.help_text !== undefined ? data.help_text : field.help_text,
      required: data.required !== undefined ? data.required : field.required,
      order_index: data.order_index !== undefined ? data.order_index : field.order_index,
      active: data.active !== undefined ? data.active : field.active
    });
    return field;
  },

  async deactivateField(templateId, fieldId, tenantId) {
    const field = await AnamneseTemplateField.findOne({
      where: { id: fieldId, template_id: templateId, tenant_id: tenantId }
    });
    if (!field) return null;
    await field.update({ active: false });
    return field;
  }
};
