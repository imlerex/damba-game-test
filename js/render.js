const Renderer = {
    canvas: null,
    ctx: null,
    floatingTexts: [],
    dustMotes: [],

    init() {
        this.canvas = document.getElementById('barn-canvas');
        this.ctx = this.canvas.getContext('2d');

        // Пылинки в лучах света
        this.dustMotes = [];
        for (let i = 0; i < 20; i++) {
            this.dustMotes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2 + 0.8,
                speedY: -0.15 - Math.random() * 0.3,
                speedX: (Math.random() - 0.5) * 0.2,
                alpha: Math.random() * 0.5 + 0.2
            });
        }
    },

    render() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;

        ctx.clearRect(0, 0, width, height);

        // 1. Фон амбара и освещение
        this.drawBackground(ctx, width, height);

        // 2. Горшки и растения с мордочками
        this.drawPotsAndPlants(ctx);

        // 3. Декорации пола (котик, ёжик, сено)
        this.drawFloorDecor(ctx, width, height);

        // 4. Пылинки
        this.drawDustMotes(ctx, width, height);

        // 5. Всплывающий текст
        this.drawFloatingTexts(ctx);
    },

    drawBackground(ctx, w, h) {
        // Деревянная стена амбара
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#35251b');
        bgGrad.addColorStop(0.5, '#281c14');
        bgGrad.addColorStop(1, '#1b120c');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Вертикальные доски текстуры
        ctx.lineWidth = 2;
        for (let x = 0; x < w; x += 120) {
            ctx.fillStyle = 'rgba(0,0,0,0.12)';
            ctx.fillRect(x, 0, 60, h);
        }

        // Горизонтальные балки
        ctx.fillStyle = '#1e140e';
        ctx.fillRect(0, 360, w, 14);

        // --- ВЕРХНЯЯ ГИРЛЯНДА ИЗ ФЛАЖКОВ ---
        const flagColors = ['#e76f51', '#f4a261', '#e9c46a', '#2a9d8f', '#457b9d', '#ff006e'];
        ctx.strokeStyle = '#221610';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 20);
        ctx.bezierCurveTo(w * 0.3, 60, w * 0.7, 60, w, 20);
        ctx.stroke();

        for (let i = 40; i < w - 20; i += 35) {
            const flagY = 20 + Math.sin(i * 0.05) * 12 + (i / w) * 15;
            ctx.fillStyle = flagColors[(i / 35) % flagColors.length | 0];
            ctx.beginPath();
            ctx.moveTo(i - 12, flagY);
            ctx.lineTo(i + 12, flagY);
            ctx.lineTo(i, flagY + 22);
            ctx.closePath();
            ctx.fill();
        }

        // --- АРОЧНОЕ ОКНО ПО ЦЕНТРУ ---
        const winX = w / 2 - 100;
        const winY = 20;
        const winW = 200;
        const winH = 220;

        // Рама окна
        ctx.fillStyle = '#261b14';
        ctx.beginPath();
        ctx.arc(winX + winW / 2, winY + 80, 100, Math.PI, 0, false);
        ctx.fillRect(winX, winY + 80, winW, winH - 80);
        ctx.fill();

        // Небо и холмы в окне
        ctx.save();
        ctx.beginPath();
        ctx.arc(winX + winW / 2, winY + 80, 92, Math.PI, 0, false);
        ctx.rect(winX + 8, winY + 80, winW - 16, winH - 88);
        ctx.clip();

        ctx.fillStyle = '#70c1b3'; // Небо
        ctx.fillRect(winX, winY, winW, winH);

        // Солнце
        ctx.fillStyle = '#f9c74f';
        ctx.beginPath();
        ctx.arc(winX + 60, winY + 70, 22, 0, Math.PI * 2);
        ctx.fill();

        // Холмы
        ctx.fillStyle = '#52b788';
        ctx.beginPath();
        ctx.moveTo(winX, winY + 160);
        ctx.quadraticCurveTo(winX + 80, winY + 110, winX + winW, winY + 150);
        ctx.lineTo(winX + winW, winY + winH);
        ctx.lineTo(winX, winY + winH);
        ctx.fill();

        // Белочка в углу окна
        ctx.fillStyle = '#d4a373';
        ctx.beginPath();
        ctx.arc(winX + 150, winY + 130, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(winX + 158, winY + 122, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Переплет окна
        ctx.strokeStyle = '#1e140e';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(winX + winW / 2, winY + 80, 92, Math.PI, 0, false);
        ctx.stroke();
        ctx.strokeRect(winX + 8, winY + 80, winW - 16, winH - 88);
        ctx.beginPath();
        ctx.moveTo(winX + winW / 2, winY + 80);
        ctx.lineTo(winX + winW / 2, winY + winH);
        ctx.stroke();

        // Маленькое круглое окошко справа
        ctx.fillStyle = '#70c1b3';
        ctx.beginPath();
        ctx.arc(w - 120, 90, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#1e140e';
        ctx.lineWidth = 5;
        ctx.stroke();

        // --- ЛАМПЫ ОСВЕЩЕНИЯ ---
        [180, w - 180].forEach(lx => {
            ctx.strokeStyle = '#1e140e';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(lx, 0);
            ctx.lineTo(lx, 90);
            ctx.stroke();

            // Плафон
            ctx.fillStyle = '#4a403a';
            ctx.beginPath();
            ctx.moveTo(lx - 18, 90);
            ctx.lineTo(lx + 18, 90);
            ctx.lineTo(lx + 10, 105);
            ctx.lineTo(lx - 10, 105);
            ctx.closePath();
            ctx.fill();

            // Свет лампы вниз
            const lightGrad = ctx.createLinearGradient(lx, 105, lx, 400);
            lightGrad.addColorStop(0, 'rgba(255, 230, 150, 0.22)');
            lightGrad.addColorStop(1, 'rgba(255, 230, 150, 0)');
            ctx.fillStyle = lightGrad;
            ctx.beginPath();
            ctx.moveTo(lx, 105);
            ctx.lineTo(lx - 120, 420);
            ctx.lineTo(lx + 120, 420);
            ctx.closePath();
            ctx.fill();
        });

        // Длинная полка для горшков
        ctx.fillStyle = '#423126';
        ctx.fillRect(0, 420, w, 24);
        ctx.fillStyle = '#261b14';
        ctx.fillRect(0, 444, w, 12);
        ctx.strokeStyle = '#5c4535';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 420);
        ctx.lineTo(w, 420);
        ctx.stroke();
    },

    drawFloorDecor(ctx, w, h) {
        // Нижний деревянный пол амбара
        ctx.fillStyle = '#150f0b';
        ctx.fillRect(0, 456, w, h - 456);

        // Солома на полу
        ctx.strokeStyle = '#e9c46a';
        ctx.lineWidth = 2;
        for (let i = 40; i < w - 60; i += 80) {
            ctx.beginPath();
            ctx.moveTo(i, h - 30);
            ctx.lineTo(i + 15, h - 15);
            ctx.moveTo(i + 20, h - 25);
            ctx.lineTo(i + 35, h - 10);
            ctx.stroke();
        }

        // --- КОТИК ВНИЗУ ПО ЦЕНТРУ ---
        const catX = w / 2 - 40;
        const catY = h - 35;
        // Тело
        ctx.fillStyle = '#f4a261';
        ctx.beginPath();
        ctx.ellipse(catX, catY, 16, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        // Голова
        ctx.beginPath();
        ctx.arc(catX - 12, catY - 6, 9, 0, Math.PI * 2);
        ctx.fill();
        // Ушки
        ctx.beginPath();
        ctx.moveTo(catX - 17, catY - 12);
        ctx.lineTo(catX - 14, catY - 18);
        ctx.lineTo(catX - 9, catY - 13);
        ctx.fill();
        // Хвостик
        ctx.strokeStyle = '#f4a261';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(catX + 14, catY);
        ctx.quadraticCurveTo(catX + 26, catY - 15, catX + 22, catY - 22);
        ctx.stroke();

        // --- ДЕРЕВЯННЫЙ ЯЩИК И ЁЖИК СПРАВА ---
        ctx.fillStyle = '#b76e47';
        ctx.fillRect(w - 110, h - 45, 45, 30);
        // Ёжик
        ctx.fillStyle = '#8d5524';
        ctx.beginPath();
        ctx.ellipse(w - 65, h - 25, 14, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // --- ВЕДЁРКО И ГРАБЛИ СЛЕВА ---
        ctx.fillStyle = '#457b9d';
        ctx.fillRect(30, h - 45, 25, 32);
        ctx.strokeStyle = '#1d3557';
        ctx.lineWidth = 3;
        ctx.strokeRect(30, h - 45, 25, 32);
    },

    drawPotsAndPlants(ctx) {
        const pots = GameState.pots;
        const cols = 4;
        const startX = 140;
        const startY = 265;
        const spacingX = 220;
        const spacingY = 180;

        pots.forEach((pot, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            const x = startX + col * spacingX;
            const y = startY + row * spacingY;

            pot.renderBounds = { x: x - 60, y: y - 50, w: 120, h: 130 };

            // Тень горшка
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.beginPath();
            ctx.ellipse(x, y + 55, 46, 14, 0, 0, Math.PI * 2);
            ctx.fill();

            // Горшок (Терракота)
            const potGrad = ctx.createLinearGradient(x - 40, y, x + 40, y);
            potGrad.addColorStop(0, '#a55833');
            potGrad.addColorStop(0.5, '#d47d52');
            potGrad.addColorStop(1, '#8b4521');
            ctx.fillStyle = potGrad;
            ctx.beginPath();
            ctx.moveTo(x - 38, y);
            ctx.lineTo(x + 38, y);
            ctx.lineTo(x + 28, y + 48);
            ctx.lineTo(x - 28, y + 48);
            ctx.closePath();
            ctx.fill();

            // Ободок горшка
            ctx.fillStyle = '#e2885b';
            ctx.fillRect(x - 42, y - 8, 84, 12);
            ctx.strokeStyle = '#5c2c16';
            ctx.lineWidth = 2;
            ctx.strokeRect(x - 42, y - 8, 84, 12);

            // Почва
            ctx.fillStyle = '#21130a';
            ctx.beginPath();
            ctx.ellipse(x, y, 34, 8, 0, 0, Math.PI * 2);
            ctx.fill();

            // Шкала воды под горшком
            const waterRatio = (pot.plant ? pot.plant.water : 0) / 100;
            ctx.fillStyle = '#1a120c';
            ctx.fillRect(x - 30, y + 62, 60, 6);
            ctx.fillStyle = waterRatio > 0.2 ? '#3a86ff' : '#e76f51';
            ctx.fillRect(x - 29, y + 63, 58 * waterRatio, 4);

            // Растение
            if (pot.plant) {
                this.drawPlantWithFace(ctx, pot.plant, x, y);
            } else {
                ctx.fillStyle = 'rgba(254, 250, 224, 0.35)';
                ctx.font = '12px system-ui';
                ctx.textAlign = 'center';
                ctx.fillText('Пусто', x, y - 10);
            }

            // Выделение рамкой
            if (UI.selectedPotIndex === index) {
                ctx.strokeStyle = '#e9c46a';
                ctx.lineWidth = 3;
                ctx.setLineDash([5, 3]);
                ctx.strokeRect(x - 58, y - 55, 116, 130);
                ctx.setLineDash([]);
            }
        });
    },

    drawPlantWithFace(ctx, plant, x, y) {
        const species = CONFIG.PLANTS[plant.speciesId];
        const color = species.color || '#52b788';

        ctx.save();
        ctx.translate(x, y);

        const sway = Math.sin(Date.now() / 300 + x) * (plant.stage === 'mature' ? 2.5 : 1);
        ctx.rotate((sway * Math.PI) / 180);

        if (plant.stage === 'withered') {
            ctx.strokeStyle = '#6b4423';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(15, -10, 25, 10);
            ctx.stroke();
        } else if (plant.stage === 'seed') {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(0, -6, 6, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Рисуем пышное растение + кавайную улыбающуюся мордочку как на скрине
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(0, -38, 26, 0, Math.PI * 2);
            ctx.fill();

            // Глазки и улыбка
            ctx.fillStyle = '#1e140e';
            ctx.beginPath();
            ctx.arc(-7, -42, 3, 0, Math.PI * 2);
            ctx.arc(7, -42, 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = '#1e140e';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, -39, 5, 0, Math.PI);
            ctx.stroke();

            if (plant.stage === 'mature' || plant.stage === 'overgrown') {
                ctx.fillStyle = '#ffb703';
                ctx.beginPath();
                ctx.arc(-14, -55, 7, 0, Math.PI * 2);
                ctx.arc(14, -55, 7, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#ffffff';
                ctx.font = '16px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('✨', 22, -65);
            }
        }

        ctx.restore();

        // Иконки статуса
        if (plant.water < 25) {
            ctx.fillStyle = '#3a86ff';
            ctx.font = '14px sans-serif';
            ctx.fillText('💧!', x - 12, y - 75);
        }
        if (plant.hasPest) {
            ctx.fillStyle = '#e76f51';
            ctx.font = '14px sans-serif';
            ctx.fillText('🐛', x + 10, y - 75);
        }
    },

    showFloatingText(text, potIndex) {
        const pot = GameState.pots[potIndex];
        if (!pot || !pot.renderBounds) return;
        this.floatingTexts.push({
            text: text,
            x: pot.renderBounds.x + 60,
            y: pot.renderBounds.y,
            alpha: 1.0,
            vy: -1.3
        });
    },

    drawFloatingTexts(ctx) {
        this.floatingTexts.forEach((ft) => {
            ctx.save();
            ctx.globalAlpha = ft.alpha;
            ctx.fillStyle = '#e9c46a';
            ctx.font = 'bold 18px system-ui';
            ctx.textAlign = 'center';
            ctx.shadowColor = 'rgba(0,0,0,0.8)';
            ctx.shadowBlur = 5;
            ctx.fillText(ft.text, ft.x, ft.y);
            ctx.restore();

            ft.y += ft.vy;
            ft.alpha -= 0.025;
        });
        this.floatingTexts = this.floatingTexts.filter(ft => ft.alpha > 0);
    }
};
