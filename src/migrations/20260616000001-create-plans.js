'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('plans', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: { type: Sequelize.STRING(100), allowNull: false },
    slug: { type: Sequelize.STRING(50), allowNull: false, unique: true },
    description: { type: Sequelize.TEXT },
    price_cents: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    currency: { type: Sequelize.STRING(3), allowNull: false, defaultValue: 'brl' },
    interval: { type: Sequelize.ENUM('month', 'year'), allowNull: false, defaultValue: 'month' },
    stripe_price_id: { type: Sequelize.STRING(255), allowNull: true },
    max_users: { type: Sequelize.INTEGER, allowNull: true },
    max_patients: { type: Sequelize.INTEGER, allowNull: true },
    max_storage_mb: { type: Sequelize.INTEGER, allowNull: true },
    features: { type: Sequelize.JSON, allowNull: true },
    active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
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
}

export async function down(queryInterface) {
  await queryInterface.dropTable('plans');
}
