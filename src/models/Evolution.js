// models/Evolution.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Patient from './Patient.js';
import User from './User.js';

const Evolution = sequelize.define('Evolution', {
  note: { type: DataTypes.TEXT, allowNull: false }
}, {
  tableName: 'evolutions',
  timestamps: true
});

Evolution.belongsTo(Patient, { foreignKey: 'patient_id', as: 'patient' });
Evolution.belongsTo(User, { foreignKey: 'professional_id', as: 'professional' });

export default Evolution;
