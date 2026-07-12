const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CarbonTransaction = sequelize.define('CarbonTransaction', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  source_type: { type: DataTypes.STRING(50), allowNull: false },
  source_reference_id: DataTypes.INTEGER,
  emission_factor_id: DataTypes.INTEGER,
  quantity: { type: DataTypes.DECIMAL(12, 4), allowNull: false },
  calculated_co2e: { type: DataTypes.DECIMAL(12, 4), allowNull: false },
  department_id: DataTypes.INTEGER,
  transaction_date: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'carbon_transaction', timestamps: false });

module.exports = CarbonTransaction;
