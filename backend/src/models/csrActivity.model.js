const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CsrActivity = sequelize.define('CsrActivity', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(150), allowNull: false },
  category_id: DataTypes.INTEGER,
  description: DataTypes.TEXT,
  department_id: DataTypes.INTEGER,
  activity_date: DataTypes.DATEONLY,
  points: { type: DataTypes.INTEGER, defaultValue: 10 }, // points earned on approval (added; not in original schema)
  status: { type: DataTypes.STRING(20), defaultValue: 'Active' },
}, { tableName: 'csr_activity', timestamps: false });

module.exports = CsrActivity;
