'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('anamnese_template_fields', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    tenant_id: { type: Sequelize.INTEGER, allowNull: false },
    template_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'anamnese_templates', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    label: { type: Sequelize.STRING(200), allowNull: false },
    key: { type: Sequelize.STRING(100), allowNull: false },
    type: {
      type: Sequelize.STRING(30),
      allowNull: false,
      defaultValue: 'text'
    },
    options: { type: Sequelize.JSON, allowNull: true },
    placeholder: { type: Sequelize.STRING(255), allowNull: true },
    help_text: { type: Sequelize.TEXT, allowNull: true },
    required: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    order_index: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  });

  await queryInterface.addIndex('anamnese_template_fields', ['tenant_id', 'template_id', 'order_index'], {
    name: 'anamnese_template_fields_order_idx'
  });
  await queryInterface.addIndex('anamnese_template_fields', ['template_id', 'key'], {
    unique: true,
    name: 'anamnese_template_fields_template_key_unique'
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('anamnese_template_fields');
}
