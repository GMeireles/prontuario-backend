import { AsyncLocalStorage } from 'async_hooks';

const tenantContext = new AsyncLocalStorage();

export function getTenantId() {
  const store = tenantContext.getStore();
  if (!store?.tenantId) {
    throw new Error('Tenant ID não definido no contexto da requisição');
  }
  return store.tenantId;
}

export function runWithTenant(tenantId, callback) {
  return tenantContext.run({ tenantId }, callback);
}

export { tenantContext };
