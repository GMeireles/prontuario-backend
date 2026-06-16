'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class DigitalSignature extends Model {
    static associate(models) {
      DigitalSignature.belongsTo(models.Tenant, { foreignKey: 'tenant_id', as: 'tenant' });
      DigitalSignature.belongsTo(models.Patient, { foreignKey: 'patient_id', as: 'patient' });
      DigitalSignature.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
  }

  DigitalSignature.init({
    tenant_id: { type: DataTypes.INTEGER, allowNull: false },
    patient_id: DataTypes.INTEGER,
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    entity_type: { type: DataTypes.STRING(50), allowNull: false },
    entity_id: { type: DataTypes.INTEGER, allowNull: false },
    signature_type: { type: DataTypes.STRING(30), allowNull: false, defaultValue: 'typed' },
    signature_data: { type: DataTypes.TEXT, allowNull: false },
    signer_name: { type: DataTypes.STRING(200), allowNull: false },
    signer_document: DataTypes.STRING(50),
    ip_address: DataTypes.STRING(45),
    user_agent: DataTypes.TEXT,
    document_hash: DataTypes.STRING(64),
    signed_at: { type: DataTypes.DATE, allowNull: false }
  }, {
    sequelize,
    modelName: 'DigitalSignature',
    tableName: 'digital_signatures',
    underscored: true
  });

  return DigitalSignature;
};
