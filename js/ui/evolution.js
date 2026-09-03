/**
 * Gym Evolution - Evolution Tracker & Custom SVG Data Visualization (Global Scope)
 */

window.GymEvo = window.GymEvo || {};

window.GymEvo.renderEvolution = function(repo, container) {
    let activeChartMetric = 'weight';

    function updateView() {
        const metrics = repo.getMetrics();

        container.innerHTML = `
            <div class="view-header">
                <div class="view-header-title">
                    <h1>متابع التطور الجسدي 📈</h1>
                    <p>رصد تقدم قياساتك الحيوية ومؤشرات البنية العضلية بيانيّاً.</p>
                </div>
                <div class="header-action">
                    <button class="btn btn-primary" id="btn-export-progress">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                        <span>شارك تقدمك / تصدير ⚡</span>
                    </button>
                </div>
            </div>

            <div class="dashboard-grid">
                <!-- Left: Chart visualization -->
                <div class="card col-8">
                    <div class="card-header" style="padding-bottom: 0.5rem;">
                        <div class="card-title">منحنى التطور البياني</div>
                        
                        <div class="tab-group" style="margin-bottom: 0;">
                            <button class="tab-btn ${activeChartMetric === 'weight' ? 'active' : ''}" id="chart-toggle-weight">الوزن</button>
                            <button class="tab-btn ${activeChartMetric === 'bodyFat' ? 'active' : ''}" id="chart-toggle-fat">الدهون %</button>
                            <button class="tab-btn ${activeChartMetric === 'waist' ? 'active' : ''}" id="chart-toggle-waist">الخصر (سم)</button>
                        </div>
                    </div>

                    <div style="position: relative;">
                        <div id="svg-chart-wrapper" class="chart-svg-container">
                            ${renderSvgChart(metrics, activeChartMetric)}
                        </div>
                        <div id="chart-tooltip" class="chart-tooltip"></div>
                    </div>
                </div>

                <!-- Right: Logger & Stats -->
                <div class="card col-4">
                    <div class="card-header">
                        <div class="card-title">تسجيل القياسات اليومية</div>
                    </div>
                    
                    <form id="add-metric-form">
                        <div class="form-group">
                            <label>وزن الجسم الحالي (${window.GymEvo.Units ? window.GymEvo.Units.getWeightUnit() : 'كجم'})</label>
                            <input type="number" step="0.1" id="metric-weight" placeholder="مثال: 78.5" required>
                        </div>

                        <div class="input-row">
                            <div class="form-group">
                                <label>نسبة الدهون (%) - اختياري</label>
                                <input type="number" step="0.1" id="metric-fat" placeholder="مثال: 15.2">
                            </div>
                            <div class="form-group">
                                <label>محيط الخصر (${window.GymEvo.Units ? window.GymEvo.Units.getLengthUnit() : 'سم'}) - اختياري</label>
                                <input type="number" step="0.1" id="metric-waist" placeholder="مثال: 84">
                            </div>
                        </div>

                        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1.5rem;">
                            تسجيل القياس الحالي
                        </button>
                    </form>
                </div>

                <!-- Bottom: Log list history -->
                <div class="card col-12">
                    <div class="card-header">
                        <div class="card-title">تاريخ القياسات المسجلة</div>
                    </div>
                    
                    <div class="table-container">
                        ${metrics.length === 0 ? `
                            <div class="empty-state">
                                <p class="empty-state-title">سجل القياسات فارغ</p>
                                <p class="empty-state-desc">سجل أول وزن لك اليوم لبدء تتبع المنحنى.</p>
                            </div>
                        ` : `
                            <table>
                                <thead>
                                    <tr>
                                        <th>التاريخ</th>
                                        <th>وزن الجسم (${window.GymEvo.Units ? window.GymEvo.Units.getWeightUnit() : 'كجم'})</th>
                                        <th>نسبة الدهون (%)</th>
                                        <th>محيط الخصر (${window.GymEvo.Units ? window.GymEvo.Units.getLengthUnit() : 'سم'})</th>
                                        <th>إجراءات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${[...metrics].reverse().map(m => {
                                        const date = new Date(m.timestamp).toLocaleDateString('ar-EG', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        });
                                        const formattedWeight = window.GymEvo.Units ? window.GymEvo.Units.formatWeight(m.weight).formatted : `${m.weight} كجم`;
                                        const formattedWaist = m.waist !== null 
                                            ? (window.GymEvo.Units ? window.GymEvo.Units.formatLength(m.waist).formatted : `${m.waist} سم`) 
                                            : '-';
                                        return `
                                            <tr>
                                                <td>${date}</td>
                                                <td style="font-weight: 600;">${formattedWeight}</td>
                                                <td>${m.bodyFat !== null ? `${m.bodyFat}%` : '-'}</td>
                                                <td>${formattedWaist}</td>
                                                <td>
                                                    <button class="btn-icon delete-metric-btn" data-id="${m.id}" title="حذف القراءة">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-coral)" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        `;
                                    }).join('')}
                                </tbody>
                            </table>
                        `}
                    </div>
                </div>
            </div>
        `;

        setupListeners();
    }

    function renderSvgChart(metrics, metricKey) {
        const data = metrics.filter(m => m[metricKey] !== null && m[metricKey] !== undefined);
        
        if (data.length < 2) {
            return `
                <div class="empty-state" style="height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                    <p class="empty-state-title">بيانات غير كافية لرسم المنحنى</p>
                    <p class="empty-state-desc">يرجى تسجيل قراءتين على الأقل في أيام مختلفة لرؤية التطور.</p>
                </div>
            `;
        }

        const width = 600;
        const height = 200;
        const paddingLeft = 40;
        const paddingRight = 20;
        const paddingTop = 20;
        const paddingBottom = 30;

        const chartWidth = width - paddingLeft - paddingRight;
        const chartHeight = height - paddingTop - paddingBottom;

        const values = data.map(m => m[metricKey]);
        const minVal = Math.min(...values);
        const maxVal = Math.max(...values);
        const valRange = maxVal - minVal;
        
        const yMin = valRange === 0 ? minVal - 2 : minVal - (valRange * 0.15);
        const yMax = valRange === 0 ? maxVal + 2 : maxVal + (valRange * 0.15);
        const yRange = yMax - yMin;

        const timestamps = data.map(m => m.timestamp);
        const minTime = Math.min(...timestamps);
        const maxTime = Math.max(...timestamps);
        const timeRange = maxTime - minTime || 1;

        const getX = (ts) => paddingLeft + ((ts - minTime) / timeRange) * chartWidth;
        const getY = (val) => paddingTop + chartHeight - ((val - yMin) / yRange) * chartHeight;

        const points = data.map(m => ({
            x: getX(m.timestamp),
            y: getY(m[metricKey]),
            val: m[metricKey],
            date: new Date(m.timestamp).toLocaleDateString('ar-EG', { month: 'numeric', day: 'numeric' }),
            raw: m
        }));

        let linePath = `M ${points[0].x} ${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
            linePath += ` L ${points[i].x} ${points[i].y}`;
        }

        const fillPath = `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`;

        let strokeColor = 'var(--accent-blue)';
        let fillGradStart = 'rgba(0, 112, 243, 0.15)';
        if (metricKey === 'bodyFat') {
            strokeColor = 'var(--accent-orange)';
            fillGradStart = 'rgba(245, 158, 11, 0.15)';
        } else if (metricKey === 'waist') {
            strokeColor = 'var(--accent-mint)';
            fillGradStart = 'rgba(16, 185, 129, 0.15)';
        }

        const gridLinesCount = 3;
        let gridHtml = '';
        for (let i = 0; i <= gridLinesCount; i++) {
            const ratio = i / gridLinesCount;
            const yCoord = paddingTop + (chartHeight * ratio);
            const val = yMax - (yRange * ratio);
            gridHtml += `
                <line x1="${paddingLeft}" y1="${yCoord}" x2="${width - paddingRight}" y2="${yCoord}" class="chart-grid-line" />
                <text x="${paddingLeft - 10}" y="${yCoord + 3}" text-anchor="end" class="chart-label-text">${val.toFixed(1)}</text>
            `;
        }

        const dotsHtml = points.map(pt => `
            <circle cx="${pt.x}" cy="${pt.y}" r="4" class="chart-dot" style="stroke: ${strokeColor};" />
            <circle cx="${pt.x}" cy="${pt.y}" r="12" fill="transparent" style="cursor: pointer;"
                    class="chart-hotzone" data-val="${pt.val}" data-date="${pt.date}" />
        `).join('');

        const firstPt = points[0];
        const lastPt = points[points.length - 1];
        const midPt = points[Math.floor(points.length / 2)];
        const xAxisHtml = `
            <text x="${firstPt.x}" y="${height - 10}" text-anchor="start" class="chart-label-text">${firstPt.date}</text>
            <text x="${midPt.x}" y="${height - 10}" text-anchor="middle" class="chart-label-text">${midPt.date}</text>
            <text x="${lastPt.x}" y="${height - 10}" text-anchor="end" class="chart-label-text">${lastPt.date}</text>
        `;

        return `
            <svg viewBox="0 0 ${width} ${height}" width="100%" height="100%" style="overflow: visible;">
                <defs>
                    <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="${fillGradStart}" />
                        <stop offset="100%" stop-color="rgba(255, 255, 255, 0.0)" />
                    </linearGradient>
                </defs>
                
                ${gridHtml}
                <path d="${fillPath}" fill="url(#chart-gradient)" />
                <path d="${linePath}" class="chart-line" style="stroke: ${strokeColor};" />
                ${dotsHtml}
                ${xAxisHtml}
            </svg>
        `;
    }

    function setupListeners() {
        const btnWeight = document.getElementById('chart-toggle-weight');
        const btnFat = document.getElementById('chart-toggle-fat');
        const btnWaist = document.getElementById('chart-toggle-waist');

        if (btnWeight) {
            btnWeight.addEventListener('click', () => {
                activeChartMetric = 'weight';
                updateView();
            });
        }
        if (btnFat) {
            btnFat.addEventListener('click', () => {
                activeChartMetric = 'bodyFat';
                updateView();
            });
        }
        if (btnWaist) {
            btnWaist.addEventListener('click', () => {
                activeChartMetric = 'waist';
                updateView();
            });
        }

        const addMetricForm = document.getElementById('add-metric-form');
        addMetricForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let weight = parseFloat(document.getElementById('metric-weight').value);
            const fatInput = document.getElementById('metric-fat').value;
            const waistInput = document.getElementById('metric-waist').value;

            const isImperial = window.GymEvo.Units && window.GymEvo.Units.getSystem() === 'imperial';
            // If in imperial, convert entered lbs to kg for internal storage
            const weightInKg = isImperial ? (window.GymEvo.Units.lbToKg(weight) || weight) : weight;
            
            const bodyFat = fatInput ? parseFloat(fatInput) : null;
            let waist = waistInput ? parseFloat(waistInput) : null;
            if (waist !== null && isImperial) {
                waist = window.GymEvo.Units.inToCm(waist) || waist;
            }

            const newMetric = new window.GymEvo.Metric({
                weight: weightInKg,
                bodyFat,
                waist
            });

            const user = repo.getUser();
            user.weight = weightInKg;
            repo.saveUser(user);

            repo.saveMetric(newMetric);
            const unitName = isImperial ? 'باوند' : 'كجم';
            window.GymEvo.notifier.success('تم تسجيل القراءة بنجاح', `الوزن المسجل: ${weight} ${unitName}`);
            updateView();
        });

        document.querySelectorAll('.delete-metric-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                const metric = repo.getMetrics().find(m => m.id === id);
                if (metric) {
                    const ok = await window.GymEvo.confirm({
                        title: 'حذف قراءة الميزان',
                        message: `هل أنت متأكد من حذف قراءة الوزن (${metric.weight} كجم)؟`,
                        confirmText: 'نعم، حذف القراءة',
                        danger: true
                    });
                    if (ok) {
                        repo.deleteMetric(id);
                        window.GymEvo.notifier.warning('تمت إزالة قراءة الميزان');
                        updateView();
                    }
                }
            });
        });

        const tooltip = document.getElementById('chart-tooltip');
        const hotzones = document.querySelectorAll('.chart-hotzone');

        hotzones.forEach(zone => {
            zone.addEventListener('mouseover', (e) => {
                const val = parseFloat(zone.dataset.val).toFixed(1);
                const date = zone.dataset.date;
                let unit = 'كجم';
                if (activeChartMetric === 'bodyFat') unit = '%';
                else if (activeChartMetric === 'waist') unit = 'سم';

                tooltip.innerHTML = `<strong>${val} ${unit}</strong> <br/> ${date}`;
                tooltip.style.opacity = 1;

                const wrapperRect = document.getElementById('svg-chart-wrapper').getBoundingClientRect();
                const xPos = e.clientX - wrapperRect.left;
                const yPos = e.clientY - wrapperRect.top;
                
                tooltip.style.left = `${xPos}px`;
                tooltip.style.top = `${yPos}px`;
            });

            zone.addEventListener('mousemove', (e) => {
                const wrapperRect = document.getElementById('svg-chart-wrapper').getBoundingClientRect();
                const xPos = e.clientX - wrapperRect.left;
                const yPos = e.clientY - wrapperRect.top;
                tooltip.style.left = `${xPos}px`;
                tooltip.style.top = `${yPos}px`;
            });

            zone.addEventListener('mouseout', () => {
                tooltip.style.opacity = 0;
            });
        });

        const exportBtn = document.getElementById('btn-export-progress');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                openExportModal(repo);
            });
        }
    }

    function openExportModal(repo) {
        let modalEl = document.getElementById('export-modal-overlay');
        if (!modalEl) {
            modalEl = document.createElement('div');
            modalEl.id = 'export-modal-overlay';
            modalEl.className = 'modal-overlay';
            document.body.appendChild(modalEl);
        }

        const user = repo.getUser();
        const metrics = repo.getMetrics();
        const workouts = repo.getWorkouts();

        const latestMetric = metrics[metrics.length - 1];
        const firstMetric = metrics[0];
        const currentWeight = latestMetric ? latestMetric.weight : user.weight;
        const initialWeight = firstMetric ? firstMetric.weight : currentWeight;
        const weightDiff = parseFloat((currentWeight - initialWeight).toFixed(1));
        const completedWorkouts = workouts.filter(w => w.completed).length;

        const summaryText = `🔥 تقرير تطوري البدني على Gym Evolution:
الوزن الحالي: ${currentWeight} كجم (${weightDiff <= 0 ? 'خسارة' : 'زيادة'} ${Math.abs(weightDiff)} كجم)
التمارين المكتملة: ${completedWorkouts} جلسة تدريبية
استمر في التطور وتحقيق أهدافك! 💪 #GymEvolution`;

        modalEl.innerHTML = `
            <div class="modal-content modal-content-lg">
                <div class="modal-header">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <div class="reminder-icon-box" style="background: var(--accent-blue-soft); color: var(--accent-blue);">📊</div>
                        <div>
                            <h2>تصدير ومشاركة التقدم البدني</h2>
                            <p class="modal-subtitle">شارك إنجازاتك الرياضية مع أصدقائك أو احتفظ بتقرير PDF متكامل لرحلتك.</p>
                        </div>
                    </div>
                    <button class="modal-close-btn" id="close-export-modal">&times;</button>
                </div>

                <div class="modal-body">
                    <!-- Progress Highlights Row -->
                    <div class="export-stats-preview">
                        <div class="export-stat-box">
                            <span class="export-stat-label">الوزن الحالي</span>
                            <span class="export-stat-num">${currentWeight} <small>كجم</small></span>
                        </div>
                        <div class="export-stat-box">
                            <span class="export-stat-label">التغير الإجمالي</span>
                            <span class="export-stat-num ${weightDiff <= 0 ? 'text-mint' : 'text-orange'}">
                                ${weightDiff > 0 ? '+' : ''}${weightDiff} <small>كجم</small>
                            </span>
                        </div>
                        <div class="export-stat-box">
                            <span class="export-stat-label">التمارين المنجزة</span>
                            <span class="export-stat-num">${completedWorkouts} <small>جلسة</small></span>
                        </div>
                    </div>

                    <!-- Visual Card Preview placeholder / loader -->
                    <div class="export-card-preview-container" id="card-preview-wrap">
                        <div id="card-preview-loading" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 180px; color: var(--text-secondary);">
                            <div class="spinner"></div>
                            <span style="margin-top: 0.75rem; font-size: 0.85rem;">جارٍ تجهيز بطاقة الإنجاز الفائقة...</span>
                        </div>
                        <img id="card-preview-img" style="display: none; width: 100%; max-height: 280px; object-fit: contain; border-radius: var(--radius-md); box-shadow: var(--shadow-sm);" />
                    </div>

                    <!-- Export Options Grid -->
                    <div class="export-actions-grid" style="margin-top: 1.5rem;">
                        <button class="export-option-btn primary-export" id="btn-download-image">
                            <div class="export-option-icon">🖼️</div>
                            <div>
                                <div class="export-option-title">تحميل كصورة (PNG)</div>
                                <div class="export-option-desc">بطاقة إنجاز بدقة عالية للنشر على إنستجرام وتويتر وواتساب</div>
                            </div>
                        </button>

                        <button class="export-option-btn" id="btn-download-pdf">
                            <div class="export-option-icon">📄</div>
                            <div>
                                <div class="export-option-title">تصدير كـ PDF / طباعة التقرير</div>
                                <div class="export-option-desc">تقرير شامل بكافة البيانات والمنحنى للطباعة أو الأرشفة كـ PDF</div>
                            </div>
                        </button>

                        <button class="export-option-btn" id="btn-share-social">
                            <div class="export-option-icon">🚀</div>
                            <div>
                                <div class="export-option-title">مشاركة سريعة / نسخ الملخص</div>
                                <div class="export-option-desc">مشاركة مباشرة عبر تطبيقات الهاتف أو نسخ نص الإنجاز للحافظة</div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        `;

        modalEl.style.display = 'flex';

        function closeModal() {
            modalEl.style.display = 'none';
        }

        document.getElementById('close-export-modal').addEventListener('click', closeModal);
        modalEl.addEventListener('click', (e) => {
            if (e.target === modalEl) closeModal();
        });

        // Generate card preview in background
        let generatedCardUrl = null;
        if (window.GymEvo.Exporter) {
            window.GymEvo.Exporter.generateShareCard({ user, metrics, workouts }).then(dataUrl => {
                generatedCardUrl = dataUrl;
                const loadingEl = document.getElementById('card-preview-loading');
                const imgEl = document.getElementById('card-preview-img');
                if (loadingEl && imgEl) {
                    loadingEl.style.display = 'none';
                    imgEl.src = dataUrl;
                    imgEl.style.display = 'block';
                }
            }).catch(err => {
                console.error('Card generation error:', err);
                const loadingEl = document.getElementById('card-preview-loading');
                if (loadingEl) loadingEl.textContent = 'جاهز للتصدير الفوري بالضغط أدناه.';
            });
        }

        // Action: Download Image
        document.getElementById('btn-download-image').addEventListener('click', async () => {
            if (!generatedCardUrl && window.GymEvo.Exporter) {
                generatedCardUrl = await window.GymEvo.Exporter.generateShareCard({ user, metrics, workouts });
            }
            if (generatedCardUrl && window.GymEvo.Exporter) {
                window.GymEvo.Exporter.downloadImage(generatedCardUrl, `gym-evolution-${user.name || 'progress'}.png`);
                window.GymEvo.notifier.success('تم تحميل بطاقة الإنجاز بنجاح! 📸', 'يمكنك الآن مشاركتها على وسائل التواصل.');
            }
        });

        // Action: PDF Print
        document.getElementById('btn-download-pdf').addEventListener('click', () => {
            closeModal();
            setTimeout(() => {
                window.GymEvo.Exporter.printReport();
            }, 300);
        });

        // Action: Quick Share / Copy
        document.getElementById('btn-share-social').addEventListener('click', async () => {
            const res = await window.GymEvo.Exporter.shareProgress(summaryText, generatedCardUrl);
            if (res.mode === 'share') {
                window.GymEvo.notifier.success('تمت المشاركة بنجاح! 🚀');
            } else if (res.mode === 'clipboard') {
                window.GymEvo.notifier.info('تم نسخ ملخص الإنجاز للحافظة!', 'يمكنك لصقه ومشاركته مع أصدقائك الآن.');
            }
        });
    }

    updateView();
};
