import { stripeService } from '../services/stripeService.js';
import { stripeWebhookService } from '../services/stripeWebhookService.js';

export const handleStripeWebhook = async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'];
    if (!signature) {
      return res.status(400).send('Missing stripe-signature header');
    }

    let event;
    try {
      event = stripeService.constructWebhookEvent(req.body, signature);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    await stripeWebhookService.handleEvent(event);
    return res.json({ received: true });
  } catch (err) {
    console.error('Stripe webhook error:', err);
    return res.status(500).json({ success: false, message: 'Webhook processing failed' });
  }
};
