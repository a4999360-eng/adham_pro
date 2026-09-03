/**
 * Gym Evolution - Progress Exporter & Social Card Generator (Global Scope)
 */

window.GymEvo = window.GymEvo || {};

window.GymEvo.Exporter = {
    /**
     * Generates a high-resolution social shareable image card on HTML5 Canvas
     * @param {Object} options { user, metrics, workouts }
     * @returns {Promise<string>} dataUrl of generated PNG
     */
    async generateShareCard(options) {
        const { user, metrics, workouts } = options;

        const canvas = document.createElement('canvas');
        const width = 1080;
        const height = 1080;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // 1. Background with subtle gradient
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#FFFFFF');
        bgGrad.addColorStop(1, '#F4F5F9');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Subtle accent grid / glow at the top
        const glowGrad = ctx.createRadialGradient(width / 2, 0, 10, width / 2, 0, 550);
        glowGrad.addColorStop(0, 'rgba(0, 112, 243, 0.08)');
        glowGrad.addColorStop(1, 'rgba(0, 112, 243, 0)');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, width, 600);

        // Outer Border
        ctx.strokeStyle = '#E2E4EB';
        ctx.lineWidth = 4;
        ctx.strokeRect(30, 30, width - 60, height - 60);

        // 2. Header Bar / Branding
        // Brand logo box
        ctx.fillStyle = '#111118';
        this._roundRect(ctx, 70, 70, 70, 70, 18, true, false);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 36px "Outfit", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('GE', 105, 105);

        // Brand Title
        ctx.fillStyle = '#111118';
        ctx.font = 'bold 38px "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Gym Evolution', 160, 95);

        ctx.fillStyle = '#6B7280';
        ctx.font = '500 20px "Inter", sans-serif';
        ctx.fillText('SMART FITNESS & NUTRITION TRACKER', 160, 128);

        // Badge on right
        ctx.fillStyle = '#E8F2FF';
        this._roundRect(ctx, width - 330, 80, 260, 50, 25, true, false);
        ctx.fillStyle = '#0070F3';
        ctx.font = '600 20px "Outfit", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('بطاقة إنجاز وتطور بدني ⚡', width - 200, 106);

        // Divider
        ctx.strokeStyle = '#EAEBEF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(70, 175);
        ctx.lineTo(width - 70, 175);
        ctx.stroke();

        // 3. User Info Section
        ctx.textAlign = 'right';
        ctx.fillStyle = '#111118';
        ctx.font = 'bold 44px "Outfit", sans-serif';
        ctx.fillText(user.name || 'البطل', width - 70, 240);

        const goalTranslations = {
            lose: 'خطة التنشيف وخسارة الدهون 🔥',
            maintain: 'خطة الثبات وتطوير اللياقة ⚖️',
            gain: 'خطة التضخيم وبناء الكتلة العضلية 💪'
        };
        ctx.fillStyle = '#6B7280';
        ctx.font = '500 24px "Inter", sans-serif';
        ctx.fillText(goalTranslations[user.goal] || 'مستمر في التطور', width - 70, 280);

        // Date of export
        const dateStr = new Date().toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        ctx.textAlign = 'left';
        ctx.fillStyle = '#9CA3AF';
        ctx.font = '500 22px "Inter", sans-serif';
        ctx.fillText(`تاريخ التقرير: ${dateStr}`, 70, 250);

        // 4. Highlight Stats Cards (4 grid boxes)
        const latestMetric = metrics[metrics.length - 1];
        const firstMetric = metrics[0];
        const currentWeight = latestMetric ? latestMetric.weight : user.weight;
        const initialWeight = firstMetric ? firstMetric.weight : currentWeight;
        const weightDiff = parseFloat((currentWeight - initialWeight).toFixed(1));
        const completedWorkouts = workouts.filter(w => w.completed).length;
        const latestFat = latestMetric && latestMetric.bodyFat ? `${latestMetric.bodyFat}%` : 'غير مسجل';

        const stats = [
            {
                label: 'الوزن الحالي',
                val: `${currentWeight}`,
                unit: 'كجم',
                color: '#0070F3',
                icon: '⚖️'
            },
            {
                label: 'إجمالي التغير في الوزن',
                val: `${weightDiff > 0 ? '+' : ''}${weightDiff}`,
                unit: 'كجم',
                color: weightDiff <= 0 ? '#10B981' : '#F59E0B',
                icon: '📉'
            },
            {
                label: 'نسبة الدهون الحالية',
                val: `${latestFat}`,
                unit: '',
                color: '#F59E0B',
                icon: '🔥'
            },
            {
                label: 'التمارين المكتملة',
                val: `${completedWorkouts}`,
                unit: 'جلسة تدريب',
                color: '#10B981',
                icon: '🏋️'
            }
        ];

        const cardW = 445;
        const cardH = 150;
        const cardX1 = 70;
        const cardX2 = 565;
        const cardY1 = 330;
        const cardY2 = 510;

        const positions = [
            { x: cardX2, y: cardY1 },
            { x: cardX1, y: cardY1 },
            { x: cardX2, y: cardY2 },
            { x: cardX1, y: cardY2 }
        ];

        stats.forEach((stat, i) => {
            const pos = positions[i];
            // Card background
            ctx.fillStyle = '#FFFFFF';
            this._roundRect(ctx, pos.x, pos.y, cardW, cardH, 20, true, false);
            ctx.strokeStyle = '#E8E9F0';
            ctx.lineWidth = 1.5;
            this._roundRect(ctx, pos.x, pos.y, cardW, cardH, 20, false, true);

            // Icon + Label
            ctx.textAlign = 'right';
            ctx.fillStyle = '#6B7280';
            ctx.font = '600 22px "Inter", sans-serif';
            ctx.fillText(`${stat.icon} ${stat.label}`, pos.x + cardW - 30, pos.y + 45);

            // Value
            ctx.fillStyle = stat.color;
            ctx.font = 'bold 44px "Outfit", sans-serif';
            ctx.fillText(stat.val, pos.x + cardW - 30, pos.y + 105);

            if (stat.unit) {
                ctx.textAlign = 'left';
                ctx.fillStyle = '#9CA3AF';
                ctx.font = '500 22px "Inter", sans-serif';
                ctx.fillText(stat.unit, pos.x + 30, pos.y + 102);
            }
        });

        // 5. Mini Progress Curve Graph (Visual Canvas Render)
        const chartBoxX = 70;
        const chartBoxY = 690;
        const chartBoxW = width - 140;
        const chartBoxH = 220;

        ctx.fillStyle = '#FFFFFF';
        this._roundRect(ctx, chartBoxX, chartBoxY, chartBoxW, chartBoxH, 20, true, false);
        ctx.strokeStyle = '#E8E9F0';
        ctx.lineWidth = 1.5;
        this._roundRect(ctx, chartBoxX, chartBoxY, chartBoxW, chartBoxH, 20, false, true);

        // Chart Title
        ctx.textAlign = 'right';
        ctx.fillStyle = '#111118';
        ctx.font = 'bold 22px "Outfit", sans-serif';
        ctx.fillText('مسار تطور الوزن البياني', chartBoxX + chartBoxW - 25, chartBoxY + 40);

        // Draw graph points if metrics exist
        if (metrics.length >= 2) {
            const weights = metrics.map(m => m.weight);
            const minW = Math.min(...weights) - 1;
            const maxW = Math.max(...weights) + 1;
            const rangeW = maxW - minW || 1;

            const gLeft = chartBoxX + 40;
            const gRight = chartBoxX + chartBoxW - 40;
            const gTop = chartBoxY + 70;
            const gBottom = chartBoxY + chartBoxH - 40;
            const gWidth = gRight - gLeft;
            const gHeight = gBottom - gTop;

            const pts = metrics.map((m, idx) => {
                const x = gLeft + (idx / (metrics.length - 1)) * gWidth;
                const y = gBottom - ((m.weight - minW) / rangeW) * gHeight;
                return { x, y, weight: m.weight };
            });

            // Fill under line
            const fillGrad = ctx.createLinearGradient(0, gTop, 0, gBottom);
            fillGrad.addColorStop(0, 'rgba(0, 112, 243, 0.2)');
            fillGrad.addColorStop(1, 'rgba(0, 112, 243, 0.0)');
            ctx.fillStyle = fillGrad;

            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            pts.forEach(p => ctx.lineTo(p.x, p.y));
            ctx.lineTo(pts[pts.length - 1].x, gBottom);
            ctx.lineTo(pts[0].x, gBottom);
            ctx.closePath();
            ctx.fill();

            // Stroke line
            ctx.strokeStyle = '#0070F3';
            ctx.lineWidth = 5;
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            pts.forEach(p => ctx.lineTo(p.x, p.y));
            ctx.stroke();

            // Draw Dots
            pts.forEach((p, idx) => {
                ctx.fillStyle = '#FFFFFF';
                ctx.beginPath();
                ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#0070F3';
                ctx.lineWidth = 4;
                ctx.stroke();

                // Draw label for first and last point
                if (idx === 0 || idx === pts.length - 1) {
                    ctx.textAlign = 'center';
                    ctx.fillStyle = '#111118';
                    ctx.font = 'bold 18px "Inter", sans-serif';
                    ctx.fillText(`${p.weight}kg`, p.x, p.y - 15);
                }
            });
        } else {
            ctx.textAlign = 'center';
            ctx.fillStyle = '#9CA3AF';
            ctx.font = '500 22px "Inter", sans-serif';
            ctx.fillText('قم بتسجيل قياسات إضافية لإظهار المنحنى البياني الكامل', width / 2, chartBoxY + 120);
        }

        // 6. Footer Motto & Branding
        const footerY = 960;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#111118';
        ctx.font = 'bold 24px "Outfit", sans-serif';
        ctx.fillText('« الاستمرارية تصنع الفرق، كل يوم خطوة للأمام! 🔥 »', width / 2, footerY);

        ctx.fillStyle = '#9CA3AF';
        ctx.font = '500 18px "Inter", sans-serif';
        ctx.fillText('تم التوليد بواسطة منصة Gym Evolution • www.gymevolution.app', width / 2, footerY + 35);

        return canvas.toDataURL('image/png');
    },

    /**
     * Helper to draw rounded rectangle on Canvas
     */
    _roundRect(ctx, x, y, width, height, radius, fill, stroke) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        if (fill) ctx.fill();
        if (stroke) ctx.stroke();
    },

    /**
     * Download generated dataURL as an image file
     */
    downloadImage(dataUrl, filename = 'gym-evolution-progress.png') {
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    /**
     * Trigger browser print / PDF export
     */
    printReport() {
        window.print();
    },

    /**
     * Share progress via Web Share API or fallback to clipboard
     */
    async shareProgress(summaryText, dataUrl = null) {
        if (navigator.share) {
            try {
                const shareData = {
                    title: 'تطوري البدني على Gym Evolution',
                    text: summaryText
                };

                // If file sharing is supported and dataUrl is provided
                if (dataUrl && navigator.canShare) {
                    try {
                        const blob = await (await fetch(dataUrl)).blob();
                        const file = new File([blob], 'gym-evolution-progress.png', { type: 'image/png' });
                        if (navigator.canShare({ files: [file] })) {
                            shareData.files = [file];
                        }
                    } catch (e) {
                        // ignore file conversion error and share text
                    }
                }

                await navigator.share(shareData);
                return { success: true, mode: 'share' };
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.warn('Share error fallback:', err);
                }
            }
        }

        // Fallback: Copy to clipboard
        try {
            await navigator.clipboard.writeText(summaryText);
            return { success: true, mode: 'clipboard' };
        } catch (e) {
            return { success: false, error: e };
        }
    }
};
