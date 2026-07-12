require('dotenv').config();
const bcrypt = require('bcryptjs');
const {
  sequelize,
  Department,
  Employee,
  Category,
  EmissionFactor,
  CsrActivity,
  Challenge,
  Badge,
  Reward,
  EsgConfig,
} = require('../models');

async function seed() {
  await sequelize.sync({ force: true }); // WARNING: drops and recreates all tables

  const engineering = await Department.create({ name: 'Engineering', code: 'ENG' });
  const hr = await Department.create({ name: 'Human Resources', code: 'HR' });

  const adminHash = await bcrypt.hash('admin123', 10);
  const passwordHash = await bcrypt.hash('password123', 10);

  const admin = await Employee.create({
    name: 'Admin',
    email: 'admin@gmail.com',
    password_hash: adminHash,
    role: 'admin',
    department_id: engineering.id,
  });

  const employee = await Employee.create({
    name: 'Jane Doe',
    email: 'jane@ecosphere.com',
    password_hash: passwordHash,
    role: 'employee',
    department_id: engineering.id,
  });

  const john = await Employee.create({
    name: 'John Smith',
    email: 'john@ecosphere.com',
    password_hash: passwordHash,
    role: 'employee',
    department_id: hr.id,
  });

  const manager = await Employee.create({
    name: 'Alice Manager',
    email: 'manager@ecosphere.com',
    password_hash: passwordHash,
    role: 'manager',
    department_id: engineering.id,
  });

  await Department.update({ head_employee_id: admin.id }, { where: { id: engineering.id } });

  const envCategory = await Category.create({ name: 'Environmental', type: 'Environmental' });
  const csrCategory = await Category.create({ name: 'Community Service', type: 'CSR' });
  const challengeCategory = await Category.create({ name: 'Sustainability', type: 'Challenge' });

  await EmissionFactor.create({ activity_type: 'Electricity (grid, kWh)', unit: 'kWh', co2e_per_unit: 0.4 });
  await EmissionFactor.create({ activity_type: 'Car travel (petrol, km)', unit: 'km', co2e_per_unit: 0.17 });

  await CsrActivity.create({
    title: 'Beach Cleanup Drive',
    category_id: csrCategory.id,
    department_id: engineering.id,
    activity_date: new Date(),
    points: 15,
    status: 'Active',
  });

  await Challenge.create({
    title: 'Zero Waste Week',
    category_id: challengeCategory.id,
    description: 'Reduce personal waste to zero for a full week.',
    xp: 100,
    difficulty: 'Medium',
    evidence_required: true,
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    status: 'Active',
  });

  await Badge.create({
    name: 'Century Club',
    description: 'Earn 100 XP',
    unlock_rule_metric: 'xp',
    unlock_rule_operator: '>=',
    unlock_rule_value: 100,
  });

  await Reward.create({
    name: '$10 Coffee Voucher',
    description: 'Redeemable at the office café',
    points_required: 50,
    stock: 25,
  });

  await EsgConfig.create({ id: 1 });

  console.log('Seed data inserted successfully.');
  console.log('Login with:');
  console.log('  admin@gmail.com / admin123');
  console.log('  jane@ecosphere.com / password123');
  console.log('  john@ecosphere.com / password123');
  console.log('  manager@ecosphere.com / password123');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
