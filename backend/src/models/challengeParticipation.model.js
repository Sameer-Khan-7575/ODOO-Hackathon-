const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ChallengeParticipation = sequelize.define('ChallengeParticipation', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  challenge_id: DataTypes.INTEGER,
  employee_id: DataTypes.INTEGER,
  progress: { type: DataTypes.STRING(20), defaultValue: 'In Progress' }, // In Progress|Submitted|Completed
  proof_url: DataTypes.STRING(255),
  approval: { type: DataTypes.STRING(20), defaultValue: 'Pending' }, // Pending|Approved|Rejected
  xp_awarded: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
  tableName: 'challenge_participation',
  timestamps: false,
  indexes: [{ unique: true, fields: ['challenge_id', 'employee_id'] }],
});

module.exports = ChallengeParticipation;
