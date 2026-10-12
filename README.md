# damba-game-test

# 🌱 Barn Bloom 🌻

A cozy, polished incremental plant-care browser game built with plain HTML5, CSS3, and vanilla JavaScript.

## How to Run
Simply open `index.html` in any modern web browser (works directly from `file://` or hosted on GitHub Pages). No build tools, npm, or external dependencies required.

## Controls & Shortcuts
- **W**: Select Watering Can
- **I**: Select Inspect tool
- **H**: Select Harvest tool
- **S**: Select Clear/Shovel tool
- **B**: Open Shop
- **U**: Open Upgrades
- **A**: Open Almanac
- **` (Backtick)**: Toggle Developer Debug Panel

## Features Overview
- **8 Unique Plant Species**: From hardy Sproutling herbs to legendary Celestial Bonsai trees.
- **Nutrient System**: 4 distinct boosters for growth speed, water retention, pest immunity, and harvest quality.
- **Barn Upgrades & Automation**: Unlock helper bots (Pip for auto-watering, Flora for auto-harvesting), barn expansions (up to 12 pots), LED grow lamps, and market connections.
- **Procedural 2D Art & Audio**: Custom canvas renderer with cozy lighting shafts, day/night cycle, and Web Audio API synthesized sound effects.
- **Robust Save System**: LocalStorage autosaves, offline progress simulation, and base64 export/import string backup.

## Design Decisions
1. **Zero External Dependencies**: All graphics are procedurally generated via Canvas 2D and sound effects via the Web Audio API to ensure instant, reliable execution anywhere without broken asset paths.
2. **Deterministic Game Loop**: Uses a fixed-step logic tick decoupled from frame rates to guarantee consistent plant growth and water drain across devices.
3. **Cozy Idle Balance**: Designed for both active care (watering and pest management) and passive progression (helper bots and offline simulation).
