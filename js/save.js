const SaveSystem = {
    save() {
        const saveData = {
            version: 1,
            coins: GameState.coins,
            totalEarned: GameState.totalEarned,
            dayTime: GameState.dayTime,
            gameDay: GameState.gameDay,
            pots: GameState.pots,
            inventory: GameState.inventory,
            unlockedPlants: GameState.unlockedPlants,
            upgrades: GameState.upgrades,
            achievements: GameState.achievements,
            stats: GameState.stats,
            settings: GameState.settings,
            timestamp: Date.now()
        };
        try {
            localStorage.setItem(CONFIG.SAVE_KEY, JSON.stringify(saveData));
        } catch (e) {
            console.error('Failed to save game:', e);
        }
    },

    load() {
        try {
            const raw = localStorage.getItem(CONFIG.SAVE_KEY);
            if (!raw) return false;
            const data = JSON.parse(raw);

            GameState.coins = data.coins ?? 120;
            GameState.totalEarned = data.totalEarned ?? 120;
            GameState.dayTime = data.dayTime ?? 8 * 3600;
            GameState.gameDay = data.gameDay ?? 1;
            GameState.pots = data.pots ?? [];
            GameState.inventory = data.inventory ?? GameState.inventory;
            GameState.unlockedPlants = data.unlockedPlants ?? GameState.unlockedPlants;
            GameState.upgrades = data.upgrades ?? {};
            GameState.achievements = data.achievements ?? {};
            GameState.stats = data.stats ?? GameState.stats;
            GameState.settings = Object.assign(GameState.settings, data.settings || {});

            // Calculate offline progress
            if (data.timestamp) {
                const elapsed = (Date.now() - data.timestamp) / 1000;
                const offlineResult = GameLogic.simulateOffline(elapsed);
                if (offlineResult && offlineResult.seconds > 60) {
                    UI.showOfflineModal(offlineResult);
                }
            }

            return true;
        } catch (e) {
            console.error('Failed to load save, corrupted?', e);
            return false;
        }
    },

    reset() {
        localStorage.removeItem(CONFIG.SAVE_KEY);
        location.reload();
    },

    exportString() {
        const raw = localStorage.getItem(CONFIG.SAVE_KEY);
        if (!raw) return '';
        return btoa(encodeURIComponent(raw));
    },

    importString(str) {
        try {
            const json = decodeURIComponent(atob(str));
            JSON.parse(json); // Test validity
            localStorage.setItem(CONFIG.SAVE_KEY, json);
            location.reload();
            return true;
        } catch (e) {
            alert('Invalid save string.');
            return false;
        }
    }
};
