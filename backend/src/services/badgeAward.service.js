const { Badge, EmployeeBadge, Employee, ChallengeParticipation, EmployeeParticipation } = require('../models');

/**
 * Evaluates a single metric value against a badge's unlock rule.
 */
function ruleMatches(value, operator, target) {
  switch (operator) {
    case '>=': return value >= target;
    case '>': return value > target;
    case '<=': return value <= target;
    case '<': return value < target;
    case '=':
    case '==': return value === target;
    default: return false;
  }
}

async function getMetricValue(employee, metric) {
  switch (metric) {
    case 'xp':
      return employee.xp;
    case 'points':
      return employee.points;
    case 'challenges_completed':
      return ChallengeParticipation.count({
        where: { employee_id: employee.id, progress: 'Completed', approval: 'Approved' },
      });
    case 'csr_activities_completed':
      return EmployeeParticipation.count({
        where: { employee_id: employee.id, approval_status: 'Approved' },
      });
    default:
      return null;
  }
}

/**
 * Checks all badges against an employee's current stats and awards
 * any newly unlocked ones. Call this after xp/points/approval changes.
 */
async function evaluateBadgesForEmployee(employeeId) {
  const employee = await Employee.findByPk(employeeId);
  if (!employee) return [];

  const badges = await Badge.findAll();
  const alreadyAwarded = await EmployeeBadge.findAll({ where: { employee_id: employeeId } });
  const awardedIds = new Set(alreadyAwarded.map((b) => b.badge_id));

  const newlyAwarded = [];

  for (const badge of badges) {
    if (awardedIds.has(badge.id)) continue;
    if (!badge.unlock_rule_metric) continue;

    const value = await getMetricValue(employee, badge.unlock_rule_metric);
    if (value === null) continue;

    if (ruleMatches(value, badge.unlock_rule_operator, badge.unlock_rule_value)) {
      await EmployeeBadge.create({ employee_id: employeeId, badge_id: badge.id });
      newlyAwarded.push(badge);
    }
  }

  return newlyAwarded;
}

module.exports = { evaluateBadgesForEmployee };
