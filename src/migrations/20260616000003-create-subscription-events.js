'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('subscription_events', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    tenant_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'tenants', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    subscription_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'subscriptions', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    provider: { type: Sequelize.STRING(50), allowNull: false, defaultValue: 'stripe' },
    event_type: { type: Sequelize.STRING(100), allowNull: false },
    provider_event_id: { type: Sequelize.STRING(255), allowNull: false, unique: true },
    payload: { type: Sequelize.JSON, allowNull: true },
    processed_at: { type: Sequelize.DATE, allowNull: true },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('subscription_events');
}
