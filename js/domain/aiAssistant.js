/**
 * Gym Evolution - Hero AI Assistant Service (OpenAI ChatGPT Integration)
 * "مساعد البطل" - الذكاء الاصطناعي المتخصص في اللياقة والتغذية والتدريب
 */

window.GymEvo = window.GymEvo || {};

window.GymEvo.AiAssistant = {
    STORAGE_KEY_API_KEY: 'gym_evo_openai_api_key',
    STORAGE_KEY_HISTORY: 'gym_evo_hero_chat_history',
    
    // Default API Key provided by the user
    DEFAULT_API_KEY: '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',
    
    // Primary model with fallback
    PRIMARY_MODEL: 'gpt-4o-mini',
    FALLBACK_MODEL: 'gpt-3.5-turbo',

    getApiKey() {
        return localStorage.getItem(this.STORAGE_KEY_API_KEY) || this.DEFAULT_API_KEY;
    },

    setApiKey(key) {
        if (key && key.trim()) {
            localStorage.setItem(this.STORAGE_KEY_API_KEY, key.trim());
        } else {
            localStorage.removeItem(this.STORAGE_KEY_API_KEY);
        }
    },

    getHistory() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY_HISTORY);
            if (data) {
                const parsed = JSON.parse(data);
                // If it only has the older robotic greeting, refresh with the new conversational greeting
                if (parsed.length === 1 && parsed[0].role === 'assistant' && parsed[0].content.includes('كيف يمكنني مساعدتك للارتقاء بلياقتك')) {
                    return this.getInitialHistory();
                }
                return parsed;
            }
        } catch (e) {
            console.error('Failed to load chat history:', e);
        }
        return this.getInitialHistory();
    },

    getInitialHistory() {
        return [
            {
                role: 'assistant',
                content: 'يا هلا بيك يا بطل! 🦾\nأنا **مساعد البطل**، كابتنك وصديقك الذكي في التطبيق.. هنا عشانك في أي وقت، سواء عايز تسأل في تمرين، نظبط أكلك وسعراتك، أو حتى ندردش ونفضفض عن يومك ومودك!\n\nطمني عنك، إيه الأخبار النهاردة؟ 😊'
            }
        ];
    },

    saveHistory(history) {
        try {
            // Keep last 30 messages to avoid token overflow while preserving context
            const trimmed = history.slice(-30);
            localStorage.setItem(this.STORAGE_KEY_HISTORY, JSON.stringify(trimmed));
        } catch (e) {
            console.error('Failed to save chat history:', e);
        }
    },

    clearHistory() {
        const initial = this.getInitialHistory();
        localStorage.setItem(this.STORAGE_KEY_HISTORY, JSON.stringify(initial));
        return initial;
    },

    /**
     * Builds contextual system prompt containing the user's real-time gym stats
     */
    buildSystemPrompt(repo) {
        let userContext = '';
        if (repo) {
            try {
                const user = repo.getUser();
                const meals = repo.getMealsByDate(new Date());
                const workouts = repo.getWorkouts();
                const todayWorkout = workouts.find(w => new Date(w.timestamp).toDateString() === new Date().toDateString());

                let totalEatenCals = 0;
                let totalProtein = 0;
                meals.forEach(m => {
                    totalEatenCals += Number(m.calories) || 0;
                    totalProtein += Number(m.protein) || 0;
                });

                const goalArabic = {
                    lose: 'تنشيف وإنقاص وزن (Fat Loss / Deficit)',
                    maintain: 'محافظة وبناء عضل صافي (Maintenance / Recomp)',
                    gain: 'تضخيم وزيادة وزن وعضل (Bulking / Surplus)'
                }[user.goal] || user.goal;

                userContext = `
[ملف بيانات المستخدم الحي]:
- الاسم: ${user.name || 'البطل'}
- الوزن الحالي: ${user.weight} كجم
- الطول: ${user.height} سم
- العمر: ${user.age} سنة
- الجنس: ${user.gender === 'female' ? 'أنثى' : 'ذكر'}
- الهدف الأساسي: ${goalArabic}
- السعرات اليومية المستهدفة: ${user.customCalories || 'محسوبة تلقائياً'} سعرة
- استهلاك اليوم حتى الآن: ${totalEatenCals} سعرة | بروتين: ${totalProtein}g (${meals.length} وجبات مسجلة)
- تمرين اليوم: ${todayWorkout ? `${todayWorkout.name} (${todayWorkout.completed ? 'منتهي ومكتمل' : 'قيد التدريب'})` : 'لم يتم تسجيل تمرين لليوم'}`;
            } catch (err) {
                console.warn('Could not parse user context for system prompt', err);
            }
        }

        return `أنت "مساعد البطل" (Hero Coach) — رفيق شخصي، مدرب لياقة عبقري، وصديق مقرب للبطل في تطبيق Gym Evolution.

صفاتك وشخصيتك الأساسية:
1. **طبيعي وبديهي وإنساني 100%**: لست روبوتاً أو آلة تلقي محاضرات جافة! تكلّم بتلقائية وبساطة وذكاء عاطفي، وافهم مقصود المستخدم مباشرة.
2. **الرد الطبيعي على التحيات والدردشة العادية**:
   - إذا قال "السلام عليكم"، "صباح الخير"، "مساء الورد"، أو "إزيك": رد بحرارة وود وروح حلوة مرحة كصديق حقيقي، واسأله عن يومه ونشاطه دون إلقاء خطبة عن التمارين!
   - إذا سأل أسئلة شخصية أو عامة أو حب يدردش ويفضفض (عن التعب، الكسل، الضغوطات، قلة النوم، الملل): استمع له بتعاطف حقيقي، وشجعه كأخ ومدرب مخلص يؤمن به.
3. **مرونة لغوية فائقة**: افهم وتجاوب مع أي لهجة (مصرية، خليجية، شامية، أو فصحى) بذكاء وطلاقة وبنفس روح المستخدم.
4. **عبقرية في الجيم والتغذية بدون تعقيد**:
   - في أمور التدريب، الدايت، السعرات، المكملات، والتكنيك، أنت مرجع علمي ذكي جداً لكنك تشرح الأمور بأسهل طريقة وبشكل ممتع وعملي.
   - استعن ببيانات ملفه الحالية المرفقة بالأسفل لتعطيه نصائح على مقاسه بالضبط.
5. **التكيف مع حجم السؤال**:
   - إذا كان سؤاله قصيراً أو عابراً، اجعل جوابك خفيفاً وموجزاً وممتعاً.
   - إذا طلب خطة أو نظاماً مفصلاً، نسق له الإجابة بجمالية (نقاط، أرقام، إيموجيز).
6. **روح البطل**: ابعث فيه الحماس والطاقة الإيجابية دائماً.

${userContext}`;
    },

    /**
     * Send message to OpenAI ChatGPT API
     * @param {string} userMessage
     * @param {Object} repo - Gym Evolution LocalRepository
     * @returns {Promise<string>} Bot response
     */
    async sendMessage(userMessage, repo) {
        const apiKey = this.getApiKey();
        if (!apiKey) {
            throw new Error('يرجى ضبط مفتاح API Key الخاص بـ OpenAI للبدء.');
        }

        const history = this.getHistory();
        history.push({ role: 'user', content: userMessage });

        const systemPrompt = this.buildSystemPrompt(repo);

        // Prepare messages payload
        const messages = [
            { role: 'system', content: systemPrompt },
            ...history.slice(-14) // Send last 14 messages for rich natural conversation flow
        ];

        let responseText = '';

        try {
            // First attempt with primary model
            responseText = await this._callOpenAi(apiKey, this.PRIMARY_MODEL, messages);
        } catch (primaryErr) {
            console.warn(`Primary model ${this.PRIMARY_MODEL} failed, trying fallback:`, primaryErr);
            try {
                // Fallback attempt
                responseText = await this._callOpenAi(apiKey, this.FALLBACK_MODEL, messages);
            } catch (fallbackErr) {
                console.error('All OpenAI models failed:', fallbackErr);
                // Remove the user message from history on error
                history.pop();
                throw fallbackErr;
            }
        }

        // Add assistant response to history and save
        history.push({ role: 'assistant', content: responseText });
        this.saveHistory(history);

        return responseText;
    },

    async _callOpenAi(apiKey, model, messages) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                temperature: 0.85,
                presence_penalty: 0.3,
                frequency_penalty: 0.3,
                max_tokens: 1200
            })
        });

        if (!response.ok) {
            let errorMsg = `خطأ من سيرفر OpenAI (${response.status})`;
            try {
                const errData = await response.json();
                if (errData && errData.error && errData.error.message) {
                    errorMsg = errData.error.message;
                }
            } catch (e) {}
            throw new Error(errorMsg);
        }

        const data = await response.json();
        if (data.choices && data.choices[0] && data.choices[0].message) {
            return data.choices[0].message.content;
        }
        throw new Error('لم يتم استلام نص استجابة صالح من الذكاء الاصطناعي.');
    }
};
