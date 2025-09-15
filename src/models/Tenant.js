'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Tenant extends Model {
    static associate(models) {
      Tenant.hasMany(models.User, { foreignKey: 'tenant_id', as: 'users' });
      Tenant.hasMany(models.Patient, { foreignKey: 'tenant_id', as: 'patients' });
      Tenant.hasMany(models.Appointment, { foreignKey: 'tenant_id', as: 'appointments' });
      Tenant.hasMany(models.Anamnese, { foreignKey: 'tenant_id', as: 'anamneses' });
      Tenant.hasMany(models.Evolution, { foreignKey: 'tenant_id', as: 'evolutions' });
      Tenant.hasMany(models.Prescription, { foreignKey: 'tenant_id', as: 'prescriptions' });
      Tenant.hasMany(models.File, { foreignKey: 'tenant_id', as: 'files' });
    }
  }

  Tenant.init({
    name: { type: DataTypes.STRING, allowNull: false },
    cnpj: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    plan: { type: DataTypes.ENUM('free', 'basic', 'pro', 'enterprise'), defaultValue: 'basic' },
    active: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    sequelize,
    modelName: 'Tenant',
    tableName: 'tenants',
    underscored: true
  });

  return Tenant;
};
