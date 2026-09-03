/**
 * Gym Evolution - Custom Confirmation Dialog System (Global Scope)
 * Prompts user before destructive actions (deleting meals, metrics, workouts)
 */

window.GymEvo = window.GymEvo || {};

window.GymEvo.confirm = function(options = {}) {
    const {
        title = 'تأكيد الحذف',
        message = 'هل أنت متأكد من رغبتك في حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.',
        confirmText = 'نعم، حذف العنصر',
        cancelText = 'إلغاء التراجع',
        danger = true
    } = options;

    return new Promise((resolve) => {
        let modalEl = document.getElementById('confirm-modal-overlay');
        if (!modalEl) {
            modalEl = document.createElement('div');
            modalEl.id = 'confirm-modal-overlay';
            modalEl.className = 'modal-overlay';
            document.body.appendChild(modalEl);
        }

        modalEl.innerHTML = `
            <div class="modal-content confirm-modal-card">
                <div class="confirm-icon-box ${danger ? 'danger' : 'warning'}">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                </div>
                <div class="confirm-text-wrap">
                    <h3 class="confirm-title">${title}</h3>
                    <p class="confirm-desc">${message}</p>
                </div>
                <div class="confirm-actions-row">
                    <button class="btn btn-secondary" id="confirm-btn-cancel">${cancelText}</button>
                    <button class="btn ${danger ? 'btn-coral' : 'btn-primary'}" id="confirm-btn-ok">${confirmText}</button>
                </div>
            </div>
        `;

        modalEl.style.display = 'flex';

        function cleanup(result) {
            modalEl.style.display = 'none';
            document.removeEventListener('keydown', handleKeydown);
            resolve(result);
        }

        function handleKeydown(e) {
            if (e.key === 'Escape') cleanup(false);
        }

        document.getElementById('confirm-btn-cancel').addEventListener('click', () => cleanup(false));
        document.getElementById('confirm-btn-ok').addEventListener('click', () => cleanup(true));
        
        modalEl.addEventListener('click', (e) => {
            if (e.target === modalEl) cleanup(false);
        });

        document.addEventListener('keydown', handleKeydown);
    });
};
