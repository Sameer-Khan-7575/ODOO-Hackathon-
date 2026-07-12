const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Badge = sequelize.define('Badge', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  description: DataTypes.TEXT,
  unlock_rule_metric: DataTypes.STRING(50), // e.g. 'xp', 'points', 'challenges_completed'
  unlock_rule_operator: DataTypes.STRING(10), // e.g. '>=', '>', '='
  unlock_rule_value: DataTypes.INTEGER,
  icon_url: DataTypes.STRING(255),
}, { tableName: 'badge', timestamps: false });

module.exports = Badge;
