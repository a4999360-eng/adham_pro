/**
 * Gym Evolution - Categorized Exercise Library Database (Global Scope)
 */

window.GymEvo = window.GymEvo || {};

window.GymEvo.ExerciseDb = {
    categories: [
        { key: 'all', nameAr: 'كل التمارين', icon: '🏋️‍♂️' },
        { key: 'chest', nameAr: 'عضلات الصدر (Chest)', icon: '🛡️' },
        { key: 'back', nameAr: 'عضلات الظهر (Back)', icon: '🦅' },
        { key: 'legs', nameAr: 'عضلات الأرجل (Legs)', icon: '🦵' },
        { key: 'shoulders', nameAr: 'عضلات الأكتاف (Shoulders)', icon: '🎯' },
        { key: 'arms', nameAr: 'عضلات الذراعين (Arms)', icon: '💪' },
        { key: 'core', nameAr: 'عضلات البطن والكور (Core)', icon: '⚡' }
    ],

    items: [
        // --- CHEST ---
        {
            id: 'ex-barbell-bench',
            nameAr: 'بنش برس مستوي بالبار (Barbell Bench Press)',
            nameEn: 'Barbell Flat Bench Press',
            category: 'chest',
            equipment: 'barbell',
            suggestedSets: 4,
            suggestedReps: 8
        },
        {
            id: 'ex-incline-db-press',
            nameAr: 'تجميع صدر عالي بالدمبلز (Incline Dumbbell Press)',
            nameEn: 'Incline Dumbbell Press',
            category: 'chest',
            equipment: 'dumbbell',
            suggestedSets: 3,
            suggestedReps: 10
        },
        {
            id: 'ex-cable-crossover',
            nameAr: 'تفتيح صدر بالكيبل (Cable Crossover / Flyes)',
            nameEn: 'Cable Flyes',
            category: 'chest',
            equipment: 'cable',
            suggestedSets: 3,
            suggestedReps: 12
        },
        {
            id: 'ex-dips-chest',
            nameAr: 'تمرين المتوازي للصدر (Chest Dips)',
            nameEn: 'Parallel Bar Dips',
            category: 'chest',
            equipment: 'bodyweight',
            suggestedSets: 3,
            suggestedReps: 10
        },
        {
            id: 'ex-pushups',
            nameAr: 'تمرين الضغط الكلاسيكي (Push-ups)',
            nameEn: 'Standard Push-ups',
            category: 'chest',
            equipment: 'bodyweight',
            suggestedSets: 3,
            suggestedReps: 15
        },

        // --- BACK ---
        {
            id: 'ex-pullups',
            nameAr: 'عقلة قبضة واسعة / ضيقة (Pull-ups / Chin-ups)',
            nameEn: 'Pull-ups / Chin-ups',
            category: 'back',
            equipment: 'bodyweight',
            suggestedSets: 4,
            suggestedReps: 8
        },
        {
            id: 'ex-lat-pulldown',
            nameAr: 'سحب عالي بالكيبل للظهر (Lat Pulldown)',
            nameEn: 'Lat Pulldown',
            category: 'back',
            equipment: 'cable',
            suggestedSets: 4,
            suggestedReps: 10
        },
        {
            id: 'ex-barbell-row',
            nameAr: 'تجديف بالبار منحني (Bent-over Barbell Row)',
            nameEn: 'Bent-Over Barbell Row',
            category: 'back',
            equipment: 'barbell',
            suggestedSets: 4,
            suggestedReps: 8
        },
        {
            id: 'ex-seated-cable-row',
            nameAr: 'سحب أرضي ضيق بالكيبل (Seated Cable Row)',
            nameEn: 'Seated Cable Row',
            category: 'back',
            equipment: 'cable',
            suggestedSets: 3,
            suggestedReps: 12
        },
        {
            id: 'ex-deadlift',
            nameAr: 'ديدليفت كلاسيكي (Conventional Deadlift)',
            nameEn: 'Conventional Deadlift',
            category: 'back',
            equipment: 'barbell',
            suggestedSets: 4,
            suggestedReps: 5
        },

        // --- LEGS ---
        {
            id: 'ex-barbell-squat',
            nameAr: 'سكوات بالبار خلفي (Barbell Back Squat)',
            nameEn: 'Barbell Back Squat',
            category: 'legs',
            equipment: 'barbell',
            suggestedSets: 4,
            suggestedReps: 8
        },
        {
            id: 'ex-leg-press',
            nameAr: 'دفع بالرجلين على الجهاز (Leg Press)',
            nameEn: 'Incline Leg Press',
            category: 'legs',
            equipment: 'machine',
            suggestedSets: 4,
            suggestedReps: 10
        },
        {
            id: 'ex-romanian-deadlift',
            nameAr: 'رومانيان ديدليفت للهامسترنج (Romanian Deadlift - RDL)',
            nameEn: 'Romanian Deadlift (RDL)',
            category: 'legs',
            equipment: 'barbell',
            suggestedSets: 3,
            suggestedReps: 10
        },
        {
            id: 'ex-leg-extension',
            nameAr: 'رفرفة أمامية للأرجل بالجهاز (Leg Extension)',
            nameEn: 'Leg Extension',
            category: 'legs',
            equipment: 'machine',
            suggestedSets: 3,
            suggestedReps: 12
        },
        {
            id: 'ex-leg-curl',
            nameAr: 'كيرل أرجل خلفي بالجهاز (Lying / Seated Leg Curl)',
            nameEn: 'Hamstring Leg Curl',
            category: 'legs',
            equipment: 'machine',
            suggestedSets: 3,
            suggestedReps: 12
        },
        {
            id: 'ex-calf-raise',
            nameAr: 'رفع السمانة واقفاً (Standing Calf Raises)',
            nameEn: 'Standing Calf Raises',
            category: 'legs',
            equipment: 'machine',
            suggestedSets: 4,
            suggestedReps: 15
        },

        // --- SHOULDERS ---
        {
            id: 'ex-overhead-press',
            nameAr: 'ضغط أكتاف بالبار واقفاً (Overhead Barbell Press)',
            nameEn: 'Overhead Barbell Press',
            category: 'shoulders',
            equipment: 'barbell',
            suggestedSets: 4,
            suggestedReps: 8
        },
        {
            id: 'ex-db-shoulder-press',
            nameAr: 'ضغط أكتاف بالدمبلز جالساً (Seated Dumbbell Press)',
            nameEn: 'Seated Dumbbell Shoulder Press',
            category: 'shoulders',
            equipment: 'dumbbell',
            suggestedSets: 3,
            suggestedReps: 10
        },
        {
            id: 'ex-lateral-raise',
            nameAr: 'رفرفة جانبي بالدمبلز للكتف الأوسط (Dumbbell Lateral Raise)',
            nameEn: 'Dumbbell Lateral Raises',
            category: 'shoulders',
            equipment: 'dumbbell',
            suggestedSets: 4,
            suggestedReps: 12
        },
        {
            id: 'ex-face-pull',
            nameAr: 'سحب للوجه بالكيبل للكتف الخلفي (Face Pulls)',
            nameEn: 'Rope Face Pulls',
            category: 'shoulders',
            equipment: 'cable',
            suggestedSets: 3,
            suggestedReps: 15
        },

        // --- ARMS ---
        {
            id: 'ex-bicep-curl',
            nameAr: 'كيرل بايسبس بالبار المزدوج (Barbell Bicep Curl)',
            nameEn: 'Barbell Bicep Curl',
            category: 'arms',
            equipment: 'barbell',
            suggestedSets: 3,
            suggestedReps: 10
        },
        {
            id: 'ex-hammer-curl',
            nameAr: 'هامر كيرل بالدمبلز (Dumbbell Hammer Curls)',
            nameEn: 'Dumbbell Hammer Curls',
            category: 'arms',
            equipment: 'dumbbell',
            suggestedSets: 3,
            suggestedReps: 12
        },
        {
            id: 'ex-tricep-pushdown',
            nameAr: 'ترايسبس بوش داون بالحبل (Tricep Rope Pushdown)',
            nameEn: 'Tricep Rope Pushdown',
            category: 'arms',
            equipment: 'cable',
            suggestedSets: 3,
            suggestedReps: 12
        },
        {
            id: 'ex-skull-crushers',
            nameAr: 'بار فرنسي مستلقي للترايسبس (Skull Crushers)',
            nameEn: 'EZ Bar Skull Crushers',
            category: 'arms',
            equipment: 'barbell',
            suggestedSets: 3,
            suggestedReps: 10
        },

        // --- CORE ---
        {
            id: 'ex-plank',
            nameAr: 'تمرين البلانك الثابت (Plank)',
            nameEn: 'Isometric Plank',
            category: 'core',
            equipment: 'bodyweight',
            suggestedSets: 3,
            suggestedReps: 60
        },
        {
            id: 'ex-hanging-leg-raise',
            nameAr: 'رفع أرجل معلق على العقلة (Hanging Leg Raises)',
            nameEn: 'Hanging Leg Raises',
            category: 'core',
            equipment: 'bodyweight',
            suggestedSets: 3,
            suggestedReps: 12
        },
        {
            id: 'ex-cable-crunch',
            nameAr: 'كرانشيز بطن بالكيبل (Cable Kneeling Crunch)',
            nameEn: 'Cable Kneeling Crunch',
            category: 'core',
            equipment: 'cable',
            suggestedSets: 3,
            suggestedReps: 15
        },
        // --- EXTRA POPULAR STAPLES ---
        {
            id: 'ex-incline-barbell-press',
            nameAr: 'بنش برس عالي بالبار (Incline Barbell Bench Press)',
            nameEn: 'Incline Barbell Bench Press',
            category: 'chest',
            equipment: 'barbell',
            suggestedSets: 4,
            suggestedReps: 8
        },
        {
            id: 'ex-dumbbell-flyes',
            nameAr: 'تفتيح بالدمبلز مستوي (Flat Dumbbell Flyes)',
            nameEn: 'Flat Dumbbell Flyes',
            category: 'chest',
            equipment: 'dumbbell',
            suggestedSets: 3,
            suggestedReps: 12
        },
        {
            id: 'ex-tbar-row',
            nameAr: 'تجديف تي-بار للظهر (T-Bar Row)',
            nameEn: 'T-Bar Row',
            category: 'back',
            equipment: 'barbell',
            suggestedSets: 4,
            suggestedReps: 10
        },
        {
            id: 'ex-sumo-deadlift',
            nameAr: 'ديدليفت سومو (Sumo Deadlift)',
            nameEn: 'Sumo Deadlift',
            category: 'back',
            equipment: 'barbell',
            suggestedSets: 4,
            suggestedReps: 6
        },
        {
            id: 'ex-walking-lunges',
            nameAr: 'طعنات المشي بالدمبلز (Walking Lunges)',
            nameEn: 'Dumbbell Walking Lunges',
            category: 'legs',
            equipment: 'dumbbell',
            suggestedSets: 3,
            suggestedReps: 12
        },
        {
            id: 'ex-hack-squat',
            nameAr: 'هاك سكوات على الجهاز (Hack Squat)',
            nameEn: 'Machine Hack Squat',
            category: 'legs',
            equipment: 'machine',
            suggestedSets: 4,
            suggestedReps: 10
        },
        {
            id: 'ex-seated-calf-raise',
            nameAr: 'رفع السمانة جالساً (Seated Calf Raise)',
            nameEn: 'Seated Calf Raise',
            category: 'legs',
            equipment: 'machine',
            suggestedSets: 4,
            suggestedReps: 15
        },
        {
            id: 'ex-rear-delt-fly',
            nameAr: 'رفرفة كتف خلفي بالدمبلز (Rear Delt Dumbbell Fly)',
            nameEn: 'Rear Delt Dumbbell Fly',
            category: 'shoulders',
            equipment: 'dumbbell',
            suggestedSets: 4,
            suggestedReps: 15
        },
        {
            id: 'ex-arnold-press',
            nameAr: 'أرنولد برس للأكتاف (Arnold Dumbbell Press)',
            nameEn: 'Arnold Dumbbell Press',
            category: 'shoulders',
            equipment: 'dumbbell',
            suggestedSets: 3,
            suggestedReps: 10
        },
        {
            id: 'ex-preacher-curl',
            nameAr: 'بريتشر كيرل على الدكة (Preacher Curl)',
            nameEn: 'Preacher Bicep Curl',
            category: 'arms',
            equipment: 'barbell',
            suggestedSets: 3,
            suggestedReps: 10
        },
        {
            id: 'ex-dips-tricep',
            nameAr: 'متوازي تركيز ترايسبس (Tricep Dips)',
            nameEn: 'Bodyweight Tricep Dips',
            category: 'arms',
            equipment: 'bodyweight',
            suggestedSets: 3,
            suggestedReps: 12
        },
        {
            id: 'ex-ab-wheel',
            nameAr: 'تمرين عجلة البطن (Ab Wheel Rollout)',
            nameEn: 'Ab Wheel Rollout',
            category: 'core',
            equipment: 'bodyweight',
            suggestedSets: 3,
            suggestedReps: 10
        },
        {
            id: 'ex-russian-twist',
            nameAr: 'تمرين الروسيان تويست (Russian Twist)',
            nameEn: 'Russian Twist',
            category: 'core',
            equipment: 'bodyweight',
            suggestedSets: 3,
            suggestedReps: 20
        }
    ],

    /**
     * Get exercises filtered by category or search term
     */
    search(query = '', category = 'all') {
        let results = this.items;
        if (category && category !== 'all') {
            results = results.filter(item => item.category === category);
        }
        if (query && query.trim()) {
            const q = query.trim().toLowerCase();
            results = results.filter(item => {
                return item.nameAr.toLowerCase().includes(q) || item.nameEn.toLowerCase().includes(q);
            });
        }
        return results;
    }
};
