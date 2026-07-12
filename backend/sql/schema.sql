CREATE DATABASE IF NOT EXISTS esg_system;
USE esg_system;

-- ==========================
-- USERS / AUTH
-- ==========================

CREATE TABLE department (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE,
    head_employee_id INT,
    parent_department_id INT,
    employee_count INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'Active'
);

CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'employee',
    department_id INT,
    xp INT DEFAULT 0,
    points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_employee_department
    FOREIGN KEY (department_id)
    REFERENCES department(id)
);

ALTER TABLE department
ADD CONSTRAINT fk_department_head
FOREIGN KEY (head_employee_id)
REFERENCES employee(id);

ALTER TABLE department
ADD CONSTRAINT fk_parent_department
FOREIGN KEY (parent_department_id)
REFERENCES department(id);

CREATE INDEX idx_employee_department ON employee(department_id);

-- ==========================
-- CATEGORY
-- ==========================

CREATE TABLE category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'Active'
);

-- ==========================
-- ENVIRONMENTAL
-- ==========================

CREATE TABLE emission_factor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    activity_type VARCHAR(100) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    co2e_per_unit DECIMAL(10,4) NOT NULL
);

CREATE TABLE carbon_transaction (
    id INT AUTO_INCREMENT PRIMARY KEY,
    source_type VARCHAR(50) NOT NULL,
    source_reference_id INT,
    emission_factor_id INT,
    quantity DECIMAL(12,4) NOT NULL,
    calculated_co2e DECIMAL(12,4) NOT NULL,
    department_id INT,
    transaction_date DATE DEFAULT (CURRENT_DATE),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_carbon_emission_factor
    FOREIGN KEY (emission_factor_id)
    REFERENCES emission_factor(id),

    CONSTRAINT fk_carbon_department
    FOREIGN KEY (department_id)
    REFERENCES department(id)
);

-- source_type/source_reference_id is intentionally polymorphic (no FK) since it can
-- point at different tables depending on source_type. Indexed for lookup performance.
CREATE INDEX idx_carbon_source ON carbon_transaction(source_type, source_reference_id);
CREATE INDEX idx_carbon_department ON carbon_transaction(department_id);
CREATE INDEX idx_carbon_date ON carbon_transaction(transaction_date);

-- ==========================
-- SOCIAL
-- ==========================

CREATE TABLE csr_activity (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    category_id INT,
    description TEXT,
    department_id INT,
    activity_date DATE,
    points INT DEFAULT 10, -- FIX: added so employee_participation.points_earned has a source
    status VARCHAR(20) DEFAULT 'Active',

    CONSTRAINT fk_csr_category
    FOREIGN KEY (category_id)
    REFERENCES category(id),

    CONSTRAINT fk_csr_department
    FOREIGN KEY (department_id)
    REFERENCES department(id)
);

CREATE INDEX idx_csr_activity_date ON csr_activity(activity_date);

CREATE TABLE employee_participation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    activity_id INT,
    proof_url VARCHAR(255),
    approval_status VARCHAR(20) DEFAULT 'Pending',
    points_earned INT DEFAULT 0,
    completion_date DATE,

    CONSTRAINT fk_participation_employee
    FOREIGN KEY (employee_id)
    REFERENCES employee(id),

    CONSTRAINT fk_participation_activity
    FOREIGN KEY (activity_id)
    REFERENCES csr_activity(id),

    -- FIX: prevent an employee from joining the same activity twice
    UNIQUE (employee_id, activity_id)
);

-- ==========================
-- GAMIFICATION
-- ==========================

CREATE TABLE challenge (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    category_id INT,
    description TEXT,
    xp INT NOT NULL,
    difficulty VARCHAR(20),
    evidence_required BOOLEAN DEFAULT FALSE,
    deadline DATE,
    status VARCHAR(20) DEFAULT 'Draft',

    CONSTRAINT fk_challenge_category
    FOREIGN KEY (category_id)
    REFERENCES category(id)
);

CREATE INDEX idx_challenge_deadline ON challenge(deadline);

CREATE TABLE challenge_participation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    challenge_id INT,
    employee_id INT,
    progress VARCHAR(20) DEFAULT 'In Progress',
    proof_url VARCHAR(255),
    approval VARCHAR(20) DEFAULT 'Pending',
    xp_awarded INT DEFAULT 0,

    CONSTRAINT fk_challenge_participation_challenge
    FOREIGN KEY (challenge_id)
    REFERENCES challenge(id),

    CONSTRAINT fk_challenge_participation_employee
    FOREIGN KEY (employee_id)
    REFERENCES employee(id),

    -- FIX: prevent an employee from joining the same challenge twice
    UNIQUE (challenge_id, employee_id)
);

CREATE TABLE badge (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    unlock_rule_metric VARCHAR(50),
    unlock_rule_operator VARCHAR(10),
    unlock_rule_value INT,
    icon_url VARCHAR(255)
);

CREATE TABLE employee_badge (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    badge_id INT,
    awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(employee_id, badge_id),

    CONSTRAINT fk_employee_badge_employee
    FOREIGN KEY (employee_id)
    REFERENCES employee(id),

    CONSTRAINT fk_employee_badge_badge
    FOREIGN KEY (badge_id)
    REFERENCES badge(id)
);

CREATE TABLE reward (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    points_required INT NOT NULL,
    stock INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'Active'
);

CREATE TABLE reward_redemption (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    reward_id INT,
    points_deducted INT NOT NULL,
    redeemed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_reward_redemption_employee
    FOREIGN KEY (employee_id)
    REFERENCES employee(id),

    CONSTRAINT fk_reward_redemption_reward
    FOREIGN KEY (reward_id)
    REFERENCES reward(id)
);

-- ==========================
-- SCORING
-- ==========================

CREATE TABLE department_score (
    id INT AUTO_INCREMENT PRIMARY KEY,
    department_id INT,
    environmental_score DECIMAL(5,2),
    social_score DECIMAL(5,2),
    governance_score DECIMAL(5,2),
    total_score DECIMAL(5,2),
    score_date DATE DEFAULT (CURRENT_DATE),

    CONSTRAINT fk_department_score_department
    FOREIGN KEY (department_id)
    REFERENCES department(id)
);

CREATE INDEX idx_department_score_date ON department_score(score_date);

-- ==========================
-- CONFIG / SETTINGS
-- ==========================

-- NOTE: treated as a singleton table in application code (always id = 1).
-- No native "max 1 row" constraint in MySQL, so this is enforced in the
-- config.service / config.controller layer instead.
CREATE TABLE esg_config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    env_weight DECIMAL(5,2) DEFAULT 40.00,
    social_weight DECIMAL(5,2) DEFAULT 30.00,
    governance_weight DECIMAL(5,2) DEFAULT 30.00,
    auto_emission_calc BOOLEAN DEFAULT TRUE,
    evidence_required BOOLEAN DEFAULT TRUE,
    badge_auto_award BOOLEAN DEFAULT TRUE
);
