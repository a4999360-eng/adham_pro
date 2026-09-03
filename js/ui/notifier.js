/**
 * Gym Evolution - Custom Premium Toast Notification System (Global Scope)
 */

window.GymEvo = window.GymEvo || {};

window.GymEvo.Notifier = class Notifier {
    constructor() {
        this.container = this._getOrCreateContainer();
    }

    /**
     * Resolves toast container element or creates one if it doesn't exist
     */
    _getOrCreateContainer() {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }
        return container;
    }

    /**
     * Shows a customized notification toast
     */
    show(title, desc = '', type = 'info', duration = 4000) {
        const toast = document.createElement('div');
        toast.className = `toast`;

        if (type === 'success') toast.classList.add('mint');
        else if (type === 'error') toast.classList.add('coral');
        else if (type === 'warning') toast.classList.add('orange');

        let iconSvg = '';
        if (type === 'success') {
            iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-mint)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        } else if (type === 'error') {
            iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-coral)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
        } else if (type === 'warning') {
            iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-orange)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
        } else {
            iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
        }

        toast.innerHTML = `
            ${iconSvg}
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                ${desc ? `<div class="toast-desc">${desc}</div>` : ''}
            </div>
            <button class="toast-close">&times;</button>
        `;

        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => this.dismiss(toast));

        this.container.appendChild(toast);

        if (duration > 0) {
            setTimeout(() => {
                this.dismiss(toast);
            }, duration);
        }

        return toast;
    }

    dismiss(toastElement) {
        if (!toastElement || !toastElement.parentNode) return;
        toastElement.classList.add('fade-out');
        toastElement.addEventListener('animationend', () => {
            if (toastElement.parentNode) {
                toastElement.parentNode.removeChild(toastElement);
            }
        });
        setTimeout(() => {
            if (toastElement.parentNode) {
                toastElement.parentNode.removeChild(toastElement);
            }
        }, 300);
    }

    success(title, desc = '') {
        return this.show(title, desc, 'success');
    }

    info(title, desc = '') {
        return this.show(title, desc, 'info');
    }

    warning(title, desc = '') {
        return this.show(title, desc, 'warning');
    }

    error(title, desc = '') {
        return this.show(title, desc, 'error');
    }
};

window.GymEvo.notifier = new window.GymEvo.Notifier();
