const router = require('express').Router();
const { getOverall, getDepartmentBreakdown, getDashboard, getLeaderboard } = require('../controllers/scores.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/overall', authMiddleware, getOverall);
router.get('/department/:id', authMiddleware, getDepartmentBreakdown);
router.get('/dashboard', authMiddleware, getDashboard);
router.get('/leaderboard', authMiddleware, getLeaderboard);

module.exports = router;
