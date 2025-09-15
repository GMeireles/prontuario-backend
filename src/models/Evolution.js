'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Evolution extends Model {
    static associate(models) {
      Evolution.belongsTo(models.Patient, { foreignKey: 'patient_id', as: 'patient' });
      Evolution.belongsTo(models.User, { foreignKey: 'professional_id', as: 'professional' });
    }
  }

  Evolution.init({
    note: { type: DataTypes.TEXT, allowNull: false }
  }, {
    sequelize,
    modelName: 'Evolution',
    tableName: 'evolutions',
    underscored: true
  });

  return Evolution;
};
