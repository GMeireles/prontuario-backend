import { tenantAccessService } from '../services/tenantAccessService.js';
import { errorResponse } from '../utils/apiResponse.js';

export const requireActiveSubscription = async (req, res, next) => {
  try {
    const tenantId = req.tenant_id || req.tenantId || req.user?.tenant_id;
    if (!tenantId) {
      return errorResponse(res, 'Tenant não identificado', null, 400);
    }

    const allowed = await tenantAccessService.isAccessAllowed(tenantId);
    if (!allowed) {
      return errorResponse(res, 'Assinatura inativa ou pagamento pendente.', null, 402);
    }

    next();
  } catch (err) {
    console.error('requireActiveSubscription error:', err);
    return errorResponse(res, 'Erro ao validar assinatura', null, 500);
  }
};
