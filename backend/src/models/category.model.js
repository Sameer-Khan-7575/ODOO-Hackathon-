const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Category = sequelize.define('Category', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  type: { type: DataTypes.STRING(20), allowNull: false }, // 'CSR' | 'Challenge' | 'Environmental'
  status: { type: DataTypes.STRING(20), defaultValue: 'Active' },
}, { tableName: 'category', timestamps: false });

module.exports = Category;
