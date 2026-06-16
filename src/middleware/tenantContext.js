import { errorResponse } from '../utils/apiResponse.js';
import { tenantContext } from '../utils/tenantStore.js';

export const tenantContextMiddleware = (req, res, next) => {
  try {
    if (!req.user?.id) {
      return errorResponse(res, 'Autenticação necessária', null, 401);
    }

    const headerTenantId = req.headers['x-tenant-id'] || req.headers['X-Tenant-ID'] || null;
    let tenantId = headerTenantId ? parseInt(headerTenantId, 10) : req.user.tenant_id;

    if (!tenantId || Number.isNaN(tenantId)) {
      return errorResponse(res, 'Tenant ID inválido', null, 400);
    }

    if (req.user.tenant_id && req.user.tenant_id !== tenantId) {
      return errorResponse(res, 'Acesso negado ao tenant informado', null, 403);
    }

    req.tenant_id = tenantId;
    req.tenantId = tenantId;

    tenantContext.run({ tenantId }, () => next());
  } catch (error) {
    console.error('Erro no tenantContextMiddleware:', error);
    return errorResponse(res, 'Erro ao validar tenant', null, 500);
  }
};

export { getTenantId, runWithTenant } from '../utils/tenantStore.js';
