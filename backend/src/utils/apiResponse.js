// ============================================
// API Response Helpers
// ============================================
// Standardized JSON response format across all endpoints.

/**
 * Send a successful response
 * @param {import('express').Response} res
 * @param {object} data
 * @param {string} message
 * @param {number} statusCode
 */
const success = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Send an error response
 * @param {import('express').Response} res
 * @param {string} message
 * @param {number} statusCode
 * @param {object} errors
 */
const error = (res, message = 'Something went wrong', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
  };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
};

/**
 * Send a paginated response
 * @param {import('express').Response} res
 * @param {Array} data
 * @param {number} total
 * @param {number} page
 * @param {number} limit
 */
const paginated = (res, data, total, page, limit, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  });
};

module.exports = { success, error, paginated };
