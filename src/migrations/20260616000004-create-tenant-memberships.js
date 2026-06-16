'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('tenant_memberships', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    tenant_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'tenants', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    role: {
      type: Sequelize.ENUM('admin', 'professional', 'assistant'),
      allowNull: false,
      defaultValue: 'professional'
    },
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

  await queryInterface.addIndex('tenant_memberships', ['tenant_id', 'user_id'], {
    unique: true,
    name: 'tenant_memberships_tenant_user_unique'
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('tenant_memberships');
}
