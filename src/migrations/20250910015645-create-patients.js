'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('patients', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    tenant_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    birth_date: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    phone: {
      type: Sequelize.STRING(20)
    },
    email: {
      type: Sequelize.STRING(100)
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
  await queryInterface.dropTable('patients');
}
