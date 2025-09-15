// models/Prescription.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Patient from './Patient.js';
import User from './User.js';

const Prescription = sequelize.define('Prescription', {
  type: { type: DataTypes.ENUM('medication', 'conduct', 'referral'), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  dosage: { type: DataTypes.STRING },
  frequency: { type: DataTypes.STRING },
  duration: { type: DataTypes.STRING }
}, {
  tableName: 'prescriptions',
  timestamps: true
});

Prescription.belongsTo(Patient, { foreignKey: 'patient_id', as: 'patient' });
Prescription.belongsTo(User, { foreignKey: 'professional_id', as: 'professional' });

export default Prescription;
