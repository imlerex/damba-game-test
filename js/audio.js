const SoundEngine = {
    ctx: null,
    ambientOsc: null,
    ambientGain: null,

    init() {
        // Не создаем AudioContext при загрузке, чтобы Safari не рубил скрипт.
        // Контекст создастся лениво при первом взаимодействии пользователя.
    },

    ensureContext() {
        if (!this.ctx) {
            try {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) {
                    this.ctx = new AudioCtx();
                }
            } catch(e) {
                console.warn('Web Audio API blocked or not supported in Safari:', e);
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },

    playTone(freq, type, duration, vol = 0.1) {
        if (!GameState.settings.sfx) return;
        this.ensureContext();
        if (!this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

            gain.gain.setValueAtTime(vol * GameState.settings.volume, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch(e) {}
    },

    resume() {
        this.ensureContext();
    },

    playWater() {
        this.playTone(400, 'sine', 0.15, 0.08);
        setTimeout(() => this.playTone(600, 'sine', 0.1, 0.06), 60);
    },

    playCoin() {
        this.playTone(987.77, 'triangle', 0.08, 0.1);
        setTimeout(() => this.playTone(1318.51, 'triangle', 0.15, 0.12), 80);
    },

    playHarvest() {
        this.playTone(523.25, 'sine', 0.1, 0.1);
        setTimeout(() => this.playTone(659.25, 'sine', 0.1, 0.1), 80);
        setTimeout(() => this.playTone(783.99, 'sine', 0.2, 0.15), 160);
    },

    playUpgrade() {
        this.playTone(440, 'triangle', 0.1, 0.1);
        setTimeout(() => this.playTone(554.37, 'triangle', 0.1, 0.1), 100);
        setTimeout(() => this.playTone(659.25, 'triangle', 0.1, 0.1), 200);
        setTimeout(() => this.playTone(880, 'triangle', 0.3, 0.15), 300);
    },

    playError() {
        this.playTone(180, 'sawtooth', 0.2, 0.1);
    },

    playPop() {
        this.playTone(350, 'sine', 0.08, 0.08);
    }
};
