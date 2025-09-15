'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Prescription extends Model {
    static associate(models) {
      Prescription.belongsTo(models.Patient, { foreignKey: 'patient_id', as: 'patient' });
      Prescription.belongsTo(models.User, { foreignKey: 'professional_id', as: 'professional' });
      Prescription.belongsTo(models.Tenant, { foreignKey: 'tenant_id', as: 'tenant' });
    }
  }

  Prescription.init({
    type: { type: DataTypes.ENUM('medication', 'conduct', 'referral'), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    dosage: DataTypes.STRING,
    frequency: DataTypes.STRING,
    duration: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Prescription',
    tableName: 'prescriptions',
    underscored: true
  });

  return Prescription;
};
