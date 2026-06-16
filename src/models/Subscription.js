'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Subscription extends Model {
    static associate(models) {
      Subscription.belongsTo(models.Tenant, { foreignKey: 'tenant_id', as: 'tenant' });
      Subscription.belongsTo(models.Plan, { foreignKey: 'plan_id', as: 'plan' });
      Subscription.hasMany(models.SubscriptionEvent, { foreignKey: 'subscription_id', as: 'events' });
    }
  }

  Subscription.init({
    tenant_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    plan_id: { type: DataTypes.INTEGER, allowNull: false },
    stripe_customer_id: DataTypes.STRING(255),
    stripe_subscription_id: { type: DataTypes.STRING(255), unique: true },
    status: {
      type: DataTypes.ENUM('trialing', 'active', 'past_due', 'canceled', 'unpaid', 'incomplete'),
      allowNull: false,
      defaultValue: 'active'
    },
    current_period_start: DataTypes.DATE,
    current_period_end: DataTypes.DATE,
    trial_ends_at: DataTypes.DATE,
    cancel_at_period_end: { type: DataTypes.BOOLEAN, defaultValue: false },
    canceled_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Subscription',
    tableName: 'subscriptions',
    underscored: true
  });

  return Subscription;
};
