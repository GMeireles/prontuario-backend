'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Patient extends Model {
    static associate(models) {
      Patient.hasMany(models.Record, { foreignKey: 'patient_id', onDelete: 'CASCADE' });
      Patient.hasMany(models.Appointment, { foreignKey: 'patient_id', onDelete: 'CASCADE' });
    }
  }
  Patient.init({
    tenant_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(20)
    },
    email: {
      type: DataTypes.STRING(100)
    }
  }, {
    sequelize,
    modelName: 'Patient',
    tableName: 'patients',
    underscored: true
  });
  return Patient;
};
