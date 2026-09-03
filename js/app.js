/**
 * Gym Evolution - SPA Application Orchestrator / Shell Driver (Global Scope)
 */

window.GymEvo = window.GymEvo || {};

window.GymEvo.GymEvolutionApp = class GymEvolutionApp {
    constructor() {
        this.repository = new window.GymEvo.LocalRepository();
        this.reminderManager = new window.GymEvo.ReminderManager(this.repository);
        window.GymEvo.reminderManager = this.reminderManager;

        this.activeTab = 'dashboard';
        this.mainContentEl = document.getElementById('view-target');
        
        this.tabs = {
            dashboard: {
                render: (repo, el, navigate) => window.GymEvo.renderDashboard(repo, el, navigate),
                navId: 'nav-dashboard',
                bnavId: 'bnav-dashboard'
            },
            nutrition: {
                render: (repo, el, navigate) => window.GymEvo.renderNutrition(repo, el),
                navId: 'nav-nutrition',
                bnavId: 'bnav-nutrition'
            },
            workout: {
                render: (repo, el, navigate) => window.GymEvo.renderWorkout(repo, el),
                navId: 'nav-workout',
                bnavId: 'bnav-workout'
            },
            evolution: {
                render: (repo, el, navigate) => window.GymEvo.renderEvolution(repo, el),
                navId: 'nav-evolution',
                bnavId: 'bnav-evolution'
            },
            assistant: {
                render: (repo, el, navigate) => window.GymEvo.renderAssistant(repo, el),
                navId: 'nav-assistant',
                bnavId: 'bnav-assistant'
            }
        };
    }

    init() {
        this._setupNavigation();
        this.navigateToTab(this.activeTab);
        this._renderProfileWidget();
        
        // Start smart background reminder checks
        if (this.reminderManager) {
            this.reminderManager.startPeriodicCheck(30);
        }

        // Show welcome toast notification
        setTimeout(() => {
            window.GymEvo.notifier.info(
                'مرحباً بك في Gym Evolution',
                'مساعدك الذكي لإدارة اللياقة البدنية والوصول لأهدافك بنجاح.'
            );
        }, 800);
    }

    _setupNavigation() {
        // Wire desktop and mobile navigation links
        Object.keys(this.tabs).forEach(tabKey => {
            const tabConfig = this.tabs[tabKey];
            const navBtn = document.getElementById(tabConfig.navId);
            const bnavBtn = document.getElementById(tabConfig.bnavId);

            if (navBtn) {
                navBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.navigateToTab(tabKey);
                });
            }

            if (bnavBtn) {
                bnavBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.navigateToTab(tabKey);
                });
            }
        });

        // Reminders modal triggers (Sidebar and Mobile header)
        const sidebarRemindBtn = document.getElementById('sidebar-reminders-btn');
        if (sidebarRemindBtn) {
            sidebarRemindBtn.addEventListener('click', () => {
                window.GymEvo.renderRemindersModal(this.repository, this.reminderManager);
            });
        }

        const mobileRemindBtn = document.getElementById('mobile-reminders-btn');
        if (mobileRemindBtn) {
            mobileRemindBtn.addEventListener('click', () => {
                window.GymEvo.renderRemindersModal(this.repository, this.reminderManager);
            });
        }

        // Unit System Switcher Setup (Sidebar and Mobile header)
        const toggleUnits = () => {
            if (window.GymEvo.Units) {
                const nextSystem = window.GymEvo.Units.toggle();
                const isImp = nextSystem === 'imperial';
                this._updateUnitLabels();
                this.navigateToTab(this.activeTab);
                window.GymEvo.notifier.info(
                    `تم تحويل وحدة القياس`,
                    `النظام الحالي: ${isImp ? 'الباوند والإنش (lb / in)' : 'الكيلوجرام والسم (kg / cm)'}`
                );
            }
        };

        const sidebarUnitBtn = document.getElementById('sidebar-unit-btn');
        if (sidebarUnitBtn) sidebarUnitBtn.addEventListener('click', toggleUnits);

        const mobileUnitBtn = document.getElementById('mobile-unit-btn');
        if (mobileUnitBtn) mobileUnitBtn.addEventListener('click', toggleUnits);

        // Global unit change listener
        window.addEventListener('gym-evo-unit-change', () => {
            this._updateUnitLabels();
        });

        this._updateUnitLabels();
    }

    _updateUnitLabels() {
        if (!window.GymEvo.Units) return;
        const isImp = window.GymEvo.Units.getSystem() === 'imperial';
        const sideLabel = document.getElementById('sidebar-unit-label');
        const mobLabel = document.getElementById('mobile-unit-label');
        if (sideLabel) sideLabel.textContent = isImp ? 'lb / in' : 'kg / cm';
        if (mobLabel) mobLabel.textContent = isImp ? 'باوند / إنش' : 'كجم / سم';
    }

    _renderProfileWidget() {
        const user = this.repository.getUser();
        const avatarEl = document.getElementById('sidebar-user-avatar');
        const mobileAvatarEl = document.getElementById('mobile-user-avatar');
        const nameEl = document.getElementById('sidebar-user-name');
        const roleEl = document.getElementById('sidebar-user-role');
        const logoutBtn = document.getElementById('btn-logout');
        const googleSection = document.getElementById('google-signin-section');

        const initials = (user.name || 'GM').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

        if (user.picture) {
            const avatarHtml = `<img src="${user.picture}" alt="${user.name}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
            if (avatarEl) avatarEl.innerHTML = avatarHtml;
            if (mobileAvatarEl) mobileAvatarEl.innerHTML = avatarHtml;
            if (logoutBtn) logoutBtn.style.display = 'inline-flex';
            if (googleSection) googleSection.style.display = 'none';
        } else {
            if (avatarEl) avatarEl.textContent = initials;
            if (mobileAvatarEl) mobileAvatarEl.textContent = initials;
            if (logoutBtn) logoutBtn.style.display = 'none';
            if (googleSection) googleSection.style.display = 'block';
        }

        if (nameEl) nameEl.textContent = user.name;
        if (roleEl) {
            if (user.email) {
                roleEl.textContent = user.email;
                roleEl.title = user.email;
            } else {
                const goalTranslations = {
                    lose: 'تنشيف / إنقاص وزن',
                    maintain: 'ثبات / محافظة',
                    gain: 'تضخيم / زيادة عضل'
                };
                roleEl.textContent = goalTranslations[user.goal] || 'عضو نشط';
            }
        }

        // Hook up logout button if not already attached with custom confirm modal
        if (logoutBtn && !logoutBtn.dataset.bound) {
            logoutBtn.dataset.bound = 'true';
            logoutBtn.addEventListener('click', async () => {
                const ok = await window.GymEvo.confirm({
                    title: 'تسجيل الخروج',
                    message: 'هل أنت متأكد من رغبتك في تسجيل الخروج؟',
                    confirmText: 'نعم، تسجيل الخروج',
                    cancelText: 'إلغاء',
                    danger: false
                });
                if (ok) {
                    this.handleLogout();
                }
            });
        }

        // Hook up mobile avatar click with custom confirm modal
        if (mobileAvatarEl && !mobileAvatarEl.dataset.bound) {
            mobileAvatarEl.dataset.bound = 'true';
            mobileAvatarEl.addEventListener('click', async () => {
                const currentUser = this.repository.getUser();
                if (currentUser.picture) {
                    const ok = await window.GymEvo.confirm({
                        title: 'تسجيل الخروج',
                        message: `أهلاً ${currentUser.name} 👋\nهل ترغب في تسجيل الخروج من حساب Google؟`,
                        confirmText: 'نعم، تسجيل الخروج',
                        cancelText: 'إلغاء',
                        danger: false
                    });
                    if (ok) {
                        this.handleLogout();
                    }
                } else {
                    window.GymEvo.notifier.info('تسجيل الدخول مع Google', 'استخدم زر تسجيل الدخول في القائمة الجانبية لحفظ بياناتك.');
                }
            });
        }

        // Notification pulse indicator status
        const notifDot = document.getElementById('mobile-notif-dot');
        if (notifDot && this.reminderManager) {
            const status = this.reminderManager.analyzeUserStatus();
            if (status.needsWeightReminder || status.needsMealReminder) {
                notifDot.style.display = 'block';
            } else {
                notifDot.style.display = 'none';
            }
        }
    }

    handleGoogleLogin(responsePayload) {
        const user = this.repository.getUser();
        user.name = responsePayload.name || user.name;
        user.email = responsePayload.email || '';
        user.picture = responsePayload.picture || '';

        this.repository.saveUser(user);
        this._renderProfileWidget();

        // Re-render current tab so header greeting updates
        this.navigateToTab(this.activeTab);

        window.GymEvo.notifier.success(
            `أهلاً بك، ${responsePayload.name} 👋`,
            'تم تسجيل الدخول بنجاح بحساب Google.'
        );
    }

    handleLogout() {
        const user = this.repository.getUser();
        user.name = 'Captain Evolution';
        user.email = '';
        user.picture = '';

        this.repository.saveUser(user);
        this._renderProfileWidget();
        this.navigateToTab(this.activeTab);

        window.GymEvo.notifier.info('تم تسجيل الخروج بنجاح');
    }

    navigateToTab(tabKey) {
        if (!this.tabs[tabKey]) return;

        // Trigger haptic feedback on mobile if supported
        if (navigator.vibrate) {
            navigator.vibrate(8);
        }

        // Sync Desktop & Mobile active states
        Object.keys(this.tabs).forEach(key => {
            const tabConfig = this.tabs[key];
            const navBtn = document.getElementById(tabConfig.navId);
            const bnavBtn = document.getElementById(tabConfig.bnavId);

            if (navBtn) {
                if (key === tabKey) navBtn.classList.add('active');
                else navBtn.classList.remove('active');
            }

            if (bnavBtn) {
                if (key === tabKey) bnavBtn.classList.add('active');
                else bnavBtn.classList.remove('active');
            }
        });

        this.activeTab = tabKey;

        // Scroll view to top immediately on tab switch
        this.mainContentEl.scrollTop = 0;
        window.scrollTo({ top: 0, behavior: 'instant' });

        // Clear and render new content
        this.mainContentEl.innerHTML = '';
        const section = document.createElement('div');
        section.className = 'view-section active';
        this.mainContentEl.appendChild(section);

        const navigateCallback = (targetKey) => this.navigateToTab(targetKey);
        this.tabs[tabKey].render(this.repository, section, navigateCallback);

        this._renderProfileWidget();
    }
};

// Global JWT decoder function for Google One Tap / Identity Services
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}
window.parseJwt = parseJwt;

// Global Credential Callback defined for Google Identity Services
window.handleCredentialResponse = function(response) {
    try {
        const responsePayload = window.parseJwt(response.credential);
        console.log("دخول ناجح من: " + responsePayload.email);

        if (window.GymEvoAppInstance) {
            window.GymEvoAppInstance.handleGoogleLogin(responsePayload);
        }
    } catch (err) {
        console.error("خطأ في معالجة استجابة تسجيل الدخول:", err);
    }
};

// PWA Installation Handling
let deferredInstallPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    const installBtns = document.querySelectorAll('.pwa-install-btn');
    installBtns.forEach(btn => btn.style.display = 'inline-flex');
});

function setupPwaInstallButtons() {
    const installBtns = document.querySelectorAll('.pwa-install-btn');
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    
    // Always show install triggers if not already running in standalone mode
    if (!isStandalone) {
        installBtns.forEach(btn => btn.style.display = 'inline-flex');
    }

    installBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (deferredInstallPrompt) {
                deferredInstallPrompt.prompt();
                const choiceResult = await deferredInstallPrompt.userChoice;
                if (choiceResult && choiceResult.outcome === 'accepted') {
                    window.GymEvo.notifier.success('تم تثبيت التطبيق بنجاح 🎉', 'يمكنك الآن فتح التطبيق مباشرة والعمل أوفلاين.');
                    installBtns.forEach(b => b.style.display = 'none');
                }
                deferredInstallPrompt = null;
            } else {
                const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
                const modalMessage = isIos
                    ? 'لتثبيت التطبيق على الآيفون: اضغط على زر <strong>المشاركة (Share)</strong> أسفل المتصفح، ثم اختر <strong>"إضافة إلى الشاشة الرئيسية" (Add to Home Screen)</strong> 📲.'
                    : 'لتثبيت التطبيق: افتح قائمة خيارات المتصفح (⋮ أو ⋯) ثم اختر <strong>"تثبيت التطبيق" (Install app)</strong> أو <strong>"إضافة إلى الشاشة الرئيسية"</strong> للعمل أوفلاين.';

                await window.GymEvo.confirm({
                    title: 'تثبيت تطبيق Gym Evolution 📲',
                    message: modalMessage,
                    confirmText: 'حسناً، فهمت',
                    cancelText: 'إغلاق',
                    danger: false
                });
            }
        });
    });
}

// Instantiate and start app on page load
document.addEventListener('DOMContentLoaded', () => {
    window.GymEvoAppInstance = new window.GymEvo.GymEvolutionApp();
    window.GymEvoAppInstance.init();

    // Setup PWA install triggers
    setupPwaInstallButtons();

    // Register PWA Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then((reg) => console.log('[PWA] Service Worker registered with scope:', reg.scope))
            .catch((err) => console.warn('[PWA] Service Worker registration skipped or failed:', err));
    }
});
