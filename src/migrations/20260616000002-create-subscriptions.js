'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('subscriptions', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    tenant_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: 'tenants', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    plan_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'plans', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    stripe_customer_id: { type: Sequelize.STRING(255), allowNull: true },
    stripe_subscription_id: { type: Sequelize.STRING(255), allowNull: true, unique: true },
    status: {
      type: Sequelize.ENUM('trialing', 'active', 'past_due', 'canceled', 'unpaid', 'incomplete'),
      allowNull: false,
      defaultValue: 'active'
    },
    current_period_start: { type: Sequelize.DATE, allowNull: true },
    current_period_end: { type: Sequelize.DATE, allowNull: true },
    trial_ends_at: { type: Sequelize.DATE, allowNull: true },
    cancel_at_period_end: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    canceled_at: { type: Sequelize.DATE, allowNull: true },
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
  await queryInterface.dropTable('subscriptions');
}
