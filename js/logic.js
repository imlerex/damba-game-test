const GameLogic = {
    eventTimer: 0,
    currentEvent: null,

    update(dt) {
        // Apply game speed multiplier
        const effectiveDt = dt * GameState.gameSpeed;

        // Update Time of Day (24 hours = 86400 seconds real time scaled, e.g. 1 min real = 1 hour game time -> 864s full day)
        // Let's make 1 full day = 480 seconds (8 minutes)
        const dayDuration = 480; 
        GameState.dayTime += (effectiveDt / dayDuration) * 86400;
        if (GameState.dayTime >= 86400) {
            GameState.dayTime -= 86400;
            GameState.gameDay++;
        }

        // Update Random Events timer
        if (GameState.settings.events) {
            this.eventTimer += effectiveDt;
            if (this.eventTimer >= 60) { // every 60 seconds check event
                this.eventTimer = 0;
                if (!this.currentEvent && Math.random() < 0.35) {
                    this.triggerRandomEvent();
                }
            }
        }

        // Automation check: Helper Pip (Auto-water) & Flora (Auto-harvest)
        const hasPip = GameState.upgrades['helper_pip'] > 0;
        const hasFlora = GameState.upgrades['helper_flora'] > 0;

        // Update Plants in Pots
        GameState.pots.forEach((pot, index) => {
            if (!pot.plant) return;
            const plant = pot.plant;
            const species = CONFIG.PLANTS[plant.speciesId];

            // Nutrient timer tick
            if (plant.activeNutrient) {
                plant.nutrientTimer -= effectiveDt;
                if (plant.nutrientTimer <= 0) {
                    plant.activeNutrient = null;
                }
            }

            // Water drain
            let waterDrainRate = species.thirstRate * 3.5; // base drain per sec
            if (plant.activeNutrient === 'aqua') waterDrainRate *= 0.4;
            if (GameState.upgrades['watering_can_3'] > 0) waterDrainRate *= 0.75; // sprinkler bonus
            
            plant.water = Math.max(0, plant.water - waterDrainRate * effectiveDt);

            // Health & Wilting logic
            if (plant.water <= 5) {
                plant.health = Math.max(0, plant.health - 4 * effectiveDt);
            } else if (plant.water >= 95) {
                // Overwatering root rot
                plant.health = Math.max(0, plant.health - 2 * effectiveDt);
            } else {
                plant.health = Math.min(100, plant.health + 3 * effectiveDt);
            }

            if (plant.health <= 0) {
                plant.stage = 'withered';
                return;
            }

            // Pest damage
            if (plant.hasPest) {
                plant.health = Math.max(0, plant.health - 6 * effectiveDt);
                if (plant.health <= 0) {
                    plant.stage = 'withered';
                    return;
                }
            }

            // Growth calculation
            // Needs water between 20% and 90% to grow
            if (plant.water >= 20 && plant.water <= 90 && plant.health > 30) {
                let growthSpeed = 1.0;
                if (plant.activeNutrient === 'nitro') growthSpeed *= 1.5;
                if (GameState.dayTime < 21600 || GameState.dayTime > 72000) {
                    // Night time
                    if (GameState.upgrades['grow_lamps'] > 0) growthSpeed *= 1.35;
                    else growthSpeed *= 0.5;
                }

                plant.age += effectiveDt * growthSpeed;

                // Update stages
                const progress = plant.age / plant.maxAge;
                if (progress < 0.25) plant.stage = 'seed';
                else if (progress < 0.5) plant.stage = 'sprout';
                else if (progress < 0.85) plant.stage = 'young';
                else if (progress < 1.0) plant.stage = 'mature';
                else {
                    plant.stage = 'overgrown';
                    // Overgrown slowly loses quality
                    plant.quality = Math.max(0.6, plant.quality - 0.02 * effectiveDt);
                }
            }

            // Auto-waterer helper Pip
            if (hasPip && plant.water < 35 && plant.stage !== 'withered') {
                plant.water = 85;
                GameState.stats.totalWatered++;
            }

            // Auto-harvester helper Flora
            if (hasFlora && plant.stage === 'mature') {
                this.harvestPlant(index);
            }
        });

        // Check Achievements
        this.checkAchievements();
    },

    harvestPlant(potIndex) {
        const pot = GameState.pots[potIndex];
        if (!pot || !pot.plant) return false;
        const plant = pot.plant;
        if (plant.stage !== 'mature' && plant.stage !== 'overgrown') return false;

        const species = CONFIG.PLANTS[plant.speciesId];
        let sellPrice = species.baseValue * plant.quality;

        // Market connections upgrade bonus
        const marketLevel = GameState.upgrades['market_conn'] || 0;
        sellPrice *= (1 + marketLevel * 0.15);

        if (plant.activeNutrient === 'sun') sellPrice *= 1.5;

        const earned = Math.round(sellPrice);
        GameState.coins += earned;
        GameState.totalEarned += earned;
        GameState.stats.harvestedCount++;

        SoundEngine.playHarvest();
        UI.showFloatingText(`+${earned} 🪙`, potIndex);

        // Clear pot or auto-replant if seed available
        if (GameState.inventory.seeds[plant.speciesId] > 0 && GameState.upgrades['helper_flora'] > 0) {
            GameState.inventory.seeds[plant.speciesId]--;
            GameState.pots[potIndex].plant = null;
            GameState.plantSeed(potIndex, plant.speciesId);
        } else {
            pot.plant = null;
        }

        UI.updateHUD();
        return true;
    },

    clearPot(potIndex) {
        const pot = GameState.pots[potIndex];
        if (!pot) return;
        pot.plant = null;
        SoundEngine.playPop();
        UI.updateHUD();
    },

    triggerRandomEvent() {
        const events = [
            {
                id: 'pest',
                title: '🐛 Pest Infestation!',
                desc: 'A swarm of aphids attacked one of your plants! Use Pest-Away or water/inspect it.',
                action: () => {
                    const validPots = GameState.pots.filter(p => p.plant && p.plant.stage !== 'withered');
                    if (validPots.length > 0) {
                        const target = validPots[Math.floor(Math.random() * validPots.length)];
                        target.plant.hasPest = true;
                        UI.showToast(`🐛 Pests attacked ${CONFIG.PLANTS[target.plant.speciesId].name}!`);
                    }
                }
            },
            {
                id: 'heatwave',
                title: '🔥 Afternoon Heatwave!',
                desc: 'The sun blazes down. Water evaporates 50% faster for the next minute.',
                action: () => {
                    UI.showToast('🔥 Heatwave started! Watch your water levels.');
                }
            },
            {
                id: 'lucky_bee',
                title: '🐝 Lucky Bumblebee!',
                desc: 'A friendly bee pollinated your barn, instantly boosting a plant\'s growth!',
                action: () => {
                    const validPots = GameState.pots.filter(p => p.plant && p.plant.stage !== 'mature');
                    if (validPots.length > 0) {
                        const target = validPots[Math.floor(Math.random() * validPots.length)];
                        target.plant.age = Math.min(target.plant.maxAge, target.plant.age + target.plant.maxAge * 0.3);
                        UI.showToast(`🐝 Bee kissed ${CONFIG.PLANTS[target.plant.speciesId].name} (+30% growth)!`);
                    }
                }
            }
        ];

        const ev = events[Math.floor(Math.random() * events.length)];
        this.currentEvent = ev;
        ev.action();
        setTimeout(() => { this.currentEvent = null; }, 60000);
    },

    checkAchievements() {
        const stats = GameState.stats;
        const ach = GameState.achievements;

        if (stats.harvestedCount >= 1 && !ach.first_harvest) {
            this.unlockAchievement('first_harvest');
        }
        if (stats.harvestedCount >= 10 && !ach.harvest_10) {
            this.unlockAchievement('harvest_10');
        }
        if (stats.harvestedCount >= 50 && !ach.harvest_50) {
            this.unlockAchievement('harvest_50');
        }
        if (GameState.totalEarned >= 5000 && !ach.rich_farmer) {
            this.unlockAchievement('rich_farmer');
        }
        if (GameState.pots.length >= 12 && !ach.full_barn) {
            this.unlockAchievement('full_barn');
        }
    },

    unlockAchievement(id) {
        GameState.achievements[id] = true;
        const def = CONFIG.ACHIEVEMENTS[id];
        if (def) {
            GameState.coins += def.reward;
            UI.showToast(`🏆 Achievement Unlocked: ${def.name} (+${def.reward} 🪙)`);
            SoundEngine.playUpgrade();
        }
    },

    simulateOffline(elapsedSeconds) {
        const cappedSeconds = Math.min(elapsedSeconds, CONFIG.MAX_OFFLINE_HOURS * 3600);
        if (cappedSeconds < 30) return null; // Ignore tiny absences

        // Simple simulation tick loop in steps
        const step = 5;
        let harvestedWhileAway = 0;
        let waterLostTotal = 0;

        for (let t = 0; t < cappedSeconds; t += step) {
            GameState.pots.forEach((pot, index) => {
                if (!pot.plant) return;
                const plant = pot.plant;
                const species = CONFIG.PLANTS[plant.speciesId];

                plant.water = Math.max(0, plant.water - species.thirstRate * 3.5 * step);
                if (plant.water > 15 && plant.health > 20) {
                    plant.age += step;
                    if (plant.age >= plant.maxAge && plant.stage !== 'mature') {
                        plant.stage = 'mature';
                        harvestedWhileAway++;
                    }
                } else {
                    plant.health = Math.max(0, plant.health - 2 * step);
                    if (plant.health <= 0) plant.stage = 'withered';
                }
            });
        }

        return {
            seconds: Math.round(cappedSeconds),
            harvested: harvestedWhileAway
        };
    }
};
