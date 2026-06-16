'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Patient extends Model {
    static associate(models) {
      Patient.hasMany(models.Record, { foreignKey: 'patient_id', onDelete: 'CASCADE' });
      Patient.hasMany(models.Appointment, { foreignKey: 'patient_id', onDelete: 'CASCADE' });
      Patient.hasMany(models.Anamnese, { foreignKey: 'patient_id', as: 'anamneses' });
      Patient.hasMany(models.Evolution, { foreignKey: 'patient_id', as: 'evolutions' });
      Patient.hasMany(models.Prescription, { foreignKey: 'patient_id', as: 'prescriptions' });
      Patient.hasMany(models.File, { foreignKey: 'patient_id', as: 'files' });
      Patient.hasMany(models.PatientAasi, { foreignKey: 'patient_id', as: 'aasis' });
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
      allowNull: false
    },
    rg: {
      type: DataTypes.STRING(20),
      allowNull: true
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
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    archived_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Patient',
    tableName: 'patients',
    underscored: true,
    indexes: [
      { unique: true, fields: ['tenant_id', 'cpf'], name: 'patients_tenant_id_cpf_unique' }
    ]
  });

  return Patient;
};
