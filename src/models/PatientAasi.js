'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class PatientAasi extends Model {
    static associate(models) {
      PatientAasi.belongsTo(models.Tenant, { foreignKey: 'tenant_id', as: 'tenant' });
      PatientAasi.belongsTo(models.Patient, { foreignKey: 'patient_id', as: 'patient' });
      PatientAasi.belongsTo(models.User, { foreignKey: 'created_by', as: 'creator' });
      PatientAasi.belongsTo(models.User, { foreignKey: 'updated_by', as: 'updater' });
    }
  }

  PatientAasi.init({
    tenant_id: { type: DataTypes.INTEGER, allowNull: false },
    patient_id: { type: DataTypes.INTEGER, allowNull: false },
    ear: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'unknown' },
    brand: DataTypes.STRING(100),
    model: DataTypes.STRING(100),
    serial_number: DataTypes.STRING(100),
    power: DataTypes.STRING(50),
    technology: DataTypes.STRING(100),
    color: DataTypes.STRING(50),
    acquisition_date: DataTypes.DATEONLY,
    adaptation_date: DataTypes.DATEONLY,
    warranty_until: DataTypes.DATEONLY,
    supplier: DataTypes.STRING(150),
    sale_order_id: DataTypes.INTEGER,
    notes: DataTypes.TEXT,
    active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PatientAasi',
    tableName: 'patient_aasis',
    underscored: true
  });

  return PatientAasi;
};
