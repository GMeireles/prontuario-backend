'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class SubscriptionEvent extends Model {
    static associate(models) {
      SubscriptionEvent.belongsTo(models.Tenant, { foreignKey: 'tenant_id', as: 'tenant' });
      SubscriptionEvent.belongsTo(models.Subscription, { foreignKey: 'subscription_id', as: 'subscription' });
    }
  }

  SubscriptionEvent.init({
    tenant_id: DataTypes.INTEGER,
    subscription_id: DataTypes.INTEGER,
    provider: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'stripe' },
    event_type: { type: DataTypes.STRING(100), allowNull: false },
    provider_event_id: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    payload: DataTypes.JSON,
    processed_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'SubscriptionEvent',
    tableName: 'subscription_events',
    underscored: true,
    updatedAt: false
  });

  return SubscriptionEvent;
};
