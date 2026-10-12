const GameState = {
    coins: 120,
    totalEarned: 120,
    dayTime: 8 * 3600, // Seconds in day (8:00 AM)
    gameDay: 1,
    gameSpeed: 1.0,
    selectedTool: 'water', // 'water', 'inspect', 'harvest', 'shovel'
    selectedSeed: 'sproutling',
    selectedNutrient: 'nitro',

    pots: [], // Array of pot objects
    inventory: {
        seeds: { sproutling: 3 },
        nutrients: { nitro: 2, aqua: 1, vita: 1, sun: 1 }
    },
    unlockedPlants: { sproutling: true },
    upgrades: {},
    achievements: {},
    stats: {
        harvestedCount: 0,
        totalWatered: 0
    },
    settings: {
        volume: 0.7,
        sfx: true,
        ambient: true,
        events: true,
        colorblind: false,
        fps: false
    },

    init() {
        // Initialize default pots (4 pots)
        this.pots = [];
        for (let i = 0; i < 4; i++) {
            this.pots.push(this.createEmptyPot(i));
        }

        // Initialize upgrades
        for (let key in CONFIG.UPGRADES) {
            if (this.upgrades[key] === undefined) {
                this.upgrades[key] = 0;
            }
        }
    },

    createEmptyPot(id) {
        return {
            id: id,
            plant: null // null or Plant object
        };
    },

    plantSeed(potIndex, speciesId) {
        if (!this.pots[potIndex] || this.pots[potIndex].plant !== null) return false;
        const species = CONFIG.PLANTS[speciesId];
        if (!species) return false;

        this.pots[potIndex].plant = {
            speciesId: speciesId,
            stage: 'seed', // seed, sprout, young, mature, overgrown, withered
            age: 0,
            maxAge: species.growthTime,
            water: 80, // 0 - 100
            nutrients: 0, // 0 - 100
            health: 100, // 0 - 100
            quality: 1.0, // multiplier
            hasPest: false,
            activeNutrient: null,
            nutrientTimer: 0
        };
        return true;
    }
};
