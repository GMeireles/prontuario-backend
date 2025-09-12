'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Appointment extends Model {
    static associate(models) {
      Appointment.belongsTo(models.Patient, { foreignKey: 'patient_id' });
    }
  }
  Appointment.init({
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tenant_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT
    }
  }, {
    sequelize,
    modelName: 'Appointment',
    tableName: 'appointments',
    underscored: true
  });
  return Appointment;
};
