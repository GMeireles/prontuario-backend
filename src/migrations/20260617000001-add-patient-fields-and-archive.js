'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('patients', 'rg', {
    type: Sequelize.STRING(20),
    allowNull: true
  });
  await queryInterface.addColumn('patients', 'notes', {
    type: Sequelize.TEXT,
    allowNull: true
  });
  await queryInterface.addColumn('patients', 'active', {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true
  });
  await queryInterface.addColumn('patients', 'archived_at', {
    type: Sequelize.DATE,
    allowNull: true
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn('patients', 'archived_at');
  await queryInterface.removeColumn('patients', 'active');
  await queryInterface.removeColumn('patients', 'notes');
  await queryInterface.removeColumn('patients', 'rg');
}
