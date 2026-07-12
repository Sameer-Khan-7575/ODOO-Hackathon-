const { Challenge, ChallengeParticipation, Employee, Category } = require('../models');
const { evaluateBadgesForEmployee } = require('../services/badgeAward.service');

async function listChallenges(req, res, next) {
  try {
    const { status, category_id } = req.query;
    const where = {};
    if (status) where.status = status;
    if (category_id) where.category_id = category_id;

    const challenges = await Challenge.findAll({ where, include: [Category], order: [['deadline', 'ASC']] });
    res.json(challenges);
  } catch (err) {
    next(err);
  }
}

async function joinChallenge(req, res, next) {
  try {
    const challengeId = req.params.id;
    const employeeId = req.user.id;

    const challenge = await Challenge.findByPk(challengeId);
    if (!challenge || challenge.status !== 'Active') {
      return res.status(404).json({ message: 'Challenge not found or not active' });
    }

    const existing = await ChallengeParticipation.findOne({
      where: { challenge_id: challengeId, employee_id: employeeId },
    });
    if (existing) return res.status(409).json({ message: 'Already joined this challenge' });

    const participation = await ChallengeParticipation.create({
      challenge_id: challengeId,
      employee_id: employeeId,
    });

    res.status(201).json(participation);
  } catch (err) {
    next(err);
  }
}

async function submitProgress(req, res, next) {
  try {
    const challengeId = req.params.id;
    const employeeId = req.user.id;
    const { proof_url, progress } = req.body;

    const participation = await ChallengeParticipation.findOne({
      where: { challenge_id: challengeId, employee_id: employeeId },
    });
    if (!participation) return res.status(404).json({ message: 'You have not joined this challenge' });

    const challenge = await Challenge.findByPk(challengeId);
    if (challenge.evidence_required && !proof_url) {
      return res.status(400).json({ message: 'Proof of completion is required for this challenge' });
    }

    participation.proof_url = proof_url || participation.proof_url;
    participation.progress = progress || 'Submitted';
    await participation.save();

    res.json(participation);
  } catch (err) {
    next(err);
  }
}

// admin approval path for a challenge submission (mirrors csr approval; xp awarded on approval)
async function approveSubmission(req, res, next) {
  try {
    const { id } = req.params; // challenge_participation id
    const { approval } = req.body; // 'Approved' | 'Rejected'

    if (!['Approved', 'Rejected'].includes(approval)) {
      return res.status(400).json({ message: "approval must be 'Approved' or 'Rejected'" });
    }

    const participation = await ChallengeParticipation.findByPk(id, { include: [Challenge] });
    if (!participation) return res.status(404).json({ message: 'Submission not found' });

    participation.approval = approval;

    if (approval === 'Approved') {
      const challenge = await Challenge.findByPk(participation.challenge_id);
      participation.progress = 'Completed';
      participation.xp_awarded = challenge.xp;

      const employee = await Employee.findByPk(participation.employee_id);
      employee.xp += challenge.xp;
      await employee.save();

      await evaluateBadgesForEmployee(employee.id);
    }

    await participation.save();
    res.json(participation);
  } catch (err) {
    next(err);
  }
}

module.exports = { listChallenges, joinChallenge, submitProgress, approveSubmission };
