const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RewardRedemption = sequelize.define('RewardRedemption', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  employee_id: DataTypes.INTEGER,
  reward_id: DataTypes.INTEGER,
  points_deducted: { type: DataTypes.INTEGER, allowNull: false },
  redeemed_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'reward_redemption', timestamps: false });

module.exports = RewardRedemption;
