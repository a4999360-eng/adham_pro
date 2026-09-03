/**
 * Gym Evolution - Workout Architect UI View Driver (Global Scope)
 */

window.GymEvo = window.GymEvo || {};

window.GymEvo.renderWorkout = function(repo, container) {
    const user = repo.getUser();

    function updateView() {
        const workouts = repo.getWorkouts();
        const unitLabel = window.GymEvo.Units ? window.GymEvo.Units.getWeightUnit() : 'كجم';

        container.innerHTML = `
            <div class="view-header">
                <div class="view-header-title">
                    <h1>مخطط التمارين والجلسات 🏋️</h1>
                    <p>قم ببناء حصصك التدريبية باختيار التمارين الجاهزة من المكتبة وحساب الحرق الدقيق.</p>
                </div>
                <div class="header-action">
                    <button class="btn btn-primary" id="create-workout-btn">
                        + إنشاء حصة تدريبية
                    </button>
                </div>
            </div>

            <div class="dashboard-grid">
                <div class="col-12" id="workouts-list-container">
                    ${workouts.length === 0 ? `
                        <div class="card">
                            <div class="empty-state">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="9"></line><line x1="9" y1="13" x2="15" y2="13"></line><line x1="9" y1="17" x2="15" y2="17"></line></svg>
                                <p class="empty-state-title">سجل التمارين فارغ</p>
                                <p class="empty-state-desc">ابدأ بإنشاء حصتك التدريبية الأولى لتتبع الجلسات والأوزان.</p>
                                <button class="btn btn-primary btn-sm" id="empty-create-workout-btn">إنشاء حصة تدريبية</button>
                            </div>
                        </div>
                    ` : workouts.map(workout => renderWorkoutCard(workout, user, unitLabel)).join('')}
                </div>
            </div>

            <!-- Modal for Adding Exercise with Library Picker -->
            <div class="modal-overlay" id="exercise-modal">
                <div class="modal-content modal-content-lg">
                    <div class="modal-header">
                        <h2>مكتبة التمارين وإضافة حركة جديدة</h2>
                        <button class="btn-icon" id="close-exercise-modal-btn" style="font-size: 1.5rem;">&times;</button>
                    </div>

                    <!-- Muscle Category Filter Tabs -->
                    <div style="margin-bottom: 0.75rem;">
                        <label style="display: block; font-size: 0.825rem; font-weight: 600; margin-bottom: 0.35rem;">اختر من مكتبة التمارين المصنفة:</label>
                        <div class="exercise-cat-tabs" id="ex-cat-tabs-wrap">
                            <button type="button" class="ex-cat-btn active" data-cat="all">الكل 🏋️</button>
                            <button type="button" class="ex-cat-btn" data-cat="chest">الصدر 🛡️</button>
                            <button type="button" class="ex-cat-btn" data-cat="back">الظهر 🦅</button>
                            <button type="button" class="ex-cat-btn" data-cat="legs">الأرجل 🦵</button>
                            <button type="button" class="ex-cat-btn" data-cat="shoulders">الأكتاف 🎯</button>
                            <button type="button" class="ex-cat-btn" data-cat="arms">الذراعين 💪</button>
                            <button type="button" class="ex-cat-btn" data-cat="core">الكور ⚡</button>
                        </div>
                    </div>

                    <!-- Search Input -->
                    <div style="margin-bottom: 0.75rem;">
                        <input type="text" id="ex-library-search" placeholder="ابحث بالاسم (مثال: بنش، سكوات، عقلة، ديدليفت...)" autocomplete="off">
                    </div>

                    <!-- Exercise Library Quick Grid -->
                    <div class="exercise-library-scroll-box" id="ex-library-box">
                        <!-- Populated dynamically -->
                    </div>

                    <form id="add-exercise-form" style="border-top: 1px solid var(--border-color); padding-top: 1rem; margin-top: 0.75rem;">
                        <input type="hidden" id="modal-workout-id">
                        
                        <div class="form-group">
                            <label>اسم التمرين المختار (أو اكتب تمريناً مخصصاً)</label>
                            <input type="text" id="exercise-name" placeholder="اسم الحركة" required>
                        </div>

                        <div class="input-row">
                            <div class="form-group">
                                <label>الوزن الافتراضي (${unitLabel})</label>
                                <input type="number" id="default-weight" placeholder="0" min="0" step="0.5" required>
                            </div>
                            <div class="form-group">
                                <label>العدات المستهدفة (Reps)</label>
                                <input type="number" id="default-reps" placeholder="10" min="1" required>
                            </div>
                        </div>

                        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 0.75rem;">
                            إدراج التمرين في الحصة التدريبية
                        </button>
                    </form>
                </div>
            </div>
        `;

        setupListeners();
    }

    function renderWorkoutCard(workout, user, unitLabel) {
        const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
        const completedSets = workout.exercises.reduce((sum, ex) => sum + ex.sets.filter(s => s.completed).length, 0);
        const progressPct = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;
        
        const duration = workout.durationMinutes || 50;
        const burnDetails = window.GymEvo.getWorkoutBurnDetails 
            ? window.GymEvo.getWorkoutBurnDetails(workout, user.weight, duration) 
            : { totalBurn: 350, totalTonnage: 0, met: 5.0 };
        const burnedCals = burnDetails.totalBurn;

        const dateStr = new Date(workout.timestamp).toLocaleDateString('ar-EG', {
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
            <div class="workout-item-card" data-id="${workout.id}">
                <div class="workout-item-header">
                    <div>
                        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                            <div class="workout-item-title">${workout.name}</div>
                            <span class="workout-burn-pill" title="حرق السعرات المحسوب بدقة: حجم رفع ${burnDetails.totalTonnage} كجم • شدة MET ${burnDetails.met} • مدة ${duration} دقيقة">
                                🔥 ${burnedCals} kcal <span style="font-size: 0.7rem; opacity: 0.85;">(حساب دقيق)</span>
                            </span>
                        </div>
                        <div class="workout-item-date" style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.25rem;">
                            <span>${dateStr}</span>
                            <span>•</span>
                            <label style="font-size: 0.75rem; color: var(--text-secondary);">المدة:</label>
                            <select class="workout-duration-select" data-id="${workout.id}" style="padding: 0.15rem 0.4rem; font-size: 0.75rem; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-primary); cursor: pointer;">
                                <option value="30" ${duration === 30 ? 'selected' : ''}>30 دقيقة</option>
                                <option value="45" ${duration === 45 ? 'selected' : ''}>45 دقيقة</option>
                                <option value="50" ${duration === 50 ? 'selected' : ''}>50 دقيقة</option>
                                <option value="60" ${duration === 60 ? 'selected' : ''}>60 دقيقة</option>
                                <option value="75" ${duration === 75 ? 'selected' : ''}>75 دقيقة</option>
                                <option value="90" ${duration === 90 ? 'selected' : ''}>90 دقيقة</option>
                            </select>
                            <span style="font-size: 0.75rem; color: var(--text-tertiary);">(إجمالي الرفع: ${burnDetails.totalTonnage} كجم)</span>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
                        <div style="font-size: 0.8rem; text-align: right; color: var(--text-secondary);">
                            الجلسات: ${completedSets}/${totalSets}
                        </div>
                        
                        <div class="btn-group">
                            <button class="btn btn-secondary btn-sm add-ex-btn" data-id="${workout.id}">
                                + إضافة حركة
                            </button>
                            ${!workout.completed ? `
                                <button class="btn btn-mint btn-sm complete-workout-btn" data-id="${workout.id}">
                                    إنهاء الحصة
                                </button>
                            ` : `
                                <span class="stat-change up" style="background-color: var(--accent-mint-soft); padding: 0.35rem 0.65rem; border-radius: var(--radius-sm); font-size: 0.8rem;">
                                    منتهية ✔️
                                </span>
                            `}
                            <button class="btn-icon delete-workout-btn" data-id="${workout.id}" title="حذف الحصة بالكامل">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-coral)" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="workout-item-body">
                    <div class="progress-bar-container" style="margin-bottom: 1.5rem; height: 4px;">
                        <div class="progress-bar-fill ${workout.completed ? 'mint' : ''}" style="width: ${progressPct}%;"></div>
                    </div>

                    ${workout.exercises.length === 0 ? `
                        <div style="text-align: center; color: var(--text-tertiary); font-size: 0.85rem; padding: 1.5rem;">
                            لم يتم إضافة أي حركات لهذه الحصة بعد. انقر على "+ إضافة حركة" للاختيار من المكتبة.
                        </div>
                    ` : workout.exercises.map((ex, exIdx) => `
                        <div class="exercise-log-row">
                            <div class="exercise-log-header">
                                <div class="exercise-name-lbl">${exIdx + 1}. ${ex.name}</div>
                                <button class="btn-icon delete-ex-btn" data-workout-id="${workout.id}" data-ex-id="${ex.id}" title="حذف الحركة">
                                    &times;
                                </button>
                            </div>

                            <div class="sets-builder-grid">
                                ${ex.sets.map((set, setIdx) => `
                                    <div class="set-pill ${set.completed ? 'completed' : ''}" 
                                         data-workout-id="${workout.id}" 
                                         data-ex-id="${ex.id}" 
                                         data-set-idx="${setIdx}" 
                                         style="cursor: pointer;">
                                        <span class="set-pill-num">ج ${setIdx + 1}</span>
                                        <span>${set.weight} ${unitLabel} × ${set.reps} عدات</span>
                                        <input type="checkbox" ${set.completed ? 'checked' : ''} style="pointer-events: none; width: 14px; height: 14px; margin-left: 0.25rem;">
                                    </div>
                                `).join('')}

                                <button class="btn btn-secondary add-set-pill-btn" 
                                        data-workout-id="${workout.id}" 
                                        data-ex-id="${ex.id}" 
                                        style="padding: 0.35rem 0.65rem; font-size: 0.75rem; border-style: dashed;">
                                    + إضافة مجموعة
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    function setupListeners() {
        const createWorkout = (e) => {
            e.preventDefault();
            const names = ['حصة دفع (Push Day: صدر/أكتاف/ترايسبس)', 'حصة سحب (Pull Day: ظهر/بايسبس)', 'حصة أرجل وبطن (Legs & Core)', 'حصة تمارين عامة (Full Body Workout)'];
            const randomName = names[Math.floor(Math.random() * names.length)];
            
            const newWorkout = new window.GymEvo.Workout({
                name: randomName,
                exercises: [],
                completed: false
            });
            newWorkout.durationMinutes = 55;

            repo.saveWorkout(newWorkout);
            window.GymEvo.notifier.success('تمت إضافة حصة تدريبية جديدة', newWorkout.name);
            updateView();
        };

        const createBtn = document.getElementById('create-workout-btn');
        if (createBtn) createBtn.addEventListener('click', createWorkout);

        const emptyCreateBtn = document.getElementById('empty-create-workout-btn');
        if (emptyCreateBtn) emptyCreateBtn.addEventListener('click', createWorkout);

        // Duration Change Listener
        document.querySelectorAll('.workout-duration-select').forEach(sel => {
            sel.addEventListener('change', (e) => {
                const wId = sel.dataset.id;
                const workout = repo.getWorkouts().find(w => w.id === wId);
                if (workout) {
                    workout.durationMinutes = parseInt(e.target.value);
                    repo.saveWorkout(workout);
                    updateView();
                }
            });
        });

        // Delete Workout with Confirmation
        document.querySelectorAll('.delete-workout-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const wId = btn.dataset.id;
                const workout = repo.getWorkouts().find(w => w.id === wId);
                if (workout) {
                    const ok = await window.GymEvo.confirm({
                        title: 'حذف الحصة التدريبية',
                        message: `هل أنت متأكد من حذف حصة "${workout.name}" بالكامل؟ سيتم مسح كافة التمارين والمجموعات المسجلة بها.`,
                        confirmText: 'نعم، حذف الحصة',
                        danger: true
                    });
                    if (ok) {
                        repo.deleteWorkout(wId);
                        window.GymEvo.notifier.warning('تم حذف الحصة التدريبية', workout.name);
                        updateView();
                    }
                }
            });
        });

        // Complete Workout
        document.querySelectorAll('.complete-workout-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const wId = btn.dataset.id;
                const workout = repo.getWorkouts().find(w => w.id === wId);
                if (workout) {
                    workout.completed = true;
                    workout.exercises.forEach(ex => {
                        ex.sets.forEach(s => s.completed = true);
                    });
                    repo.saveWorkout(workout);

                    const burnedCals = window.GymEvo.calculateWorkoutCaloriesBurned 
                        ? window.GymEvo.calculateWorkoutCaloriesBurned(workout, user.weight, workout.durationMinutes || 50) 
                        : 350;

                    window.GymEvo.notifier.success('تهانينا 🎉 تم إنهاء الحصة بنجاح!', `تم حرق ${burnedCals} سعرة حرارية وإدراجها في ميزان اليوم.`);
                    updateView();
                }
            });
        });

        // Modal Elements
        const modal = document.getElementById('exercise-modal');
        const closeModalBtn = document.getElementById('close-exercise-modal-btn');
        const exLibraryBox = document.getElementById('ex-library-box');
        const exSearchInput = document.getElementById('ex-library-search');
        let selectedCategory = 'all';

        function renderExerciseLibrary() {
            if (!exLibraryBox || !window.GymEvo.ExerciseDb) return;
            const query = exSearchInput ? exSearchInput.value : '';
            const items = window.GymEvo.ExerciseDb.search(query, selectedCategory);

            if (items.length === 0) {
                exLibraryBox.innerHTML = `<div style="padding: 1rem; text-align: center; color: var(--text-tertiary); font-size: 0.85rem;">لم يتم العثور على تمارين مطابقة</div>`;
                return;
            }

            exLibraryBox.innerHTML = items.map(item => `
                <div class="exercise-picker-card" data-name="${item.nameAr}" data-sets="${item.suggestedSets}" data-reps="${item.suggestedReps}">
                    <div style="font-weight: 600; font-size: 0.85rem; color: var(--text-primary);">${item.nameAr}</div>
                    <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.15rem;">
                        ${item.equipment} • مقترح: ${item.suggestedSets} مجموعات × ${item.suggestedReps} عدات
                    </div>
                </div>
            `).join('');

            exLibraryBox.querySelectorAll('.exercise-picker-card').forEach(card => {
                card.addEventListener('click', () => {
                    document.getElementById('exercise-name').value = card.dataset.name;
                    document.getElementById('default-reps').value = card.dataset.reps;
                    document.getElementById('default-weight').value = '20';
                    // highlight card
                    exLibraryBox.querySelectorAll('.exercise-picker-card').forEach(c => c.classList.remove('selected'));
                    card.classList.add('selected');
                });
            });
        }

        // Category Tab Switching
        document.querySelectorAll('.ex-cat-btn').forEach(tabBtn => {
            tabBtn.addEventListener('click', () => {
                document.querySelectorAll('.ex-cat-btn').forEach(b => b.classList.remove('active'));
                tabBtn.classList.add('active');
                selectedCategory = tabBtn.dataset.cat;
                renderExerciseLibrary();
            });
        });

        if (exSearchInput) {
            exSearchInput.addEventListener('input', () => {
                renderExerciseLibrary();
            });
        }

        document.querySelectorAll('.add-ex-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('modal-workout-id').value = btn.dataset.id;
                document.getElementById('add-exercise-form').reset();
                selectedCategory = 'all';
                document.querySelectorAll('.ex-cat-btn').forEach(b => b.classList.toggle('active', b.dataset.cat === 'all'));
                if (exSearchInput) exSearchInput.value = '';
                renderExerciseLibrary();
                modal.style.display = 'flex';
            });
        });

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });

        const addExForm = document.getElementById('add-exercise-form');
        if (addExForm) {
            addExForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const workoutId = document.getElementById('modal-workout-id').value;
                const workout = repo.getWorkouts().find(w => w.id === workoutId);

                if (workout) {
                    const exName = document.getElementById('exercise-name').value;
                    const weight = parseFloat(document.getElementById('default-weight').value);
                    const reps = parseInt(document.getElementById('default-reps').value);

                    const newEx = new window.GymEvo.Exercise({
                        name: exName,
                        sets: [
                            { weight, reps, completed: false },
                            { weight, reps, completed: false },
                            { weight, reps, completed: false }
                        ]
                    });

                    workout.exercises.push(newEx);
                    repo.saveWorkout(workout);
                    window.GymEvo.notifier.success('تمت إضافة الحركة', `${exName} (3 مجموعات)`);
                    modal.style.display = 'none';
                    updateView();
                }
            });
        }

        // Delete Exercise with Confirmation
        document.querySelectorAll('.delete-ex-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const wId = btn.dataset.workoutId;
                const exId = btn.dataset.exId;
                const workout = repo.getWorkouts().find(w => w.id === wId);

                if (workout) {
                    const ex = workout.exercises.find(e => e.id === exId);
                    const exName = ex ? ex.name : 'هذا التمرين';

                    const ok = await window.GymEvo.confirm({
                        title: 'حذف التمرين من الحصة',
                        message: `هل أنت متأكد من حذف "${exName}"؟`,
                        confirmText: 'نعم، حذف التمرين',
                        danger: true
                    });

                    if (ok) {
                        workout.exercises = workout.exercises.filter(e => e.id !== exId);
                        repo.saveWorkout(workout);
                        window.GymEvo.notifier.warning('تمت إزالة الحركة من الحصة');
                        updateView();
                    }
                }
            });
        });

        // Set pill click toggle
        document.querySelectorAll('.set-pill').forEach(pill => {
            pill.addEventListener('click', (e) => {
                if (e.target.tagName === 'INPUT') return;

                const wId = pill.dataset.workoutId;
                const exId = pill.dataset.exId;
                const setIdx = parseInt(pill.dataset.setIdx);

                const workout = repo.getWorkouts().find(w => w.id === wId);
                if (workout) {
                    const ex = workout.exercises.find(e => e.id === exId);
                    if (ex && ex.sets[setIdx]) {
                        ex.sets[setIdx].completed = !ex.sets[setIdx].completed;
                        
                        const allSetsTotal = workout.exercises.reduce((sum, e) => sum + e.sets.length, 0);
                        const allSetsCompleted = workout.exercises.reduce((sum, e) => sum + e.sets.filter(s => s.completed).length, 0);
                        if (allSetsCompleted === allSetsTotal && allSetsTotal > 0 && !workout.completed) {
                            workout.completed = true;
                            window.GymEvo.notifier.success('رائع! أتممت جميع المجموعات 🎉', 'تم إنهاء الحصة التدريبية.');
                        } else if (allSetsCompleted < allSetsTotal && workout.completed) {
                            workout.completed = false;
                        }

                        repo.saveWorkout(workout);
                        updateView();
                    }
                }
            });
        });

        // Add set button
        document.querySelectorAll('.add-set-pill-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const wId = btn.dataset.workoutId;
                const exId = btn.dataset.exId;
                const workout = repo.getWorkouts().find(w => w.id === wId);

                if (workout) {
                    const ex = workout.exercises.find(e => e.id === exId);
                    if (ex) {
                        const lastSet = ex.sets[ex.sets.length - 1] || { weight: 0, reps: 10 };
                        ex.sets.push({
                            weight: lastSet.weight,
                            reps: lastSet.reps,
                            completed: false
                        });
                        
                        if (workout.completed) workout.completed = false;

                        repo.saveWorkout(workout);
                        updateView();
                    }
                }
            });
        });
    }

    updateView();
};
