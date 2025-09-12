'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Record extends Model {
    static associate(models) {
      Record.belongsTo(models.Patient, { foreignKey: 'patient_id' });
    }
  }
  Record.init({
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tenant_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Record',
    tableName: 'records',
    underscored: true
  });
  return Record;
};
