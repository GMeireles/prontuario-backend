'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('tenants', 'stripe_customer_id', {
    type: Sequelize.STRING(255),
    allowNull: true
  });
  await queryInterface.addColumn('tenants', 'subscription_status', {
    type: Sequelize.STRING(50),
    allowNull: true
  });
  await queryInterface.addColumn('tenants', 'plan_id', {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: { model: 'plans', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  });
  await queryInterface.addColumn('tenants', 'billing_email', {
    type: Sequelize.STRING(255),
    allowNull: true
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn('tenants', 'billing_email');
  await queryInterface.removeColumn('tenants', 'plan_id');
  await queryInterface.removeColumn('tenants', 'subscription_status');
  await queryInterface.removeColumn('tenants', 'stripe_customer_id');
}
