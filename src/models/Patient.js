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
    cpf: {
      type: DataTypes.STRING(11),
      allowNull: false,
      unique: true
    },
    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    gender: {
      type: DataTypes.ENUM('M', 'F', 'O'),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(20)
    },
    address: {
      type: DataTypes.STRING(255)
    },
    city: {
      type: DataTypes.STRING(100)
    },
    state: {
      type: DataTypes.STRING(2)
    },
    zip_code: {
      type: DataTypes.STRING(9)
    },
    responsible_name: {
      type: DataTypes.STRING(100),
      allowNull: true
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
