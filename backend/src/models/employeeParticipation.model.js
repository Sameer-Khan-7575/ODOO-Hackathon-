const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const EmployeeParticipation = sequelize.define('EmployeeParticipation', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  employee_id: DataTypes.INTEGER,
  activity_id: DataTypes.INTEGER,
  proof_url: DataTypes.STRING(255),
  approval_status: { type: DataTypes.STRING(20), defaultValue: 'Pending' }, // Pending|Approved|Rejected
  points_earned: { type: DataTypes.INTEGER, defaultValue: 0 },
  completion_date: DataTypes.DATEONLY,
}, {
  tableName: 'employee_participation',
  timestamps: false,
  indexes: [{ unique: true, fields: ['employee_id', 'activity_id'] }],
});

module.exports = EmployeeParticipation;
