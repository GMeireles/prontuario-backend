'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('anamneses', 'template_id', {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: { model: 'anamnese_templates', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  });
  await queryInterface.addColumn('anamneses', 'signed_at', {
    type: Sequelize.DATE,
    allowNull: true
  });
  await queryInterface.addColumn('anamneses', 'signed_by', {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  });
  await queryInterface.addColumn('anamneses', 'signature_id', {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: { model: 'digital_signatures', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  });
  await queryInterface.addColumn('anamneses', 'locked_at', {
    type: Sequelize.DATE,
    allowNull: true
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn('anamneses', 'locked_at');
  await queryInterface.removeColumn('anamneses', 'signature_id');
  await queryInterface.removeColumn('anamneses', 'signed_by');
  await queryInterface.removeColumn('anamneses', 'signed_at');
  await queryInterface.removeColumn('anamneses', 'template_id');
}
