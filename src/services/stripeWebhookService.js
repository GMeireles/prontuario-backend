import db from '../models/index.js';
import { stripeService } from './stripeService.js';
import { planService } from './planService.js';
import { subscriptionService } from './subscriptionService.js';

const { SubscriptionEvent, Plan } = db;

async function recordEvent(event, tenantId = null, subscriptionId = null) {
  const existing = await SubscriptionEvent.findOne({
    where: { provider_event_id: event.id }
  });
  if (existing) return { duplicate: true, event: existing };

  const row = await SubscriptionEvent.create({
    tenant_id: tenantId,
    subscription_id: subscriptionId,
    provider: 'stripe',
    event_type: event.type,
    provider_event_id: event.id,
    payload: event.data?.object || {},
    processed_at: new Date()
  });

  return { duplicate: false, event: row };
}

async function resolvePlanFromStripeObject(stripeSub) {
  const priceId = stripeSub?.items?.data?.[0]?.price?.id;
  if (!priceId) return null;
  return Plan.findOne({ where: { stripe_price_id: priceId } });
}

export const stripeWebhookService = {
  async handleEvent(event) {
    const object = event.data?.object || {};
    let tenantId = object.metadata?.tenant_id ? parseInt(object.metadata.tenant_id, 10) : null;

    const pre = await recordEvent(event, tenantId, null);
    if (pre.duplicate) {
      return { processed: false, reason: 'duplicate' };
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        tenantId = tenantId || (object.metadata?.tenant_id ? parseInt(object.metadata.tenant_id, 10) : null);
        const planId = object.metadata?.plan_id ? parseInt(object.metadata.plan_id, 10) : null;
        const plan = planId ? await planService.findById(planId) : null;
        if (tenantId && plan) {
          await subscriptionService.upsertFromStripe({
            tenantId,
            planId: plan.id,
            stripeCustomerId: object.customer,
            stripeSubscriptionId: object.subscription,
            status: 'active'
          });
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        tenantId = tenantId || (object.metadata?.tenant_id ? parseInt(object.metadata.tenant_id, 10) : null);
        let plan = await resolvePlanFromStripeObject(object);
        if (!plan && object.metadata?.plan_id) {
          plan = await planService.findById(parseInt(object.metadata.plan_id, 10));
        }
        if (tenantId && plan) {
          await subscriptionService.upsertFromStripe({
            tenantId,
            planId: plan.id,
            stripeCustomerId: object.customer,
            stripeSubscriptionId: object.id,
            status: object.status,
            currentPeriodStart: object.current_period_start
              ? new Date(object.current_period_start * 1000)
              : null,
            currentPeriodEnd: object.current_period_end
              ? new Date(object.current_period_end * 1000)
              : null,
            trialEndsAt: object.trial_end ? new Date(object.trial_end * 1000) : null,
            cancelAtPeriodEnd: object.cancel_at_period_end,
            canceledAt: object.canceled_at ? new Date(object.canceled_at * 1000) : null
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = await subscriptionService.getByTenantId(tenantId);
        if (!sub && object.metadata?.tenant_id) {
          tenantId = parseInt(object.metadata.tenant_id, 10);
        }
        const local = object.id
          ? await db.Subscription.findOne({ where: { stripe_subscription_id: object.id } })
          : null;
        const tid = local?.tenant_id || tenantId;
        if (tid) {
          const freePlan = await planService.findBySlug('free');
          await subscriptionService.upsertFromStripe({
            tenantId: tid,
            planId: freePlan?.id || local?.plan_id,
            stripeCustomerId: object.customer,
            stripeSubscriptionId: null,
            status: 'canceled',
            canceledAt: new Date()
          });
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const stripeSubId = object.subscription;
        if (stripeSubId) {
          const local = await db.Subscription.findOne({ where: { stripe_subscription_id: stripeSubId } });
          if (local) {
            await subscriptionService.upsertFromStripe({
              tenantId: local.tenant_id,
              planId: local.plan_id,
              stripeCustomerId: object.customer,
              stripeSubscriptionId: stripeSubId,
              status: 'active'
            });
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const stripeSubId = object.subscription;
        if (stripeSubId) {
          const local = await db.Subscription.findOne({ where: { stripe_subscription_id: stripeSubId } });
          if (local) {
            await subscriptionService.upsertFromStripe({
              tenantId: local.tenant_id,
              planId: local.plan_id,
              stripeCustomerId: object.customer,
              stripeSubscriptionId: stripeSubId,
              status: 'past_due'
            });
          }
        }
        break;
      }

      default:
        break;
    }

    return { processed: true };
  }
};
