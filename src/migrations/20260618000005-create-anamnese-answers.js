'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('anamnese_answers', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    tenant_id: { type: Sequelize.INTEGER, allowNull: false },
    anamnese_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'anamneses', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    template_field_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'anamnese_template_fields', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    field_key: { type: Sequelize.STRING(100), allowNull: false },
    value_text: { type: Sequelize.TEXT, allowNull: true },
    value_json: { type: Sequelize.JSON, allowNull: true },
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

  await queryInterface.addIndex('anamnese_answers', ['anamnese_id', 'field_key'], {
    unique: true,
    name: 'anamnese_answers_anamnese_field_key_unique'
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('anamnese_answers');
}
