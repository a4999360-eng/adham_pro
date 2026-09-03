/**
 * Gym Evolution - BMR, TDEE, and Macro Logic Engine (Global Scope)
 */

window.GymEvo = window.GymEvo || {};

window.GymEvo.ACTIVITY_MULTIPLIERS = {
    sedentary: 1.2,      // Little/no exercise
    light: 1.375,        // Light exercise 1-3 days/week
    moderate: 1.55,      // Moderate exercise 3-5 days/week
    active: 1.725,       // Hard exercise 6-7 days/week
    extra: 1.9           // Very hard daily/twice daily sports
};

window.GymEvo.GOAL_CALORIE_ADJUSTMENTS = {
    lose: -500,          // Caloric deficit for weight loss
    maintain: 0,         // Maintenance calories
    gain: 400            // Caloric surplus for muscle building
};

/**
 * Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor Equation
 */
window.GymEvo.calculateBMR = function(gender, weight, height, age) {
    const w = Number(weight) || 0;
    const h = Number(height) || 0;
    const a = Number(age) || 0;

    if (w <= 0 || h <= 0 || a <= 0) return 0;

    if (gender === 'female') {
        return (10 * w) + (6.25 * h) - (5 * a) - 161;
    }
    // Default to male
    return (10 * w) + (6.25 * h) - (5 * a) + 5;
};

/**
 * Calculate Total Daily Energy Expenditure (TDEE)
 */
window.GymEvo.calculateTDEE = function(bmr, activityLevel) {
    const multipliers = window.GymEvo.ACTIVITY_MULTIPLIERS;
    const multiplier = multipliers[activityLevel] || multipliers.moderate;
    return Math.round(bmr * multiplier);
};

/**
 * Calculate Target Calories based on TDEE and Fitness Goal
 */
window.GymEvo.calculateTargetCalories = function(tdee, goal) {
    const adjustments = window.GymEvo.GOAL_CALORIE_ADJUSTMENTS;
    const adjustment = adjustments[goal] || adjustments.maintain;
    return Math.max(1200, Math.round(tdee + adjustment)); // Safeguard bottom limit of 1200kcal
};

/**
 * Calculate Macro splits (Protein, Carbs, Fats)
 */
window.GymEvo.calculateMacros = function(targetCalories, weight) {
    const w = Number(weight) || 70;
    const cals = Number(targetCalories) || 2000;

    // 1. Protein: 2g per kg of bodyweight
    let proteinGrams = Math.round(w * 2);
    let proteinCalories = proteinGrams * 4;

    // Safeguard: Ensure protein does not exceed 45% of total calories
    if (proteinCalories > (cals * 0.45)) {
        proteinCalories = Math.round(cals * 0.35);
        proteinGrams = Math.round(proteinCalories / 4);
    }

    // 2. Fat: 25% of target calories
    const fatCalories = cals * 0.25;
    const fatGrams = Math.round(fatCalories / 9);

    // 3. Carbs: Remainder of target calories
    const remainingCalories = cals - (proteinCalories + fatCalories);
    const carbsGrams = Math.round(Math.max(0, remainingCalories) / 4);

    return {
        protein: proteinGrams,
        carbs: carbsGrams,
        fat: fatGrams
    };
};

/**
 * Calculate accurate dynamic workout calories burned breakdown based on:
 * - User Body Weight (kg)
 * - Duration of Workout (minutes)
 * - Exercise Intensity (MET)
 * - Mechanical Work & Tonnage Lifted (Sets × Reps × Weight)
 */
window.GymEvo.getWorkoutBurnDetails = function(workout, userWeight = 75, durationMinutes = 50) {
    const w = Number(userWeight) || 75;
    const dur = Math.max(15, Number(durationMinutes) || 50);

    // Calculate total completed tonnage (kg lifted) and completed sets
    let totalTonnage = 0;
    let completedSetsCount = 0;
    if (workout && workout.exercises) {
        workout.exercises.forEach(ex => {
            if (ex.sets) {
                ex.sets.forEach(s => {
                    if (s.completed) {
                        completedSetsCount++;
                        const setWeight = s.weight > 0 ? Number(s.weight) : (w * 0.5); // bodyweight movement estimate
                        const reps = Number(s.reps) || 8;
                        totalTonnage += (setWeight * reps);
                    }
                });
            }
        });
    }

    // Dynamic MET based on session volume & intensity
    let met = 5.0; // Moderate resistance training
    if (completedSetsCount >= 10) met = 5.8;
    if (completedSetsCount >= 16) met = 6.6;

    // ACSM formula: Calories = ((MET × 3.5 × weightKg) / 200) × minutes
    const basalCardioBurn = Math.round(((met * 3.5 * w) / 200) * dur);

    // Mechanical work & EPOC metabolic afterburn bonus (based on tonnage)
    const tonnageBurn = Math.round(totalTonnage * 0.015);

    const totalBurn = Math.max(120, basalCardioBurn + tonnageBurn);

    return {
        totalBurn,
        basalCardioBurn,
        tonnageBurn,
        totalTonnage: Math.round(totalTonnage),
        completedSetsCount,
        met,
        durationMinutes: dur
    };
};

window.GymEvo.calculateWorkoutCaloriesBurned = function(workout, userWeight = 75, durationMinutes = 50) {
    if (window.GymEvo.getWorkoutBurnDetails) {
        return window.GymEvo.getWorkoutBurnDetails(workout, userWeight, durationMinutes).totalBurn;
    }
    return 350;
};


