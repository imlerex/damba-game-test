function initBarnBloom() {
    GameState.init();
    SoundEngine.init();
    Renderer.init();
    UI.init();

    // Try loading save
    const loaded = SaveSystem.load();
    if (loaded) {
        const btnContinue = document.getElementById('btn-continue');
        if (btnContinue) btnContinue.removeAttribute('disabled');
    }

    // Main Game Loop with fixed time-step accumulator
    let lastTime = performance.now();
    const targetFps = 60;
    let accumulator = 0;

    function gameLoop(currentTime) {
        const dt = Math.min(0.1, (currentTime - lastTime) / 1000);
        lastTime = currentTime;

        accumulator += dt;
        const logicStep = 1 / 60;

        while (accumulator >= logicStep) {
            GameLogic.update(logicStep);
            accumulator -= logicStep;
        }

        // Render frame
        Renderer.render();

        requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);

    // Autosave interval
    setInterval(() => {
        SaveSystem.save();
    }, CONFIG.AUTOSAVE_INTERVAL);
}

// Ensure execution whether DOMContentLoaded already fired or not
if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initBarnBloom);
} else {
    initBarnBloom();
}
