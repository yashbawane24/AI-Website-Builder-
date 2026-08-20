// ============================================
// Generate Routes
// ============================================

const { Router } = require('express');
const { z } = require('zod');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');
const { generate, regenerate } = require('../controllers/generate.controller');

const router = Router();

const generateSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters').max(2000),
  projectName: z.string().max(100).optional(),
  template: z.string().optional(),
  style: z.string().optional(),
  sections: z.array(z.string()).optional(),
});

const regenerateSchema = z.object({
  prompt: z.string().min(10).max(2000).optional(),
});

router.post('/', authenticate, aiLimiter, validate(generateSchema), generate);
router.post('/regenerate/:projectId', authenticate, aiLimiter, validate(regenerateSchema), regenerate);

module.exports = router;
