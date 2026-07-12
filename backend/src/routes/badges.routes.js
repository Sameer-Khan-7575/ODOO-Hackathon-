const router = require('express').Router();
const { listBadges } = require('../controllers/badges.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', authMiddleware, listBadges);

module.exports = router;
