const { Reward, Employee } = require('../models');
const { redeemReward } = require('../services/redemption.service');

async function listRewards(req, res, next) {
  try {
    const employeeId = req.user.id;

    const [rewards, employee] = await Promise.all([
      Reward.findAll({ where: { status: 'Active' }, order: [['points_required', 'ASC']] }),
      Employee.findByPk(employeeId, { attributes: ['points'] }),
    ]);

    const userPoints = employee ? employee.points : 0;

    const data = rewards.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      pointsRequired: r.points_required,
      inventory: r.stock,
      icon: r.icon || '🎁',
      canRedeem: userPoints >= r.points_required && r.stock > 0,
    }));

    res.json({ data, userPoints });
  } catch (err) {
    next(err);
  }
}

// POST /api/rewards/:id/redeem  (route-param style — existing)
async function redeem(req, res, next) {
  try {
    const rewardId = req.params.id;
    const employeeId = req.user.id;

    const reward = await Reward.findByPk(rewardId);
    const redemption = await redeemReward(employeeId, rewardId);

    res.status(201).json({
      ...redemption.toJSON(),
      rewardName: reward ? reward.name : '',
      claimCode: `ESG-${redemption.id}-${Date.now().toString(36).toUpperCase()}`,
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/rewards/redeem  (body style — used by frontend)
async function redeemByBody(req, res, next) {
  try {
    const { rewardId } = req.body;
    const employeeId = req.user.id;

    if (!rewardId) return res.status(400).json({ message: 'rewardId is required' });

    const reward = await Reward.findByPk(rewardId);
    if (!reward) return res.status(404).json({ message: 'Reward not found' });

    const redemption = await redeemReward(employeeId, rewardId);

    res.status(201).json({
      ...redemption.toJSON(),
      rewardName: reward.name,
      claimCode: `ESG-${redemption.id}-${Date.now().toString(36).toUpperCase()}`,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { listRewards, redeem, redeemByBody };
