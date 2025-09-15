'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class File extends Model {
    static associate(models) {
      File.belongsTo(models.Patient, { foreignKey: 'patient_id', as: 'patient' });
      File.belongsTo(models.User, { foreignKey: 'uploaded_by', as: 'uploader' });
    }
  }

  File.init({
    type: { type: DataTypes.ENUM('exam', 'image', 'document', 'other'), defaultValue: 'document' },
    filename: { type: DataTypes.STRING, allowNull: false },
    filepath: { type: DataTypes.STRING, allowNull: false },
    mimetype: { type: DataTypes.STRING, allowNull: false },
    size: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    sequelize,
    modelName: 'File',
    tableName: 'files',
    underscored: true
  });

  return File;
};
