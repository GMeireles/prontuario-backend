export function addTenantScope(Model, getTenantId) {
  Model.addHook('beforeFind', 'tenantFilter', (options) => {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant ID não definido no contexto da requisição');
    }

    if (!options.where) {
      options.where = {};
    }

    if (!options.where.tenant_id) {
      options.where.tenant_id = tenantId;
    } else {
      const existingTenantId = options.where.tenant_id;
      if (typeof existingTenantId === 'number' || typeof existingTenantId === 'string') {
        const existingIdNum = typeof existingTenantId === 'string' ? parseInt(existingTenantId, 10) : existingTenantId;
        if (existingIdNum !== tenantId) {
          throw new Error('Tentativa de acesso a dados de outro tenant');
        }
      }
    }
  });

  Model.addHook('beforeValidate', 'tenantEnforceBeforeValidate', (instance) => {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant ID não definido no contexto da requisição');
    }
    instance.tenant_id = tenantId;
    if (instance.dataValues) {
      instance.dataValues.tenant_id = tenantId;
    }
  });

  Model.addHook('beforeUpdate', 'tenantValidate', (instance) => {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant ID não definido no contexto da requisição');
    }
    if (instance.tenant_id && instance.tenant_id !== tenantId) {
      throw new Error('Tentativa de atualizar registro de outro tenant');
    }
    if (instance.changed('tenant_id')) {
      delete instance.tenant_id;
      instance.changed('tenant_id', false);
    }
  });

  Model.addHook('beforeDestroy', 'tenantValidateDestroy', (instance) => {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant ID não definido no contexto da requisição');
    }
    if (instance.tenant_id != null && instance.tenant_id !== tenantId) {
      throw new Error('Tentativa de deletar registro de outro tenant');
    }
  });
}

export function withoutTenantScope(Model) {
  return Model.unscoped();
}
