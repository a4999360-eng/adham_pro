/**
 * Gym Evolution - Dashboard UI View Driver (Global Scope)
 */

window.GymEvo = window.GymEvo || {};

window.GymEvo.renderDashboard = function(repo, container, navigateToTab) {
    const user = repo.getUser();
    const meals = repo.getMealsByDate(new Date());
    const workouts = repo.getWorkouts();
    const metrics = repo.getMetrics();

    // 1. Math calculations (from global scope)
    const bmr = window.GymEvo.calculateBMR(user.gender, user.weight, user.height, user.age);
    const tdee = window.GymEvo.calculateTDEE(bmr, user.activityLevel);
    const calorieTarget = user.customCalories || window.GymEvo.calculateTargetCalories(tdee, user.goal);
    
    const macroTargets = user.customMacros || window.GymEvo.calculateMacros(calorieTarget, user.weight);

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

    // Workouts completed today (dynamic accurate burn calculation)
    const todayStr = new Date().toDateString();
    const completedWorkoutsToday = workouts.filter(w => w.completed && new Date(w.timestamp).toDateString() === todayStr);
    let caloriesBurned = 0;
    completedWorkoutsToday.forEach(w => {
        caloriesBurned += window.GymEvo.calculateWorkoutCaloriesBurned 
            ? window.GymEvo.calculateWorkoutCaloriesBurned(w, user.weight, w.durationMinutes || 50)
            : 350;
    });

    const remainingCals = Math.max(0, calorieTarget - eatenCals + caloriesBurned);
    const calProgressPct = Math.min(100, Math.round((eatenCals / (calorieTarget + caloriesBurned)) * 100)) || 0;

    // Get latest weight metric with active unit system (kg / lb)
    const latestMetric = metrics[metrics.length - 1];
    const rawWeight = latestMetric ? latestMetric.weight : user.weight;
    const formattedWeightObj = window.GymEvo.Units ? window.GymEvo.Units.formatWeight(rawWeight) : { formatted: `${rawWeight} kg` };
    const latestWeight = formattedWeightObj.formatted;

    // Check reminder and retention status
    let reminderBannerHtml = '';
    if (window.GymEvo.reminderManager) {
        const status = window.GymEvo.reminderManager.analyzeUserStatus();
        if (status.needsWeightReminder) {
            reminderBannerHtml = `
                <div class="card col-12 reminder-nudge-card orange">
                    <div class="nudge-content">
                        <div class="nudge-icon">⚖️</div>
                        <div>
                            <div class="nudge-title">تذكير قياس الوزن الدوري</div>
                            <div class="nudge-desc">مرت ${status.daysSinceWeight} أيام منذ آخر تسجيل لوزنك. قياس وزنك أسبوعياً يساعدك على رصد استجابة جسمك بدقة.</div>
                        </div>
                    </div>
                    <button class="btn btn-secondary btn-sm" id="nudge-track-weight-btn">تسجيل وزني الآن 👈</button>
                </div>
            `;
        } else if (status.needsMealReminder) {
            reminderBannerHtml = `
                <div class="card col-12 reminder-nudge-card blue">
                    <div class="nudge-content">
                        <div class="nudge-icon">🥗</div>
                        <div>
                            <div class="nudge-title">لم تسجل وجباتك اليوم بعد!</div>
                            <div class="nudge-desc">تسجيل وجباتك بانتظام هو العامل الحاسم للوصول لهدفك البدني دون انقطاع.</div>
                        </div>
                    </div>
                    <button class="btn btn-secondary btn-sm" id="nudge-log-meal-btn">إضافة وجبة الآن 👈</button>
                </div>
            `;
        }
    }
    
    // UI Layout HTML
    container.innerHTML = `
        <div class="view-header">
            <div class="view-header-title">
                <h1>أهلاً بك، ${user.name} 👋</h1>
                <p>إليك ملخص اليوم لتطورك البدني والتغذوي.</p>
            </div>
            <div class="header-action">
                <button class="btn btn-secondary" id="quick-ask-assistant-btn" style="border-color: var(--accent-blue); color: var(--accent-blue);">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    مساعد البطل 🦾
                </button>
                <button class="btn btn-secondary" id="quick-track-metric-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20v-8m0 0V4m0 8h8m-8 0H4"></path></svg>
                    تسجيل وزن
                </button>
                <button class="btn btn-primary" id="quick-log-meal-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    إضافة وجبة
                </button>
            </div>
        </div>

        <div class="dashboard-grid">
            ${reminderBannerHtml}
            <!-- Calorie Tracker Card -->
            <div class="card col-8">
                <div class="card-header">
                    <div>
                        <div class="card-title">ميزان السعرات اليومي</div>
                        <div class="card-subtitle">الهدف اليومي المخصص لك هو ${calorieTarget} سعرة حرارية</div>
                    </div>
                </div>
                
                <div class="daily-total-summary">
                    <!-- Progress ring -->
                    <div class="progress-ring-container">
                        <svg width="120" height="120">
                            <circle stroke="var(--border-color)" stroke-width="8" fill="transparent" r="50" cx="60" cy="60" />
                            <circle class="progress-ring-circle" stroke="var(--accent-blue)" stroke-width="8" fill="transparent" r="50" cx="60" cy="60" 
                                    stroke-dasharray="314.15" stroke-dashoffset="${314.15 - (314.15 * calProgressPct / 100)}" />
                        </svg>
                        <div class="progress-ring-text">
                            <div class="progress-ring-val">${calProgressPct}%</div>
                            <div class="progress-ring-lbl">مكتمل</div>
                        </div>
                    </div>

                    <!-- Calorie balance breakdown -->
                    <div style="flex-grow: 1; margin-inline-start: 2rem;">
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; text-align: center;">
                            <div>
                                <div style="font-size: 0.8rem; color: var(--text-secondary);">المستهدف</div>
                                <div style="font-size: 1.25rem; font-weight: 700; margin-top: 0.25rem;">${calorieTarget}</div>
                            </div>
                            <div>
                                <div style="font-size: 0.8rem; color: var(--text-secondary);">المتناول</div>
                                <div style="font-size: 1.25rem; font-weight: 700; color: var(--accent-orange); margin-top: 0.25rem;">${eatenCals}</div>
                            </div>
                            <div>
                                <div style="font-size: 0.8rem; color: var(--text-secondary);">المحروق</div>
                                <div style="font-size: 1.25rem; font-weight: 700; color: var(--accent-mint); margin-top: 0.25rem;">${caloriesBurned}</div>
                            </div>
                        </div>
                        
                        <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: 500; font-size: 0.9rem;">السعرات المتبقية لليوم:</span>
                            <span style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 700; color: var(--accent-blue);">${remainingCals} <span style="font-size: 0.8rem; font-weight: 500;">سعرة</span></span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Macros Card -->
            <div class="card col-4">
                <div class="card-header">
                    <div class="card-title">توزيع المغذيات الكبرى (Macros)</div>
                </div>
                
                <!-- Protein Progress -->
                <div style="margin-bottom: 1.25rem;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.825rem; margin-bottom: 0.4rem;">
                        <span style="font-weight: 600;">البروتين</span>
                        <span style="color: var(--text-secondary);">${eatenProtein}g / ${macroTargets.protein}g</span>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width: ${Math.min(100, (eatenProtein / macroTargets.protein) * 100)}%;"></div>
                    </div>
                </div>

                <!-- Carbs Progress -->
                <div style="margin-bottom: 1.25rem;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.825rem; margin-bottom: 0.4rem;">
                        <span style="font-weight: 600;">الكربوهيدرات</span>
                        <span style="color: var(--text-secondary);">${eatenCarbs}g / ${macroTargets.carbs}g</span>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill mint" style="width: ${Math.min(100, (eatenCarbs / macroTargets.carbs) * 100)}%;"></div>
                    </div>
                </div>

                <!-- Fats Progress -->
                <div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.825rem; margin-bottom: 0.4rem;">
                        <span style="font-weight: 600;">الدهون الصحية</span>
                        <span style="color: var(--text-secondary);">${eatenFat}g / ${macroTargets.fat}g</span>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill orange" style="width: ${Math.min(100, (eatenFat / macroTargets.fat) * 100)}%;"></div>
                    </div>
                </div>
            </div>

            <!-- Stats Rows -->
            <div class="card col-4 stat-card">
                <div>
                    <div class="stat-icon-wrap" style="color: var(--accent-mint); background-color: var(--accent-mint-soft);">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    </div>
                    <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.75rem;">معدل الأيض الأساسي (BMR)</div>
                    <div class="stat-value">${Math.round(bmr)} <span class="stat-unit">kcal</span></div>
                </div>
                <div style="font-size: 0.75rem; color: var(--text-tertiary);">معدل الحرق أثناء الراحة التامة.</div>
            </div>

            <div class="card col-4 stat-card">
                <div>
                    <div class="stat-icon-wrap" style="color: var(--accent-blue); background-color: var(--accent-blue-soft);">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" y1="8" x2="2" y2="22"></line><line x1="17.5" y1="15" x2="9" y2="15"></line></svg>
                    </div>
                    <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.75rem;">الوزن الحالي المسجل</div>
                    <div class="stat-value">${latestWeight}</div>
                </div>
                <div class="stat-change ${metrics.length > 1 ? (metrics[metrics.length-1].weight < metrics[0].weight ? 'down' : 'up') : 'flat'}">
                    ${metrics.length > 1 
                        ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="${metrics[metrics.length-1].weight < metrics[0].weight ? '23 18 13.5 8.5 8.5 13.5 1 6' : '23 6 13.5 15.5 8.5 10.5 1 18'}"></polyline></svg>
                           تغير بمقدار ${Math.abs(parseFloat((metrics[metrics.length-1].weight - metrics[0].weight).toFixed(1)))} كجم منذ البدء`
                        : 'لم يتم رصد تغيير بعد'}
                </div>
            </div>

            <div class="card col-4 stat-card">
                <div>
                    <div class="stat-icon-wrap" style="color: var(--accent-orange); background-color: #FEF3C7;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                    </div>
                    <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.75rem;">التمارين المنجزة</div>
                    <div class="stat-value">${workouts.filter(w => w.completed).length} <span class="stat-unit">جلسة</span></div>
                </div>
                <div style="font-size: 0.75rem; color: var(--text-tertiary);">مجموع الجلسات التدريبية المكتملة.</div>
            </div>

            <!-- Today's Workout Status -->
            <div class="card col-6">
                <div class="card-header">
                    <div class="card-title">تمارين اليوم</div>
                </div>
                
                ${renderTodayWorkoutSummary(workouts)}
            </div>

            <!-- Recent Meals Summary -->
            <div class="card col-6">
                <div class="card-header">
                    <div class="card-title">وجبات اليوم الأخيرة</div>
                </div>
                
                ${renderRecentMealsSummary(meals)}
            </div>
        </div>
    `;

    // 3. Attach Event Listeners
    document.getElementById('quick-track-metric-btn').addEventListener('click', () => {
        navigateToTab('evolution');
    });

    document.getElementById('quick-log-meal-btn').addEventListener('click', () => {
        navigateToTab('nutrition');
    });

    const askAssistantBtn = document.getElementById('quick-ask-assistant-btn');
    if (askAssistantBtn) {
        askAssistantBtn.addEventListener('click', () => {
            navigateToTab('assistant');
        });
    }

    const nudgeWeightBtn = document.getElementById('nudge-track-weight-btn');
    if (nudgeWeightBtn) {
        nudgeWeightBtn.addEventListener('click', () => {
            navigateToTab('evolution');
        });
    }

    const nudgeMealBtn = document.getElementById('nudge-log-meal-btn');
    if (nudgeMealBtn) {
        nudgeMealBtn.addEventListener('click', () => {
            navigateToTab('nutrition');
        });
    }

    const editWorkoutBtn = document.getElementById('dash-edit-workout-btn');
    if (editWorkoutBtn) {
        editWorkoutBtn.addEventListener('click', () => {
            navigateToTab('workout');
        });
    }
};

function renderTodayWorkoutSummary(workouts) {
    const todayStr = new Date().toDateString();
    const todayWorkout = workouts.find(w => new Date(w.timestamp).toDateString() === todayStr);

    if (!todayWorkout) {
        return `
            <div class="empty-state" style="padding: 1.5rem 1rem;">
                <p class="empty-state-title">لا توجد تمارين مجدولة لليوم</p>
                <p class="empty-state-desc">خطط لتمارينك وابدأ حصتك التدريبية الآن.</p>
                <button class="btn btn-secondary btn-sm" id="dash-edit-workout-btn">المخطط التدريبي</button>
            </div>
        `;
    }

    const totalSets = todayWorkout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
    const completedSets = todayWorkout.exercises.reduce((sum, ex) => sum + ex.sets.filter(s => s.completed).length, 0);
    const progressPct = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

    return `
        <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <span style="font-weight: 600; font-size: 1.05rem;">${todayWorkout.name}</span>
                <span class="stat-change ${todayWorkout.completed ? 'up' : 'flat'}" style="font-size: 0.8rem; background-color: ${todayWorkout.completed ? 'var(--accent-mint-soft)' : 'var(--bg-sub)'}; padding: 0.25rem 0.5rem; border-radius: var(--radius-sm);">
                    ${todayWorkout.completed ? 'مكتمل' : 'قيد التمرين'}
                </span>
            </div>
            
            <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
                المجموعات التدريبية المكتملة: ${completedSets} من أصل ${totalSets} (${progressPct}%)
            </div>
            <div class="progress-bar-container" style="margin-bottom: 1.5rem;">
                <div class="progress-bar-fill ${todayWorkout.completed ? 'mint' : ''}" style="width: ${progressPct}%;"></div>
            </div>

            <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                <button class="btn btn-secondary" id="dash-edit-workout-btn" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
                    عرض الجلسة في المخطط
                </button>
            </div>
        </div>
    `;
}

function renderRecentMealsSummary(meals) {
    if (meals.length === 0) {
        return `
            <div class="empty-state" style="padding: 1.5rem 1rem;">
                <p class="empty-state-title">لم تسجل أي وجبات اليوم</p>
                <p class="empty-state-desc">سجل وجباتك لحساب السعرات والماكروز اليومية بدقة.</p>
            </div>
        `;
    }

    const sorted = [...meals].sort((a, b) => b.timestamp - a.timestamp).slice(0, 3);

    return `
        <div style="display: flex; flex-direction: column;">
            ${sorted.map(meal => `
                <div class="meal-list-item" style="padding: 0.75rem 0;">
                    <div class="meal-info">
                        <div class="meal-name-text">${meal.name}</div>
                        <div class="meal-macros-text">بروتين: ${meal.protein}g | كارب: ${meal.carbs}g | دهون: ${meal.fat}g</div>
                    </div>
                    <div class="meal-cal-wrap">
                        <div class="meal-cal-val">${meal.calories}</div>
                        <div class="meal-cal-lbl">سعرة</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}
