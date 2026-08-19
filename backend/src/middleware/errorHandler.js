// ============================================
// Global Error Handler Middleware
// ============================================
// Catches all errors and returns structured JSON responses.
// Maps Prisma-specific errors to user-friendly messages.

const { error } = require('../utils/apiResponse');
const env = require('../config/env');

const errorHandler = (err, req, res, _next) => {
  console.error('Error:', err.message);
  if (env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // Zod validation errors
  if (err.name === 'ZodError') {
    const messages = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return error(res, 'Validation failed', 400, messages);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return error(res, 'Invalid token', 401);
  }
  if (err.name === 'TokenExpiredError') {
    return error(res, 'Token expired', 401);
  }

  // Prisma validation errors (malformed queries, connection issues)
  if (err.constructor?.name === 'PrismaClientValidationError') {
    console.error('Prisma validation error:', err.message);
    return error(res, 'A database error occurred. Please try again.', 500);
  }
  if (err.constructor?.name === 'PrismaClientInitializationError') {
    console.error('Prisma initialization error:', err.message);
    return error(res, 'Service temporarily unavailable. Please try again later.', 503);
  }
  if (err.constructor?.name === 'PrismaClientRustPanicError') {
    console.error('Prisma critical error:', err.message);
    return error(res, 'An unexpected error occurred. Please try again.', 500);
  }

  // Prisma known request errors
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'field';
    return error(res, `A record with this ${field} already exists`, 409);
  }
  if (err.code === 'P2025') {
    return error(res, 'Record not found', 404);
  }
  if (err.code === 'P2003') {
    return error(res, 'Related record not found', 400);
  }

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return error(res, 'File too large. Maximum size is 5MB', 400);
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return error(res, 'Unexpected file field', 400);
  }

  // Custom application errors
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  return error(
    res,
    statusCode === 500 && env.NODE_ENV === 'production'
      ? 'Internal server error'
      : message,
    statusCode
  );
};

module.exports = errorHandler;
