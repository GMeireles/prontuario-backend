'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('evolutions', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    patient_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'patients', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    professional_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    tenant_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'tenants', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    note: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('evolutions');
}
