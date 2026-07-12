const scoringService = require('../services/scoring.service');
const {
  Employee,
  EmployeeBadge,
  Badge,
  EmployeeParticipation,
  CsrActivity,
  Department,
  DepartmentScore,
  EsgConfig,
} = require('../models');

async function getOverall(req, res, next) {
  try {
    const data = await scoringService.getOverallScore();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function getDepartmentBreakdown(req, res, next) {
  try {
    const { id } = req.params;
    const data = await scoringService.getDepartmentBreakdown(id);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

async function buildLeaderboard(limit = 10) {
  const employees = await Employee.findAll({
    attributes: ['id', 'name', 'points', 'xp', 'department_id'],
    include: [{ model: Department, attributes: ['name'] }],
    order: [['points', 'DESC']],
    limit,
  });
  return employees.map((e, idx) => ({
    rank: idx + 1,
    userId: e.id,
    name: e.name,
    points: e.points,
    xp: e.xp,
    departmentName: e.Department ? e.Department.name : '',
  }));
}

async function buildUnlockedBadges(userId) {
  const badgeRows = await EmployeeBadge.findAll({
    where: { employee_id: userId },
    include: [{ model: Badge, attributes: ['name', 'icon_url', 'description'] }],
  });
  return badgeRows.map((b) => ({
    name: b.Badge ? b.Badge.name : '',
    icon: b.Badge ? (b.Badge.icon_url || '🏅') : '🏅',
    description: b.Badge ? b.Badge.description : '',
  }));
}

async function buildRecentActivity(userId, limit = 5) {
  const rows = await EmployeeParticipation.findAll({
    where: { employee_id: userId },
    include: [{ model: CsrActivity, attributes: ['id', 'title'] }],
    order: [['id', 'DESC']],
    limit,
  });
  return rows.map((p) => ({
    id: p.id,
    activityTitle: p.CsrActivity ? p.CsrActivity.title : '',
    pointsEarned: p.points_earned || null,
    status: p.approval_status,
  }));
}

async function buildPendingApprovals(deptId, limit = 10) {
  const where = { approval_status: 'Pending' };
  const csrWhere = deptId ? { department_id: deptId } : {};

  const pending = await EmployeeParticipation.findAll({
    where,
    include: [
      { model: Employee, attributes: ['id', 'name', 'email'] },
      { model: CsrActivity, attributes: ['id', 'title'], where: Object.keys(csrWhere).length ? csrWhere : undefined },
    ],
    order: [['id', 'DESC']],
    limit,
  });

  return pending
    .filter((p) => p.CsrActivity)
    .map((p) => ({
      id: p.id,
      activityTitle: p.CsrActivity ? p.CsrActivity.title : '',
      employeeName: p.Employee ? p.Employee.name : '',
      employeeEmail: p.Employee ? p.Employee.email : '',
      submittedAt: new Date().toISOString(),
    }));
}

// ─── EMPLOYEE dashboard ────────────────────────────────────────────────────────

async function buildEmployeeDashboard(employee, deptId) {
  const [scores, leaderboard, unlockedBadges, recentActivities] = await Promise.all([
    scoringService.getDepartmentBreakdown(deptId),
    buildLeaderboard(10),
    buildUnlockedBadges(employee.id),
    buildRecentActivity(employee.id, 5),
  ]);

  return {
    currentScores: {
      totalPoints: employee.points,
      totalXP: employee.xp,
      environmentalScore: scores ? Number(scores.environmental_score) : 0,
      socialScore: scores ? Number(scores.social_score) : 0,
      governanceScore: scores ? Number(scores.governance_score) : 0,
      overallScore: scores ? Number(scores.total_score) : 0,
    },
    leaderboard,
    pendingApprovals: [],
    recentActivities,
    unlockedBadges,
  };
}

// ─── MANAGER dashboard ─────────────────────────────────────────────────────────

async function buildManagerDashboard(employee, deptId) {
  const [scores, leaderboard, unlockedBadges, recentActivities, pendingApprovals, teamMembers] =
    await Promise.all([
      scoringService.getDepartmentBreakdown(deptId),
      buildLeaderboard(10),
      buildUnlockedBadges(employee.id),
      buildRecentActivity(employee.id, 5),
      buildPendingApprovals(deptId, 10),
      Employee.findAll({
        where: { department_id: deptId },
        attributes: ['id', 'name', 'email', 'role', 'points', 'xp'],
        order: [['points', 'DESC']],
      }),
    ]);

  const teamStats = {
    totalMembers: teamMembers.length,
    totalPoints: teamMembers.reduce((s, e) => s + (e.points || 0), 0),
    totalXP: teamMembers.reduce((s, e) => s + (e.xp || 0), 0),
    pendingCount: pendingApprovals.length,
  };

  return {
    currentScores: {
      totalPoints: employee.points,
      totalXP: employee.xp,
      environmentalScore: scores ? Number(scores.environmental_score) : 0,
      socialScore: scores ? Number(scores.social_score) : 0,
      governanceScore: scores ? Number(scores.governance_score) : 0,
      overallScore: scores ? Number(scores.total_score) : 0,
    },
    leaderboard,
    pendingApprovals,
    recentActivities,
    unlockedBadges,
    teamMembers: teamMembers.map((m) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      role: m.role,
      points: m.points,
      xp: m.xp,
    })),
    teamStats,
  };
}

// ─── ADMIN dashboard ───────────────────────────────────────────────────────────

async function buildAdminDashboard(employee) {
  const [companyScores, allDepts, allPendingApprovals, leaderboard, unlockedBadges, config, totalEmployees] =
    await Promise.all([
      scoringService.getOverallScore(),
      Department.findAll({ attributes: ['id', 'name', 'status'] }),
      buildPendingApprovals(null, 20), // all departments
      buildLeaderboard(10),
      buildUnlockedBadges(employee.id),
      scoringService.getConfig(),
      Employee.count(),
    ]);

  // Per-department scores
  const departmentScores = await Promise.all(
    allDepts.map(async (dept) => {
      const score = await scoringService.getDepartmentBreakdown(dept.id);
      const memberCount = await Employee.count({ where: { department_id: dept.id } });
      return {
        id: dept.id,
        name: dept.name,
        status: dept.status,
        memberCount,
        environmentalScore: score ? Number(score.environmental_score) : 0,
        socialScore: score ? Number(score.social_score) : 0,
        governanceScore: score ? Number(score.governance_score) : 0,
        totalScore: score ? Number(score.total_score) : 0,
      };
    })
  );

  return {
    currentScores: {
      totalPoints: employee.points,
      totalXP: employee.xp,
      environmentalScore: companyScores ? Number(companyScores.environmental_score) : 0,
      socialScore: companyScores ? Number(companyScores.social_score) : 0,
      governanceScore: companyScores ? Number(companyScores.governance_score) : 0,
      overallScore: companyScores ? Number(companyScores.total_score) : 0,
    },
    leaderboard,
    pendingApprovals: allPendingApprovals,
    recentActivities: [],
    unlockedBadges,
    // Admin-only fields
    departmentScores,
    totalEmployees,
    config: config
      ? {
          envWeight: Number(config.env_weight),
          socialWeight: Number(config.social_weight),
          governanceWeight: Number(config.governance_weight),
          autoEmissionCalc: config.auto_emission_calc,
          evidenceRequired: config.evidence_required,
          badgeAutoAward: config.badge_auto_award,
        }
      : null,
  };
}

// ─── Main getDashboard handler ─────────────────────────────────────────────────

async function getDashboard(req, res, next) {
  try {
    const userId = req.user.id;
    const deptId = req.user.department_id;
    const role = (req.user.role || 'employee').toLowerCase();

    const employee = await Employee.findByPk(userId, {
      include: [{ model: Department, attributes: ['id', 'name'] }],
    });

    if (!employee) return res.status(404).json({ message: 'User not found' });

    let roleData;
    if (role === 'admin') {
      roleData = await buildAdminDashboard(employee);
    } else if (role === 'manager') {
      roleData = await buildManagerDashboard(employee, deptId);
    } else {
      roleData = await buildEmployeeDashboard(employee, deptId);
    }

    res.json({
      user: {
        name: employee.name,
        role: employee.role.toUpperCase(),
        departmentName: employee.Department ? employee.Department.name : '',
      },
      ...roleData,
    });
  } catch (err) {
    next(err);
  }
}

// ─── Full leaderboard page ─────────────────────────────────────────────────────

async function getLeaderboard(req, res, next) {
  try {
    const { sort_by = 'points', limit = 50 } = req.query;
    const orderField = ['xp', 'points'].includes(sort_by) ? sort_by : 'points';

    const employees = await Employee.findAll({
      attributes: ['id', 'name', 'points', 'xp', 'department_id'],
      include: [{ model: Department, attributes: ['name'] }],
      order: [[orderField, 'DESC']],
      limit: Number(limit),
    });

    const myId = req.user.id;
    let yourRank = null;

    const rows = employees.map((e, idx) => {
      if (e.id === myId) yourRank = idx + 1;
      return {
        rank: idx + 1,
        userId: e.id,
        name: e.name,
        points: e.points,
        xp: e.xp,
        overallScore: 0,
        departmentName: e.Department ? e.Department.name : '',
      };
    });

    res.json({ data: rows, yourRank });
  } catch (err) {
    next(err);
  }
}

module.exports = { getOverall, getDepartmentBreakdown, getDashboard, getLeaderboard };
