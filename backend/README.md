# ESG System Backend

## Setup
1. `cp .env.example .env` and fill in your MySQL credentials + a JWT secret.
2. `npm install`
3. Run `sql/schema.sql` in MySQL Workbench against your `esg_system` database
   (or let `npm run seed` do it for you — see below).
4. `npm run seed` — drops/recreates all tables via Sequelize and inserts demo
   data, including an admin login (`admin@example.com` / `password123`) and
   an employee login (`jane@example.com` / `password123`).
5. `npm run dev` (or `npm start`) to launch the API on `PORT` from `.env`.

## Notes on fixes vs. the original schema
- Added `csr_activity.points` — `employee_participation.points_earned` had
  no source value without it.
- Added `UNIQUE(employee_id, activity_id)` on `employee_participation` and
  `UNIQUE(challenge_id, employee_id)` on `challenge_participation` to stop
  duplicate joins.
- Added indexes on frequently-filtered columns (dates, department_id,
  polymorphic source columns).
- `esg_config` is treated as a singleton (`id = 1`) at the application layer.
- Added `POST /api/challenges/submissions/:id/approve` (admin) — the
  original API list had no endpoint to actually approve a challenge
  submission and award XP, mirroring how `/api/participation/:id/approve`
  works for CSR activities.

## Architecture
Routes → Controllers (HTTP concerns only) → Services (business logic:
CO2e math, E/S/G scoring, badge unlock evaluation, reward redemption with
stock/points checks) → Sequelize Models.
