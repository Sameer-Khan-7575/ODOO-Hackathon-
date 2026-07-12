const { sequelize, Reward, RewardRedemption, Employee } = require('../models');

/**
 * Validates stock + points, deducts both atomically, records the redemption.
 */
async function redeemReward(employeeId, rewardId) {
  return sequelize.transaction(async (t) => {
    const employee = await Employee.findByPk(employeeId, { transaction: t, lock: t.LOCK.UPDATE });
    const reward = await Reward.findByPk(rewardId, { transaction: t, lock: t.LOCK.UPDATE });

    if (!reward || reward.status !== 'Active') {
      const err = new Error('Reward not available');
      err.status = 404;
      throw err;
    }
    if (reward.stock <= 0) {
      const err = new Error('Reward out of stock');
      err.status = 400;
      throw err;
    }
    if (employee.points < reward.points_required) {
      const err = new Error('Insufficient points');
      err.status = 400;
      throw err;
    }

    employee.points -= reward.points_required;
    reward.stock -= 1;

    await employee.save({ transaction: t });
    await reward.save({ transaction: t });

    const redemption = await RewardRedemption.create(
      {
        employee_id: employeeId,
        reward_id: rewardId,
        points_deducted: reward.points_required,
      },
      { transaction: t }
    );

    return redemption;
  });
}

module.exports = { redeemReward };
