const UI = {
    selectedPotIndex: null,

    init() {
        this.bindEvents();
        this.updateHUD();
    },

    bindEvents() {
        // Main Menu
        document.getElementById('btn-continue').addEventListener('click', () => {
            document.getElementById('main-menu').classList.add('hidden');
            document.getElementById('game-container').classList.remove('hidden');
            SoundEngine.resume();
        });

        document.getElementById('btn-new-game').addEventListener('click', () => {
            SaveSystem.reset();
        });

        document.getElementById('btn-how-to-play').addEventListener('click', () => {
            this.openModal('modal-how-to-play');
        });

        document.getElementById('btn-settings-menu').addEventListener('click', () => {
            this.openModal('modal-settings');
        });

        const btnCredits = document.getElementById('btn-credits');
        if (btnCredits) {
            btnCredits.addEventListener('click', () => {
                alert('🌱 Barn Bloom v1.0\nCreated with cozy procedural art & synthesized audio.\nEnjoy your peaceful farming adventure!');
            });
        }

        document.getElementById('btn-export-save').addEventListener('click', () => {
            const str = SaveSystem.exportString();
            if (str) prompt('Copy your save string:', str);
            else alert('No save data found yet.');
        });

        document.getElementById('btn-import-save').addEventListener('click', () => {
            const str = prompt('Paste your save string:');
            if (str) SaveSystem.importString(str);
        });

        const btnExportModal = document.getElementById('btn-export-save-modal');
        if (btnExportModal) {
            btnExportModal.addEventListener('click', () => {
                const str = SaveSystem.exportString();
                if (str) prompt('Copy your save string:', str);
                else alert('No save data found yet.');
            });
        }

        const btnImportModal = document.getElementById('btn-import-save-modal');
        if (btnImportModal) {
            btnImportModal.addEventListener('click', () => {
                const str = prompt('Paste your save string:');
                if (str) SaveSystem.importString(str);
            });
        }

        // Offline Modal Resume Button
        const btnCloseOffline = document.getElementById('btn-close-offline');
        if (btnCloseOffline) {
            btnCloseOffline.addEventListener('click', () => {
                document.getElementById('modal-offline').classList.add('hidden');
                document.getElementById('main-menu').classList.add('hidden');
                document.getElementById('game-container').classList.remove('hidden');
                SoundEngine.resume();
            });
        }

        // Top Toolbar Tool Selection
        const toolBtns = document.querySelectorAll('.tool-btn');
        toolBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                toolBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                GameState.selectedTool = btn.dataset.tool;
            });
        });

        // Modal navigation buttons
        document.getElementById('btn-open-shop').addEventListener('click', () => {
            this.populateShop();
            this.openModal('modal-shop');
        });
        document.getElementById('btn-open-upgrades').addEventListener('click', () => {
            this.populateUpgrades();
            this.openModal('modal-upgrades');
        });
        document.getElementById('btn-open-almanac').addEventListener('click', () => {
            this.populateAlmanac();
            this.openModal('modal-almanac');
        });
        document.getElementById('btn-open-achievements').addEventListener('click', () => {
            this.populateAchievements();
            this.openModal('modal-achievements');
        });
        document.getElementById('btn-open-settings').addEventListener('click', () => {
            this.openModal('modal-settings');
        });

        // Close modals
        document.querySelectorAll('.close-modal, .modal').forEach(el => {
            el.addEventListener('click', (e) => {
                if (e.target === el || e.target.classList.contains('close-modal')) {
                    document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
                }
            });
        });

        // Tab switching in modals
        document.querySelectorAll('.modal-tabs').forEach(tabsContainer => {
            const tabBtns = tabsContainer.querySelectorAll('.tab-btn');
            tabBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const modalContent = tabsContainer.closest('.modal-content');
                    modalContent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                    modalContent.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
                    btn.classList.add('active');
                    const targetPane = modalContent.querySelector(`#${btn.dataset.tab}`);
                    if (targetPane) targetPane.classList.add('active');
                });
            });
        });

        // Canvas Click Interaction
        const canvas = document.getElementById('barn-canvas');
        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;

            GameState.pots.forEach((pot, index) => {
                const b = pot.renderBounds;
                if (b && clickX >= b.x && clickX <= b.x + b.w && clickY >= b.y && clickY <= b.y + b.h) {
                    this.handlePotClick(index);
                }
            });
        });

        // Close inspect sidebar
        document.getElementById('btn-close-inspect').addEventListener('click', () => {
            document.getElementById('plant-inspect-panel').classList.add('hidden');
            this.selectedPotIndex = null;
        });

        // Settings inputs
        document.getElementById('setting-volume').addEventListener('input', (e) => {
            GameState.settings.volume = parseFloat(e.target.value);
        });
        document.getElementById('setting-sfx').addEventListener('change', (e) => {
            GameState.settings.sfx = e.target.checked;
        });
        document.getElementById('setting-ambient').addEventListener('change', (e) => {
            GameState.settings.ambient = e.target.checked;
        });
        document.getElementById('setting-events').addEventListener('change', (e) => {
            GameState.settings.events = e.target.checked;
        });
        document.getElementById('setting-colorblind').addEventListener('change', (e) => {
            GameState.settings.colorblind = e.target.checked;
        });
        document.getElementById('btn-reset-save').addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all farm progress?')) {
                SaveSystem.reset();
            }
        });

        // Keyboard Hotkeys
        window.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT') return;
            if (e.key.toLowerCase() === 'w') this.selectTool('water');
            if (e.key.toLowerCase() === 'i') this.selectTool('inspect');
            if (e.key.toLowerCase() === 'h') this.selectTool('harvest');
            if (e.key.toLowerCase() === 's') this.selectTool('shovel');
            if (e.key.toLowerCase() === 'b') { this.populateShop(); this.openModal('modal-shop'); }
            if (e.key.toLowerCase() === 'u') { this.populateUpgrades(); this.openModal('modal-upgrades'); }
            if (e.key.toLowerCase() === 'a') { this.populateAlmanac(); this.openModal('modal-almanac'); }
            if (e.key === '`') {
                document.getElementById('debug-panel').classList.toggle('hidden');
            }
        });

        // Debug panel bindings
        document.getElementById('dbg-add-coins').addEventListener('click', () => { GameState.coins += 1000; this.updateHUD(); });
        document.getElementById('dbg-skip-time').addEventListener('click', () => { GameState.dayTime += 3600; });
        document.getElementById('dbg-mature-all').addEventListener('click', () => {
            GameState.pots.forEach(p => { if (p.plant) { p.plant.age = p.plant.maxAge; p.plant.stage = 'mature'; } });
        });
        document.getElementById('dbg-trigger-event').addEventListener('click', () => { GameLogic.triggerRandomEvent(); });
    },

    selectTool(toolName) {
        document.querySelectorAll('.tool-btn').forEach(btn => {
            if (btn.dataset.tool === toolName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        GameState.selectedTool = toolName;
    },

    handlePotClick(potIndex) {
        const pot = GameState.pots[potIndex];
        this.selectedPotIndex = potIndex;

        if (GameState.selectedTool === 'water') {
            if (pot.plant) {
                pot.plant.water = Math.min(100, pot.plant.water + 35);
                pot.plant.health = Math.min(100, pot.plant.health + 10);
                if (pot.plant.hasPest) pot.plant.hasPest = false;
                SoundEngine.playWater();
                this.showFloatingText('💧', potIndex);
            } else {
                const seedId = GameState.selectedSeed;
                if ((GameState.inventory.seeds[seedId] || 0) > 0) {
                    GameState.inventory.seeds[seedId]--;
                    GameState.plantSeed(potIndex, seedId);
                    SoundEngine.playPop();
                } else {
                    this.populateShop();
                    this.openModal('modal-shop');
                }
            }
        } else if (GameState.selectedTool === 'harvest') {
            GameLogic.harvestPlant(potIndex);
        } else if (GameState.selectedTool === 'shovel') {
            GameLogic.clearPot(potIndex);
        }

        this.updateInspectPanel();
        this.updateHUD();
    },

    updateHUD() {
        document.getElementById('stat-coins').innerText = GameState.coins;
        const hours = Math.floor(GameState.dayTime / 3600);
        const mins = Math.floor((GameState.dayTime % 3600) / 60);
        const timeStr = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
        document.getElementById('stat-time').innerText = `${timeStr} (Day ${GameState.gameDay})`;
        document.getElementById('summary-pots').innerText = `${GameState.pots.length}/12`;

        const helpers = [];
        if (GameState.upgrades['helper_pip'] > 0) helpers.push('Pip');
        if (GameState.upgrades['helper_flora'] > 0) helpers.push('Flora');
        document.getElementById('summary-helpers').innerText = helpers.length ? helpers.join(', ') : 'None';

        this.updateInspectPanel();
    },

    updateInspectPanel() {
        const panel = document.getElementById('plant-inspect-panel');
        if (this.selectedPotIndex === null) {
            panel.classList.add('hidden');
            return;
        }

        const pot = GameState.pots[this.selectedPotIndex];
        if (!pot || !pot.plant) {
            panel.classList.add('hidden');
            return;
        }

        panel.classList.remove('hidden');
        const plant = pot.plant;
        const species = CONFIG.PLANTS[plant.speciesId];

        document.getElementById('inspect-title').innerText = species.name;
        const body = document.getElementById('inspect-body');
        const growthPercent = Math.min(100, Math.round((plant.age / plant.maxAge) * 100));

        body.innerHTML = `
            <div class="stat-row"><span>Stage:</span> <strong>${plant.stage.toUpperCase()}</strong></div>
            <div class="stat-row"><span>Water Level:</span> <span>${Math.round(plant.water)}%</span></div>
            <div class="progress-bar-container"><div class="progress-bar-fill fill-water" style="width: ${plant.water}%"></div></div>
            <div class="stat-row"><span>Plant Health:</span> <span>${Math.round(plant.health)}%</span></div>
            <div class="progress-bar-container"><div class="progress-bar-fill fill-health" style="width: ${plant.health}%"></div></div>
            <div class="stat-row"><span>Growth Progress:</span> <span>${growthPercent}%</span></div>
            <div class="progress-bar-container"><div class="progress-bar-fill fill-growth" style="width: ${growthPercent}%"></div></div>
        `;

        const footer = document.getElementById('inspect-footer');
        footer.innerHTML = '';
        for (let nId in CONFIG.NUTRIENTS) {
            const nut = CONFIG.NUTRIENTS[nId];
            const count = GameState.inventory.nutrients[nId] || 0;
            const btn = document.createElement('button');
            btn.className = 'btn tiny';
            btn.innerHTML = `${nut.icon} ${nut.name} (${count})`;
            btn.disabled = count <= 0 || plant.activeNutrient !== null;
            btn.addEventListener('click', () => {
                if (count > 0 && !plant.activeNutrient) {
                    GameState.inventory.nutrients[nId]--;
                    plant.activeNutrient = nId;
                    plant.nutrientTimer = nut.duration;
                    SoundEngine.playPop();
                    this.updateInspectPanel();
                }
            });
            footer.appendChild(btn);
        }
    },

    populateShop() {
        const seedsPane = document.getElementById('shop-seeds');
        const nutrientsPane = document.getElementById('shop-nutrients');
        const specialPane = document.getElementById('shop-special');

        seedsPane.innerHTML = '';
        nutrientsPane.innerHTML = '';
        specialPane.innerHTML = '';

        // Seeds
        for (let sId in CONFIG.PLANTS) {
            const p = CONFIG.PLANTS[sId];
            const unlocked = GameState.unlockedPlants[sId] || p.unlockedByDefault;
            const card = document.createElement('div');
            card.className = 'shop-item-card';
            card.innerHTML = `
                <div class="item-info">
                    <h4>${p.name}</h4>
                    <p>${p.desc}</p>
                    <p>Growth: ${p.growthTime}s | Value: ${p.baseValue} 🪙</p>
                </div>
            `;
            const actionBtn = document.createElement('button');
            actionBtn.className = 'btn primary';
            if (!unlocked) {
                actionBtn.innerText = `Unlock (${p.unlockCost} 🪙)`;
                actionBtn.disabled = GameState.coins < p.unlockCost;
                actionBtn.addEventListener('click', () => {
                    if (GameState.coins >= p.unlockCost) {
                        GameState.coins -= p.unlockCost;
                        GameState.unlockedPlants[sId] = true;
                        SoundEngine.playUpgrade();
                        this.populateShop();
                        this.updateHUD();
                    }
                });
            } else {
                actionBtn.innerText = `Buy Seed (${p.seedCost} 🪙)`;
                actionBtn.disabled = GameState.coins < p.seedCost;
                actionBtn.addEventListener('click', () => {
                    if (GameState.coins >= p.seedCost) {
                        GameState.coins -= p.seedCost;
                        GameState.inventory.seeds[sId] = (GameState.inventory.seeds[sId] || 0) + 1;
                        SoundEngine.playCoin();
                        this.populateShop();
                        this.updateHUD();
                    }
                });
            }
            card.appendChild(actionBtn);
            seedsPane.appendChild(card);
        }

        // Nutrients
        for (let nId in CONFIG.NUTRIENTS) {
            const n = CONFIG.NUTRIENTS[nId];
            const card = document.createElement('div');
            card.className = 'shop-item-card';
            card.innerHTML = `
                <div class="item-info">
                    <h4>${n.icon} ${n.name}</h4>
                    <p>${n.desc}</p>
                    <p>Price: ${n.cost} 🪙 | Owned: ${GameState.inventory.nutrients[nId] || 0}</p>
                </div>
            `;
            const buyBtn = document.createElement('button');
            buyBtn.className = 'btn primary';
            buyBtn.innerText = `Buy (${n.cost} 🪙)`;
            buyBtn.disabled = GameState.coins < n.cost;
            buyBtn.addEventListener('click', () => {
                if (GameState.coins >= n.cost) {
                    GameState.coins -= n.cost;
                    GameState.inventory.nutrients[nId] = (GameState.inventory.nutrients[nId] || 0) + 1;
                    SoundEngine.playCoin();
                    this.populateShop();
                    this.updateHUD();
                }
            });
            card.appendChild(buyBtn);
            nutrientsPane.appendChild(card);
        }
    },

    populateUpgrades() {
        const container = document.getElementById('upgrades-container');
        container.innerHTML = '';

        for (let uId in CONFIG.UPGRADES) {
            const u = CONFIG.UPGRADES[uId];
            const currentLevel = GameState.upgrades[uId] || 0;
            const isMax = currentLevel >= u.maxLevel;
            const cost = u.cost * Math.pow(u.costMult || 1.5, currentLevel);

            const card = document.createElement('div');
            card.className = 'upgrade-item-card';
            card.innerHTML = `
                <div class="item-info">
                    <h4>${u.name} (Lv. ${currentLevel}/${u.maxLevel})</h4>
                    <p>${u.desc}</p>
                </div>
            `;
            const btn = document.createElement('button');
            btn.className = 'btn primary';
            if (isMax) {
                btn.innerText = 'Maxed';
                btn.disabled = true;
            } else {
                btn.innerText = `Upgrade (${Math.round(cost)} 🪙)`;
                btn.disabled = GameState.coins < Math.round(cost);
                btn.addEventListener('click', () => {
                    const finalCost = Math.round(cost);
                    if (GameState.coins >= finalCost) {
                        GameState.coins -= finalCost;
                        GameState.upgrades[uId] = currentLevel + 1;

                        if (uId === 'barn_expansion_1') {
                            GameState.pots.push(GameState.createEmptyPot(4), GameState.createEmptyPot(5));
                        } else if (uId === 'barn_expansion_2') {
                            GameState.pots.push(GameState.createEmptyPot(6), GameState.createEmptyPot(7), GameState.createEmptyPot(8));
                        } else if (uId === 'barn_expansion_3') {
                            GameState.pots.push(GameState.createEmptyPot(9), GameState.createEmptyPot(10), GameState.createEmptyPot(11));
                        }

                        SoundEngine.playUpgrade();
                        this.populateUpgrades();
                        this.updateHUD();
                    }
                });
            }
            card.appendChild(btn);
            container.appendChild(card);
        }
    },

    populateAlmanac() {
        const plantsPane = document.getElementById('almanac-plants');
        const nutrientsPane = document.getElementById('almanac-nutrients');
        plantsPane.innerHTML = '';
        nutrientsPane.innerHTML = '';

        for (let sId in CONFIG.PLANTS) {
            const p = CONFIG.PLANTS[sId];
            const unlocked = GameState.unlockedPlants[sId] || p.unlockedByDefault;
            const card = document.createElement('div');
            card.className = 'shop-item-card';
            card.innerHTML = `
                <div class="item-info">
                    <h4>${unlocked ? p.name : '🔒 Locked Plant'}</h4>
                    <p>${unlocked ? p.desc : 'Unlock this plant species in the shop to reveal its secrets.'}</p>
                </div>
            `;
            plantsPane.appendChild(card);
        }

        for (let nId in CONFIG.NUTRIENTS) {
            const n = CONFIG.NUTRIENTS[nId];
            const card = document.createElement('div');
            card.className = 'shop-item-card';
            card.innerHTML = `
                <div class="item-info">
                    <h4>${n.icon} ${n.name}</h4>
                    <p>${n.desc}</p>
                </div>
            `;
            nutrientsPane.appendChild(card);
        }
    },

    populateAchievements() {
        const container = document.getElementById('achievements-container');
        container.innerHTML = '';

        for (let aId in CONFIG.ACHIEVEMENTS) {
            const a = CONFIG.ACHIEVEMENTS[aId];
            const unlocked = GameState.achievements[aId];
            const card = document.createElement('div');
            card.className = 'shop-item-card';
            card.innerHTML = `
                <div class="item-info">
                    <h4>${unlocked ? '🏆' : '🔒'} ${a.name}</h4>
                    <p>${a.desc} (Reward: ${a.reward} 🪙)</p>
                </div>
            `;
            container.appendChild(card);
        }
    },

    showOfflineModal(result) {
        document.getElementById('offline-body').innerHTML = `
            <p>While you were away for <strong>${Math.round(result.seconds / 60)} minutes</strong>:</p>
            <p>🌾 Mature plants harvested automatically: <strong>${result.harvested}</strong></p>
        `;
        this.openModal('modal-offline');
    },

    openModal(modalId) {
        document.getElementById(modalId).classList.remove('hidden');
    },

    showToast(text) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerText = text;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    },

    showFloatingText(text, potIndex) {
        Renderer.showFloatingText(text, potIndex);
    }
};
