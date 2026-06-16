import Stripe from 'stripe';

let stripeClient = null;

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!stripeClient) {
    stripeClient = new Stripe(key, { apiVersion: '2024-06-20' });
  }
  return stripeClient;
}

export const stripeService = {
  isConfigured() {
    return Boolean(process.env.STRIPE_SECRET_KEY);
  },

  getClient() {
    const client = getStripe();
    if (!client) {
      const err = new Error('Stripe não configurado. Defina STRIPE_SECRET_KEY no ambiente.');
      err.status = 503;
      throw err;
    }
    return client;
  },

  async ensureCustomer(tenant, billingEmail) {
    if (tenant.stripe_customer_id) {
      return tenant.stripe_customer_id;
    }

    const stripe = this.getClient();
    const customer = await stripe.customers.create({
      email: billingEmail || tenant.billing_email || tenant.email,
      name: tenant.name,
      metadata: { tenant_id: String(tenant.id) }
    });

    await tenant.update({
      stripe_customer_id: customer.id,
      billing_email: billingEmail || tenant.billing_email || tenant.email
    });

    return customer.id;
  },

  async createCheckoutSession({ tenant, plan, customerId, successUrl, cancelUrl }) {
    if (!plan.stripe_price_id) {
      const err = new Error('Este plano ainda não está configurado para checkout. Contate o suporte.');
      err.status = 400;
      throw err;
    }

    const stripe = this.getClient();
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: plan.stripe_price_id, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        tenant_id: String(tenant.id),
        plan_id: String(plan.id),
        plan_slug: plan.slug
      },
      subscription_data: {
        metadata: {
          tenant_id: String(tenant.id),
          plan_id: String(plan.id)
        }
      }
    });

    return session;
  },

  async createPortalSession({ customerId, returnUrl }) {
    const stripe = this.getClient();
    return stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl
    });
  },

  constructWebhookEvent(rawBody, signature) {
    const stripe = this.getClient();
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) {
      const err = new Error('STRIPE_WEBHOOK_SECRET não configurado.');
      err.status = 503;
      throw err;
    }
    return stripe.webhooks.constructEvent(rawBody, signature, secret);
  }
};
