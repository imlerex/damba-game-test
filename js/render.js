const Renderer = {
    canvas: null,
    ctx: null,
    floatingTexts: [],
    dustMotes: [],

    init() {
        this.canvas = document.getElementById('barn-canvas');
        this.ctx = this.canvas.getContext('2d');

        // Initialize ambient floating dust motes
        this.dustMotes = [];
        for (let i = 0; i < 25; i++) {
            this.dustMotes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2.5 + 1,
                speedY: -0.2 - Math.random() * 0.4,
                speedX: (Math.random() - 0.5) * 0.3,
                alpha: Math.random() * 0.6 + 0.2
            });
        }
    },

    render() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;

        ctx.clearRect(0, 0, width, height);

        // 1. Draw Barn Background & Atmospheric Lighting
        this.drawBackground(ctx, width, height);

        // 2. Draw Planter Pots & Plants
        this.drawPotsAndPlants(ctx);

        // 3. Draw Ambient Dust & Particles
        this.drawDustMotes(ctx, width, height);

        // 4. Draw Floating Texts / Rewards
        this.drawFloatingTexts(ctx);
    },

    drawBackground(ctx, w, h) {
        // Rich warm wooden wall gradient
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#2d2016');
        bgGrad.addColorStop(0.5, '#221711');
        bgGrad.addColorStop(1, '#150f0c');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Wooden plank lines and wood grain shading
        ctx.lineWidth = 2;
        for (let y = 0; y < h; y += 45) {
            ctx.fillStyle = (y / 45) % 2 === 0 ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.02)';
            ctx.fillRect(0, y, w, 45);
            ctx.strokeStyle = 'rgba(0,0,0,0.3)';
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // Cozy Window Frame
        const winX = w - 260;
        const winY = 30;
        const winW = 180;
        const winH = 220;

        ctx.fillStyle = '#1e150f';
        ctx.fillRect(winX - 10, winY - 10, winW + 20, winH + 20);

        // Day/night sky through window
        const dayProgress = GameState.dayTime / 86400;
        let skyColor = '#70c1b3';
        let skyGlow = 'rgba(255, 240, 180, 0.35)';
        if (dayProgress < 0.25 || dayProgress > 0.75) {
            skyColor = '#0b132b'; // Night sky
            skyGlow = 'rgba(100, 150, 255, 0.15)';
        } else if (dayProgress < 0.35 || dayProgress > 0.65) {
            skyColor = '#f39237'; // Sunset / Sunrise
            skyGlow = 'rgba(255, 180, 100, 0.4)';
        }

        ctx.fillStyle = skyColor;
        ctx.fillRect(winX, winY, winW, winH);

        // Window pane grid lines
        ctx.strokeStyle = '#1e150f';
        ctx.lineWidth = 6;
        ctx.strokeRect(winX, winY, winW, winH);
        ctx.beginPath();
        ctx.moveTo(winX + winW / 2, winY);
        ctx.lineTo(winX + winW / 2, winY + winH);
        ctx.moveTo(winX, winY + winH / 2);
        ctx.lineTo(winX + winW, winY + winH / 2);
        ctx.stroke();

        // Volumetric Sunlight Beam casting across the barn
        const isDay = dayProgress >= 0.25 && dayProgress <= 0.75;
        if (isDay) {
            const sunGrad = ctx.createLinearGradient(winX + winW / 2, winY, 0, h);
            sunGrad.addColorStop(0, skyGlow);
            sunGrad.addColorStop(1, 'rgba(255, 230, 150, 0)');
            ctx.fillStyle = sunGrad;
            ctx.beginPath();
            ctx.moveTo(winX, winY);
            ctx.lineTo(winX + winW, winY);
            ctx.lineTo(0, h);
            ctx.lineTo(0, 180);
            ctx.fill();
        }

        // Wooden Shelf Surface for Pots
        ctx.fillStyle = '#3a271b';
        ctx.fillRect(0, 390, w, 20);
        ctx.fillStyle = '#261911';
        ctx.fillRect(0, 410, w, h - 410);
        ctx.strokeStyle = '#4e3727';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 390);
        ctx.lineTo(w, 390);
        ctx.stroke();
    },

    drawDustMotes(ctx, w, h) {
        ctx.save();
        this.dustMotes.forEach(mote => {
            mote.y += mote.speedY;
            mote.x += mote.speedX;

            if (mote.y < 0) mote.y = h;
            if (mote.x < 0) mote.x = w;
            if (mote.x > w) mote.x = 0;

            ctx.fillStyle = `rgba(255, 245, 200, ${mote.alpha})`;
            ctx.beginPath();
            ctx.arc(mote.x, mote.y, mote.radius, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();
    },

    drawPotsAndPlants(ctx) {
        const pots = GameState.pots;
        const cols = 4;
        const startX = 140;
        const startY = 240;
        const spacingX = 220;
        const spacingY = 180;

        pots.forEach((pot, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            const x = startX + col * spacingX;
            const y = startY + row * spacingY;

            pot.renderBounds = { x: x - 65, y: y - 50, w: 130, h: 130 };

            // Pot Drop Shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
            ctx.beginPath();
            ctx.ellipse(x, y + 55, 52, 16, 0, 0, Math.PI * 2);
            ctx.fill();

            // Terracotta Pot with 3D gradient shading
            const potGrad = ctx.createLinearGradient(x - 45, y, x + 45, y);
            potGrad.addColorStop(0, '#9c5430');
            potGrad.addColorStop(0.4, '#c87548');
            potGrad.addColorStop(1, '#824424');
            ctx.fillStyle = potGrad;
            ctx.beginPath();
            ctx.moveTo(x - 42, y);
            ctx.lineTo(x + 42, y);
            ctx.lineTo(x + 32, y + 52);
            ctx.lineTo(x - 32, y + 52);
            ctx.closePath();
            ctx.fill();

            // Pot Rim with highlight
            ctx.fillStyle = '#df8957';
            ctx.fillRect(x - 48, y - 10, 96, 14);
            ctx.strokeStyle = '#6e381c';
            ctx.lineWidth = 2;
            ctx.strokeRect(x - 48, y - 10, 96, 14);

            // Rich Soil Bed with pebbles
            ctx.fillStyle = '#26180e';
            ctx.beginPath();
            ctx.ellipse(x, y, 38, 9, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#3a2617';
            ctx.beginPath();
            ctx.arc(x - 12, y - 2, 3, 0, Math.PI * 2);
            ctx.arc(x + 10, y + 2, 2.5, 0, Math.PI * 2);
            ctx.fill();

            // Draw Plant if present
            if (pot.plant) {
                this.drawPlant(ctx, pot.plant, x, y);
            } else {
                // Empty pot prompt
                ctx.fillStyle = 'rgba(254, 250, 224, 0.45)';
                ctx.font = '13px system-ui';
                ctx.textAlign = 'center';
                ctx.fillText('Click to Plant', x, y - 15);
            }

            // Selection Highlight Border
            if (UI.selectedPotIndex === index) {
                ctx.strokeStyle = '#e9c46a';
                ctx.lineWidth = 3;
                ctx.setLineDash([6, 4]);
                ctx.strokeRect(x - 65, y - 60, 130, 130);
                ctx.setLineDash([]);
            }
        });
    },

    drawPlant(ctx, plant, x, y) {
        const species = CONFIG.PLANTS[plant.speciesId];
        const primaryColor = species.color || '#52b788';

        ctx.save();
        ctx.translate(x, y);

        // Gentle organic idle swaying animation
        const sway = Math.sin(Date.now() / 350 + x * 0.5) * (plant.stage === 'mature' ? 3.5 : 1.5);
        ctx.rotate((sway * Math.PI) / 180);

        if (plant.stage === 'withered') {
            // Sad drooping withered brown stem
            ctx.strokeStyle = '#6b4423';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(18, -15, 28, 5);
            ctx.stroke();
        } else if (plant.stage === 'seed') {
            // Sprout mound / seedling tip
            ctx.fillStyle = primaryColor;
            ctx.beginPath();
            ctx.arc(0, -6, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#99d98c';
            ctx.beginPath();
            ctx.ellipse(0, -14, 4, 8, 0.2, 0, Math.PI * 2);
            ctx.fill();
        } else if (plant.stage === 'sprout') {
            // Double leaf sprout
            ctx.strokeStyle = '#2d6a4f';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(0, -20, 0, -25);
            ctx.stroke();

            ctx.fillStyle = primaryColor;
            ctx.beginPath();
            ctx.ellipse(-10, -28, 10, 6, -0.4, 0, Math.PI * 2);
            ctx.ellipse(10, -28, 10, 6, 0.4, 0, Math.PI * 2);
            ctx.fill();
        } else if (plant.stage === 'young') {
            // Multi-leaf young plant
            ctx.strokeStyle = '#2d6a4f';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -35);
            ctx.stroke();

            ctx.fillStyle = primaryColor;
            for (let i = 0; i < 4; i++) {
                ctx.save();
                ctx.translate(0, -25 + i * -5);
                ctx.rotate(((i % 2 === 0 ? 1 : -1) * 35 * Math.PI) / 180);
                ctx.beginPath();
                ctx.ellipse(12, 0, 14, 7, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        } else if (plant.stage === 'mature' || plant.stage === 'overgrown') {
            // Lush mature plant with flowering crown & glow
            ctx.strokeStyle = '#1b4332';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -45);
            ctx.stroke();

            // Layered foliage canopy
            ctx.fillStyle = primaryColor;
            ctx.beginPath();
            ctx.arc(0, -55, 28, 0, Math.PI * 2);
            ctx.arc(-16, -42, 18, 0, Math.PI * 2);
            ctx.arc(16, -42, 18, 0, Math.PI * 2);
            ctx.fill();

            // Center blossom flowers / fruits
            ctx.fillStyle = '#ffb703';
            for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * Math.PI * 2;
                ctx.beginPath();
                ctx.arc(Math.cos(angle) * 16, -55 + Math.sin(angle) * 16, 7, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, -55, 8, 0, Math.PI * 2);
            ctx.fill();

            if (plant.stage === 'mature') {
                // Sparkle indicator for harvest ready
                ctx.fillStyle = '#fff';
                ctx.font = '18px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('✨', 25, -75);
            }
        }

        ctx.restore();

        // Status indicators above pot
        const iconY = y - 80;
        if (plant.water < 25) {
            ctx.fillStyle = '#3a86ff';
            ctx.font = '15px sans-serif';
            ctx.fillText('💧!', x - 15, iconY);
        }
        if (plant.hasPest) {
            ctx.fillStyle = '#e76f51';
            ctx.font = '15px sans-serif';
            ctx.fillText('🐛', x + 10, iconY);
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
            vy: -1.4
        });
    },

    drawFloatingTexts(ctx) {
        this.floatingTexts.forEach((ft) => {
            ctx.save();
            ctx.globalAlpha = ft.alpha;
            ctx.fillStyle = '#ffd166';
            ctx.font = 'bold 20px system-ui';
            ctx.textAlign = 'center';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = 6;
            ctx.fillText(ft.text, ft.x, ft.y);
            ctx.restore();

            ft.y += ft.vy;
            ft.alpha -= 0.025;
        });
        this.floatingTexts = this.floatingTexts.filter(ft => ft.alpha > 0);
    }
};
