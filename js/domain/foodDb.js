/**
 * Gym Evolution - Nutritional Food Database & Search Engine (Global Scope)
 */

window.GymEvo = window.GymEvo || {};

window.GymEvo.FoodDb = {
    // Standard baseline per 100g or standard unit
    items: [
        {
            id: 'f-chicken-breast',
            nameAr: 'صدور دجاج مشوية',
            nameEn: 'Grilled Chicken Breast',
            category: 'protein',
            categoryAr: 'مصادر البروتين',
            defaultServingGrams: 150,
            per100g: { calories: 165, protein: 31, carbs: 0, fat: 3.6 }
        },
        {
            id: 'f-white-rice',
            nameAr: 'أرز بسمتي / أبيض مطبوخ',
            nameEn: 'Cooked White Basmati Rice',
            category: 'carbs',
            categoryAr: 'الكربوهيدرات',
            defaultServingGrams: 150,
            per100g: { calories: 130, protein: 2.7, carbs: 28.2, fat: 0.3 }
        },
        {
            id: 'f-boiled-egg',
            nameAr: 'بيض مسلوق (حبة كاملة)',
            nameEn: 'Boiled Egg (Whole)',
            category: 'protein',
            categoryAr: 'مصادر البروتين',
            defaultServingGrams: 50,
            per100g: { calories: 155, protein: 12.6, carbs: 1.1, fat: 10.6 }
        },
        {
            id: 'f-egg-whites',
            nameAr: 'بياض بيض',
            nameEn: 'Egg Whites',
            category: 'protein',
            categoryAr: 'مصادر البروتين',
            defaultServingGrams: 100,
            per100g: { calories: 52, protein: 11, carbs: 0.7, fat: 0.2 }
        },
        {
            id: 'f-rolled-oats',
            nameAr: 'شوفان كامل الحبة',
            nameEn: 'Rolled Oats (Dry)',
            category: 'carbs',
            categoryAr: 'الكربوهيدرات',
            defaultServingGrams: 60,
            per100g: { calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9 }
        },
        {
            id: 'f-tuna-water',
            nameAr: 'تونة معلبة في ماء',
            nameEn: 'Canned Tuna in Water',
            category: 'protein',
            categoryAr: 'مصادر البروتين',
            defaultServingGrams: 120,
            per100g: { calories: 116, protein: 26, carbs: 0, fat: 1 }
        },
        {
            id: 'f-grilled-salmon',
            nameAr: 'سلمون فيليه مشوي',
            nameEn: 'Grilled Salmon Fillet',
            category: 'protein',
            categoryAr: 'مصادر البروتين',
            defaultServingGrams: 150,
            per100g: { calories: 206, protein: 22, carbs: 0, fat: 12.3 }
        },
        {
            id: 'f-lean-beef',
            nameAr: 'لحم بقري مفروم قليل الدهن (95/5)',
            nameEn: 'Lean Ground Beef (95/5)',
            category: 'protein',
            categoryAr: 'مصادر البروتين',
            defaultServingGrams: 150,
            per100g: { calories: 172, protein: 26.5, carbs: 0, fat: 6.8 }
        },
        {
            id: 'f-sweet-potato',
            nameAr: 'بطاطا حلوة مشوية',
            nameEn: 'Baked Sweet Potato',
            category: 'carbs',
            categoryAr: 'الكربوهيدرات',
            defaultServingGrams: 200,
            per100g: { calories: 86, protein: 1.6, carbs: 20.1, fat: 0.1 }
        },
        {
            id: 'f-boiled-potato',
            nameAr: 'بطاطس مسلوقة',
            nameEn: 'Boiled White Potato',
            category: 'carbs',
            categoryAr: 'الكربوهيدرات',
            defaultServingGrams: 200,
            per100g: { calories: 87, protein: 1.9, carbs: 20.1, fat: 0.1 }
        },
        {
            id: 'f-whey-protein',
            nameAr: 'واي بروتين (سكوب بودرة)',
            nameEn: 'Whey Protein Powder',
            category: 'protein',
            categoryAr: 'المكملات والبروتين',
            defaultServingGrams: 30,
            per100g: { calories: 400, protein: 80, carbs: 8, fat: 4 }
        },
        {
            id: 'f-greek-yogurt',
            nameAr: 'زبادي يوناني خالي الدسم',
            nameEn: 'Non-Fat Greek Yogurt',
            category: 'protein',
            categoryAr: 'مصادر البروتين',
            defaultServingGrams: 170,
            per100g: { calories: 59, protein: 10.3, carbs: 3.6, fat: 0.4 }
        },
        {
            id: 'f-cottage-cheese',
            nameAr: 'جبن قريش قليل الدسم',
            nameEn: 'Low-Fat Cottage Cheese',
            category: 'protein',
            categoryAr: 'مصادر البروتين',
            defaultServingGrams: 150,
            per100g: { calories: 86, protein: 12.4, carbs: 3.4, fat: 2.1 }
        },
        {
            id: 'f-peanut-butter',
            nameAr: 'زبدة فول سوداني طبيعية',
            nameEn: 'Natural Peanut Butter',
            category: 'fat',
            categoryAr: 'الدهون الصحية',
            defaultServingGrams: 32,
            per100g: { calories: 588, protein: 25, carbs: 20, fat: 50 }
        },
        {
            id: 'f-olive-oil',
            nameAr: 'زيت زيتون بكر ممتاز',
            nameEn: 'Extra Virgin Olive Oil',
            category: 'fat',
            categoryAr: 'الدهون الصحية',
            defaultServingGrams: 14,
            per100g: { calories: 884, protein: 0, carbs: 0, fat: 100 }
        },
        {
            id: 'f-almonds',
            nameAr: 'لوز نيء / مكسرات مشكلة',
            nameEn: 'Raw Almonds',
            category: 'fat',
            categoryAr: 'الدهون الصحية',
            defaultServingGrams: 30,
            per100g: { calories: 579, protein: 21.2, carbs: 21.6, fat: 49.9 }
        },
        {
            id: 'f-banana',
            nameAr: 'موز طازج',
            nameEn: 'Fresh Banana',
            category: 'fruits',
            categoryAr: 'الفواكه والخضار',
            defaultServingGrams: 120,
            per100g: { calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3 }
        },
        {
            id: 'f-apple',
            nameAr: 'تفاح طازج',
            nameEn: 'Fresh Apple',
            category: 'fruits',
            categoryAr: 'الفواكه والخضار',
            defaultServingGrams: 150,
            per100g: { calories: 52, protein: 0.3, carbs: 13.8, fat: 0.2 }
        },
        {
            id: 'f-avocado',
            nameAr: 'أفوكادو طازج',
            nameEn: 'Fresh Avocado',
            category: 'fat',
            categoryAr: 'الدهون الصحية',
            defaultServingGrams: 100,
            per100g: { calories: 160, protein: 2, carbs: 8.5, fat: 14.7 }
        },
        {
            id: 'f-pasta',
            nameAr: 'مكرونة مسلوقة',
            nameEn: 'Cooked Pasta',
            category: 'carbs',
            categoryAr: 'الكربوهيدرات',
            defaultServingGrams: 150,
            per100g: { calories: 158, protein: 5.8, carbs: 30.9, fat: 0.9 }
        },
        {
            id: 'f-brown-bread',
            nameAr: 'خبز توست أسمر كامل القمح',
            nameEn: 'Whole Wheat Bread Slice',
            category: 'carbs',
            categoryAr: 'الكربوهيدرات',
            defaultServingGrams: 40,
            per100g: { calories: 247, protein: 13, carbs: 41, fat: 3.4 }
        },
        {
            id: 'f-broccoli',
            nameAr: 'بروكلي مسلوق أو على البخار',
            nameEn: 'Steamed Broccoli',
            category: 'fruits',
            categoryAr: 'الفواكه والخضار',
            defaultServingGrams: 100,
            per100g: { calories: 35, protein: 2.4, carbs: 7.2, fat: 0.4 }
        },
        {
            id: 'f-foul-mudammas',
            nameAr: 'فول مدمس مسلوق',
            nameEn: 'Fava Beans / Foul',
            category: 'carbs',
            categoryAr: 'الكربوهيدرات والبروتين',
            defaultServingGrams: 150,
            per100g: { calories: 110, protein: 7.6, carbs: 19.8, fat: 0.4 }
        },
        {
            id: 'f-cooked-lentils',
            nameAr: 'عدس أصفر / بني مطبوخ',
            nameEn: 'Cooked Lentils',
            category: 'carbs',
            categoryAr: 'الكربوهيدرات والبروتين',
            defaultServingGrams: 150,
            per100g: { calories: 116, protein: 9, carbs: 20.1, fat: 0.4 }
        },
        {
            id: 'f-quinoa',
            nameAr: 'كينوا مطبوخة',
            nameEn: 'Cooked Quinoa',
            category: 'carbs',
            categoryAr: 'الكربوهيدرات',
            defaultServingGrams: 150,
            per100g: { calories: 120, protein: 4.4, carbs: 21.3, fat: 1.9 }
        },
        {
            id: 'f-dates',
            nameAr: 'تمر سكري / مجدول',
            nameEn: 'Medjool Dates',
            category: 'fruits',
            categoryAr: 'الفواكه والخضار',
            defaultServingGrams: 40,
            per100g: { calories: 277, protein: 1.8, carbs: 75, fat: 0.2 }
        },
        {
            id: 'f-turkey-breast',
            nameAr: 'صدر ديك رومي مدخن (تركي)',
            nameEn: 'Smoked Turkey Breast',
            category: 'protein',
            categoryAr: 'مصادر البروتين',
            defaultServingGrams: 100,
            per100g: { calories: 104, protein: 22, carbs: 1.5, fat: 1 }
        },
        {
            id: 'f-shrimp',
            nameAr: 'جمبري (روبيان) مشوي أو مسلوق',
            nameEn: 'Grilled Shrimp',
            category: 'protein',
            categoryAr: 'مصادر البروتين',
            defaultServingGrams: 150,
            per100g: { calories: 99, protein: 24, carbs: 0.2, fat: 0.3 }
        },
        {
            id: 'f-beef-steak',
            nameAr: 'ستيك لحم بقري فيليه مشوي',
            nameEn: 'Grilled Beef Tenderloin Steak',
            category: 'protein',
            categoryAr: 'مصادر البروتين',
            defaultServingGrams: 180,
            per100g: { calories: 210, protein: 28, carbs: 0, fat: 10 }
        },
        {
            id: 'f-labneh-light',
            nameAr: 'لبنة قليلة الدسم',
            nameEn: 'Low-Fat Labneh',
            category: 'protein',
            categoryAr: 'مصادر البروتين',
            defaultServingGrams: 100,
            per100g: { calories: 105, protein: 9, carbs: 4.5, fat: 5 }
        },
        {
            id: 'f-walnuts',
            nameAr: 'عين جمل (جوز)',
            nameEn: 'Walnuts',
            category: 'fat',
            categoryAr: 'الدهون الصحية',
            defaultServingGrams: 30,
            per100g: { calories: 654, protein: 15.2, carbs: 13.7, fat: 65.2 }
        },
        {
            id: 'f-chia-seeds',
            nameAr: 'بذور الشيا الكاملة',
            nameEn: 'Chia Seeds',
            category: 'fat',
            categoryAr: 'الدهون الصحية',
            defaultServingGrams: 20,
            per100g: { calories: 486, protein: 16.5, carbs: 42.1, fat: 30.7 }
        },
        {
            id: 'f-berries',
            nameAr: 'توت أزرق (بلوبيري) طازج',
            nameEn: 'Fresh Blueberries',
            category: 'fruits',
            categoryAr: 'الفواكه والخضار',
            defaultServingGrams: 100,
            per100g: { calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3 }
        },
        {
            id: 'f-strawberries',
            nameAr: 'فراولة طازجة',
            nameEn: 'Fresh Strawberries',
            category: 'fruits',
            categoryAr: 'الفواكه والخضار',
            defaultServingGrams: 150,
            per100g: { calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3 }
        },
        {
            id: 'f-skim-milk',
            nameAr: 'حليب قليل الدسم (1.5%)',
            nameEn: 'Low-Fat Milk',
            category: 'protein',
            categoryAr: 'المشروبات والألبان',
            defaultServingGrams: 200,
            per100g: { calories: 47, protein: 3.4, carbs: 4.8, fat: 1.5 }
        },
        {
            id: 'f-raw-honey',
            nameAr: 'عسل نحل طبيعي',
            nameEn: 'Natural Pure Honey',
            category: 'carbs',
            categoryAr: 'الكربوهيدرات',
            defaultServingGrams: 20,
            per100g: { calories: 304, protein: 0.3, carbs: 82.4, fat: 0 }
        }
    ],

    /**
     * Search foods by Arabic or English query
     * @param {string} query
     * @returns {Array} List of matched food items
     */
    search(query) {
        if (!query || !query.trim()) return this.items.slice(0, 10);
        const q = query.trim().toLowerCase();
        return this.items.filter(item => {
            return item.nameAr.toLowerCase().includes(q) || item.nameEn.toLowerCase().includes(q);
        });
    },

    /**
     * Calculate exact calories and macros for a chosen gram amount
     * @param {Object} foodItem
     * @param {number} grams
     */
    calculateForGrams(foodItem, grams) {
        const factor = grams / 100;
        return {
            calories: Math.round(foodItem.per100g.calories * factor),
            protein: parseFloat((foodItem.per100g.protein * factor).toFixed(1)),
            carbs: parseFloat((foodItem.per100g.carbs * factor).toFixed(1)),
            fat: parseFloat((foodItem.per100g.fat * factor).toFixed(1))
        };
    }
};
