'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class PrescriptionFile extends Model {
    static associate(models) {
      PrescriptionFile.belongsTo(models.Prescription, {
        foreignKey: 'prescription_id',
        as: 'prescription'
      });
      PrescriptionFile.belongsTo(models.File, {
        foreignKey: 'file_id',
        as: 'file'
      });
    }
  }

  PrescriptionFile.init({}, {
    sequelize,
    modelName: 'PrescriptionFile',
    tableName: 'prescription_files',
    underscored: true
  });

  return PrescriptionFile;
};
