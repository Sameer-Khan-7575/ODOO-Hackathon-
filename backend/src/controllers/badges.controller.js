const { Badge, EmployeeBadge } = require('../models');

// GET /api/badges  — all badges with isUnlocked for logged-in user
async function listBadges(req, res, next) {
  try {
    const employeeId = req.user.id;

    const [allBadges, myBadges] = await Promise.all([
      Badge.findAll({ order: [['id', 'ASC']] }),
      EmployeeBadge.findAll({ where: { employee_id: employeeId } }),
    ]);

    const myBadgeIds = new Set(myBadges.map((b) => b.badge_id));

    const data = allBadges.map((b) => ({
      id: b.id,
      name: b.name,
      description: b.description,
      icon: b.icon_url || '🏅',
      requirement: {
        type: b.unlock_rule_metric || 'POINTS',
        value: b.unlock_rule_value || 0,
      },
      isUnlocked: myBadgeIds.has(b.id),
      unlockedAt: myBadges.find((m) => m.badge_id === b.id)?.awarded_at || null,
    }));

    res.json({ data });
  } catch (err) {
    next(err);
  }
}

module.exports = { listBadges };
