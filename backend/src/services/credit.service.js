// ============================================
// Credit Service
// ============================================
// Manages credit balance: check, deduct, add, history.

const prisma = require('../config/database');

/**
 * Check if user has enough credits
 * @param {string} userId
 * @param {number} required
 * @returns {Promise<boolean>}
 */
const hasEnoughCredits = async (userId, required) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true },
  });
  return user && user.credits >= required;
};

/**
 * Deduct credits from a user
 * @param {string} userId
 * @param {number} amount - Positive number to deduct
 * @param {string} description
 * @param {string|null} projectId
 * @returns {Promise<number>} New balance
 */
const deductCredits = async (userId, amount, description, projectId = null) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { credits: { decrement: amount } },
  });

  await prisma.creditTransaction.create({
    data: {
      userId,
      amount: -amount,
      type: 'USAGE',
      description,
      projectId,
      balanceAfter: user.credits,
    },
  });

  return user.credits;
};

/**
 * Add credits to a user
 * @param {string} userId
 * @param {number} amount
 * @param {'PURCHASE'|'BONUS'|'SUBSCRIPTION'|'REFUND'} type
 * @param {string} description
 * @returns {Promise<number>} New balance
 */
const addCredits = async (userId, amount, type, description) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { credits: { increment: amount } },
  });

  await prisma.creditTransaction.create({
    data: {
      userId,
      amount,
      type,
      description,
      balanceAfter: user.credits,
    },
  });

  return user.credits;
};

/**
 * Get credit transaction history for a user
 * @param {string} userId
 * @param {number} page
 * @param {number} limit
 */
const getTransactionHistory = async (userId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const [transactions, total] = await Promise.all([
    prisma.creditTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.creditTransaction.count({ where: { userId } }),
  ]);

  return { transactions, total };
};

module.exports = { hasEnoughCredits, deductCredits, addCredits, getTransactionHistory };
