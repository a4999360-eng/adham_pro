/**
 * Gym Evolution - Smart Reminders & Retention Notification Manager (Global Scope)
 */

window.GymEvo = window.GymEvo || {};

window.GymEvo.ReminderManager = class ReminderManager {
    constructor(repository) {
        this.repository = repository;
        this._timerId = null;
    }

    /**
     * Check if browser notifications are supported
     */
    isSupported() {
        return 'Notification' in window;
    }

    /**
     * Get current permission state: 'granted', 'denied', or 'default'
     */
    getPermissionState() {
        if (!this.isSupported()) return 'unsupported';
        return Notification.permission;
    }

    /**
     * Request browser notification permission
     */
    async requestPermission() {
        if (!this.isSupported()) return 'unsupported';
        try {
            const result = await Notification.requestPermission();
            return result;
        } catch (e) {
            console.error('Notification permission error:', e);
            return 'denied';
        }
    }

    /**
     * Play custom ringtone uploaded by the user or synthetic chime
     */
    playRingtone() {
        const repo = this.repository || new window.GymEvo.LocalRepository();
        const ringtone = repo.getRingtone ? repo.getRingtone() : null;

        if (this._currentAudio) {
            try {
                this._currentAudio.pause();
                this._currentAudio.currentTime = 0;
            } catch (e) {}
            this._currentAudio = null;
        }

        if (ringtone && ringtone.dataUrl) {
            try {
                const audio = new Audio(ringtone.dataUrl);
                this._currentAudio = audio;
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(err => {
                        console.warn('Custom ringtone playback blocked/failed, playing synthesized chime:', err);
                        this.playSyntheticChime();
                    });
                }
                return audio;
            } catch (err) {
                console.warn('Audio construction error, using fallback:', err);
                this.playSyntheticChime();
            }
        } else {
            this.playSyntheticChime();
        }
    }

    /**
     * Stop currently playing preview or ringtone
     */
    stopRingtone() {
        if (this._currentAudio) {
            try {
                this._currentAudio.pause();
                this._currentAudio.currentTime = 0;
            } catch (e) {}
            this._currentAudio = null;
        }
    }

    /**
     * Web Audio API pleasant bell sound (works 100% offline without any external files)
     */
    playSyntheticChime() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const now = ctx.currentTime;
            
            // Pleasant chime notes: C5 (523.25Hz), E5 (659.25Hz), G5 (783.99Hz)
            const frequencies = [523.25, 659.25, 783.99];
            frequencies.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + (idx * 0.1));
                
                gain.gain.setValueAtTime(0.25, now + (idx * 0.1));
                gain.gain.exponentialRampToValueAtTime(0.001, now + (idx * 0.1) + 0.9);
                
                osc.connect(gain);
                gain.connect(ctx.destination);
                
                osc.start(now + (idx * 0.1));
                osc.stop(now + (idx * 0.1) + 1.0);
            });
        } catch (e) {
            console.warn('Synthetic audio chime failed:', e);
        }
    }

    /**
     * Shows a system notification (or falls back to in-app toast) and rings
     */
    notify(title, body, tag = 'gym-evo-reminder') {
        // Play selected ringtone
        this.playRingtone();

        if (this.isSupported() && Notification.permission === 'granted') {
            try {
                const notif = new Notification(title, {
                    body,
                    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="%23111118"/><text x="50" y="65" font-size="45" font-family="sans-serif" font-weight="bold" fill="%23FFFFFF" text-anchor="middle">GE</text></svg>',
                    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%230070F3"/></svg>',
                    tag,
                    renotify: true
                });

                notif.onclick = () => {
                    window.focus();
                    notif.close();
                };
            } catch (e) {
                console.warn('Native notification failed, falling back to toast', e);
                if (window.GymEvo.notifier) {
                    window.GymEvo.notifier.info(title, body);
                }
            }
        } else if (window.GymEvo.notifier) {
            window.GymEvo.notifier.info(title, body);
        }
    }

    /**
     * Sends an instant test notification
     */
    sendTestNotification() {
        const repo = this.repository || new window.GymEvo.LocalRepository();
        const ringtone = repo.getRingtone ? repo.getRingtone() : null;
        const ringtoneName = ringtone ? ringtone.name : 'الافتراضية';
        
        const title = 'تذكير تجريبي ورنين من Gym Evolution 🔔';
        const body = `النغمة المستخدمة: ${ringtoneName}. سيتم تذكيرك بالوجبات والتمارين والمواعيد المخصصة بدقة.`;
        this.notify(title, body, 'test-reminder');
    }

    /**
     * Analyzes user logging status and detects missing logs
     * @returns {Object} { needsWeightCheck: boolean, daysSinceWeight: number, missingMealsToday: boolean, mealsCount: number }
     */
    analyzeUserStatus() {
        const repo = this.repository || new window.GymEvo.LocalRepository();
        const metrics = repo.getMetrics();
        const todayMeals = repo.getMealsByDate(new Date());

        let daysSinceWeight = 999;
        if (metrics.length > 0) {
            const latestMetric = metrics[metrics.length - 1];
            const msDiff = Date.now() - latestMetric.timestamp;
            daysSinceWeight = Math.floor(msDiff / (1000 * 60 * 60 * 24));
        }

        const now = new Date();
        const currentHour = now.getHours();

        // If it's afternoon/evening and no meals logged
        const needsMealReminder = todayMeals.length === 0 && currentHour >= 12;

        // If weight hasn't been logged in 5 days or more
        const needsWeightReminder = daysSinceWeight >= 5;

        return {
            needsWeightReminder,
            daysSinceWeight,
            needsMealReminder,
            mealsCount: todayMeals.length,
            currentHour
        };
    }

    /**
     * Check if a reminder should trigger today based on user settings
     */
    checkAndTriggerScheduledReminders() {
        const repo = this.repository || new window.GymEvo.LocalRepository();
        const settings = repo.getReminderSettings();
        if (!settings.enabled) return;

        const status = this.analyzeUserStatus();
        const todayStr = new Date().toDateString();
        const lastNotified = settings.lastNotified || {};

        // 1. Weight Reminder Check
        if (settings.weightReminder && settings.weightReminder.enabled) {
            if (status.needsWeightReminder && lastNotified.weight !== todayStr) {
                this.notify(
                    'حان وقت ميزان التطور! ⚖️',
                    `مرت ${status.daysSinceWeight} أيام منذ آخر قراءة لوزنك. تسجيل وزنك الآن يساعدك على رصد استجابة جسمك بدقة.`
                );
                lastNotified.weight = todayStr;
                settings.lastNotified = lastNotified;
                repo.saveReminderSettings(settings);
            }
        }

        // 2. Meal Reminder Check
        if (settings.mealReminder && settings.mealReminder.enabled) {
            if (status.needsMealReminder && lastNotified.meal !== todayStr) {
                this.notify(
                    'لا تنسَ تسجيل وجباتك اليوم! 🥗',
                    'تسجيل السعرات بانتظام هو العامل الحاسم للوصول لهدفك البدني دون مفاجآت.'
                );
                lastNotified.meal = todayStr;
                settings.lastNotified = lastNotified;
                repo.saveReminderSettings(settings);
            }
        }

        // 3. Custom Reminders Time Match Check (HH:MM)
        const now = new Date();
        const currentHours = String(now.getHours()).padStart(2, '0');
        const currentMinutes = String(now.getMinutes()).padStart(2, '0');
        const currentTimeStr = `${currentHours}:${currentMinutes}`;
        const currentMinuteKey = `${todayStr}_${currentTimeStr}`;

        if (settings.customReminders && settings.customReminders.length > 0) {
            settings.customReminders.forEach(reminder => {
                if (!reminder.enabled) return;
                if (reminder.time === currentTimeStr) {
                    const reminderKey = `cr_${reminder.id}`;
                    if (lastNotified[reminderKey] !== currentMinuteKey) {
                        this.notify(
                            `⏰ تذكير: ${reminder.title}`,
                            `حان موعد تذكيرك المحدد (${reminder.time}): ${reminder.title}`,
                            `custom-${reminder.id}`
                        );
                        lastNotified[reminderKey] = currentMinuteKey;
                        settings.lastNotified = lastNotified;
                        repo.saveReminderSettings(settings);
                    }
                }
            });
        }
    }

    /**
     * Start background checking loop
     */
    startPeriodicCheck(intervalSeconds = 30) {
        if (this._timerId) clearInterval(this._timerId);
        
        // Initial check after short delay
        setTimeout(() => this.checkAndTriggerScheduledReminders(), 2000);

        this._timerId = setInterval(() => {
            this.checkAndTriggerScheduledReminders();
        }, intervalSeconds * 1000);
    }
};
