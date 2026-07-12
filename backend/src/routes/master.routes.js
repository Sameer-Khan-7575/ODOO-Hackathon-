const router = require('express').Router();
const { Department } = require('../models');

// GET /api/master/departments  — public, used by registration form
router.get('/departments', async (req, res, next) => {
  try {
    const depts = await Department.findAll({
      where: { status: 'Active' },
      attributes: ['id', 'name'],
      order: [['name', 'ASC']],
    });
    res.json({ data: depts });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
