const { EsgConfig, CarbonTransaction, EmployeeParticipation, CsrActivity, DepartmentScore, Department } = require('../models');
const { Op, fn, col } = require('sequelize');

/**
 * Very simple normalized-score model:
 * - Environmental: lower CO2e = higher score (capped 0-100, inverted against a baseline)
 * - Social: approved CSR participations count towards score (capped 0-100)
 * - Governance: placeholder fixed baseline (no governance data source yet in schema)
 * Weighted using esg_config weights.
 */
async function getConfig() {
  let config = await EsgConfig.findByPk(1);
  if (!config) {
    config = await EsgConfig.create({ id: 1 });
  }
  return config;
}

async function computeDepartmentScore(departmentId) {
  const config = await getConfig();

  const totalCo2e = await CarbonTransaction.sum('calculated_co2e', {
    where: { department_id: departmentId },
  }) || 0;
  // naive baseline: assume 1000 kg CO2e is "poor", 0 is "excellent"
  const environmental_score = Math.max(0, Math.min(100, 100 - (totalCo2e / 1000) * 100));

  const approvedCount = await EmployeeParticipation.count({
    include: [{ model: CsrActivity, where: { department_id: departmentId }, attributes: [] }],
    where: { approval_status: 'Approved' },
  });
  // naive baseline: 20 approved activities = 100 score
  const social_score = Math.max(0, Math.min(100, (approvedCount / 20) * 100));

  const governance_score = 70; // placeholder until governance data source is added

  const total_score =
    (environmental_score * Number(config.env_weight) +
      social_score * Number(config.social_weight) +
      governance_score * Number(config.governance_weight)) /
    100;

  const record = await DepartmentScore.create({
    department_id: departmentId,
    environmental_score: environmental_score.toFixed(2),
    social_score: social_score.toFixed(2),
    governance_score: governance_score.toFixed(2),
    total_score: total_score.toFixed(2),
  });

  return record;
}

async function getOverallScore() {
  const departments = await Department.findAll({ attributes: ['id'] });
  const latestScores = [];

  for (const dept of departments) {
    const latest = await DepartmentScore.findOne({
      where: { department_id: dept.id },
      order: [['score_date', 'DESC']],
    });
    if (latest) latestScores.push(latest);
  }

  if (latestScores.length === 0) {
    return { environmental_score: 0, social_score: 0, governance_score: 0, total_score: 0, trend: [] };
  }

  const avg = (key) =>
    Number((latestScores.reduce((sum, s) => sum + Number(s[key]), 0) / latestScores.length).toFixed(2));

  const trend = await DepartmentScore.findAll({
    attributes: [[fn('DATE', col('score_date')), 'date'], [fn('AVG', col('total_score')), 'avg_score']],
    group: [fn('DATE', col('score_date'))],
    order: [[fn('DATE', col('score_date')), 'ASC']],
  });

  return {
    environmental_score: avg('environmental_score'),
    social_score: avg('social_score'),
    governance_score: avg('governance_score'),
    total_score: avg('total_score'),
    trend,
  };
}

async function getDepartmentBreakdown(departmentId) {
  const latest = await DepartmentScore.findOne({
    where: { department_id: departmentId },
    order: [['score_date', 'DESC']],
  });
  return latest || (await computeDepartmentScore(departmentId));
}

module.exports = { computeDepartmentScore, getOverallScore, getDepartmentBreakdown, getConfig };
