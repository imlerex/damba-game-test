const CONFIG = {
    SAVE_KEY: 'barn_bloom_save_v1',
    AUTOSAVE_INTERVAL: 30000, // 30s
    MAX_OFFLINE_HOURS: 8,
    TICK_RATE: 60, // 60 updates/sec logical tick

    // Plant species data
    PLANTS: {
        sproutling: {
            id: 'sproutling',
            name: 'Sproutling Herb',
            desc: 'A hardy, fast-growing green herb. Perfect for beginner farmers.',
            growthTime: 15, // seconds to maturity
            thirstRate: 1.0, // water drain multiplier
            nutrientPref: 'nitro',
            baseValue: 18,
            seedCost: 10,
            unlockCost: 0,
            unlockedByDefault: true,
            color: '#52b788'
        },
        dew_fern: {
            id: 'dew_fern',
            name: 'Dew Fern',
            desc: 'Thrives in damp environments. Drinks water rapidly but yields well.',
            growthTime: 40,
            thirstRate: 2.2,
            nutrientPref: 'aqua',
            baseValue: 55,
            seedCost: 30,
            unlockCost: 75,
            unlockedByDefault: false,
            color: '#2d6a4f'
        },
        sun_succulent: {
            id: 'sun_succulent',
            name: 'Sun Succulent',
            desc: 'A desert dweller that stores water for days. Extremely drought-resistant.',
            growthTime: 75,
            thirstRate: 0.4,
            nutrientPref: 'vita',
            baseValue: 120,
            seedCost: 70,
            unlockCost: 180,
            unlockedByDefault: false,
            color: '#d4a373'
        },
        golden_sunflower: {
            id: 'golden_sunflower',
            name: 'Golden Sunflower',
            desc: 'Radiant tall bloom that loves sunlight and yields high-value golden seeds.',
            growthTime: 110,
            thirstRate: 1.3,
            nutrientPref: 'sun',
            baseValue: 260,
            seedCost: 140,
            unlockCost: 350,
            unlockedByDefault: false,
            color: '#e9c46a'
        },
        mystic_mushroom: {
            id: 'mystic_mushroom',
            name: 'Mystic Spore Mushroom',
            desc: 'A bioluminescent fungus that glows in the dark barn corners.',
            growthTime: 160,
            thirstRate: 0.9,
            nutrientPref: 'bloom',
            baseValue: 480,
            seedCost: 280,
            unlockCost: 700,
            unlockedByDefault: false,
            color: '#9b5de5'
        },
        frostbell_orchid: {
            id: 'frostbell_orchid',
            name: 'Frostbell Orchid',
            desc: 'Exquisite delicate petals with a sweet aroma. Requires careful attention.',
            growthTime: 240,
            thirstRate: 1.6,
            nutrientPref: 'aqua',
            baseValue: 950,
            seedCost: 550,
            unlockCost: 1500,
            unlockedByDefault: false,
            color: '#00b4d8'
        },
        starfruit_vine: {
            id: 'starfruit_vine',
            name: 'Starfruit Vine',
            desc: 'Twisting climber bearing celestial star-shaped sweet fruits.',
            growthTime: 360,
            thirstRate: 1.8,
            nutrientPref: 'sun',
            baseValue: 2100,
            seedCost: 1200,
            unlockCost: 3200,
            unlockedByDefault: false,
            color: '#f72585'
        },
        celestial_bonsai: {
            id: 'celestial_bonsai',
            name: 'Celestial Bonsai Tree',
            desc: 'A legendary ancient miniature tree said to whisper ancient farm wisdom.',
            growthTime: 600,
            thirstRate: 1.1,
            nutrientPref: 'bloom',
            baseValue: 5500,
            seedCost: 3000,
            unlockCost: 8000,
            unlockedByDefault: false,
            color: '#ffb703'
        }
    },

    // Nutrients
    NUTRIENTS: {
        nitro: {
            id: 'nitro',
            name: 'Nitro-Bloom Tonic',
            desc: 'Accelerates growth speed by +50% for 45 seconds.',
            cost: 25,
            duration: 45,
            effectType: 'growth',
            multiplier: 1.5,
            icon: '⚡'
        },
        aqua: {
            id: 'aqua',
            name: 'Aqua-Retention Gel',
            desc: 'Reduces water evaporation rate by 60% for 60 seconds.',
            cost: 30,
            duration: 60,
            effectType: 'water',
            multiplier: 0.4,
            icon: '💧'
        },
        vita: {
            id: 'vita',
            name: 'Pest-Away Bio-Shield',
            desc: 'Heals plant health instantly and wards off pests for 90 seconds.',
            cost: 40,
            duration: 90,
            effectType: 'shield',
            multiplier: 1.0,
            icon: '🛡️'
        },
        sun: {
            id: 'sun',
            name: 'Everbright Quality Serum',
            desc: 'Boosts final harvest quality & sell price by +50%.',
            cost: 50,
            duration: 50,
            effectType: 'quality',
            multiplier: 1.5,
            icon: '✨'
        }
    },

    // Upgrades
    UPGRADES: {
        watering_can_2: {
            id: 'watering_can_2',
            name: 'Silver Watering Can',
            desc: 'Waters neighboring pots simultaneously.',
            cost: 200,
            category: 'tools',
            level: 0,
            maxLevel: 1
        },
        watering_can_3: {
            id: 'watering_can_3',
            name: 'Gold Auto-Sprinkler',
            desc: 'Constantly mists all pots, slowing water drain by 25%.',
            cost: 850,
            category: 'tools',
            level: 0,
            maxLevel: 1,
            req: 'watering_can_2'
        },
        harvest_scythe: {
            id: 'harvest_scythe',
            name: 'Golden Scythe',
            desc: 'Click-drag across pots to quickly harvest mature plants.',
            cost: 500,
            category: 'tools',
            level: 0,
            maxLevel: 1
        },
        barn_expansion_1: {
            id: 'barn_expansion_1',
            name: 'Expand Barn Wing A',
            desc: 'Adds 2 extra planter pots to your barn (Total 6).',
            cost: 300,
            category: 'barn',
            level: 0,
            maxLevel: 1
        },
        barn_expansion_2: {
            id: 'barn_expansion_2',
            name: 'Expand Barn Wing B',
            desc: 'Adds 3 extra planter pots to your barn (Total 9).',
            cost: 1200,
            category: 'barn',
            level: 0,
            maxLevel: 1,
            req: 'barn_expansion_1'
        },
        barn_expansion_3: {
            id: 'barn_expansion_3',
            name: 'Grand Greenhouse Loft',
            desc: 'Adds 3 final planter pots to your barn (Total 12).',
            cost: 4500,
            category: 'barn',
            level: 0,
            maxLevel: 1,
            req: 'barn_expansion_2'
        },
        grow_lamps: {
            id: 'grow_lamps',
            name: 'LED Grow Lamps',
            desc: 'Increases plant growth speed during nighttime by +35%.',
            cost: 650,
            category: 'barn',
            level: 0,
            maxLevel: 1
        },
        helper_pip: {
            id: 'helper_pip',
            name: 'Helper Bot Pip (Auto-Waterer)',
            desc: 'Pip automatically waters thirsty plants every few seconds.',
            cost: 1500,
            category: 'automation',
            level: 0,
            maxLevel: 1
        },
        helper_flora: {
            id: 'helper_flora',
            name: 'Helper Bot Flora (Auto-Harvester)',
            desc: 'Flora automatically harvests mature plants and replants seeds.',
            cost: 4000,
            category: 'automation',
            level: 0,
            maxLevel: 1,
            req: 'helper_pip'
        },
        market_conn: {
            id: 'market_conn',
            name: 'Merchant Connections',
            desc: 'Improves all harvest sell prices by +15% per level.',
            cost: 400,
            category: 'economy',
            level: 0,
            maxLevel: 5,
            costMult: 2.0
        },
        bulk_discounts: {
            id: 'bulk_discounts',
            name: 'Wholesale Seed Discounts',
            desc: 'Reduces seed & nutrient shop prices by -10% per level.',
            cost: 500,
            category: 'economy',
            level: 0,
            maxLevel: 3,
            costMult: 2.2
        }
    },

    // Achievements
    ACHIEVEMENTS: {
        first_harvest: { name: 'First Sprout', desc: 'Harvest your very first mature plant.', reward: 50 },
        harvest_10: { name: 'Dedicated Botanist', desc: 'Harvest 10 mature plants.', reward: 200 },
        harvest_50: { name: 'Master Harvester', desc: 'Harvest 50 mature plants.', reward: 1000 },
        rich_farmer: { name: 'Coin Collector', desc: 'Accumulate 5,000 coins.', reward: 500 },
        full_barn: { name: 'Overcrowded', desc: 'Unlock all 12 planter pots.', reward: 1500 },
        legendary: { name: 'Celestial Growth', desc: 'Grow and harvest a Celestial Bonsai Tree.', reward: 3000 }
    }
};
