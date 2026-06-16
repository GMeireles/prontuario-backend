import db from '../models/index.js';
import { subscriptionService, isSubscriptionActive } from './subscriptionService.js';

const { Tenant, User, Patient } = db;

export const tenantAccessService = {
  async getTenantWithSubscription(tenantId) {
    const tenant = await Tenant.findByPk(tenantId, {
      include: [{ association: 'subscription', include: ['plan'] }]
    });
    if (!tenant) return null;

    if (!tenant.subscription) {
      await subscriptionService.ensureForTenant(tenantId);
      return Tenant.findByPk(tenantId, {
        include: [{ association: 'subscription', include: ['plan'] }]
      });
    }

    return tenant;
  },

  async isAccessAllowed(tenantId) {
    const tenant = await this.getTenantWithSubscription(tenantId);
    if (!tenant?.subscription) return true;
    return isSubscriptionActive(tenant.subscription.status);
  },

  async getUsage(tenantId) {
    const [usersCount, patientsCount] = await Promise.all([
      User.count({ where: { tenant_id: tenantId } }),
      Patient.count({ where: { tenant_id: tenantId } })
    ]);

    return {
      users: usersCount,
      patients: patientsCount,
      storage_mb: 0
    };
  }
};
