const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Challenge = sequelize.define('Challenge', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(150), allowNull: false },
  category_id: DataTypes.INTEGER,
  description: DataTypes.TEXT,
  xp: { type: DataTypes.INTEGER, allowNull: false },
  difficulty: DataTypes.STRING(20),
  evidence_required: { type: DataTypes.BOOLEAN, defaultValue: false },
  deadline: DataTypes.DATEONLY,
  status: { type: DataTypes.STRING(20), defaultValue: 'Draft' }, // Draft|Active|Closed
}, { tableName: 'challenge', timestamps: false });

module.exports = Challenge;
