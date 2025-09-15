'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Anamnese extends Model {
    static associate(models) {
      Anamnese.belongsTo(models.Patient, { foreignKey: 'patient_id', as: 'patient' });
      Anamnese.belongsTo(models.User, { foreignKey: 'professional_id', as: 'professional' });
      Anamnese.belongsTo(models.Tenant, { foreignKey: 'tenant_id', as: 'tenant' });
    }
  }

  Anamnese.init({
    main_complaint: { type: DataTypes.TEXT, allowNull: false },
    medical_history: DataTypes.TEXT,
    family_history: DataTypes.TEXT,
    lifestyle: DataTypes.TEXT,
    allergies: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Anamnese',
    tableName: 'anamneses',
    underscored: true
  });

  return Anamnese;
};
