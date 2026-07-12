const router = require('express').Router();
const { listTransactions, createTransaction, listEmissionFactors } = require('../controllers/carbon.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/carbon-transactions', authMiddleware, listTransactions);
router.post('/carbon-transactions', authMiddleware, createTransaction);
router.get('/emission-factors', authMiddleware, listEmissionFactors);

module.exports = router;
