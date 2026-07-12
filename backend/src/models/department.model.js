const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Department = sequelize.define('Department', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  code: { type: DataTypes.STRING(20), unique: true },
  head_employee_id: DataTypes.INTEGER,
  parent_department_id: DataTypes.INTEGER,
  employee_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  status: { type: DataTypes.STRING(20), defaultValue: 'Active' },
}, { tableName: 'department', timestamps: false });

module.exports = Department;
