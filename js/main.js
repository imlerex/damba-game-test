window.addEventListener('DOMContentLoaded', () => {
    // Initialize systems
    GameState.init();
    SoundEngine.init();
    Renderer.init();
    UI.init();

    // Try loading save
    const loaded = SaveSystem.load();
    if (loaded) {
        document.getElementById('btn-continue').removeAttribute('disabled');
    }

    // Main Game Loop with fixed time-step accumulator
    let lastTime = performance.now();
    const targetFps = 60;
    const frameInterval = 1000 / targetFps;
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
});
