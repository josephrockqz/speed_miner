# AGENTS.md

Guidance for AI coding agents working with this repository.

## Commands

- `npm run serve` — dev server
- `npm run build` — production build
- `npm run lint` — lint
- `npm run test:unit` — run tests
- `npm run test:unit:coverage` — run tests with coverage report

## Project Overview

Speed Miner is a Minesweeper clone built with Vue 2, Vue Router, Vuex, and BootstrapVue. The backend for scores/leaderboards is a separate application (`blue2red_backend`) accessed via `src/services/EventServiceMongo.js`.

## Architecture

**State management:** All game logic lives in the Vuex store (`src/store.js`). This is the core of the application — cell uncovering, mine placement, flag toggling, neighbor detection, win/loss conditions, timer, and statistics are all implemented as Vuex actions and mutations. The store directly manipulates DOM elements (classList, innerText, style) via the `squares` array, which holds references to the grid's div elements.

**Levels:** Level views (`src/views/Level1.vue`, `Level2.vue`, `Level3.vue`) are structurally identical — they differ only in grid dimensions and mine count. Each level dispatches `instantiateRectangleLevel` and `makeCells` on mount, and wires click/right-click/middle-click to store actions.

| Level | Grid | Mines |
|-------|------|-------|
| 1 (Beginner) | 10x10 | 12 |
| 2 (Intermediate) | 25x10 | 35 |
| 3 (Advanced) | 30x16 | 99 |

**Grid neighbor logic:** Neighbor calculations (mines, flags, recursive blank cell uncovering) use arithmetic on cell indices with `width` and `height` to determine adjacency. Boundary checks use `% width` for left/right edges and index range checks for top/bottom edges.

**Persistence:** Game statistics (wins/games played per level) use `localStorage`. High scores are posted to and fetched from an external MongoDB-backed API.

**Components:** `GamePanel` (mine counter, timer, restart/home buttons), `GameWinModal`, `GameLossModal`, `LeaveLevelModal`, `LevelMenu` (home page level selector with tabs for play, scores, statistics, settings).

**Routing:** Hash-free history mode — `/` (Home), `/level1`, `/level2`, `/level3`.

## Testing Conventions

- Jest with `@vue/test-utils` for component testing
- Test location: `tests/unit/**/*.spec.js`
- Helper utilities:
  - `tests/unit/helpers/storeFactory.js` — exports `createTestStore()` for building Vuex stores with state overrides
  - `tests/unit/helpers/mockDomElements.js` — exports `createMockSquares()` for mocking the DOM squares array
- Coverage thresholds enforced at 80% (branches, functions, lines, statements)
- Coverage exclusions: `src/main.js`, `src/views/Level1.vue`, `src/views/Level2.vue`, `src/views/Level3.vue` — level views are thin wrappers tested via `Level.spec.js`

## Coding Standards

- Vue 2 Options API — no Composition API
- Vuex for all game state — no component-local game state
- Store directly manipulates DOM via `squares` array (intentional pattern, not a bug)
- BootstrapVue components (`b-modal`, `b-button`, `b-tabs`, etc.) — don't replace with raw HTML
- ESLint config in `package.json` — run `npm run lint` before committing

## Key Conventions

- `src/store.js` exports `createStoreConfig()` for testability — don't remove this pattern
- Neighbor logic uses index arithmetic, not coordinate objects
- localStorage keys: `level1wins`, `level1games`, `level2wins`, `level2games`, `level3wins`, `level3games`
- API service in `src/services/EventServiceMongo.js` — backend (`blue2red_backend`) is separate
