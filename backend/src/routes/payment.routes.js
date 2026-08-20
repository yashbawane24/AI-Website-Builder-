const { Router } = require('express');
const { authenticate } = require('../middleware/auth');
const { createCheckout, handleWebhook, getTransactions, getBilling } = require('../controllers/payment.controller');
const router = Router();

router.post('/webhook', handleWebhook); // Raw body — handled in index.js
router.use(authenticate);
router.post('/create-checkout', createCheckout);
router.get('/transactions', getTransactions);
router.get('/billing', getBilling);
module.exports = router;
