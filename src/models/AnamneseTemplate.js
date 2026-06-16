'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class AnamneseTemplate extends Model {
    static associate(models) {
      AnamneseTemplate.belongsTo(models.Tenant, { foreignKey: 'tenant_id', as: 'tenant' });
      AnamneseTemplate.belongsTo(models.User, { foreignKey: 'created_by', as: 'creator' });
      AnamneseTemplate.belongsTo(models.User, { foreignKey: 'updated_by', as: 'updater' });
      AnamneseTemplate.hasMany(models.AnamneseTemplateField, { foreignKey: 'template_id', as: 'fields' });
      AnamneseTemplate.hasMany(models.Anamnese, { foreignKey: 'template_id', as: 'anamneses' });
    }
  }

  AnamneseTemplate.init({
    tenant_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING(150), allowNull: false },
    description: DataTypes.TEXT,
    active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    is_default: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'AnamneseTemplate',
    tableName: 'anamnese_templates',
    underscored: true
  });

  return AnamneseTemplate;
};
