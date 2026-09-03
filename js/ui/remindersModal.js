/**
 * Gym Evolution - Reminders & Notifications Modal (Global Scope)
 * Enhanced with Custom Reminders (Reason + Specific Time) & Phone Ringtone Upload
 */

window.GymEvo = window.GymEvo || {};

window.GymEvo.renderRemindersModal = function(repo, reminderManager) {
    let modalEl = document.getElementById('reminders-modal-overlay');
    if (!modalEl) {
        modalEl = document.createElement('div');
        modalEl.id = 'reminders-modal-overlay';
        modalEl.className = 'modal-overlay';
        document.body.appendChild(modalEl);
    }

    const settings = repo.getReminderSettings();
    const ringtone = repo.getRingtone();
    const permissionState = reminderManager.getPermissionState();

    let permBadge = '';
    if (permissionState === 'granted') {
        permBadge = '<span class="badge badge-success">مفعلة بالمتصفح ✔️</span>';
    } else if (permissionState === 'denied') {
        permBadge = '<span class="badge badge-danger">محظورة بالمتصفح ⚠️</span>';
    } else {
        permBadge = '<span class="badge badge-warning">بانتظار الإذن 🔔</span>';
    }

    modalEl.innerHTML = `
        <div class="modal-content modal-content-lg" style="max-height: 92dvh; overflow-y: auto; -webkit-overflow-scrolling: touch;">
            <div class="modal-header">
                <div style="display: flex; align-items: center; gap: 0.6rem; min-width: 0; flex: 1;">
                    <div class="reminder-icon-box">🔔</div>
                    <div style="min-width: 0;">
                        <h2 style="font-size: clamp(1rem, 4vw, 1.35rem);">التنبيهات والتذكيرات</h2>
                        <p class="modal-subtitle">إشعارات مخصصة ونغمة رنين من هاتفك.</p>
                    </div>
                </div>
                <button class="modal-close-btn" id="close-reminders-modal" style="flex-shrink: 0;">&times;</button>
            </div>

            <div class="modal-body">
                <!-- Browser Permission Bar -->
                <div class="reminder-perm-card">
                    <div style="font-weight: 600; font-size: 0.9rem; margin-bottom: 0.35rem;">
                        حالة إشعارات المتصفح ${permBadge}
                    </div>
                    <div style="font-size: 0.78rem; color: var(--text-secondary); margin-bottom: 0.75rem;">
                        ${permissionState === 'granted'
                            ? 'ستصلك التنبيهات مع الرنين الصوتي حتى عند عمل التطبيق في الخلفية.'
                            : 'اضغط على الزر لتفعيل إشعارات النظام والرنين الصوتي.'}
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        ${permissionState !== 'granted' ? `
                            <button class="btn btn-primary" id="btn-request-notif-perm" style="width: 100%; justify-content: center;">
                                🔔 السماح بالإشعارات
                            </button>
                        ` : ''}
                        <button class="btn btn-secondary" id="btn-test-reminder" style="width: 100%; justify-content: center;">
                            إشعار وتجربة الرنين ⚡
                        </button>
                    </div>
                </div>

                <!-- Custom Ringtone Selection Section -->
                <div class="reminder-section-box" style="margin-top: 1rem;">
                    <div class="reminder-section-header">
                        <div>
                            <span class="reminder-section-title">🎵 نغمة رنين التذكيرات</span>
                            <p class="reminder-section-desc">اختر أي نغمة صوتية من هاتفك (MP3, WAV, M4A).</p>
                        </div>
                    </div>

                    <div style="margin-top: 0.75rem; background-color: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 0.85rem;">
                        <div style="margin-bottom: 0.65rem;">
                            <div style="font-size: 0.72rem; color: var(--text-secondary);">النغمة المفعلة حالياً:</div>
                            <div style="font-weight: 700; font-size: 0.9rem; color: var(--accent-blue); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" id="current-ringtone-name">
                                ${ringtone.name || 'نغمة التطبيق الافتراضية (Bell Chime)'}
                            </div>
                        </div>
                        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                            <button type="button" class="btn btn-secondary btn-sm" id="btn-play-preview-ringtone" style="flex: 1; justify-content: center; min-width: 100px;">
                                ▶️ استماع
                            </button>
                            <button type="button" class="btn btn-secondary btn-sm" id="btn-reset-ringtone" style="flex: 1; justify-content: center; min-width: 100px; color: var(--accent-coral);">
                                🔄 الأصلية
                            </button>
                        </div>
                        <!-- Hidden file input triggered by button -->
                        <input type="file" id="ringtone-file-input" accept="audio/*" style="display: none;">
                        <button type="button" class="btn btn-secondary" id="btn-choose-ringtone-file" style="width: 100%; border-style: dashed; font-size: 0.82rem; padding: 0.6rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 0.65rem;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                            <span>تحميل نغمة من الهاتف</span>
                        </button>
                        <div style="font-size: 0.72rem; color: var(--text-tertiary); margin-top: 0.35rem; text-align: center;">
                            MP3, WAV, AAC, M4A, OGG — يُحفظ محلياً على جهازك.
                        </div>
                    </div>
                </div>

                <!-- Custom Scheduled Reminders Section -->
                <div class="reminder-section-box" style="margin-top: 1rem;">
                    <div class="reminder-section-header">
                        <div>
                            <span class="reminder-section-title">📝 تذكير مخصص</span>
                            <p class="reminder-section-desc">أضف سبباً ووقتاً خاصاً (مكملات، بروتين، نوم...).</p>
                        </div>
                    </div>

                    <!-- Add New Custom Reminder Box -->
                    <div style="background-color: var(--bg-card); border: 1px dashed var(--border-color); border-radius: var(--radius-md); padding: 0.85rem; margin-top: 0.75rem;">
                        <div class="form-group" style="margin-bottom: 0.65rem;">
                            <label style="font-size: 0.78rem; font-weight: 600;">سبب التذكير:</label>
                            <input type="text" id="new-custom-remind-title" placeholder="مثال: أخذ مكمل الكرياتين، شرب البروتين..." autocomplete="off">
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                            <div class="form-group" style="margin-bottom: 0;">
                                <label style="font-size: 0.78rem; font-weight: 600;">توقيت التنبيه:</label>
                                <input type="time" id="new-custom-remind-time" value="18:00">
                            </div>
                            <button type="button" class="btn btn-primary" id="btn-add-custom-remind" style="width: 100%; justify-content: center;">
                                + إضافة هذا التذكير
                            </button>
                        </div>
                    </div>

                    <!-- Custom Reminders Active List -->
                    <div style="margin-top: 0.85rem;">
                        <div style="font-size: 0.78rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 0.5rem;">
                            التذكيرات المخصصة النشطة:
                        </div>
                        <div id="custom-reminders-list" style="display: flex; flex-direction: column; gap: 0.5rem;">
                            <!-- Populated dynamically -->
                        </div>
                    </div>
                </div>

                <!-- Core App Reminders Settings Form -->
                <form id="reminders-form" style="margin-top: 1rem;">
                    <!-- Master Toggle -->
                    <div class="toggle-card">
                        <div style="flex: 1; min-width: 0; padding-left: 0.5rem;">
                            <div style="font-weight: 600; font-size: 0.9rem;">التذكيرات الدورية العامة</div>
                            <div style="font-size: 0.75rem; color: var(--text-secondary);">تنبيهات الوزن والوجبات والماء</div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="remind-master" ${settings.enabled ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>

                    <!-- Weight Reminder Section -->
                    <div class="reminder-section-box">
                        <div class="reminder-section-header">
                            <div style="flex: 1; min-width: 0;">
                                <span class="reminder-section-title">⚖️ تذكير قياس الوزن</span>
                                <p class="reminder-section-desc">تنبيه دوري لقياس وزنك ومتابعة التطور.</p>
                            </div>
                            <label class="switch" style="flex-shrink: 0;">
                                <input type="checkbox" id="remind-weight-enabled" ${settings.weightReminder.enabled ? 'checked' : ''}>
                                <span class="slider"></span>
                            </label>
                        </div>

                        <div style="margin-top: 0.85rem; display: flex; flex-direction: column; gap: 0.65rem; ${settings.weightReminder.enabled ? '' : 'opacity: 0.5; pointer-events: none;'}" id="weight-reminder-fields">
                            <div class="form-group" style="margin-bottom: 0;">
                                <label>تكرار التذكير</label>
                                <select id="remind-weight-freq">
                                    <option value="weekly" ${settings.weightReminder.frequency === 'weekly' ? 'selected' : ''}>أسبوعياً (كل أحد صباحاً)</option>
                                    <option value="daily" ${settings.weightReminder.frequency === 'daily' ? 'selected' : ''}>يومياً (كل صباح)</option>
                                </select>
                            </div>
                            <div class="form-group" style="margin-bottom: 0;">
                                <label>توقيت التذكير</label>
                                <input type="time" id="remind-weight-time" value="${settings.weightReminder.time || '09:00'}">
                            </div>
                        </div>
                    </div>

                    <!-- Meals Reminder Section -->
                    <div class="reminder-section-box">
                        <div class="reminder-section-header">
                            <div style="flex: 1; min-width: 0;">
                                <span class="reminder-section-title">🥗 تذكير تسجيل الوجبات</span>
                                <p class="reminder-section-desc">تنبيه ذكي عند نسيان تسجيل الوجبات.</p>
                            </div>
                            <label class="switch" style="flex-shrink: 0;">
                                <input type="checkbox" id="remind-meals-enabled" ${settings.mealReminder.enabled ? 'checked' : ''}>
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>

                    <!-- Water & Hydration Section -->
                    <div class="reminder-section-box">
                        <div class="reminder-section-header">
                            <div style="flex: 1; min-width: 0;">
                                <span class="reminder-section-title">💧 تذكير شرب الماء</span>
                                <p class="reminder-section-desc">تذكير لطيف كل ساعتين للترطيب.</p>
                            </div>
                            <label class="switch" style="flex-shrink: 0;">
                                <input type="checkbox" id="remind-water-enabled" ${settings.waterReminder.enabled ? 'checked' : ''}>
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1.25rem;">
                        <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;">حفظ وتأكيد الإعدادات ✓</button>
                        <button type="button" class="btn btn-secondary" id="cancel-reminders-modal" style="width: 100%; justify-content: center;">إغلاق</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    // Modal Display & Dismiss
    modalEl.style.display = 'flex';

    let previewAudio = null;
    let isPreviewPlaying = false;

    function closeModal() {
        if (previewAudio) {
            previewAudio.pause();
            previewAudio = null;
        }
        reminderManager.stopRingtone();
        modalEl.style.display = 'none';
    }

    document.getElementById('close-reminders-modal').addEventListener('click', closeModal);
    document.getElementById('cancel-reminders-modal').addEventListener('click', closeModal);
    modalEl.addEventListener('click', (e) => {
        if (e.target === modalEl) closeModal();
    });

    // 1. Browser Notification Permission Request
    const permBtn = document.getElementById('btn-request-notif-perm');
    if (permBtn) {
        permBtn.addEventListener('click', async () => {
            const res = await reminderManager.requestPermission();
            if (res === 'granted') {
                window.GymEvo.notifier.success('تم تفعيل إشعارات المتصفح بنجاح! 🔔');
            } else {
                window.GymEvo.notifier.warning('تم رفض الإذن أو عدم تفعيله في المتصفح.');
            }
            window.GymEvo.renderRemindersModal(repo, reminderManager);
        });
    }

    // 2. Test Notification & Ringtone
    document.getElementById('btn-test-reminder').addEventListener('click', () => {
        reminderManager.sendTestNotification();
    });

    // 3. Custom Ringtone Handling
    const ringtoneFileInput = document.getElementById('ringtone-file-input');
    const chooseRingtoneBtn = document.getElementById('btn-choose-ringtone-file');
    const ringtoneNameDisplay = document.getElementById('current-ringtone-name');
    const playPreviewBtn = document.getElementById('btn-play-preview-ringtone');
    const resetRingtoneBtn = document.getElementById('btn-reset-ringtone');

    if (chooseRingtoneBtn && ringtoneFileInput) {
        chooseRingtoneBtn.addEventListener('click', () => {
            ringtoneFileInput.click();
        });

        ringtoneFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            if (file.size > 8 * 1024 * 1024) {
                window.GymEvo.notifier.error('الملف الصوتي كبير جداً', 'يرجى اختيار مقطع صوتي بحجم أقل من 8 ميجابايت.');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(ev) {
                const dataUrl = ev.target.result;
                repo.saveRingtone(file.name, dataUrl);
                ringtoneNameDisplay.textContent = file.name;
                window.GymEvo.notifier.success('تم تحميل نغمة الرنين بنجاح 🎵', file.name);

                // Play preview immediately
                if (previewAudio) previewAudio.pause();
                previewAudio = new Audio(dataUrl);
                previewAudio.play().catch(() => {});
                previewAudio.onended = () => {
                    playPreviewBtn.textContent = '▶️ استماع وتشغيل';
                    isPreviewPlaying = false;
                };
                playPreviewBtn.textContent = '⏹️ إيقاف النغمة';
                isPreviewPlaying = true;
            };
            reader.readAsDataURL(file);
        });
    }

    if (playPreviewBtn) {
        playPreviewBtn.addEventListener('click', () => {
            if (isPreviewPlaying) {
                if (previewAudio) {
                    previewAudio.pause();
                    previewAudio.currentTime = 0;
                }
                reminderManager.stopRingtone();
                playPreviewBtn.textContent = '▶️ استماع وتشغيل';
                isPreviewPlaying = false;
            } else {
                const audio = reminderManager.playRingtone();
                if (audio instanceof Audio) {
                    previewAudio = audio;
                    previewAudio.onended = () => {
                        playPreviewBtn.textContent = '▶️ استماع وتشغيل';
                        isPreviewPlaying = false;
                    };
                }
                playPreviewBtn.textContent = '⏹️ إيقاف النغمة';
                isPreviewPlaying = true;

                setTimeout(() => {
                    if (playPreviewBtn && isPreviewPlaying) {
                        playPreviewBtn.textContent = '▶️ استماع وتشغيل';
                        isPreviewPlaying = false;
                    }
                }, 6000);
            }
        });
    }

    if (resetRingtoneBtn) {
        resetRingtoneBtn.addEventListener('click', () => {
            repo.saveRingtone('نغمة التطبيق الافتراضية (Bell Chime)', null);
            ringtoneNameDisplay.textContent = 'نغمة التطبيق الافتراضية (Bell Chime)';
            if (previewAudio) {
                previewAudio.pause();
                previewAudio = null;
            }
            reminderManager.stopRingtone();
            reminderManager.playSyntheticChime();
            window.GymEvo.notifier.info('تمت استعادة النغمة الافتراضية 🔔');
        });
    }

    // 4. Custom Reminders List & Add Handler
    function renderCustomRemindersList() {
        const listEl = document.getElementById('custom-reminders-list');
        if (!listEl) return;
        const currentSettings = repo.getReminderSettings();
        const list = currentSettings.customReminders || [];

        if (list.length === 0) {
            listEl.innerHTML = `
                <div style="text-align: center; color: var(--text-tertiary); font-size: 0.8rem; padding: 0.75rem; border: 1px dashed var(--border-color); border-radius: var(--radius-sm); background-color: var(--bg-card);">
                    لا توجد تذكيرات مخصصة مضافة حالياً. اكتب سبباً ووقتاً بالأعلى لإضافته فوراً!
                </div>
            `;
            return;
        }

        listEl.innerHTML = list.map(item => `
            <div class="custom-remind-row" data-id="${item.id}" style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; background-color: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <span class="custom-remind-time-pill" style="font-weight: 700; font-size: 0.85rem; color: var(--accent-blue); background-color: var(--accent-blue-soft); padding: 0.2rem 0.6rem; border-radius: var(--radius-sm);">
                        ⏰ ${item.time}
                    </span>
                    <span style="font-weight: 600; font-size: 0.9rem; color: ${item.enabled ? 'var(--text-primary)' : 'var(--text-tertiary)'}; text-decoration: ${item.enabled ? 'none' : 'line-through'};">
                        ${item.title}
                    </span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <label class="switch" style="transform: scale(0.85); margin-bottom: 0;">
                        <input type="checkbox" class="toggle-custom-remind" data-id="${item.id}" ${item.enabled ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                    <button type="button" class="btn-icon delete-custom-remind-btn" data-id="${item.id}" title="حذف هذا التذكير" style="color: var(--accent-coral); font-size: 1.25rem; line-height: 1;">
                        &times;
                    </button>
                </div>
            </div>
        `).join('');

        // Toggle listeners
        listEl.querySelectorAll('.toggle-custom-remind').forEach(chk => {
            chk.addEventListener('change', (e) => {
                const id = e.target.dataset.id;
                repo.toggleCustomReminder(id, e.target.checked);
                renderCustomRemindersList();
            });
        });

        // Delete listeners with confirmation
        listEl.querySelectorAll('.delete-custom-remind-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                const currentList = repo.getReminderSettings().customReminders || [];
                const item = currentList.find(r => r.id === id);
                const ok = await window.GymEvo.confirm({
                    title: 'حذف التذكير المخصص',
                    message: `هل أنت متأكد من رغبتك في حذف تذكير "${item ? item.title : ''}"؟`,
                    confirmText: 'نعم، حذف التذكير',
                    cancelText: 'إلغاء',
                    danger: true
                });

                if (ok) {
                    repo.deleteCustomReminder(id);
                    window.GymEvo.notifier.warning('تم حذف التذكير المخصص');
                    renderCustomRemindersList();
                }
            });
        });
    }

    renderCustomRemindersList();

    const addCustomBtn = document.getElementById('btn-add-custom-remind');
    const titleInput = document.getElementById('new-custom-remind-title');
    const timeInput = document.getElementById('new-custom-remind-time');

    if (addCustomBtn && titleInput && timeInput) {
        addCustomBtn.addEventListener('click', () => {
            const title = titleInput.value.trim();
            const time = timeInput.value;

            if (!title) {
                window.GymEvo.notifier.warning('يرجى كتابة سبب التذكير أولاً');
                titleInput.focus();
                return;
            }

            if (!time) {
                window.GymEvo.notifier.warning('يرجى تحديد وقت التنبيه');
                return;
            }

            repo.addCustomReminder({ title, time });
            titleInput.value = '';
            window.GymEvo.notifier.success('تمت إضافة التذكير المخصص بنجاح ⏰', `${title} في تمام الساعة ${time}`);
            renderCustomRemindersList();
        });
    }

    // Weight toggle interactive enable/disable
    const weightToggle = document.getElementById('remind-weight-enabled');
    const weightFields = document.getElementById('weight-reminder-fields');
    if (weightToggle && weightFields) {
        weightToggle.addEventListener('change', () => {
            if (weightToggle.checked) {
                weightFields.style.opacity = '1';
                weightFields.style.pointerEvents = 'auto';
            } else {
                weightFields.style.opacity = '0.5';
                weightFields.style.pointerEvents = 'none';
            }
        });
    }

    // Save General Settings Form
    const form = document.getElementById('reminders-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const currentSettings = repo.getReminderSettings();
            const updated = {
                enabled: document.getElementById('remind-master').checked,
                weightReminder: {
                    enabled: document.getElementById('remind-weight-enabled').checked,
                    frequency: document.getElementById('remind-weight-freq').value,
                    dayOfWeek: 0,
                    time: document.getElementById('remind-weight-time').value
                },
                mealReminder: {
                    enabled: document.getElementById('remind-meals-enabled').checked,
                    breakfast: '09:30',
                    lunch: '14:30',
                    dinner: '20:30'
                },
                waterReminder: {
                    enabled: document.getElementById('remind-water-enabled').checked,
                    intervalHours: 2
                },
                customReminders: currentSettings.customReminders || [],
                ringtone: currentSettings.ringtone || { name: 'نغمة التطبيق الافتراضية (Bell Chime)', dataUrl: null },
                lastNotified: currentSettings.lastNotified || {}
            };

            repo.saveReminderSettings(updated);
            window.GymEvo.notifier.success('تم حفظ إعدادات التذكيرات', 'كافة التذكيرات والنغمات تعمل بكفاءة.');
            closeModal();
        });
    }
};
