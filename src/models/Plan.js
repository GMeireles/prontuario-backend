'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Plan extends Model {
    static associate(models) {
      Plan.hasMany(models.Subscription, { foreignKey: 'plan_id', as: 'subscriptions' });
      Plan.hasMany(models.Tenant, { foreignKey: 'plan_id', as: 'tenantsByPlan' });
    }
  }

  Plan.init({
    name: { type: DataTypes.STRING(100), allowNull: false },
    slug: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    description: DataTypes.TEXT,
    price_cents: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    currency: { type: DataTypes.STRING(3), allowNull: false, defaultValue: 'brl' },
    interval: { type: DataTypes.ENUM('month', 'year'), allowNull: false, defaultValue: 'month' },
    stripe_price_id: DataTypes.STRING(255),
    max_users: DataTypes.INTEGER,
    max_patients: DataTypes.INTEGER,
    max_storage_mb: DataTypes.INTEGER,
    features: DataTypes.JSON,
    active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  }, {
    sequelize,
    modelName: 'Plan',
    tableName: 'plans',
    underscored: true
  });

  return Plan;
};
