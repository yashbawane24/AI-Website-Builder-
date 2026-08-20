const { Router } = require('express');
const { authenticate, requireAdmin } = require('../middleware/auth');
const ctrl = require('../controllers/admin.controller');
const router = Router();

router.use(authenticate, requireAdmin);
router.get('/stats', ctrl.getStats);
router.get('/users', ctrl.getUsers);
router.put('/users/:id', ctrl.updateUser);
router.get('/payments', ctrl.getPayments);
router.post('/templates', ctrl.createTemplate);
router.put('/templates/:id', ctrl.updateTemplate);
router.delete('/templates/:id', ctrl.deleteTemplate);
module.exports = router;
