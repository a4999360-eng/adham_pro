/**
 * Gym Evolution - Nutrition & BMR Calculator UI View Driver (Global Scope)
 */

window.GymEvo = window.GymEvo || {};

window.GymEvo.renderNutrition = function(repo, container) {
    const user = repo.getUser();
    let selectedDate = new Date();

    function updateView() {
        const meals = repo.getMealsByDate(selectedDate);
        
        // 1. Math calculations (from global scope)
        const bmr = window.GymEvo.calculateBMR(user.gender, user.weight, user.height, user.age);
        const tdee = window.GymEvo.calculateTDEE(bmr, user.activityLevel);
        const targetCalories = user.customCalories || window.GymEvo.calculateTargetCalories(tdee, user.goal);
        const targetMacros = user.customMacros || window.GymEvo.calculateMacros(targetCalories, user.weight);

        // Sum eaten today
        let eatenCals = 0;
        let eatenProtein = 0;
        let eatenCarbs = 0;
        let eatenFat = 0;
        meals.forEach(m => {
            eatenCals += m.calories;
            eatenProtein += m.protein;
            eatenCarbs += m.carbs;
            eatenFat += m.fat;
        });

        const calPct = Math.min(100, Math.round((eatenCals / targetCalories) * 100)) || 0;

        const isImperial = window.GymEvo.Units && window.GymEvo.Units.getSystem() === 'imperial';
        const weightUnit = window.GymEvo.Units ? window.GymEvo.Units.getWeightUnit() : 'كجم';
        const lengthUnit = window.GymEvo.Units ? window.GymEvo.Units.getLengthUnit() : 'سم';
        const displayWeight = isImperial ? window.GymEvo.Units.kgToLb(user.weight) : user.weight;
        const displayHeight = isImperial ? window.GymEvo.Units.cmToIn(user.height) : user.height;

        container.innerHTML = `
            <div class="view-header">
                <div class="view-header-title">
                    <h1>محرك السعرات والتغذية 🍎</h1>
                    <p>احسب معدل الحرق اليومي وقم بتتبع وجباتك بدقة متناهية.</p>
                </div>
            </div>

            <div class="dashboard-grid">
                <!-- Left Column: Body Math & Target Setting -->
                <div class="card col-5">
                    <div class="card-header">
                        <div class="card-title">حاسبة السعرات والماكروز الذكية</div>
                    </div>
                    
                    <form id="bmr-calc-form">
                        <div class="form-group">
                            <label>الجنس</label>
                            <select id="calc-gender">
                                <option value="male" ${user.gender === 'male' ? 'selected' : ''}>ذكر</option>
                                <option value="female" ${user.gender === 'female' ? 'selected' : ''}>أنثى</option>
                            </select>
                        </div>

                        <div class="input-row">
                            <div class="form-group">
                                <label>الوزن الحالي (${weightUnit})</label>
                                <input type="number" step="0.1" id="calc-weight" value="${displayWeight}" min="${isImperial ? 60 : 30}" max="${isImperial ? 550 : 250}" required>
                            </div>
                            <div class="form-group">
                                <label>الطول (${lengthUnit})</label>
                                <input type="number" step="0.1" id="calc-height" value="${displayHeight}" min="${isImperial ? 40 : 100}" max="${isImperial ? 100 : 250}" required>
                            </div>
                        </div>

                        <div class="input-row">
                            <div class="form-group">
                                <label>العمر (سنوات)</label>
                                <input type="number" id="calc-age" value="${user.age}" min="10" max="100" required>
                            </div>
                            <div class="form-group">
                                <label>مستوى النشاط البدني</label>
                                <select id="calc-activity">
                                    <option value="sedentary" ${user.activityLevel === 'sedentary' ? 'selected' : ''}>خامل (مكتب/بلا تمرين)</option>
                                    <option value="light" ${user.activityLevel === 'light' ? 'selected' : ''}>نشاط خفيف (تمرين 1-3 أيام)</option>
                                    <option value="moderate" ${user.activityLevel === 'moderate' ? 'selected' : ''}>نشاط متوسط (تمرين 3-5 أيام)</option>
                                    <option value="active" ${user.activityLevel === 'active' ? 'selected' : ''}>نشاط عالٍ (تمرين 6-7 أيام)</option>
                                    <option value="extra" ${user.activityLevel === 'extra' ? 'selected' : ''}>نشاط فائق (تمرين مرتين باليوم)</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>الهدف البدني</label>
                            <select id="calc-goal">
                                <option value="lose" ${user.goal === 'lose' ? 'selected' : ''}>إنقاص الوزن (تنشيف / Caloric Deficit)</option>
                                <option value="maintain" ${user.goal === 'maintain' ? 'selected' : ''}>المحافظة على الوزن (ثبات / Maintenance)</option>
                                <option value="gain" ${user.goal === 'gain' ? 'selected' : ''}>زيادة الوزن (تضخيم عضل / Caloric Surplus)</option>
                            </select>
                        </div>

                        <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 0.5rem;">
                            <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                                <span style="color: var(--text-secondary);">معدل الحرق الأساسي BMR:</span>
                                <span style="font-weight: 600;">${Math.round(bmr)} kcal</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                                <span style="color: var(--text-secondary);">إجمالي الحرق اليومي TDEE:</span>
                                <span style="font-weight: 600;">${Math.round(tdee)} kcal</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: 0.9rem; font-weight: 700; color: var(--accent-blue); padding-top: 0.25rem; border-top: 1px dashed var(--border-color);">
                                <span>السعرات المستهدفة:</span>
                                <span>${targetCalories} kcal</span>
                            </div>
                        </div>

                        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1.25rem;">
                            تحديث الحسابات وحفظ البيانات
                        </button>
                    </form>
                </div>

                <!-- Right Column: Meal Logging Diary -->
                <div class="card col-7">
                    <div class="card-header">
                        <div>
                            <div class="card-title">سجل التغذية اليومي</div>
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.25rem;">
                                <button class="btn-icon" id="prev-date-btn" title="اليوم السابق" style="padding: 0.2rem; display: inline-flex; align-items: center; justify-content: center;">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                </button>
                                <span class="card-subtitle" id="selected-date-display" style="font-weight: 600; color: var(--text-primary);">
                                    ${selectedDate.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </span>
                                <button class="btn-icon" id="next-date-btn" title="اليوم التالي" style="padding: 0.2rem; display: inline-flex; align-items: center; justify-content: center;">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                                </button>
                            </div>
                        </div>
                        <button class="btn btn-secondary btn-sm" id="add-meal-modal-btn">
                            + إضافة وجبة
                        </button>
                    </div>

                    <!-- Progress bar -->
                    <div style="margin-bottom: 1.5rem;">
                        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.5rem;">
                            <span>مجموع السعرات المستهلكة</span>
                            <span style="font-weight: 600;">${eatenCals} / ${targetCalories} سعرة</span>
                        </div>
                        <div class="progress-bar-container" style="height: 8px;">
                            <div class="progress-bar-fill ${calPct > 100 ? 'coral' : ''}" style="width: ${calPct}%;"></div>
                        </div>
                    </div>

                    <!-- Macros Progress Row -->
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem; padding-bottom: 1.25rem; border-bottom: 1px dashed var(--border-color);">
                        <!-- Protein Progress -->
                        <div>
                            <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 0.4rem;">
                                <span style="font-weight: 600;">البروتين</span>
                                <span style="color: var(--text-secondary); font-size: 0.75rem;">${eatenProtein}g / ${targetMacros.protein}g</span>
                            </div>
                            <div class="progress-bar-container" style="height: 6px;">
                                <div class="progress-bar-fill" style="width: ${Math.min(100, Math.round((eatenProtein / targetMacros.protein) * 100)) || 0}%;"></div>
                            </div>
                        </div>

                        <!-- Carbs Progress -->
                        <div>
                            <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 0.4rem;">
                                <span style="font-weight: 600;">الكربوهيدرات</span>
                                <span style="color: var(--text-secondary); font-size: 0.75rem;">${eatenCarbs}g / ${targetMacros.carbs}g</span>
                            </div>
                            <div class="progress-bar-container" style="height: 6px;">
                                <div class="progress-bar-fill mint" style="width: ${Math.min(100, Math.round((eatenCarbs / targetMacros.carbs) * 100)) || 0}%;"></div>
                            </div>
                        </div>

                        <!-- Fats Progress -->
                        <div>
                            <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 0.4rem;">
                                <span style="font-weight: 600;">الدهون</span>
                                <span style="color: var(--text-secondary); font-size: 0.75rem;">${eatenFat}g / ${targetMacros.fat}g</span>
                            </div>
                            <div class="progress-bar-container" style="height: 6px;">
                                <div class="progress-bar-fill orange" style="width: ${Math.min(100, Math.round((eatenFat / targetMacros.fat) * 100)) || 0}%;"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Meal List -->
                    <div style="border-top: 1px solid var(--border-color); margin-top: 1rem;">
                        ${meals.length === 0 ? `
                            <div class="empty-state">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                                <p class="empty-state-title">لا توجد وجبات مسجلة بعد</p>
                                <p class="empty-state-desc">لم تسجل أي طعام لهذا اليوم.</p>
                            </div>
                        ` : `
                            <div style="display: flex; flex-direction: column;">
                                ${meals.map(meal => `
                                    <div class="meal-list-item">
                                        <div class="meal-info">
                                            <div class="meal-name-text">${meal.name}</div>
                                            <div class="meal-macros-text">بروتين: ${meal.protein}g | كارب: ${meal.carbs}g | دهون: ${meal.fat}g</div>
                                        </div>
                                        <div class="meal-cal-wrap">
                                            <div class="meal-cal-val">${meal.calories}</div>
                                            <div class="meal-cal-lbl">سعرة</div>
                                        </div>
                                        <button class="btn-icon delete-meal-btn" data-id="${meal.id}" title="حذف الوجبة">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-coral)" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                        </button>
                                    </div>
                                `).join('')}
                            </div>
                        `}
                    </div>
                </div>
            </div>

            <!-- Modal for Adding Meals -->
            <div class="modal-overlay" id="meal-modal">
                <div class="modal-content modal-content-lg">
                    <div class="modal-header">
                        <h2>تسجيل وجبة جديدة</h2>
                        <button class="btn-icon" id="close-meal-modal-btn" style="font-size: 1.5rem;">&times;</button>
                    </div>

                    <!-- Smart Food Database Search Bar -->
                    <div class="food-search-section">
                        <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.45rem;">
                            🔍 البحث الذكي في قاعدة الأطعمة (تعبئة تلقائية فورية):
                        </label>
                        <div style="position: relative;">
                            <input type="text" id="food-db-search" placeholder="اكتب اسم الطعام (مثال: صدور دجاج، أرز، بيض، شوفان، تونة...)" autocomplete="off">
                            <div id="food-search-dropdown" class="food-search-results" style="display: none;"></div>
                        </div>

                        <!-- Quantity Selector (Visible when food is picked) -->
                        <div id="portion-selector-box" class="portion-box" style="display: none;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                <span style="font-size: 0.85rem; font-weight: 600;" id="selected-food-title">اسم الطعام المختار</span>
                                <span style="font-size: 0.75rem; color: var(--text-secondary);" id="selected-food-meta">قيم لكل 100 جم</span>
                            </div>
                            <div style="display: flex; gap: 0.75rem; align-items: center;">
                                <div style="flex: 1;">
                                    <label style="font-size: 0.75rem; color: var(--text-secondary);">الكمية بالجرام (g):</label>
                                    <input type="number" id="food-amount-grams" value="100" min="5" max="1000" step="5">
                                </div>
                                <div class="btn-group" style="margin-top: 1.1rem;">
                                    <button type="button" class="btn btn-secondary btn-sm quick-gram-btn" data-g="50">50g</button>
                                    <button type="button" class="btn btn-secondary btn-sm quick-gram-btn" data-g="100">100g</button>
                                    <button type="button" class="btn btn-secondary btn-sm quick-gram-btn" data-g="150">150g</button>
                                    <button type="button" class="btn btn-secondary btn-sm quick-gram-btn" data-g="200">200g</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Quick Preset Templates -->
                    <div style="margin: 1rem 0;">
                        <label style="display: block; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.4rem; color: var(--text-secondary);">أو اختر نموذجاً سريعاً جاهزاً:</label>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
                            <button type="button" class="btn btn-secondary preset-meal-btn" data-name="بيض مسلوق (3 حبات)" data-cals="230" data-prot="19" data-carbs="1" data-fat="16" style="padding: 0.35rem 0.65rem; font-size: 0.75rem;">بيض مسلوق</button>
                            <button type="button" class="btn btn-secondary preset-meal-btn" data-name="صدور دجاج (200جم) وأرز بسمتي" data-cals="550" data-prot="55" data-carbs="60" data-fat="8" style="padding: 0.35rem 0.65rem; font-size: 0.75rem;">دجاج وأرز</button>
                            <button type="button" class="btn btn-secondary preset-meal-btn" data-name="سكوب بروتين مع ماء" data-cals="120" data-prot="25" data-carbs="2" data-fat="1" style="padding: 0.35rem 0.65rem; font-size: 0.75rem;">واي بروتين</button>
                            <button type="button" class="btn btn-secondary preset-meal-btn" data-name="شوفان بالحليب والموز" data-cals="380" data-prot="15" data-carbs="65" data-fat="7" style="padding: 0.35rem 0.65rem; font-size: 0.75rem;">شوفان</button>
                        </div>
                    </div>

                    <form id="add-meal-form" style="border-top: 1px solid var(--border-color); padding-top: 1rem;">
                        <div class="form-group">
                            <label>اسم الوجبة</label>
                            <input type="text" id="meal-name" placeholder="مثال: صدور دجاج مشوية مع أرز" required>
                        </div>

                        <div class="form-group">
                            <label>السعرات الحرارية (kcal)</label>
                            <input type="number" id="meal-calories" placeholder="0" min="0" required>
                        </div>

                        <div class="input-row">
                            <div class="form-group">
                                <label>بروتين (جرام)</label>
                                <input type="number" id="meal-protein" placeholder="0" min="0" required>
                            </div>
                            <div class="form-group">
                                <label>كربوهيدرات (جرام)</label>
                                <input type="number" id="meal-carbs" placeholder="0" min="0" required>
                            </div>
                            <div class="form-group">
                                <label>دهون (جرام)</label>
                                <input type="number" id="meal-fat" placeholder="0" min="0" required>
                            </div>
                        </div>

                        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">
                            إضافة الوجبة للسجل
                        </button>
                    </form>
                </div>
            </div>
        `;

        setupFormListeners();
    }

    function setupFormListeners() {
        const bmrForm = document.getElementById('bmr-calc-form');
        bmrForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const isImperial = window.GymEvo.Units && window.GymEvo.Units.getSystem() === 'imperial';
            const enteredWeight = parseFloat(document.getElementById('calc-weight').value);
            const enteredHeight = parseFloat(document.getElementById('calc-height').value);

            user.gender = document.getElementById('calc-gender').value;
            user.weight = isImperial ? (window.GymEvo.Units.lbToKg(enteredWeight) || enteredWeight) : enteredWeight;
            user.height = isImperial ? (window.GymEvo.Units.inToCm(enteredHeight) || enteredHeight) : enteredHeight;
            user.age = parseInt(document.getElementById('calc-age').value);
            user.activityLevel = document.getElementById('calc-activity').value;
            user.goal = document.getElementById('calc-goal').value;

            user.customCalories = null;
            user.customMacros = null;

            repo.saveUser(user);
            window.GymEvo.notifier.success('تم تحديث البيانات الحيوية بنجاح!', 'تمت إعادة حساب معدلات الحرق والماكروز تلقائياً.');
            updateView();
        });

        const modal = document.getElementById('meal-modal');
        const openModalBtn = document.getElementById('add-meal-modal-btn');
        const closeModalBtn = document.getElementById('close-meal-modal-btn');

        if (openModalBtn) {
            openModalBtn.addEventListener('click', () => {
                modal.style.display = 'flex';
                document.getElementById('add-meal-form').reset();
                const foodSearchInput = document.getElementById('food-db-search');
                const foodDropdown = document.getElementById('food-search-dropdown');
                const portionBox = document.getElementById('portion-selector-box');
                if (foodSearchInput) foodSearchInput.value = '';
                if (foodDropdown) foodDropdown.style.display = 'none';
                if (portionBox) portionBox.style.display = 'none';
            });
        }

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // --- Food Database Live Search & Autocomplete ---
        const foodSearchInput = document.getElementById('food-db-search');
        const foodDropdown = document.getElementById('food-search-dropdown');
        const portionBox = document.getElementById('portion-selector-box');
        const selectedFoodTitle = document.getElementById('selected-food-title');
        const selectedFoodMeta = document.getElementById('selected-food-meta');
        const foodAmountInput = document.getElementById('food-amount-grams');
        let currentSelectedFood = null;

        function renderFoodSearchResults(results) {
            if (!foodDropdown) return;
            if (!results || results.length === 0) {
                foodDropdown.innerHTML = `<div style="padding: 0.75rem; font-size: 0.8rem; color: var(--text-tertiary); text-align: center;">لم يتم العثور على أطعمة مطابقة</div>`;
                foodDropdown.style.display = 'block';
                return;
            }

            foodDropdown.innerHTML = results.map(item => `
                <div class="food-search-item" data-id="${item.id}">
                    <div>
                        <div class="food-search-item-title">${item.nameAr}</div>
                        <div class="food-search-item-sub">${item.nameEn} • ${item.categoryAr}</div>
                    </div>
                    <div class="food-search-item-macros">
                        <strong>${item.per100g.calories} kcal</strong> / 100g
                        <small>P: ${item.per100g.protein}g | C: ${item.per100g.carbs}g | F: ${item.per100g.fat}g</small>
                    </div>
                </div>
            `).join('');

            foodDropdown.style.display = 'block';

            foodDropdown.querySelectorAll('.food-search-item').forEach(itemEl => {
                itemEl.addEventListener('click', () => {
                    const foodId = itemEl.dataset.id;
                    const food = window.GymEvo.FoodDb.items.find(f => f.id === foodId);
                    if (food) {
                        currentSelectedFood = food;
                        selectFoodItem(food);
                    }
                });
            });
        }

        function selectFoodItem(food) {
            foodDropdown.style.display = 'none';
            portionBox.style.display = 'block';
            selectedFoodTitle.textContent = `${food.nameAr} (${food.nameEn})`;
            selectedFoodMeta.textContent = `100جم: ${food.per100g.calories} kcal (بروتين ${food.per100g.protein}g | كارب ${food.per100g.carbs}g | دهون ${food.per100g.fat}g)`;
            
            const defaultGrams = food.defaultServingGrams || 100;
            foodAmountInput.value = defaultGrams;
            recalcNutrients(defaultGrams);
        }

        function recalcNutrients(grams) {
            if (!currentSelectedFood) return;
            const computed = window.GymEvo.FoodDb.calculateForGrams(currentSelectedFood, grams);
            document.getElementById('meal-name').value = `${currentSelectedFood.nameAr} (${grams} جم)`;
            document.getElementById('meal-calories').value = computed.calories;
            document.getElementById('meal-protein').value = Math.round(computed.protein);
            document.getElementById('meal-carbs').value = Math.round(computed.carbs);
            document.getElementById('meal-fat').value = Math.round(computed.fat);
        }

        if (foodSearchInput) {
            foodSearchInput.addEventListener('input', () => {
                const q = foodSearchInput.value;
                if (window.GymEvo.FoodDb) {
                    const results = window.GymEvo.FoodDb.search(q);
                    renderFoodSearchResults(results);
                }
            });

            foodSearchInput.addEventListener('focus', () => {
                if (window.GymEvo.FoodDb) {
                    const results = window.GymEvo.FoodDb.search(foodSearchInput.value);
                    renderFoodSearchResults(results);
                }
            });
        }

        if (foodAmountInput) {
            foodAmountInput.addEventListener('input', () => {
                const g = parseFloat(foodAmountInput.value) || 100;
                recalcNutrients(g);
            });
        }

        document.querySelectorAll('.quick-gram-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const g = parseInt(btn.dataset.g);
                if (foodAmountInput) foodAmountInput.value = g;
                recalcNutrients(g);
            });
        });

        // Hide dropdown on click outside
        document.addEventListener('click', (e) => {
            if (foodDropdown && !e.target.closest('.food-search-section')) {
                foodDropdown.style.display = 'none';
            }
        });

        const presetBtns = document.querySelectorAll('.preset-meal-btn');
        presetBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('meal-name').value = btn.dataset.name;
                document.getElementById('meal-calories').value = btn.dataset.cals;
                document.getElementById('meal-protein').value = btn.dataset.prot;
                document.getElementById('meal-carbs').value = btn.dataset.carbs;
                document.getElementById('meal-fat').value = btn.dataset.fat;
            });
        });

        const addMealForm = document.getElementById('add-meal-form');
        addMealForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const newMeal = new window.GymEvo.Meal({
                name: document.getElementById('meal-name').value,
                calories: parseInt(document.getElementById('meal-calories').value),
                protein: parseInt(document.getElementById('meal-protein').value),
                carbs: parseInt(document.getElementById('meal-carbs').value),
                fat: parseInt(document.getElementById('meal-fat').value)
            });

            repo.saveMeal(newMeal);
            window.GymEvo.notifier.success('تمت إضافة الوجبة بنجاح', newMeal.name);
            modal.style.display = 'none';
            updateView();
        });

        const deleteBtns = document.querySelectorAll('.delete-meal-btn');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', async () => {
                const mealId = btn.dataset.id;
                const meal = repo.getMeals().find(m => m.id === mealId);
                if (meal) {
                    const ok = await window.GymEvo.confirm({
                        title: 'حذف الوجبة',
                        message: `هل أنت متأكد من حذف وجبة "${meal.name}" من سجل اليوم؟`,
                        confirmText: 'نعم، حذف الوجبة',
                        danger: true
                    });
                    if (ok) {
                        repo.deleteMeal(mealId);
                        window.GymEvo.notifier.warning('تم حذف الوجبة', meal.name);
                        updateView();
                    }
                }
            });
        });
    }

    updateView();
};
