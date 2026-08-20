// ============================================
// Payment Controller
// ============================================

const prisma = require('../config/database');
const { success, error, paginated } = require('../utils/apiResponse');
const { createCheckoutSession, verifyWebhookSignature, CREDIT_PACKAGES, SUBSCRIPTION_PLANS } = require('../services/stripe.service');
const { addCredits } = require('../services/credit.service');

/** POST /api/payments/create-checkout */
const createCheckout = async (req, res, next) => {
  try {
    const { type, packageId } = req.body;
    const session = await createCheckoutSession(req.user.id, req.user.email, type, packageId);

    // Record pending payment
    await prisma.payment.create({
      data: {
        userId: req.user.id,
        stripeSessionId: session.id,
        amount: session.amount_total ? session.amount_total / 100 : 0,
        type: type === 'credits' ? 'CREDIT_PURCHASE' : 'SUBSCRIPTION',
        status: 'PENDING',
        credits: parseInt(
          type === 'credits'
            ? CREDIT_PACKAGES[packageId]?.credits || 0
            : SUBSCRIPTION_PLANS[packageId]?.credits || 0
        ),
      },
    });

    return success(res, { url: session.url, sessionId: session.id });
  } catch (err) { next(err); }
};

/** POST /api/payments/webhook */
const handleWebhook = async (req, res, next) => {
  try {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = verifyWebhookSignature(req.body, sig);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const { userId, type, credits } = session.metadata || {};

        if (userId && credits) {
          const creditAmount = parseInt(credits);

          // Update payment status
          await prisma.payment.updateMany({
            where: { stripeSessionId: session.id },
            data: {
              status: 'COMPLETED',
              stripePaymentId: session.payment_intent || session.subscription,
              amount: (session.amount_total || 0) / 100,
            },
          });

          // Add credits
          await addCredits(
            userId,
            creditAmount,
            type === 'credits' ? 'PURCHASE' : 'SUBSCRIPTION',
            `${type === 'credits' ? 'Credit purchase' : 'Subscription'}: ${creditAmount} credits`
          );

          // If subscription, create/update subscription record
          if (type === 'subscription') {
            const plan = session.metadata.plan?.toUpperCase() || 'PRO';
            await prisma.subscription.upsert({
              where: { userId_unique: undefined },
              create: {
                userId,
                stripeSubscriptionId: session.subscription,
                plan,
                status: 'ACTIVE',
              },
              update: {
                stripeSubscriptionId: session.subscription,
                plan,
                status: 'ACTIVE',
              },
            }).catch(() => {
              // If upsert fails, try create
              prisma.subscription.create({
                data: {
                  userId,
                  stripeSubscriptionId: session.subscription,
                  plan,
                  status: 'ACTIVE',
                },
              }).catch(() => {});
            });
          }

          // Log activity
          await prisma.activityLog.create({
            data: {
              userId,
              action: 'PAYMENT_COMPLETED',
              metadata: { type, credits: creditAmount, amount: (session.amount_total || 0) / 100 },
            },
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: { status: 'CANCELED' },
        });
        break;
      }
    }

    res.json({ received: true });
  } catch (err) { next(err); }
};

/** GET /api/payments/transactions */
const getTransactions = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [transactions, total] = await Promise.all([
      prisma.payment.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.payment.count({ where: { userId: req.user.id } }),
    ]);

    return paginated(res, transactions, total, parseInt(page), parseInt(limit));
  } catch (err) { next(err); }
};

/** GET /api/payments/billing */
const getBilling = async (req, res, next) => {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: { userId: req.user.id, status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
    });

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { credits: true },
    });

    const recentPayments = await prisma.payment.findMany({
      where: { userId: req.user.id, status: 'COMPLETED' },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return success(res, {
      subscription: subscription || { plan: 'FREE' },
      credits: user.credits,
      recentPayments,
      packages: CREDIT_PACKAGES,
      plans: SUBSCRIPTION_PLANS,
    });
  } catch (err) { next(err); }
};

module.exports = { createCheckout, handleWebhook, getTransactions, getBilling };
