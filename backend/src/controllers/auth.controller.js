const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Employee, Department } = require('../models');

function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, department_id: user.department_id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
}

function userPayload(employee, department) {
  return {
    id: employee.id,
    name: employee.name,
    email: employee.email,
    role: (employee.role || 'employee').toUpperCase(),
    department_id: employee.department_id,
    departmentName: department ? department.name : null,
    xp: employee.xp,
    points: employee.points,
  };
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const employee = await Employee.findOne({
      where: { email },
      include: [{ model: Department, attributes: ['id', 'name'] }],
    });

    if (!employee) return res.status(401).json({ message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, employee.password_hash);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken(employee);
    const user = userPayload(employee, employee.Department);

    res.json({ token, user });
  } catch (err) {
    next(err);
  }
}

async function register(req, res, next) {
  try {
    const { name, email, password, departmentId } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'name, email and password are required' });

    const existing = await Employee.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const employee = await Employee.create({
      name,
      email,
      password_hash,
      role: 'employee',
      department_id: departmentId || null,
    });

    const department = departmentId
      ? await Department.findByPk(departmentId, { attributes: ['id', 'name'] })
      : null;

    const token = signToken(employee);
    const user = userPayload(employee, department);

    res.status(201).json({ token, user });
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const employee = await Employee.findByPk(req.user.id, {
      include: [{ model: Department, attributes: ['id', 'name'] }],
    });
    if (!employee) return res.status(404).json({ message: 'User not found' });

    res.json(userPayload(employee, employee.Department));
  } catch (err) {
    next(err);
  }
}

module.exports = { login, register, me };