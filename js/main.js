function initBarnBloom() {
    try {
        console.log("Initializing Barn Bloom...");
        
        GameState.init();
        SoundEngine.init();
        Renderer.init();
        UI.init();

        // Try loading save data
        const loaded = SaveSystem.load();
        if (loaded) {
            const btnContinue = document.getElementById('btn-continue');
            if (btnContinue) {
                btnContinue.removeAttribute('disabled');
            }
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

            Renderer.render();
            requestAnimationFrame(gameLoop);
        }

        requestAnimationFrame(gameLoop);

        // Autosave interval (every 30 seconds)
        setInterval(() => {
            SaveSystem.save();
        }, CONFIG.AUTOSAVE_INTERVAL);

        console.log("Barn Bloom initialized successfully!");
    } catch (err) {
        console.error("Critical error during initialization:", err);
        alert("Failed to start Barn Bloom. Check browser console (F12) for details.");
    }
}

// Ensure execution regardless of script load timing
if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initBarnBloom);
} else {
    initBarnBloom();
}
