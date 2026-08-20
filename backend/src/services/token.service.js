// ============================================
// Token Service
// ============================================
// JWT token generation and verification for
// access tokens, refresh tokens, email verification,
// and password reset.

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const env = require('../config/env');

/**
 * Generate an access token (short-lived)
 * @param {string} userId
 * @returns {string}
 */
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRY,
  });
};

/**
 * Generate a refresh token (long-lived)
 * @param {string} userId
 * @returns {string}
 */
const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRY,
  });
};

/**
 * Verify an access token
 * @param {string} token
 * @returns {{ userId: string }}
 */
const verifyAccessToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};

/**
 * Verify a refresh token
 * @param {string} token
 * @returns {{ userId: string }}
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
};

/**
 * Generate a random hex token for email verification / password reset
 * @returns {string}
 */
const generateRandomToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Generate both access and refresh tokens
 * @param {string} userId
 * @returns {{ accessToken: string, refreshToken: string }}
 */
const generateTokenPair = (userId) => {
  return {
    accessToken: generateAccessToken(userId),
    refreshToken: generateRefreshToken(userId),
  };
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateRandomToken,
  generateTokenPair,
};
