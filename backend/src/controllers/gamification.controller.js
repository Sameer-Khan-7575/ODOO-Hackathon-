const { Employee, EmployeeBadge, Badge } = require('../models');

async function getXp(req, res, next) {
  try {
    const employee = await Employee.findByPk(req.params.id, { attributes: ['id', 'name', 'xp'] });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    next(err);
  }
}

async function getBadges(req, res, next) {
  try {
    const badges = await EmployeeBadge.findAll({
      where: { employee_id: req.params.id },
      include: [Badge],
      order: [['awarded_at', 'DESC']],
    });
    res.json(badges);
  } catch (err) {
    next(err);
  }
}

async function getLeaderboard(req, res, next) {
  try {
    const { limit = 20, sort_by = 'xp' } = req.query;
    const orderField = ['xp', 'points'].includes(sort_by) ? sort_by : 'xp';

    const leaderboard = await Employee.findAll({
      attributes: ['id', 'name', 'department_id', 'xp', 'points'],
      order: [[orderField, 'DESC']],
      limit: Number(limit),
    });
    res.json(leaderboard);
  } catch (err) {
    next(err);
  }
}

module.exports = { getXp, getBadges, getLeaderboard };
