// ============================================
// JWT Authentication Middleware
// ============================================
// Verifies Bearer tokens and attaches user to req.
// Includes role-based access control.

const jwt = require('jsonwebtoken');
const env = require('../config/env');
const prisma = require('../config/database');
const { error } = require('../utils/apiResponse');

/**
 * Authenticate user via JWT access token
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return error(res, 'Access denied. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        credits: true,
        avatar: true,
        emailVerified: true,
        theme: true,
        stripeCustomerId: true,
        createdAt: true,
      },
    });

    if (!user) {
      return error(res, 'User not found', 401);
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return error(res, 'Token expired', 401);
    }
    if (err.name === 'JsonWebTokenError') {
      return error(res, 'Invalid token', 401);
    }
    next(err);
  }
};

/**
 * Require admin role
 */
const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'ADMIN') {
    return error(res, 'Access denied. Admin privileges required.', 403);
  }
  next();
};

/**
 * Optional authentication — attaches user if token present, but doesn't block
 */
const optionalAuth = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, env.JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, name: true, role: true, credits: true },
      });
      if (user) req.user = user;
    }
  } catch {
    // Silently fail — user is just not authenticated
  }
  next();
};

module.exports = { authenticate, requireAdmin, optionalAuth };
