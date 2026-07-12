const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const scoresRoutes = require('./routes/scores.routes');
const carbonRoutes = require('./routes/carbon.routes');
const csrRoutes = require('./routes/csr.routes');
const challengesRoutes = require('./routes/challenges.routes');
const gamificationRoutes = require('./routes/gamification.routes');
const rewardsRoutes = require('./routes/rewards.routes');
const configRoutes = require('./routes/config.routes');
const masterRoutes = require('./routes/master.routes');
const badgesRoutes = require('./routes/badges.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Auth
app.use('/api/auth', authRoutes);

// Scores (dashboard, leaderboard, overall, department breakdown)
app.use('/api/scores', scoresRoutes);

// Environmental
app.use('/api', carbonRoutes);        // /api/carbon-transactions, /api/emission-factors

// Social / CSR  (includes both /api/csr-activities and /api/csr/*)
app.use('/api', csrRoutes);

// Gamification (challenges)
app.use('/api/challenges', challengesRoutes);

// Gamification (XP, leaderboard via /api/employees/:id/xp etc.)
app.use('/api', gamificationRoutes);

// Rewards
app.use('/api/rewards', rewardsRoutes);

// Badges  — GET /api/badges
app.use('/api/badges', badgesRoutes);

// Config (admin)
app.use('/api/config', configRoutes);

// Master data (departments list for registration)
app.use('/api/master', masterRoutes);

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

module.exports = app;
