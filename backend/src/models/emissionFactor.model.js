const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const EmissionFactor = sequelize.define('EmissionFactor', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  activity_type: { type: DataTypes.STRING(100), allowNull: false },
  unit: { type: DataTypes.STRING(20), allowNull: false },
  co2e_per_unit: { type: DataTypes.DECIMAL(10, 4), allowNull: false },
}, { tableName: 'emission_factor', timestamps: false });

module.exports = EmissionFactor;
