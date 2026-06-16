'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class AnamneseAnswer extends Model {
    static associate(models) {
      AnamneseAnswer.belongsTo(models.Tenant, { foreignKey: 'tenant_id', as: 'tenant' });
      AnamneseAnswer.belongsTo(models.Anamnese, { foreignKey: 'anamnese_id', as: 'anamnese' });
      AnamneseAnswer.belongsTo(models.AnamneseTemplateField, { foreignKey: 'template_field_id', as: 'template_field' });
    }
  }

  AnamneseAnswer.init({
    tenant_id: { type: DataTypes.INTEGER, allowNull: false },
    anamnese_id: { type: DataTypes.INTEGER, allowNull: false },
    template_field_id: DataTypes.INTEGER,
    field_key: { type: DataTypes.STRING(100), allowNull: false },
    value_text: DataTypes.TEXT,
    value_json: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'AnamneseAnswer',
    tableName: 'anamnese_answers',
    underscored: true
  });

  return AnamneseAnswer;
};
