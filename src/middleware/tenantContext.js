import { formatErrorResponse } from '../utils/errorHandler.js';
import { tenantContext } from '../utils/tenantStore.js';

export const tenantContextMiddleware = (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Autenticação necessária' });
    }

    const headerTenantId = req.headers['x-tenant-id'] || req.headers['X-Tenant-ID'] || null;
    let tenantId = headerTenantId ? parseInt(headerTenantId, 10) : req.user.tenant_id;

    if (!tenantId || Number.isNaN(tenantId)) {
      return res.status(400).json({ error: 'Tenant ID inválido' });
    }

    if (req.user.tenant_id && req.user.tenant_id !== tenantId) {
      return res.status(403).json({ error: 'Acesso negado ao tenant informado' });
    }

    req.tenant_id = tenantId;
    req.tenantId = tenantId;

    tenantContext.run({ tenantId }, () => next());
  } catch (error) {
    console.error('Erro no tenantContextMiddleware:', error);
    res.status(500).json(formatErrorResponse(error, 'Erro ao validar tenant'));
  }
};

export { getTenantId, runWithTenant } from '../utils/tenantStore.js';
