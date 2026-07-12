const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const EsgConfig = sequelize.define('EsgConfig', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  env_weight: { type: DataTypes.DECIMAL(5, 2), defaultValue: 40.0 },
  social_weight: { type: DataTypes.DECIMAL(5, 2), defaultValue: 30.0 },
  governance_weight: { type: DataTypes.DECIMAL(5, 2), defaultValue: 30.0 },
  auto_emission_calc: { type: DataTypes.BOOLEAN, defaultValue: true },
  evidence_required: { type: DataTypes.BOOLEAN, defaultValue: true },
  badge_auto_award: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'esg_config', timestamps: false });

module.exports = EsgConfig;
