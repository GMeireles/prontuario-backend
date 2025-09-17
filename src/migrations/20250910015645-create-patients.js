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
    cpf: {
      type: Sequelize.STRING(11),
      allowNull: false,
      unique: true
    },
    birth_date: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    gender: {
      type: Sequelize.ENUM('M', 'F', 'O'),
      allowNull: false
    },
    phone: {
      type: Sequelize.STRING(20)
    },
    address: {
      type: Sequelize.STRING(255)
    },
    city: {
      type: Sequelize.STRING(100)
    },
    state: {
      type: Sequelize.STRING(2)
    },
    zip_code: {
      type: Sequelize.STRING(9)
    },
    responsible_name: {
      type: Sequelize.STRING(100),
      allowNull: true
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
