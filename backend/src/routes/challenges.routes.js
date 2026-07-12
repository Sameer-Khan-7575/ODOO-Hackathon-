const router = require('express').Router();
const {
  listChallenges,
  joinChallenge,
  submitProgress,
  approveSubmission,
} = require('../controllers/challenges.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');

router.get('/', authMiddleware, listChallenges);
router.post('/:id/join', authMiddleware, joinChallenge);
router.post('/:id/submit-progress', authMiddleware, submitProgress);
// admin route to approve a submission (challenge_participation id), not in the original
// spec list but required to actually award xp — mirrors /api/participation/:id/approve
router.post('/submissions/:id/approve', authMiddleware, adminOnly, approveSubmission);

module.exports = router;
