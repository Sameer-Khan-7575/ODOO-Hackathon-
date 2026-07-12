const router = require('express').Router();
const { getXp, getBadges, getLeaderboard } = require('../controllers/gamification.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/employees/:id/xp', authMiddleware, getXp);
router.get('/employees/:id/badges', authMiddleware, getBadges);
router.get('/leaderboard', authMiddleware, getLeaderboard);

module.exports = router;
