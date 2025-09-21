// migrations/xxxx-create-prescription-files.js
'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('prescription_files', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    prescription_id: {
      type: Sequelize.INTEGER,
      references: { model: 'prescriptions', key: 'id' },
      onDelete: 'CASCADE'
    },
    file_id: {
      type: Sequelize.INTEGER,
      references: { model: 'files', key: 'id' },
      onDelete: 'CASCADE'
    },
    created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('prescription_files');
}
