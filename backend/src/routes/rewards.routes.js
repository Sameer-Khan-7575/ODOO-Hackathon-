const router = require('express').Router();
const { listRewards, redeem, redeemByBody } = require('../controllers/rewards.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', authMiddleware, listRewards);
router.post('/redeem', authMiddleware, redeemByBody);   // frontend calls this
router.post('/:id/redeem', authMiddleware, redeem);      // original route

module.exports = router;
