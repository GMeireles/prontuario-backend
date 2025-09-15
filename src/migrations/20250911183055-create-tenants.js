'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('tenants', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    cnpj: {
      type: Sequelize.STRING,
      allowNull: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: true
    },
    plan: {
      type: Sequelize.ENUM('free', 'basic', 'pro', 'enterprise'),
      allowNull: false,
      defaultValue: 'basic'
    },
    active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
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
  await queryInterface.dropTable('tenants');
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_tenants_plan";');
}
