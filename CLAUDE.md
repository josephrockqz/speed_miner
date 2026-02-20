# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `npm run serve`
- **Build:** `npm run build`
- **Lint:** `npm run lint`

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
