require('dotenv').config();

const { getDashboard } = require('../controllers/scores.controller');
const { Employee } = require('../models');

async function test() {
  const admin = await Employee.findOne({ where: { email: 'admin@gmail.com' } });
  const manager = await Employee.findOne({ where: { email: 'manager@ecosphere.com' } });
  const employee = await Employee.findOne({ where: { email: 'jane@ecosphere.com' } });

  const mockRes = {
    json: (data) => {
      console.log('--- RESPONSE USER ---');
      console.log(JSON.stringify(data.user, null, 2));
      console.log('--- KEYS ---');
      console.log(Object.keys(data));
    },
    status: (code) => {
      console.log('Status code:', code);
      return mockRes;
    }
  };

  const next = (err) => {
    if (err) console.error('Error:', err);
  };

  console.log('TESTING ADMIN:');
  await getDashboard({ user: { id: admin.id, role: admin.role, department_id: admin.department_id } }, mockRes, next);

  console.log('TESTING MANAGER:');
  await getDashboard({ user: { id: manager.id, role: manager.role, department_id: manager.department_id } }, mockRes, next);

  console.log('TESTING EMPLOYEE:');
  await getDashboard({ user: { id: employee.id, role: employee.role, department_id: employee.department_id } }, mockRes, next);
}

test().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
