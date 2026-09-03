/**
 * Gym Evolution - Relational Database Schema Design (Production-Ready Target SQL - Global Scope)
 */

window.GymEvo = window.GymEvo || {};

window.GymEvo.SQL_DATABASE_SCHEMA = `
-- 1. Users Table
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
    age INT NOT NULL,
    weight_kg DECIMAL(5, 2) NOT NULL,
    height_cm DECIMAL(5, 2) NOT NULL,
    activity_level VARCHAR(20) CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'extra')),
    goal VARCHAR(20) CHECK (goal IN ('lose', 'maintain', 'gain')),
    custom_calories INT,
    custom_protein INT,
    custom_carbs INT,
    custom_fat INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Daily Logs Table
CREATE TABLE daily_logs (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL UNIQUE,
    target_calories INT NOT NULL,
    target_protein INT NOT NULL,
    target_carbs INT NOT NULL,
    target_fat INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Meals Table
CREATE TABLE meals (
    id VARCHAR(50) PRIMARY KEY,
    daily_log_id VARCHAR(50) REFERENCES daily_logs(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    calories INT NOT NULL DEFAULT 0,
    protein_g INT NOT NULL DEFAULT 0,
    carbs_g INT NOT NULL DEFAULT 0,
    fat_g INT NOT NULL DEFAULT 0,
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Workout Sessions Table
CREATE TABLE workouts (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    session_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Exercises Table
CREATE TABLE exercises (
    id VARCHAR(50) PRIMARY KEY,
    workout_id VARCHAR(50) REFERENCES workouts(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0
);

-- 6. Exercise Sets Table
CREATE TABLE exercise_sets (
    id SERIAL PRIMARY KEY,
    exercise_id VARCHAR(50) REFERENCES exercises(id) ON DELETE CASCADE,
    set_number INT NOT NULL,
    weight_kg DECIMAL(6, 2) NOT NULL,
    reps INT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Evolution Metrics Table
CREATE TABLE evolution_metrics (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    weight_kg DECIMAL(5, 2) NOT NULL,
    body_fat_percentage DECIMAL(4, 2),
    waist_cm DECIMAL(5, 2),
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_meals_daily_log ON meals(daily_log_id);
CREATE INDEX idx_exercises_workout ON exercises(workout_id);
CREATE INDEX idx_exercise_sets_exercise ON exercise_sets(exercise_id);
CREATE INDEX idx_workouts_user_date ON workouts(user_id, session_date);
CREATE INDEX idx_metrics_user_date ON evolution_metrics(user_id, logged_at);
`;

window.GymEvo.SCHEMA_DETAILS = {
    description: "Production SQL relational schema defining relationships between User profiles, nutrition items, structured workouts, and physiological evolution metrics.",
    architecturePattern: "Repository Pattern mapping Domain Entities to LocalStorage serialized JSONs in prototype, ready to migrate to PostgreSQL ORM objects."
};
