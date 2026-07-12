const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const EmployeeBadge = sequelize.define('EmployeeBadge', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  employee_id: DataTypes.INTEGER,
  badge_id: DataTypes.INTEGER,
  awarded_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'employee_badge',
  timestamps: false,
  indexes: [{ unique: true, fields: ['employee_id', 'badge_id'] }],
});

module.exports = EmployeeBadge;
