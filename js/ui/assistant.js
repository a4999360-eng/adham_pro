/**
 * Gym Evolution - Hero AI Assistant UI View Driver ("مساعد البطل")
 */

window.GymEvo = window.GymEvo || {};

window.GymEvo.renderAssistant = function(repo, container) {
    const ai = window.GymEvo.AiAssistant;
    let isGenerating = false;

    function formatMarkdown(text) {
        if (!text) return '';
        // Escape basic HTML
        let esc = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Bold
        esc = esc.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Italic
        esc = esc.replace(/\*(.*?)\*/g, '<em>$1</em>');
        // Headers
        esc = esc.replace(/^### (.*$)/gim, '<h4 class="chat-h4">$1</h4>');
        esc = esc.replace(/^## (.*$)/gim, '<h3 class="chat-h3">$1</h3>');
        // List items
        esc = esc.replace(/^\s*[-•*]\s+(.*$)/gim, '<li class="chat-li">$1</li>');
        // Wrap lists
        esc = esc.replace(/(<li.*<\/li>)/gms, '<ul class="chat-ul">$1</ul>');
        // Numbered list
        esc = esc.replace(/^\s*(\d+)\.\s+(.*$)/gim, '<li class="chat-oli"><strong>$1.</strong> $2</li>');
        // Line breaks (convert double newline to paragraph, single to br)
        esc = esc.replace(/\n\n/g, '<br/><br/>');
        esc = esc.replace(/\n/g, '<br/>');

        return esc;
    }

    function updateView() {
        const history = ai.getHistory();

        container.innerHTML = `
            <div class="view-header" style="margin-bottom: 1.25rem;">
                <div class="view-header-title">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <div class="hero-bot-avatar-badge">🦾</div>
                        <div>
                            <h1 style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.15rem;">
                                مساعد البطل 
                                <span class="ai-pill-tag">ChatGPT Powered</span>
                            </h1>
                            <p>مدربك الرياضي وخبير التغذية الذكي — اسأله عن أي شيء في التمارين والدايت.</p>
                        </div>
                    </div>
                </div>
                <div class="header-action" style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-secondary btn-sm" id="btn-api-settings" title="إعدادات الـ API Key">
                        ⚙️ مفتاح API
                    </button>
                    <button class="btn btn-secondary btn-sm" id="btn-clear-chat" title="مسح المحادثة وبدء محادثة جديدة">
                        🗑️ مسح المحادثة
                    </button>
                </div>
            </div>

            <!-- Main Chat Card Container -->
            <div class="hero-chat-container">
                <!-- Messages Scroll Box -->
                <div class="hero-chat-messages" id="chat-messages-box">
                    ${history.map(msg => renderMessageHtml(msg)).join('')}
                    <div id="chat-typing-indicator" class="chat-typing-box" style="display: none;">
                        <div class="chat-msg-avatar">🦾</div>
                        <div class="chat-bubble bot typing">
                            <span class="typing-dot"></span>
                            <span class="typing-dot"></span>
                            <span class="typing-dot"></span>
                            <span style="margin-right: 0.5rem; font-size: 0.8rem; color: var(--text-secondary);">مساعد البطل يفكر ويكتب...</span>
                        </div>
                    </div>
                </div>

                <!-- Conversational Quick Prompts Bar (Optional & Spontaneous) -->
                <div class="quick-prompts-container" id="quick-prompts-container">
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.4rem 1.25rem 0.2rem 1.25rem; font-size: 0.75rem; color: var(--text-tertiary);">
                        <span>💡 أفكار لفتح الكلام (أو اكتب أي سؤال يخطر ببالك بحرية تامة):</span>
                        <button type="button" class="btn-icon" id="btn-toggle-prompts" title="إخفاء الاقتراحات" style="font-size: 0.75rem; padding: 0.1rem 0.35rem;">✕ إخفاء</button>
                    </div>
                    <div class="quick-prompts-bar" id="quick-prompts-bar">
                        <button type="button" class="quick-prompt-btn" data-prompt="السلام عليكم يا كابتن! إزيك وإيه الأخبار عندك؟ 👋">👋 السلام عليكم، إزيك يا كابتن؟</button>
                        <button type="button" class="quick-prompt-btn" data-prompt="ماليش نفس أتمرن النهاردة وحاسس بكسل.. تنصحني بإيه؟ 😅">😅 كسلان وماليش نفس للجيم</button>
                        <button type="button" class="quick-prompt-btn" data-prompt="إيه رأيك في أكلي وسعراتي المسجلة في التطبيق النهاردة؟ 📊">📊 إيه رأيك في يومي وأكلي؟</button>
                        <button type="button" class="quick-prompt-btn" data-prompt="اقترح لي وجبة عشاء لذيذة وسريعة وفيها بروتين عالي 🍳">🍳 عشاء سريع وبروتين عالي</button>
                        <button type="button" class="quick-prompt-btn" data-prompt="إيه أفضل وقت لشرب القهوة ومشروبات الطاقة قبل التمرين؟ ☕">☕ فنجان القهوة قبل التمرين بقد إيه؟</button>
                        <button type="button" class="quick-prompt-btn" data-prompt="عايز أفضفض معاك شوية عن يومي وضغوطاتي 💬">💬 عايز أفضفض معاك شوية</button>
                    </div>
                </div>

                <!-- Chat Input Section -->
                <form class="hero-chat-input-bar" id="chat-form">
                    <textarea 
                        id="chat-input" 
                        class="hero-chat-textarea" 
                        placeholder="اتكلم مع مساعد البطل في أي حاجة.. دردشة شخصية، تمارين، دايت، أو فضفضة! (Enter للإرسال)" 
                        rows="1" 
                        required
                    ></textarea>
                    <button type="submit" class="btn btn-primary hero-send-btn" id="chat-send-btn" title="إرسال">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                        <span class="send-text-lbl">إرسال</span>
                    </button>
                </form>
            </div>

            <!-- API Key Settings Modal -->
            <div class="modal-overlay" id="api-key-modal" style="display: none;">
                <div class="modal-content confirm-modal-card" style="text-align: right; max-width: 480px;">
                    <h3 style="margin-bottom: 0.5rem; font-family: var(--font-heading);">⚙️ إعدادات اتصال ChatGPT</h3>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.25rem;">
                        المفتاح مدمج ومفعل تلقائياً. يمكنك تحديثه في أي وقت إذا رغبت باستخدام مفتاح خاص بك من OpenAI.
                    </p>
                    <div class="form-group" style="margin-bottom: 1.25rem;">
                        <label style="font-size: 0.825rem; font-weight: 600;">OpenAI API Key:</label>
                        <input type="password" id="input-openai-key" style="direction: ltr; font-family: monospace; font-size: 0.85rem;" placeholder="sk-proj-...">
                    </div>
                    <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
                        <button type="button" class="btn btn-secondary" id="btn-close-api-modal">إلغاء</button>
                        <button type="button" class="btn btn-primary" id="btn-save-api-modal">حفظ المفتاح</button>
                    </div>
                </div>
            </div>
        `;

        setupListeners();
        scrollToBottom();
    }

    function renderMessageHtml(msg) {
        const isUser = msg.role === 'user';
        return `
            <div class="chat-msg-row ${isUser ? 'user' : 'bot'}">
                ${!isUser ? `<div class="chat-msg-avatar">🦾</div>` : ''}
                <div class="chat-bubble ${isUser ? 'user' : 'bot'}">
                    ${isUser ? `<div class="chat-text">${escapeHtml(msg.content)}</div>` : `<div class="chat-text markdown">${formatMarkdown(msg.content)}</div>`}
                </div>
                ${isUser ? `<div class="chat-msg-avatar user">${(repo.getUser().name || 'أنا')[0].toUpperCase()}</div>` : ''}
            </div>
        `;
    }

    function escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function scrollToBottom() {
        const box = document.getElementById('chat-messages-box');
        if (box) {
            box.scrollTop = box.scrollHeight;
        }
    }

    function setupListeners() {
        const form = document.getElementById('chat-form');
        const input = document.getElementById('chat-input');
        const sendBtn = document.getElementById('chat-send-btn');
        const messagesBox = document.getElementById('chat-messages-box');
        const typingIndicator = document.getElementById('chat-typing-indicator');

        // Auto-expanding textarea & Enter key support
        if (input) {
            input.addEventListener('input', () => {
                input.style.height = 'auto';
                input.style.height = Math.min(input.scrollHeight, 120) + 'px';
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (!isGenerating && input.value.trim()) {
                        form.dispatchEvent(new Event('submit'));
                    }
                }
            });
        }

        // Send message handler
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const text = input.value.trim();
                if (!text || isGenerating) return;

                isGenerating = true;
                input.value = '';
                input.style.height = 'auto';
                sendBtn.disabled = true;

                // Append user message immediately to UI
                const userMsgEl = document.createElement('div');
                userMsgEl.className = 'chat-msg-row user';
                userMsgEl.innerHTML = `
                    <div class="chat-bubble user">
                        <div class="chat-text">${escapeHtml(text)}</div>
                    </div>
                    <div class="chat-msg-avatar user">${(repo.getUser().name || 'أنا')[0].toUpperCase()}</div>
                `;
                messagesBox.insertBefore(userMsgEl, typingIndicator);

                // Show typing indicator
                typingIndicator.style.display = 'flex';
                scrollToBottom();

                try {
                    const reply = await ai.sendMessage(text, repo);

                    // Render bot reply
                    const botMsgEl = document.createElement('div');
                    botMsgEl.className = 'chat-msg-row bot';
                    botMsgEl.innerHTML = `
                        <div class="chat-msg-avatar">🦾</div>
                        <div class="chat-bubble bot">
                            <div class="chat-text markdown">${formatMarkdown(reply)}</div>
                        </div>
                    `;
                    messagesBox.insertBefore(botMsgEl, typingIndicator);
                } catch (err) {
                    window.GymEvo.notifier.error(
                        'تعذر الرد من مساعد البطل',
                        err.message || 'يرجى التحقق من اتصال الإنترنت أو مفتاح API.'
                    );

                    const errMsgEl = document.createElement('div');
                    errMsgEl.className = 'chat-msg-row bot';
                    errMsgEl.innerHTML = `
                        <div class="chat-msg-avatar">⚠️</div>
                        <div class="chat-bubble bot" style="border-color: var(--accent-coral); background-color: var(--accent-coral-soft);">
                            <div class="chat-text" style="color: var(--accent-coral); font-size: 0.85rem;">
                                <strong>عذراً يا بطل:</strong> حدث خطأ أثناء محاولة الاتصال بـ ChatGPT (${err.message}).<br/>
                                تأكد من تشغيل الإنترنت أو تحقق من إعدادات مفتاح الـ API.
                            </div>
                        </div>
                    `;
                    messagesBox.insertBefore(errMsgEl, typingIndicator);
                } finally {
                    typingIndicator.style.display = 'none';
                    isGenerating = false;
                    sendBtn.disabled = false;
                    scrollToBottom();
                    if (input) input.focus();
                }
            });
        }

        // Toggle prompts visibility
        const togglePromptsBtn = document.getElementById('btn-toggle-prompts');
        const promptsContainer = document.getElementById('quick-prompts-container');
        if (togglePromptsBtn && promptsContainer) {
            togglePromptsBtn.addEventListener('click', () => {
                promptsContainer.style.display = 'none';
            });
        }

        // Quick prompt chips click
        document.querySelectorAll('.quick-prompt-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const prompt = btn.dataset.prompt;
                if (input && !isGenerating) {
                    input.value = prompt;
                    form.dispatchEvent(new Event('submit'));
                }
            });
        });

        // Clear Chat Confirmation
        const clearBtn = document.getElementById('btn-clear-chat');
        if (clearBtn) {
            clearBtn.addEventListener('click', async () => {
                const ok = await window.GymEvo.confirm({
                    title: 'مسح محادثة مساعد البطل',
                    message: 'هل تريد مسح سجل الرسائل وبدء محادثة تدريبية جديدة؟',
                    confirmText: 'نعم، مسح المحادثة',
                    cancelText: 'إلغاء',
                    danger: true
                });

                if (ok) {
                    ai.clearHistory();
                    window.GymEvo.notifier.info('تم مسح المحادثة', 'بدأت جلسة جديدة مع مساعد البطل.');
                    updateView();
                }
            });
        }

        // API Key Settings Modal
        const apiBtn = document.getElementById('btn-api-settings');
        const apiModal = document.getElementById('api-key-modal');
        const apiInput = document.getElementById('input-openai-key');
        const closeApiBtn = document.getElementById('btn-close-api-modal');
        const saveApiBtn = document.getElementById('btn-save-api-modal');

        if (apiBtn && apiModal) {
            apiBtn.addEventListener('click', () => {
                apiInput.value = ai.getApiKey();
                apiModal.style.display = 'flex';
            });

            closeApiBtn.addEventListener('click', () => {
                apiModal.style.display = 'none';
            });

            saveApiBtn.addEventListener('click', () => {
                const newKey = apiInput.value.trim();
                ai.setApiKey(newKey);
                apiModal.style.display = 'none';
                window.GymEvo.notifier.success('تم حفظ المفتاح', 'تم تحديث اتصال OpenAI بنجاح.');
            });

            apiModal.addEventListener('click', (e) => {
                if (e.target === apiModal) apiModal.style.display = 'none';
            });
        }
    }

    updateView();
};
