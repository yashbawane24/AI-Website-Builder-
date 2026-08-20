const { Router } = require('express');
const { optionalAuth } = require('../middleware/auth');
const { getTemplates, getTemplate } = require('../controllers/template.controller');

const router = Router();
router.get('/', optionalAuth, getTemplates);
router.get('/:id', optionalAuth, getTemplate);
module.exports = router;
