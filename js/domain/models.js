/**
 * Gym Evolution - Clean Architecture Domain Entities (Global Scope)
 */

window.GymEvo = window.GymEvo || {};

window.GymEvo.User = class User {
    constructor({
        id = 'user-default',
        name = 'Captain Evolution',
        email = '',
        picture = '',
        gender = 'male', // 'male' | 'female'
        age = 28,
        weight = 82, // in kg
        height = 180, // in cm
        activityLevel = 'active', // 'sedentary' | 'light' | 'moderate' | 'active' | 'extra'
        goal = 'lose', // 'lose' | 'maintain' | 'gain'
        customCalories = null,
        customMacros = null // { protein, carbs, fat }
    } = {}) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.picture = picture;
        this.gender = gender;
        this.age = age;
        this.weight = weight;
        this.height = height;
        this.activityLevel = activityLevel;
        this.goal = goal;
        this.customCalories = customCalories;
        this.customMacros = customMacros;
    }
};

window.GymEvo.Meal = class Meal {
    constructor({
        id = null,
        name = '',
        calories = 0,
        protein = 0, // grams
        carbs = 0,   // grams
        fat = 0,     // grams
        timestamp = Date.now()
    } = {}) {
        this.id = id || `meal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        this.name = name;
        this.calories = Math.round(Number(calories) || 0);
        this.protein = Math.round(Number(protein) || 0);
        this.carbs = Math.round(Number(carbs) || 0);
        this.fat = Math.round(Number(fat) || 0);
        this.timestamp = timestamp;
    }
};

window.GymEvo.Exercise = class Exercise {
    constructor({
        id = null,
        name = '',
        sets = [] // Array of { weight: number, reps: number, completed: boolean }
    } = {}) {
        this.id = id || `ex-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        this.name = name;
        this.sets = sets.map(set => ({
            weight: Number(set.weight) || 0,
            reps: Number(set.reps) || 0,
            completed: set.completed !== undefined ? set.completed : false
        }));
    }
};

window.GymEvo.Workout = class Workout {
    constructor({
        id = null,
        name = 'New Workout',
        exercises = [], // Array of Exercise instances
        timestamp = Date.now(),
        completed = false
    } = {}) {
        this.id = id || `workout-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        this.name = name;
        this.exercises = exercises.map(ex => new window.GymEvo.Exercise(ex));
        this.timestamp = timestamp;
        this.completed = completed;
    }
};

window.GymEvo.Metric = class Metric {
    constructor({
        id = null,
        weight = 0,
        bodyFat = null, // percentage
        waist = null, // cm
        timestamp = Date.now()
    } = {}) {
        this.id = id || `metric-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        this.weight = Number(weight) || 0;
        this.bodyFat = bodyFat !== null && bodyFat !== undefined ? Number(bodyFat) : null;
        this.waist = waist !== null && waist !== undefined ? Number(waist) : null;
        this.timestamp = timestamp;
    }
};
