// ============================================
// Auth Controller
// ============================================
// Handles registration, login, email verification,
// password reset, token refresh, and logout.

const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const { success, error } = require('../utils/apiResponse');
const { generateTokenPair, verifyRefreshToken, generateRandomToken } = require('../services/token.service');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../services/email.service');

/**
 * POST /api/auth/register
 * Register a new user
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return error(res, 'An account with this email already exists', 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate email verification token
    const verifyToken = generateRandomToken();
    const verifyExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        verifyToken,
        verifyExpiry,
        credits: 20, // Free credits
      },
      select: {
        id: true,
        name: true,
        email: true,
        credits: true,
        createdAt: true,
      },
    });

    // Create default free subscription
    await prisma.subscription.create({
      data: {
        userId: user.id,
        plan: 'FREE',
        status: 'ACTIVE',
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'REGISTER',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    // Generate tokens
    const tokens = generateTokenPair(user.id);

    // Save refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    // Send verification email (non-blocking)
    sendVerificationEmail(user.email, user.name, verifyToken);

    return success(
      res,
      {
        user,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
      'Registration successful. Please verify your email.',
      201
    );
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 * Login with email and password
 */
const login = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return error(res, 'Invalid email or password', 401);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return error(res, 'Invalid email or password', 401);
    }

    // Generate tokens
    const tokens = generateTokenPair(user.id);

    // Save refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    return success(res, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        credits: user.credits,
        avatar: user.avatar,
        emailVerified: user.emailVerified,
        theme: user.theme,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    }, 'Login successful');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/verify-email
 * Verify email with token
 */
const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        verifyToken: token,
        verifyExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      return error(res, 'Invalid or expired verification token', 400);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verifyToken: null,
        verifyExpiry: null,
      },
    });

    return success(res, null, 'Email verified successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/forgot-password
 * Request password reset email
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return success(res, null, 'If an account exists with this email, a reset link has been sent.');
    }

    const resetToken = generateRandomToken();
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetExpiry },
    });

    sendPasswordResetEmail(user.email, user.name, resetToken);

    return success(res, null, 'If an account exists with this email, a reset link has been sent.');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/reset-password
 * Reset password with token
 */
const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      return error(res, 'Invalid or expired reset token', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetExpiry: null,
        refreshToken: null, // Invalidate all sessions
      },
    });

    return success(res, null, 'Password reset successful. Please login with your new password.');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/refresh-token
 * Refresh access token using refresh token
 */
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return error(res, 'Refresh token is required', 400);
    }

    // Verify the refresh token
    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch {
      return error(res, 'Invalid or expired refresh token', 401);
    }

    // Check if user exists and token matches
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.refreshToken !== token) {
      return error(res, 'Invalid refresh token', 401);
    }

    // Generate new token pair
    const tokens = generateTokenPair(user.id);

    // Update refresh token in database
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    return success(res, {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    }, 'Token refreshed');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/logout
 * Invalidate refresh token
 */
const logout = async (req, res, next) => {
  try {
    if (req.user) {
      await prisma.user.update({
        where: { id: req.user.id },
        data: { refreshToken: null },
      });

      await prisma.activityLog.create({
        data: {
          userId: req.user.id,
          action: 'LOGOUT',
          ipAddress: req.ip,
        },
      });
    }

    return success(res, null, 'Logged out successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        credits: true,
        emailVerified: true,
        theme: true,
        language: true,
        notifyEmail: true,
        notifyBrowser: true,
        createdAt: true,
        _count: { select: { projects: true } },
        subscriptions: {
          where: { status: 'ACTIVE' },
          take: 1,
          select: { plan: true, currentPeriodEnd: true },
        },
      },
    });

    return success(res, {
      ...user,
      subscription: user.subscriptions[0] || { plan: 'FREE' },
      totalProjects: user._count.projects,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  refreshToken,
  logout,
  getMe,
};
