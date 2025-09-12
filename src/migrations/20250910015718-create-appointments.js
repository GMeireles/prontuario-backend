'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('appointments', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    patient_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'patients', key: 'id' },
      onDelete: 'CASCADE'
    },
    tenant_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    date_time: {
      type: Sequelize.DATE,
      allowNull: false
    },
    notes: {
      type: Sequelize.TEXT
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

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('appointments');
}
