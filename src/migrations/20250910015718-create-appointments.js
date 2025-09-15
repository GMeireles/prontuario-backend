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
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    professional_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',   // se o profissional for apagado, apaga as consultas
      onUpdate: 'CASCADE'
    },
    tenant_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    date_time: {
      type: Sequelize.DATE,
      allowNull: false
    },
    status: {
      type: Sequelize.ENUM('scheduled', 'confirmed', 'cancelled', 'completed'),
      allowNull: false,
      defaultValue: 'scheduled'
    },
    notes: {
      type: Sequelize.TEXT
    },
    cancellation_reason: {
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
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_appointments_status";');
}
