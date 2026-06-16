'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Anamnese extends Model {
    static associate(models) {
      Anamnese.belongsTo(models.Patient, { foreignKey: 'patient_id', as: 'patient' });
      Anamnese.belongsTo(models.User, { foreignKey: 'professional_id', as: 'professional' });
      Anamnese.belongsTo(models.User, { foreignKey: 'signed_by', as: 'signer' });
      Anamnese.belongsTo(models.Tenant, { foreignKey: 'tenant_id', as: 'tenant' });
      Anamnese.belongsTo(models.AnamneseTemplate, { foreignKey: 'template_id', as: 'template' });
      Anamnese.belongsTo(models.DigitalSignature, { foreignKey: 'signature_id', as: 'signature' });
      Anamnese.hasMany(models.AnamneseAnswer, { foreignKey: 'anamnese_id', as: 'answers' });
    }
  }

  Anamnese.init({
    patient_id: { type: DataTypes.INTEGER, allowNull: false },
    professional_id: { type: DataTypes.INTEGER, allowNull: false },
    tenant_id: { type: DataTypes.INTEGER, allowNull: false },
    template_id: DataTypes.INTEGER,
    main_complaint: DataTypes.TEXT,
    medical_history: DataTypes.TEXT,
    family_history: DataTypes.TEXT,
    lifestyle: DataTypes.TEXT,
    allergies: DataTypes.TEXT,
    signed_at: DataTypes.DATE,
    signed_by: DataTypes.INTEGER,
    signature_id: DataTypes.INTEGER,
    locked_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Anamnese',
    tableName: 'anamneses',
    underscored: true
  });

  return Anamnese;
};
