import db from '../models/index.js';

const { Subscription, Plan, Tenant } = db;

const ACTIVE_STATUSES = new Set(['trialing', 'active']);

export function isSubscriptionActive(status) {
  return ACTIVE_STATUSES.has(status);
}

export const subscriptionService = {
  async getByTenantId(tenantId) {
    return Subscription.findOne({
      where: { tenant_id: tenantId },
      include: [{ model: Plan, as: 'plan' }]
    });
  },

  async ensureForTenant(tenantId) {
    let subscription = await this.getByTenantId(tenantId);
    if (subscription) return subscription;

    const tenant = await Tenant.findByPk(tenantId);
    const freePlan = await Plan.findOne({ where: { slug: 'free' } });
    if (!freePlan) {
      throw new Error('Plano free não configurado. Execute os seeders de planos.');
    }

    subscription = await Subscription.create({
      tenant_id: tenantId,
      plan_id: freePlan.id,
      status: 'active'
    });

    await tenant.update({
      plan_id: freePlan.id,
      subscription_status: 'active',
      plan: 'free'
    });

    return this.getByTenantId(tenantId);
  },

  async updateTenantCache(tenantId, data) {
    const tenant = await Tenant.findByPk(tenantId);
    if (!tenant) return null;
    await tenant.update(data);
    return tenant;
  },

  async upsertFromStripe({
    tenantId,
    planId,
    stripeCustomerId,
    stripeSubscriptionId,
    status,
    currentPeriodStart,
    currentPeriodEnd,
    trialEndsAt,
    cancelAtPeriodEnd,
    canceledAt
  }) {
    const [subscription] = await Subscription.findOrCreate({
      where: { tenant_id: tenantId },
      defaults: {
        tenant_id: tenantId,
        plan_id: planId,
        status: status || 'incomplete'
      }
    });

    await subscription.update({
      plan_id: planId,
      stripe_customer_id: stripeCustomerId || subscription.stripe_customer_id,
      stripe_subscription_id: stripeSubscriptionId || subscription.stripe_subscription_id,
      status,
      current_period_start: currentPeriodStart,
      current_period_end: currentPeriodEnd,
      trial_ends_at: trialEndsAt,
      cancel_at_period_end: cancelAtPeriodEnd ?? subscription.cancel_at_period_end,
      canceled_at: canceledAt
    });

    const plan = await Plan.findByPk(planId);
    await this.updateTenantCache(tenantId, {
      plan_id: planId,
      subscription_status: status,
      stripe_customer_id: stripeCustomerId || subscription.stripe_customer_id,
      plan: plan?.slug || undefined
    });

    return this.getByTenantId(tenantId);
  }
};
