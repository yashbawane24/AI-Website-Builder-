// ============================================
// Rate Limiter Middleware
// ============================================
// Configurable rate limiters for different endpoint groups.

const rateLimit = require('express-rate-limit');
const env = require('../config/env');

// General API rate limiter — 100 requests per 15 minutes
const generalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
});

// Auth rate limiter — stricter: 10 requests per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.',
  },
});

// AI generation rate limiter — 5 requests per minute
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many generation requests. Please wait before trying again.',
  },
});

module.exports = { generalLimiter, authLimiter, aiLimiter };
