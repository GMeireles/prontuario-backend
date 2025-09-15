// models/Anamnese.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Patient from './Patient.js';
import User from './User.js';

const Anamnese = sequelize.define('Anamnese', {
  main_complaint: { type: DataTypes.TEXT, allowNull: false },
  medical_history: { type: DataTypes.TEXT },
  family_history: { type: DataTypes.TEXT },
  lifestyle: { type: DataTypes.TEXT },
  allergies: { type: DataTypes.TEXT }
}, {
  tableName: 'anamneses',
  timestamps: true
});

Anamnese.belongsTo(Patient, { foreignKey: 'patient_id', as: 'patient' });
Anamnese.belongsTo(User, { foreignKey: 'professional_id', as: 'professional' });

export default Anamnese;
