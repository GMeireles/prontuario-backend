'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class TenantMembership extends Model {
    static associate(models) {
      TenantMembership.belongsTo(models.Tenant, { foreignKey: 'tenant_id', as: 'tenant' });
      TenantMembership.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
  }

  TenantMembership.init({
    tenant_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    role: {
      type: DataTypes.ENUM('admin', 'professional', 'assistant'),
      allowNull: false,
      defaultValue: 'professional'
    },
    active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  }, {
    sequelize,
    modelName: 'TenantMembership',
    tableName: 'tenant_memberships',
    underscored: true
  });

  return TenantMembership;
};
