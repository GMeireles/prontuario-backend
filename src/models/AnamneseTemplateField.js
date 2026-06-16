'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class AnamneseTemplateField extends Model {
    static associate(models) {
      AnamneseTemplateField.belongsTo(models.Tenant, { foreignKey: 'tenant_id', as: 'tenant' });
      AnamneseTemplateField.belongsTo(models.AnamneseTemplate, { foreignKey: 'template_id', as: 'template' });
      AnamneseTemplateField.hasMany(models.AnamneseAnswer, { foreignKey: 'template_field_id', as: 'answers' });
    }
  }

  AnamneseTemplateField.init({
    tenant_id: { type: DataTypes.INTEGER, allowNull: false },
    template_id: { type: DataTypes.INTEGER, allowNull: false },
    label: { type: DataTypes.STRING(200), allowNull: false },
    key: { type: DataTypes.STRING(100), allowNull: false },
    type: { type: DataTypes.STRING(30), allowNull: false, defaultValue: 'text' },
    options: DataTypes.JSON,
    placeholder: DataTypes.STRING(255),
    help_text: DataTypes.TEXT,
    required: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    order_index: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  }, {
    sequelize,
    modelName: 'AnamneseTemplateField',
    tableName: 'anamnese_template_fields',
    underscored: true
  });

  return AnamneseTemplateField;
};
