const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DepartmentScore = sequelize.define('DepartmentScore', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  department_id: DataTypes.INTEGER,
  environmental_score: DataTypes.DECIMAL(5, 2),
  social_score: DataTypes.DECIMAL(5, 2),
  governance_score: DataTypes.DECIMAL(5, 2),
  total_score: DataTypes.DECIMAL(5, 2),
  score_date: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
}, { tableName: 'department_score', timestamps: false });

module.exports = DepartmentScore;
