'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('anamnese_templates', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    tenant_id: { type: Sequelize.INTEGER, allowNull: false },
    name: { type: Sequelize.STRING(150), allowNull: false },
    description: { type: Sequelize.TEXT, allowNull: true },
    active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
    is_default: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    created_by: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    updated_by: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
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

  await queryInterface.addIndex('anamnese_templates', ['tenant_id', 'active'], {
    name: 'anamnese_templates_tenant_active_idx'
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('anamnese_templates');
}
