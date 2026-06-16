'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('digital_signatures', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    tenant_id: { type: Sequelize.INTEGER, allowNull: false },
    patient_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'patients', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    entity_type: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    entity_id: { type: Sequelize.INTEGER, allowNull: false },
    signature_type: {
      type: Sequelize.STRING(30),
      allowNull: false,
      defaultValue: 'typed'
    },
    signature_data: { type: Sequelize.TEXT, allowNull: false },
    signer_name: { type: Sequelize.STRING(200), allowNull: false },
    signer_document: { type: Sequelize.STRING(50), allowNull: true },
    ip_address: { type: Sequelize.STRING(45), allowNull: true },
    user_agent: { type: Sequelize.TEXT, allowNull: true },
    document_hash: { type: Sequelize.STRING(64), allowNull: true },
    signed_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
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

  await queryInterface.addIndex('digital_signatures', ['tenant_id', 'entity_type', 'entity_id'], {
    name: 'digital_signatures_entity_idx'
  });
  await queryInterface.addIndex('digital_signatures', ['tenant_id', 'patient_id'], {
    name: 'digital_signatures_patient_idx'
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('digital_signatures');
}
