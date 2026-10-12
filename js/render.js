const Renderer = {
    canvas: null,
    ctx: null,
    floatingTexts: [],

    init() {
        this.canvas = document.getElementById('barn-canvas');
        this.ctx = this.canvas.getContext('2d');
    },

    render() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;

        ctx.clearRect(0, 0, width, height);

        // 1. Draw Barn Background & Day/Night Lighting
        this.drawBackground(ctx, width, height);

        // 2. Draw Planter Pots & Plants
        this.drawPotsAndPlants(ctx);

        // 3. Draw Particles / Floating Texts
        this.drawFloatingTexts(ctx);
    },

    drawBackground(ctx, w, h) {
        // Wooden wall gradient
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#2d231b');
        bgGrad.addColorStop(1, '#18120e');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Window & Sunlight beam
        ctx.fillStyle = '#3a2e25';
        ctx.fillRect(w - 240, 40, 160, 220);

        // Day/night sky through window
        const dayProgress = GameState.dayTime / 86400;
        let skyColor = '#87ceeb';
        if (dayProgress < 0.25 || dayProgress > 0.75) skyColor = '#101828'; // night
        else if (dayProgress < 0.35 || dayProgress > 0.65) skyColor = '#f4a261'; // sunrise/sunset

        ctx.fillStyle = skyColor;
        ctx.fillRect(w - 230, 50, 140, 200);

        // Sunlight shafts
        const isDay = dayProgress >= 0.25 && dayProgress <= 0.75;
        if (isDay) {
            const sunGrad = ctx.createLinearGradient(w - 160, 50, 0, h);
            sunGrad.addColorStop(0, 'rgba(255, 230, 150, 0.25)');
            sunGrad.addColorStop(1, 'rgba(255, 230, 150, 0)');
            ctx.fillStyle = sunGrad;
            ctx.beginPath();
            ctx.moveTo(w - 160, 50);
            ctx.lineTo(w - 230, 250);
            ctx.lineTo(0, h);
            ctx.lineTo(0, 200);
            ctx.fill();
        }

        // Wooden shelves / floor plank lines
        ctx.strokeStyle = '#3d3024';
        ctx.lineWidth = 4;
        for (let y = 350; y < h; y += 100) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }
    },

    drawPotsAndPlants(ctx) {
        const pots = GameState.pots;
        const cols = 4;
        const startX = 140;
        const startY = 220;
        const spacingX = 220;
        const spacingY = 180;

        pots.forEach((pot, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            const x = startX + col * spacingX;
            const y = startY + row * spacingY;

            pot.renderBounds = { x: x - 65, y: y - 50, w: 130, h: 120 };

            // Draw Pot Shadow & Base
            ctx.fillStyle = 'rgba(0,0,0,0.4)';
            ctx.beginPath();
            ctx.ellipse(x, y + 45, 55, 18, 0, 0, Math.PI * 2);
            ctx.fill();

            // Pot Body (Terracotta)
            ctx.fillStyle = '#b76e47';
            ctx.beginPath();
            ctx.moveTo(x - 45, y);
            ctx.lineTo(x + 45, y);
            ctx.lineTo(x + 35, y + 50);
            ctx.lineTo(x - 35, y + 50);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#8c4e2a';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Pot Rim
            ctx.fillStyle = '#c87d55';
            ctx.fillRect(x - 50, y - 10, 100, 14);
            ctx.strokeRect(x - 50, y - 10, 100, 14);

            // Soil
            ctx.fillStyle = '#3a2a1a';
            ctx.beginPath();
            ctx.ellipse(x, y, 42, 10, 0, 0, Math.PI * 2);
            ctx.fill();

            // Draw Plant if exists
            if (pot.plant) {
                this.drawPlant(ctx, pot.plant, x, y);
            } else {
                // Empty pot prompt
                ctx.fillStyle = 'rgba(254, 250, 224, 0.3)';
                ctx.font = '12px system-ui';
                ctx.textAlign = 'center';
                ctx.fillText('Empty Pot', x, y - 15);
            }

            // Selection Highlight
            if (UI.selectedPotIndex === index) {
                ctx.strokeStyle = '#e9c46a';
                ctx.lineWidth = 3;
                ctx.strokeRect(x - 65, y - 55, 130, 120);
            }
        });
    },

    drawPlant(ctx, plant, x, y) {
        const species = CONFIG.PLANTS[plant.speciesId];
        const color = species.color || '#52b788';

        ctx.save();
        ctx.translate(x, y);

        // Sway animation based on age
        const sway = Math.sin(Date.now() / 300 + x) * (plant.stage === 'mature' ? 3 : 1);
        ctx.rotate((sway * Math.PI) / 180);

        if (plant.stage === 'withered') {
            // Withered brown drooping plant
            ctx.strokeStyle = '#6b4423';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(15, -20, 25, -10);
            ctx.stroke();
        } else if (plant.stage === 'seed') {
            // Little green sprout seed mound
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(0, -5, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.font = '10px sans-serif';
            ctx.fillText('🌱', -6, -20);
        } else if (plant.stage === 'sprout') {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.ellipse(0, -20, 12, 18, 0, 0, Math.PI * 2);
            ctx.fill();
        } else if (plant.stage === 'young') {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(0, -35, 22, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#e9c46a';
            ctx.beginPath();
            ctx.arc(-8, -42, 6, 0, Math.PI * 2);
            ctx.arc(8, -42, 6, 0, Math.PI * 2);
            ctx.fill();
        } else if (plant.stage === 'mature' || plant.stage === 'overgrown') {
            // Lush mature plant with flowers/fruit
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(0, -50, 32, 0, Math.PI * 2);
            ctx.fill();
            
            // Decorative blooms
            ctx.fillStyle = '#ffb703';
            for (let i = 0; i < 5; i++) {
                const angle = (i / 5) * Math.PI * 2;
                ctx.beginPath();
                ctx.arc(Math.cos(angle) * 18, -50 + Math.sin(angle) * 18, 8, 0, Math.PI * 2);
                ctx.fill();
            }

            if (plant.stage === 'mature') {
                // Sparkle indicator for ready harvest
                ctx.fillStyle = '#fff';
                ctx.font = '16px sans-serif';
                ctx.fillText('✨', 20, -70);
            }
        }

        ctx.restore();

        // Status indicators above pot
        const iconY = y - 75;
        if (plant.water < 25) {
            ctx.fillStyle = '#3a86ff';
            ctx.font = '14px sans-serif';
            ctx.fillText('💧!', x - 15, iconY);
        }
        if (plant.hasPest) {
            ctx.fillStyle = '#e76f51';
            ctx.font = '14px sans-serif';
            ctx.fillText('🐛', x + 5, iconY);
        }
    },

    showFloatingText(text, potIndex) {
        const pot = GameState.pots[potIndex];
        if (!pot || !pot.renderBounds) return;
        this.floatingTexts.push({
            text: text,
            x: pot.renderBounds.x + 65,
            y: pot.renderBounds.y,
            alpha: 1.0,
            vy: -1.2
        });
    },

    drawFloatingTexts(ctx) {
        this.floatingTexts.forEach((ft, index) => {
            ctx.save();
            ctx.globalAlpha = ft.alpha;
            ctx.fillStyle = '#e9c46a';
            ctx.font = 'bold 18px system-ui';
            ctx.textAlign = 'center';
            ctx.fillText(ft.text, ft.x, ft.y);
            ctx.restore();

            ft.y += ft.vy;
            ft.alpha -= 0.02;
        });
        this.floatingTexts = this.floatingTexts.filter(ft => ft.alpha > 0);
    }
};
