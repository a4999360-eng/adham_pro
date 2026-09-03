/**
 * Gym Evolution - LocalStorage Clean Repository with Mock Seeding (Global Scope)
 */

window.GymEvo = window.GymEvo || {};

const STORAGE_KEYS = {
    USER: 'gym_evo_user',
    MEALS: 'gym_evo_meals',
    WORKOUTS: 'gym_evo_workouts',
    METRICS: 'gym_evo_metrics',
    REMINDERS: 'gym_evo_reminders'
};

window.GymEvo.LocalRepository = class LocalRepository {
    constructor() {
        this._initStorage();
    }

    /**
     * Initializes storage structures and seeds mock data if empty
     */
    _initStorage() {
        if (!localStorage.getItem(STORAGE_KEYS.USER)) {
            // Seed Default User: Male, 28y, 82kg, 180cm, active, goal: lose (deficit)
            const defaultUser = new window.GymEvo.User({
                id: 'user-active-evo',
                name: 'Captain Evolution',
                gender: 'male',
                age: 28,
                weight: 82,
                height: 180,
                activityLevel: 'active',
                goal: 'lose'
            });
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(defaultUser));
            this._seedMockData(defaultUser.weight);
        }
    }

    /**
     * Seeds initial mock data for dashboard visualization
     */
    _seedMockData(userWeight) {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

        // 1. Seed Meals for Today
        const mockMeals = [
            new window.GymEvo.Meal({
                name: 'Breakfast: Scrambled Eggs & Avocado Toast',
                calories: 450,
                protein: 28,
                carbs: 35,
                fat: 22,
                timestamp: startOfDay + 8 * 60 * 60 * 1000 // 8:00 AM
            }),
            new window.GymEvo.Meal({
                name: 'Lunch: Grilled Chicken Breast with Brown Rice & Broccoli',
                calories: 620,
                protein: 52,
                carbs: 65,
                fat: 12,
                timestamp: startOfDay + 13 * 60 * 60 * 1000 // 1:00 PM
            }),
            new window.GymEvo.Meal({
                name: 'Snack: Whey Protein Shake & Banana',
                calories: 280,
                protein: 26,
                carbs: 38,
                fat: 3,
                timestamp: startOfDay + 17 * 60 * 60 * 1000 // 5:00 PM
            })
        ];
        localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(mockMeals));

        // 2. Seed Workouts
        const mockWorkouts = [
            new window.GymEvo.Workout({
                name: 'Push Day - Hypertrophy',
                timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
                completed: true,
                exercises: [
                    new window.GymEvo.Exercise({
                        name: 'Barbell Bench Press',
                        sets: [
                            { weight: 80, reps: 8, completed: true },
                            { weight: 80, reps: 8, completed: true },
                            { weight: 85, reps: 6, completed: true }
                        ]
                    }),
                    new window.GymEvo.Exercise({
                        name: 'Seated Dumbbell Overhead Press',
                        sets: [
                            { weight: 24, reps: 10, completed: true },
                            { weight: 24, reps: 10, completed: true },
                            { weight: 26, reps: 8, completed: true }
                        ]
                    }),
                    new window.GymEvo.Exercise({
                        name: 'Incline Dumbbell Flyes',
                        sets: [
                            { weight: 16, reps: 12, completed: true },
                            { weight: 16, reps: 12, completed: true }
                        ]
                    }),
                    new window.GymEvo.Exercise({
                        name: 'Tricep Rope Pushdowns',
                        sets: [
                            { weight: 25, reps: 15, completed: true },
                            { weight: 30, reps: 12, completed: true }
                        ]
                    })
                ]
            }),
            new window.GymEvo.Workout({
                name: 'Pull Day - Strength',
                timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
                completed: true,
                exercises: [
                    new window.GymEvo.Exercise({
                        name: 'Conventional Deadlift',
                        sets: [
                            { weight: 120, reps: 5, completed: true },
                            { weight: 130, reps: 5, completed: true },
                            { weight: 140, reps: 4, completed: true }
                        ]
                    }),
                    new window.GymEvo.Exercise({
                        name: 'Weighted Pull-ups',
                        sets: [
                            { weight: 10, reps: 8, completed: true },
                            { weight: 10, reps: 7, completed: true },
                            { weight: 0, reps: 10, completed: true }
                        ]
                    }),
                    new window.GymEvo.Exercise({
                        name: 'Chest-Supported Dumbbell Rows',
                        sets: [
                            { weight: 28, reps: 10, completed: true },
                            { weight: 28, reps: 10, completed: true }
                        ]
                    }),
                    new window.GymEvo.Exercise({
                        name: 'Incline Dumbbell Curls',
                        sets: [
                            { weight: 14, reps: 12, completed: true },
                            { weight: 14, reps: 12, completed: true }
                        ]
                    })
                ]
            }),
            new window.GymEvo.Workout({
                name: 'Legs & Core',
                timestamp: Date.now(), // Today (editable / active)
                completed: false,
                exercises: [
                    new window.GymEvo.Exercise({
                        name: 'Barbell Back Squats',
                        sets: [
                            { weight: 100, reps: 8, completed: false },
                            { weight: 100, reps: 8, completed: false },
                            { weight: 105, reps: 6, completed: false }
                        ]
                    }),
                    new window.GymEvo.Exercise({
                        name: 'Romanian Deadlifts',
                        sets: [
                            { weight: 80, reps: 10, completed: false },
                            { weight: 80, reps: 10, completed: false }
                        ]
                    }),
                    new window.GymEvo.Exercise({
                        name: 'Hanging Leg Raises',
                        sets: [
                            { weight: 0, reps: 15, completed: false },
                            { weight: 0, reps: 15, completed: false }
                        ]
                    })
                ]
            })
        ];
        localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(mockWorkouts));

        // 3. Seed Evolution Metrics (Last 30 days)
        const mockMetrics = [];
        for (let i = 30; i >= 0; i -= 3) {
            const timeOffset = i * 24 * 60 * 60 * 1000;
            const progressRatio = (30 - i) / 30;
            
            const weightVal = parseFloat((84.5 - (2.5 * progressRatio) + (Math.random() * 0.3 - 0.15)).toFixed(1));
            const fatVal = parseFloat((18.2 - (1.2 * progressRatio) + (Math.random() * 0.1 - 0.05)).toFixed(1));
            const waistVal = parseFloat((89.5 - (2.5 * progressRatio)).toFixed(1));

            mockMetrics.push(new window.GymEvo.Metric({
                weight: weightVal,
                bodyFat: fatVal,
                waist: waistVal,
                timestamp: Date.now() - timeOffset
            }));
        }
        localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(mockMetrics));
    }

    // --- USER CRUD ---
    getUser() {
        const data = localStorage.getItem(STORAGE_KEYS.USER);
        return data ? new window.GymEvo.User(JSON.parse(data)) : null;
    }

    saveUser(userInstance) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userInstance));
        return userInstance;
    }

    // --- MEALS CRUD ---
    getMeals() {
        const data = localStorage.getItem(STORAGE_KEYS.MEALS) || '[]';
        return JSON.parse(data).map(m => new window.GymEvo.Meal(m));
    }

    getMealsByDate(dateObj) {
        const targetDateStr = dateObj.toDateString();
        return this.getMeals().filter(meal => {
            return new Date(meal.timestamp).toDateString() === targetDateStr;
        });
    }

    saveMeal(mealInstance) {
        const meals = this.getMeals();
        const existingIndex = meals.findIndex(m => m.id === mealInstance.id);
        if (existingIndex > -1) {
            meals[existingIndex] = mealInstance;
        } else {
            meals.push(mealInstance);
        }
        localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals));
        return mealInstance;
    }

    deleteMeal(mealId) {
        const meals = this.getMeals();
        const filtered = meals.filter(m => m.id !== mealId);
        localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(filtered));
        return true;
    }

    // --- WORKOUTS CRUD ---
    getWorkouts() {
        const data = localStorage.getItem(STORAGE_KEYS.WORKOUTS) || '[]';
        return JSON.parse(data).map(w => new window.GymEvo.Workout(w));
    }

    saveWorkout(workoutInstance) {
        const workouts = this.getWorkouts();
        const existingIndex = workouts.findIndex(w => w.id === workoutInstance.id);
        if (existingIndex > -1) {
            workouts[existingIndex] = workoutInstance;
        } else {
            workouts.unshift(workoutInstance);
        }
        localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
        return workoutInstance;
    }

    deleteWorkout(workoutId) {
        const workouts = this.getWorkouts();
        const filtered = workouts.filter(w => w.id !== workoutId);
        localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(filtered));
        return true;
    }

    // --- METRICS CRUD ---
    getMetrics() {
        const data = localStorage.getItem(STORAGE_KEYS.METRICS) || '[]';
        return JSON.parse(data).map(m => new window.GymEvo.Metric(m)).sort((a, b) => a.timestamp - b.timestamp);
    }

    saveMetric(metricInstance) {
        const metrics = this.getMetrics();
        const dateStr = new Date(metricInstance.timestamp).toDateString();
        const existingIndex = metrics.findIndex(m => new Date(m.timestamp).toDateString() === dateStr);
        
        if (existingIndex > -1) {
            metrics[existingIndex] = metricInstance;
        } else {
            metrics.push(metricInstance);
        }
        
        localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(metrics));
        return metricInstance;
    }

    deleteMetric(metricId) {
        const metrics = this.getMetrics();
        const filtered = metrics.filter(m => m.id !== metricId);
        localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(filtered));
        return true;
    }

    // --- REMINDERS CRUD ---
    getReminderSettings() {
        const defaults = {
            enabled: true,
            weightReminder: {
                enabled: true,
                frequency: 'weekly', // 'daily' or 'weekly'
                dayOfWeek: 0, // Sunday
                time: '09:00'
            },
            mealReminder: {
                enabled: true,
                breakfast: '09:30',
                lunch: '14:30',
                dinner: '20:30'
            },
            waterReminder: {
                enabled: false,
                intervalHours: 2
            },
            customReminders: [],
            ringtone: {
                name: 'نغمة التطبيق الافتراضية (Bell Chime)',
                dataUrl: null
            },
            lastNotified: {}
        };
        const data = localStorage.getItem(STORAGE_KEYS.REMINDERS);
        if (!data) return defaults;
        try {
            const parsed = JSON.parse(data);
            return Object.assign(defaults, parsed, {
                customReminders: parsed.customReminders || [],
                ringtone: parsed.ringtone || defaults.ringtone
            });
        } catch (e) {
            return defaults;
        }
    }

    saveReminderSettings(settings) {
        localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(settings));
        return settings;
    }

    addCustomReminder(reminder) {
        const settings = this.getReminderSettings();
        if (!settings.customReminders) settings.customReminders = [];
        const newReminder = {
            id: 'cr-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
            title: reminder.title.trim(),
            time: reminder.time || '18:00',
            days: reminder.days || 'daily',
            enabled: true,
            createdAt: Date.now()
        };
        settings.customReminders.unshift(newReminder);
        this.saveReminderSettings(settings);
        return newReminder;
    }

    deleteCustomReminder(id) {
        const settings = this.getReminderSettings();
        if (!settings.customReminders) return false;
        settings.customReminders = settings.customReminders.filter(r => r.id !== id);
        this.saveReminderSettings(settings);
        return true;
    }

    toggleCustomReminder(id, enabled) {
        const settings = this.getReminderSettings();
        if (!settings.customReminders) return false;
        const target = settings.customReminders.find(r => r.id === id);
        if (target) {
            target.enabled = enabled;
            this.saveReminderSettings(settings);
            return true;
        }
        return false;
    }

    saveRingtone(name, dataUrl) {
        const settings = this.getReminderSettings();
        settings.ringtone = {
            name: name || 'نغمة مخصصة من الهاتف',
            dataUrl: dataUrl
        };
        this.saveReminderSettings(settings);
        return settings.ringtone;
    }

    getRingtone() {
        const settings = this.getReminderSettings();
        return settings.ringtone || { name: 'نغمة التطبيق الافتراضية (Bell Chime)', dataUrl: null };
    }
};
