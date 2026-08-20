const { Router } = require('express');
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/user.controller');
const router = Router();

router.use(authenticate);
router.get('/profile', ctrl.getProfile);
router.put('/profile', ctrl.updateProfile);
router.put('/password', ctrl.changePassword);
router.post('/avatar', ctrl.uploadAvatar);
router.delete('/account', ctrl.deleteAccount);
router.get('/stats', ctrl.getStats);
module.exports = router;
