const { CsrActivity, EmployeeParticipation, Category, Department, Employee } = require('../models');
const { evaluateBadgesForEmployee } = require('../services/badgeAward.service');

// GET /api/csr-activities  (original — kept for compatibility)
// GET /api/csr/activities  (new alias used by frontend)
async function listActivities(req, res, next) {
  try {
    const { department_id, status } = req.query;
    const where = {};
    if (department_id) where.department_id = department_id;
    if (status) where.status = status;
    else where.status = 'Active'; // default to active only

    const activities = await CsrActivity.findAll({
      where,
      include: [{ model: Category }, { model: Department }],
      order: [['activity_date', 'DESC']],
    });

    const data = activities.map((a) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      pointsReward: a.points,
      xpReward: 0, // schema has no xp column on csr_activity
      proofType: 'TEXT', // default
      category: {
        name: a.Category ? a.Category.name : '',
        color: categoryColor(a.Category ? a.Category.type : ''),
      },
    }));

    res.json(data);
  } catch (err) {
    next(err);
  }
}

// POST /api/csr/participate  { activityId, proof }
async function participate(req, res, next) {
  try {
    const { activityId, proof } = req.body;
    const employeeId = req.user.id;

    const activity = await CsrActivity.findByPk(activityId);
    if (!activity || activity.status !== 'Active') {
      return res.status(404).json({ message: 'Activity not found or inactive' });
    }

    const existing = await EmployeeParticipation.findOne({
      where: { employee_id: employeeId, activity_id: activityId },
    });
    if (existing) return res.status(409).json({ message: 'Already joined this activity' });

    const participation = await EmployeeParticipation.create({
      employee_id: employeeId,
      activity_id: activityId,
      proof_url: proof && (proof.url || proof.text)
        ? proof.url || proof.text
        : null,
    });

    res.status(201).json({ message: 'Submitted! Awaiting manager approval.', id: participation.id });
  } catch (err) {
    next(err);
  }
}

// POST /api/csr-activities/:id/join  (original path)
async function joinActivity(req, res, next) {
  try {
    const activityId = req.params.id;
    const employeeId = req.user.id;

    const activity = await CsrActivity.findByPk(activityId);
    if (!activity || activity.status !== 'Active') {
      return res.status(404).json({ message: 'Activity not found or inactive' });
    }

    const existing = await EmployeeParticipation.findOne({
      where: { employee_id: employeeId, activity_id: activityId },
    });
    if (existing) return res.status(409).json({ message: 'Already joined this activity' });

    const participation = await EmployeeParticipation.create({
      employee_id: employeeId,
      activity_id: activityId,
    });

    res.status(201).json(participation);
  } catch (err) {
    next(err);
  }
}

// GET /api/csr/pending-approvals  (manager/admin only)
async function pendingApprovals(req, res, next) {
  try {
    const deptId = req.user.department_id;

    const pending = await EmployeeParticipation.findAll({
      where: { approval_status: 'Pending' },
      include: [
        { model: Employee, attributes: ['id', 'name', 'email'] },
        {
          model: CsrActivity,
          attributes: ['id', 'title', 'category_id'],
          include: [{ model: Category, attributes: ['id', 'name'] }],
        },
      ],
      order: [['id', 'DESC']],
    });

    const data = pending.map((p) => ({
      id: p.id,
      employeeName: p.Employee ? p.Employee.name : '',
      employeeEmail: p.Employee ? p.Employee.email : '',
      activityTitle: p.CsrActivity ? p.CsrActivity.title : '',
      categoryName:
        p.CsrActivity && p.CsrActivity.Category ? p.CsrActivity.Category.name : '',
      proof: p.proof_url ? { type: 'TEXT', text: p.proof_url } : { type: 'TEXT', text: '' },
      submittedAt: new Date().toISOString(),
    }));

    res.json(data);
  } catch (err) {
    next(err);
  }
}

// POST /api/csr/approve  { participationId, approved, feedback }
async function approveDecision(req, res, next) {
  try {
    const { participationId, approved, feedback } = req.body;
    const approval_status = approved ? 'Approved' : 'Rejected';

    const participation = await EmployeeParticipation.findByPk(participationId, {
      include: [CsrActivity],
    });
    if (!participation) return res.status(404).json({ message: 'Participation not found' });

    participation.approval_status = approval_status;
    participation.completion_date = new Date();

    if (approved) {
      const activity = await CsrActivity.findByPk(participation.activity_id);
      participation.points_earned = activity ? activity.points : 0;

      const employee = await Employee.findByPk(participation.employee_id);
      if (employee) {
        employee.points += participation.points_earned;
        await employee.save();
        await evaluateBadgesForEmployee(employee.id);
      }
    }

    await participation.save();
    res.json(participation);
  } catch (err) {
    next(err);
  }
}

// POST /api/participation/:id/approve  (original path)
async function approveParticipation(req, res, next) {
  try {
    const { id } = req.params;
    const { approval_status } = req.body;

    if (!['Approved', 'Rejected'].includes(approval_status)) {
      return res.status(400).json({ message: "approval_status must be 'Approved' or 'Rejected'" });
    }

    const participation = await EmployeeParticipation.findByPk(id, { include: [CsrActivity] });
    if (!participation) return res.status(404).json({ message: 'Participation not found' });

    participation.approval_status = approval_status;
    participation.completion_date = new Date();

    if (approval_status === 'Approved') {
      const activity = await CsrActivity.findByPk(participation.activity_id);
      participation.points_earned = activity.points;

      const employee = await Employee.findByPk(participation.employee_id);
      employee.points += activity.points;
      await employee.save();
      await evaluateBadgesForEmployee(employee.id);
    }

    await participation.save();
    res.json(participation);
  } catch (err) {
    next(err);
  }
}

// GET /api/csr/history  (logged-in employee's participation history)
async function history(req, res, next) {
  try {
    const employeeId = req.user.id;

    const participations = await EmployeeParticipation.findAll({
      where: { employee_id: employeeId },
      include: [
        {
          model: CsrActivity,
          attributes: ['id', 'title', 'category_id'],
          include: [{ model: Category, attributes: ['id', 'name'] }],
        },
      ],
      order: [['id', 'DESC']],
    });

    const statusMap = { Pending: 'PENDING', Approved: 'APPROVED', Rejected: 'REJECTED' };

    const data = participations.map((p) => ({
      id: p.id,
      activityTitle: p.CsrActivity ? p.CsrActivity.title : '',
      categoryName:
        p.CsrActivity && p.CsrActivity.Category ? p.CsrActivity.Category.name : '',
      status: statusMap[p.approval_status] || p.approval_status,
      submittedAt: new Date().toISOString(),
      pointsEarned: p.points_earned || null,
      approverName: null,
      approvedAt: p.completion_date || null,
    }));

    res.json(data);
  } catch (err) {
    next(err);
  }
}

// Helper — give categories a colour based on type
function categoryColor(type) {
  const map = {
    Environmental: '#4ade80',
    Social: '#38bdf8',
    Governance: '#f59e0b',
  };
  return map[type] || '#a3a3a3';
}

module.exports = {
  listActivities,
  participate,
  joinActivity,
  approveParticipation,
  pendingApprovals,
  approveDecision,
  history,
};
