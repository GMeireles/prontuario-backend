'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('patient_aasis', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    tenant_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    patient_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'patients', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    ear: {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: 'unknown'
    },
    brand: { type: Sequelize.STRING(100), allowNull: true },
    model: { type: Sequelize.STRING(100), allowNull: true },
    serial_number: { type: Sequelize.STRING(100), allowNull: true },
    power: { type: Sequelize.STRING(50), allowNull: true },
    technology: { type: Sequelize.STRING(100), allowNull: true },
    color: { type: Sequelize.STRING(50), allowNull: true },
    acquisition_date: { type: Sequelize.DATEONLY, allowNull: true },
    adaptation_date: { type: Sequelize.DATEONLY, allowNull: true },
    warranty_until: { type: Sequelize.DATEONLY, allowNull: true },
    supplier: { type: Sequelize.STRING(150), allowNull: true },
    sale_order_id: { type: Sequelize.INTEGER, allowNull: true },
    notes: { type: Sequelize.TEXT, allowNull: true },
    active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
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

  await queryInterface.addIndex('patient_aasis', ['tenant_id', 'patient_id'], {
    name: 'patient_aasis_tenant_patient_idx'
  });
  await queryInterface.addIndex('patient_aasis', ['tenant_id', 'serial_number'], {
    name: 'patient_aasis_tenant_serial_idx'
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('patient_aasis');
}
