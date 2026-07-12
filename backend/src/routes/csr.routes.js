const router = require('express').Router();
const {
  listActivities,
  participate,
  joinActivity,
  approveParticipation,
  pendingApprovals,
  approveDecision,
  history,
} = require('../controllers/csr.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');

// Original routes (keep for backward compat)
router.get('/csr-activities', authMiddleware, listActivities);
router.post('/csr-activities/:id/join', authMiddleware, joinActivity);
router.post('/participation/:id/approve', authMiddleware, adminOnly, approveParticipation);

// New routes consumed by frontend
router.get('/csr/activities', authMiddleware, listActivities);
router.post('/csr/participate', authMiddleware, participate);
router.get('/csr/pending-approvals', authMiddleware, pendingApprovals);
router.post('/csr/approve', authMiddleware, approveDecision);
router.get('/csr/history', authMiddleware, history);

module.exports = router;
