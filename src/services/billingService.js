import db from '../models/index.js';
import { planService } from './planService.js';
import { subscriptionService } from './subscriptionService.js';
import { stripeService } from './stripeService.js';
import { tenantAccessService } from './tenantAccessService.js';

const { Tenant } = db;

function getUrl(envKey, fallback) {
  return process.env[envKey] || fallback;
}

export const billingService = {
  async listPlans() {
    return planService.listActive();
  },

  async getSubscription(tenantId) {
    const subscription = await subscriptionService.ensureForTenant(tenantId);
    const usage = await tenantAccessService.getUsage(tenantId);
    return { subscription, usage };
  },

  async createCheckout(tenantId, { planId, planSlug }, user) {
    const tenant = await Tenant.findByPk(tenantId);
    if (!tenant) {
      const err = new Error('Tenant não encontrado');
      err.status = 404;
      throw err;
    }

    const plan = await planService.resolvePlan({ planId, planSlug });
    if (!plan) {
      const err = new Error('Plano não encontrado');
      err.status = 404;
      throw err;
    }

    if (!stripeService.isConfigured()) {
      const err = new Error('Stripe não configurado no servidor.');
      err.status = 503;
      throw err;
    }

    const billingEmail = user?.email || tenant.billing_email || tenant.email;
    const customerId = await stripeService.ensureCustomer(tenant, billingEmail);

    const session = await stripeService.createCheckoutSession({
      tenant,
      plan,
      customerId,
      successUrl: getUrl('STRIPE_SUCCESS_URL', 'http://localhost:6263/app/billing?success=1'),
      cancelUrl: getUrl('STRIPE_CANCEL_URL', 'http://localhost:6263/app/billing?canceled=1')
    });

    return { checkoutUrl: session.url, sessionId: session.id };
  },

  async createPortal(tenantId) {
    const tenant = await Tenant.findByPk(tenantId);
    if (!tenant) {
      const err = new Error('Tenant não encontrado');
      err.status = 404;
      throw err;
    }

    if (!tenant.stripe_customer_id) {
      const err = new Error('Nenhuma assinatura Stripe vinculada a esta clínica. Contrate um plano primeiro.');
      err.status = 400;
      throw err;
    }

    if (!stripeService.isConfigured()) {
      const err = new Error('Stripe não configurado no servidor.');
      err.status = 503;
      throw err;
    }

    const session = await stripeService.createPortalSession({
      customerId: tenant.stripe_customer_id,
      returnUrl: getUrl('STRIPE_CUSTOMER_PORTAL_RETURN_URL', 'http://localhost:6263/app/billing')
    });

    return { portalUrl: session.url };
  }
};
