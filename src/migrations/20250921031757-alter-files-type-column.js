// migrations/xxxx-alter-files-type-column.js
'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.changeColumn('files', 'type', {
    type: Sequelize.STRING(50),
    allowNull: false,
    defaultValue: 'document'
  });
}

export async function down(queryInterface, Sequelize) {
  // Aqui você pode reverter para o estado anterior
  // Supondo que antes era STRING(20) ou ENUM limitado
  await queryInterface.changeColumn('files', 'type', {
    type: Sequelize.STRING(20),
    allowNull: false,
    defaultValue: 'document'
  });
}
