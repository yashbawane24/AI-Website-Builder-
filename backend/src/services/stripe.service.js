// ============================================
// Stripe Service
// ============================================

const Stripe = require('stripe');
const env = require('../config/env');

let stripe;
const getStripe = () => {
  if (!stripe) stripe = new Stripe(env.STRIPE_SECRET_KEY);
  return stripe;
};

const CREDIT_PACKAGES = {
  credits_100: { credits: 100, price: 999, name: '100 Credits' },
  credits_500: { credits: 500, price: 3999, name: '500 Credits' },
  credits_1000: { credits: 1000, price: 6999, name: '1000 Credits' },
};

const SUBSCRIPTION_PLANS = {
  pro: { name: 'Pro Plan', price: 1999, interval: 'month', credits: 500 },
  enterprise: { name: 'Enterprise Plan', price: 4999, interval: 'month', credits: 2000 },
};

const createCheckoutSession = async (userId, email, type, packageId) => {
  const s = getStripe();

  let lineItems, mode, metadata;

  if (type === 'credits') {
    const pkg = CREDIT_PACKAGES[packageId];
    if (!pkg) throw new Error('Invalid credit package');
    lineItems = [{
      price_data: {
        currency: 'usd',
        product_data: { name: pkg.name, description: `${pkg.credits} AI generation credits` },
        unit_amount: pkg.price,
      },
      quantity: 1,
    }];
    mode = 'payment';
    metadata = { userId, type: 'credits', credits: String(pkg.credits), packageId };
  } else if (type === 'subscription') {
    const plan = SUBSCRIPTION_PLANS[packageId];
    if (!plan) throw new Error('Invalid subscription plan');
    lineItems = [{
      price_data: {
        currency: 'usd',
        product_data: { name: plan.name },
        unit_amount: plan.price,
        recurring: { interval: plan.interval },
      },
      quantity: 1,
    }];
    mode = 'subscription';
    metadata = { userId, type: 'subscription', plan: packageId, credits: String(plan.credits) };
  } else {
    throw new Error('Invalid checkout type');
  }

  const session = await s.checkout.sessions.create({
    customer_email: email,
    payment_method_types: ['card'],
    line_items: lineItems,
    mode,
    metadata,
    success_url: `${env.FRONTEND_URL}/dashboard/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.FRONTEND_URL}/dashboard/billing?canceled=true`,
  });

  return session;
};

const verifyWebhookSignature = (body, sig) => {
  const s = getStripe();
  return s.webhooks.constructEvent(body, sig, env.STRIPE_WEBHOOK_SECRET);
};

module.exports = { createCheckoutSession, verifyWebhookSignature, CREDIT_PACKAGES, SUBSCRIPTION_PLANS, getStripe };
