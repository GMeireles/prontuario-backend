'use strict';

const DEFAULT_FIELDS = [
  { key: 'queixa_principal', label: 'Queixa principal', type: 'textarea', required: true, order_index: 0 },
  { key: 'historico_medico', label: 'Histórico médico', type: 'textarea', required: false, order_index: 1 },
  { key: 'historico_familiar', label: 'Histórico familiar', type: 'textarea', required: false, order_index: 2 },
  { key: 'medicamentos', label: 'Uso de medicamentos', type: 'textarea', required: false, order_index: 3 },
  { key: 'alergias', label: 'Alergias', type: 'textarea', required: false, order_index: 4 },
  { key: 'exposicao_ruido', label: 'Exposição a ruído', type: 'boolean', required: false, order_index: 5 },
  { key: 'zumbido', label: 'Zumbido', type: 'boolean', required: false, order_index: 6 },
  { key: 'tontura', label: 'Tontura', type: 'boolean', required: false, order_index: 7 },
  { key: 'dificuldade_auditiva', label: 'Dificuldade auditiva', type: 'textarea', required: false, order_index: 8 },
  { key: 'observacoes', label: 'Observações gerais', type: 'textarea', required: false, order_index: 9 }
];

export async function up(queryInterface) {
  const [tenants] = await queryInterface.sequelize.query(
    'SELECT id FROM tenants ORDER BY id ASC'
  );

  const now = new Date();

  for (const tenant of tenants) {
    const tenantId = tenant.id;

    const [existing] = await queryInterface.sequelize.query(
      `SELECT id FROM anamnese_templates WHERE tenant_id = :tenantId AND is_default = true LIMIT 1`,
      { replacements: { tenantId } }
    );

    if (existing.length > 0) continue;

    await queryInterface.bulkInsert('anamnese_templates', [{
      tenant_id: tenantId,
      name: 'Anamnese Audiológica Padrão',
      description: 'Template padrão de anamnese audiológica',
      active: true,
      is_default: true,
      created_by: null,
      updated_by: null,
      created_at: now,
      updated_at: now
    }]);

    const [inserted] = await queryInterface.sequelize.query(
      `SELECT id FROM anamnese_templates WHERE tenant_id = :tenantId AND is_default = true ORDER BY id DESC LIMIT 1`,
      { replacements: { tenantId } }
    );

    const templateId = inserted[0]?.id;
    if (!templateId) continue;

    const fieldRows = DEFAULT_FIELDS.map((f) => ({
      tenant_id: tenantId,
      template_id: templateId,
      label: f.label,
      key: f.key,
      type: f.type,
      options: null,
      placeholder: null,
      help_text: null,
      required: f.required,
      order_index: f.order_index,
      active: true,
      created_at: now,
      updated_at: now
    }));

    await queryInterface.bulkInsert('anamnese_template_fields', fieldRows);
  }
}

export async function down(queryInterface) {
  await queryInterface.sequelize.query(
    `DELETE FROM anamnese_template_fields WHERE template_id IN (
      SELECT id FROM anamnese_templates WHERE name = 'Anamnese Audiológica Padrão'
    )`
  );
  await queryInterface.bulkDelete('anamnese_templates', { name: 'Anamnese Audiológica Padrão' });
}
