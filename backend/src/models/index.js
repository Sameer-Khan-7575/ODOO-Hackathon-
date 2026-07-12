const sequelize = require('../config/db');

const Department = require('./department.model');
const Employee = require('./employee.model');
const Category = require('./category.model');
const EmissionFactor = require('./emissionFactor.model');
const CarbonTransaction = require('./carbonTransaction.model');
const CsrActivity = require('./csrActivity.model');
const EmployeeParticipation = require('./employeeParticipation.model');
const Challenge = require('./challenge.model');
const ChallengeParticipation = require('./challengeParticipation.model');
const Badge = require('./badge.model');
const EmployeeBadge = require('./employeeBadge.model');
const Reward = require('./reward.model');
const RewardRedemption = require('./rewardRedemption.model');
const DepartmentScore = require('./departmentScore.model');
const EsgConfig = require('./esgConfig.model');

// ---- Department / Employee ----
Employee.belongsTo(Department, { foreignKey: 'department_id' });
Department.hasMany(Employee, { foreignKey: 'department_id' });
Department.belongsTo(Employee, { as: 'Head', foreignKey: 'head_employee_id' });
Department.belongsTo(Department, { as: 'ParentDepartment', foreignKey: 'parent_department_id' });

// ---- Environmental ----
CarbonTransaction.belongsTo(EmissionFactor, { foreignKey: 'emission_factor_id' });
CarbonTransaction.belongsTo(Department, { foreignKey: 'department_id' });

// ---- Social ----
CsrActivity.belongsTo(Category, { foreignKey: 'category_id' });
CsrActivity.belongsTo(Department, { foreignKey: 'department_id' });
EmployeeParticipation.belongsTo(Employee, { foreignKey: 'employee_id' });
EmployeeParticipation.belongsTo(CsrActivity, { foreignKey: 'activity_id' });
CsrActivity.hasMany(EmployeeParticipation, { foreignKey: 'activity_id' });

// ---- Gamification ----
Challenge.belongsTo(Category, { foreignKey: 'category_id' });
ChallengeParticipation.belongsTo(Challenge, { foreignKey: 'challenge_id' });
ChallengeParticipation.belongsTo(Employee, { foreignKey: 'employee_id' });
Challenge.hasMany(ChallengeParticipation, { foreignKey: 'challenge_id' });

EmployeeBadge.belongsTo(Employee, { foreignKey: 'employee_id' });
EmployeeBadge.belongsTo(Badge, { foreignKey: 'badge_id' });
Employee.hasMany(EmployeeBadge, { foreignKey: 'employee_id' });

RewardRedemption.belongsTo(Employee, { foreignKey: 'employee_id' });
RewardRedemption.belongsTo(Reward, { foreignKey: 'reward_id' });

// ---- Scoring ----
DepartmentScore.belongsTo(Department, { foreignKey: 'department_id' });

module.exports = {
  sequelize,
  Department,
  Employee,
  Category,
  EmissionFactor,
  CarbonTransaction,
  CsrActivity,
  EmployeeParticipation,
  Challenge,
  ChallengeParticipation,
  Badge,
  EmployeeBadge,
  Reward,
  RewardRedemption,
  DepartmentScore,
  EsgConfig,
};
