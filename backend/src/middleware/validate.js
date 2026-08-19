// ============================================
// Validation Middleware (Zod)
// ============================================
// Factory function that returns middleware to validate
// request body/params/query against Zod schemas.

/**
 * Validate request data against a Zod schema
 * @param {import('zod').ZodSchema} schema
 * @param {'body'|'params'|'query'} source
 */
const validate = (schema, source = 'body') => {
  return (req, _res, next) => {
    try {
      const parsed = schema.parse(req[source]);
      req[source] = parsed; // Replace with parsed (and coerced) data
      next();
    } catch (err) {
      err.name = 'ZodError'; // Ensure errorHandler catches it
      next(err);
    }
  };
};

module.exports = validate;
