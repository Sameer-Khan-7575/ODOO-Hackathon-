const router = require('express').Router();
const { get, update } = require('../controllers/config.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');

router.get('/', authMiddleware, adminOnly, get);
router.put('/', authMiddleware, adminOnly, update);

module.exports = router;
