const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Reward = sequelize.define('Reward', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  description: DataTypes.TEXT,
  points_required: { type: DataTypes.INTEGER, allowNull: false },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  status: { type: DataTypes.STRING(20), defaultValue: 'Active' },
}, { tableName: 'reward', timestamps: false });

module.exports = Reward;
